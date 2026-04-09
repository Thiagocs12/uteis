// cypress/support/db_commands.js
import {
  paraLiteralSql,
  construirClausulaWhere,
  construirQueryInsert,
  construirQueryUpdate,
  registrarLogSql
} from './db_helpers';
import MAPEAMENTO_TABELAS from '../utils/mapeamentoDeTabelas'; // Importa o mapeamento de tabelas
import { compararObjetosParaUpdate } from './object_helpers';

/**
 * Executa uma consulta SELECT no banco de dados.
 * @param {string} nomeTabela - Nome da tabela.
 * @param {string|number|Array<string|number>|null} filtroDados - ID, array de IDs, '*' para todos, ou null para IS NULL.
 * @param {'hml'|'prod'} ambiente - Ambiente do banco de dados.
 * @param {string} colunaCondicao - Coluna para a cláusula WHERE (padrão: 'id').
 * @param {string|null} customSelectTop - Uma string como 'TOP 10' para ser inserida diretamente no SELECT.
 * @returns {Cypress.Chainable<Array<object>>} O recordset da consulta.
 */
Cypress.Commands.add('consultarDados', (nomeTabela, filtroDados, ambiente = 'hml', colunaCondicao = 'id', customSelectTop = null) => {
  let clausulaWhere = '';
  let query;
  const selectTopClause = customSelectTop ? customSelectTop : '';

  if (filtroDados === '*') {
    clausulaWhere = '';
    cy.log(`[${ambiente.toUpperCase()}][consultarDados] Pesquisando toda a tabela '${nomeTabela}'.`);
  } else if (filtroDados !== undefined && filtroDados !== null) {
    let dadosFiltroProcessados = filtroDados;

    if (Array.isArray(filtroDados)) {
      dadosFiltroProcessados = [...new Set(filtroDados.filter(v => v !== null && v !== undefined))];
    }

    if (dadosFiltroProcessados === null || dadosFiltroProcessados === undefined ||
        (Array.isArray(dadosFiltroProcessados) && dadosFiltroProcessados.length === 0)) {

      if (filtroDados === null || (Array.isArray(filtroDados) && filtroDados.includes(null) && dadosFiltroProcessados.length === 0)) {
        clausulaWhere = `WHERE [${colunaCondicao}] IS NULL`;
      } else {
        cy.log(`[${ambiente.toUpperCase()}][consultarDados] Nenhum valor válido fornecido para a coluna '${colunaCondicao}'. Pulando consulta.`);
        return cy.wrap([]);
      }
    } else {
      const valores = Array.isArray(dadosFiltroProcessados)
        ? dadosFiltroProcessados.map(v => paraLiteralSql(v)).join(', ')
        : paraLiteralSql(dadosFiltroProcessados);

      if (valores.toLowerCase() === "null") {
        clausulaWhere = `WHERE [${colunaCondicao}] IS NULL`;
      } else {
        clausulaWhere = `WHERE [${colunaCondicao}] IN (${valores})`;
      }
    }
  } else if (filtroDados === null) {
    clausulaWhere = `WHERE [${colunaCondicao}] IS NULL`;
  }

  query = `SELECT ${selectTopClause} * FROM [${nomeTabela}] ${clausulaWhere}`.trim();
  registrarLogSql(ambiente, 'SELECT', nomeTabela, query);

  if (clausulaWhere === '' && filtroDados !== '*' && filtroDados !== null && !customSelectTop) {
    cy.log(`[${ambiente.toUpperCase()}][consultarDados] Nenhuma cláusula WHERE válida gerada e sem TOP customizado. Pulando execução da query.`);
    return cy.wrap([]);
  }

  return cy.task('consultarSql', { query, ambiente });
});

/**
 * Executa uma query SQL de INSERT/UPDATE/DELETE.
 * @param {string} query - A query SQL a ser executada.
 * @param {'hml'|'prod'} ambiente - Ambiente do banco de dados.
 * @returns {Cypress.Chainable<object>} O resultado da execução.
 */
Cypress.Commands.add('executarSql', (query, ambiente = 'hml') => {
  return cy.task('executarSql', { query, ambiente });
});

/**
 * Busca o idHml de um registro no ambiente de HML com base em colunas de composição.
 * @param {string} nomeTabela - Nome da tabela.
 * @param {Array<string>} colunasComposicao - Colunas que formam a chave de composição.
 * @param {object} linha - Objeto da linha a ser pesquisada.
 * @returns {Cypress.Chainable<number|null>} O idHml encontrado ou null.
 */
Cypress.Commands.add('buscarIdHmlPorComposicao', (nomeTabela, colunasComposicao, linha) => {
  if (!colunasComposicao || colunasComposicao.length === 0) {
    cy.log(`[buscarIdHmlPorComposicao] Nenhuma coluna de composição fornecida para ${nomeTabela}. Retornando null.`);
    return cy.wrap(null);
  }

  return cy.wrap(null, { log: false }).then(() => {
    const clausulaWhere = construirClausulaWhere(colunasComposicao, linha);
    const query = `SELECT TOP 1 id FROM [${nomeTabela}] WHERE ${clausulaWhere}`;
    registrarLogSql('hml', 'SELECT', nomeTabela, query);

    return cy.task('consultarSql', { query, ambiente: 'hml' }).then((resultado) => {
      const idEncontrado = Array.isArray(resultado) && resultado.length > 0 ? resultado[0].id : null;
      return idEncontrado;
    });
  });
});

/**
 * Cria ou atualiza um registro no HML.
 * Prioriza o idHml existente para UPDATE. Se não existir, usa composição para buscar ou insere.
 * @param {object} entidade - Objeto da entidade do mapeamento de tabelas.
 * @param {object} linha - Objeto da linha a ser criada/atualizada (dados de Produção, com FKs de HML).
 * @returns {Cypress.Chainable<object>} A linha com o idHml atualizado.
 */
Cypress.Commands.add('criarOuAtualizarRegistro', (entidade, linha) => {
  const nomeTabela = entidade.nomeTabela;
  let idHmlParaUpdate = null;

  if (linha.idHml !== null && linha.idHml !== undefined) {
    idHmlParaUpdate = linha.idHml;
  }

  let chain = cy.wrap(null, { log: false });

  if (idHmlParaUpdate === null) {
    const colunasComposicao =
      Array.isArray(entidade.composicao) && entidade.composicao.length > 0 ? entidade.composicao : ['descricao'];

    if (!colunasComposicao || colunasComposicao.length === 0) {
      cy.log(`[criarOuAtualizarRegistro] Entidade '${nomeTabela}' sem 'composicao' e sem fallback válido. Não é possível realizar UPSERT. Setando idHml=null.`);
      linha.idHml = null;
      return cy.wrap(linha);
    }

    chain = chain.then(() => {
      return cy.buscarIdHmlPorComposicao(nomeTabela, colunasComposicao, linha).then((idEncontradoPorComposicao) => {
        idHmlParaUpdate = idEncontradoPorComposicao;
        if (idHmlParaUpdate) {
          cy.log(`[HML][UPSERT] Entidade '${nomeTabela}' encontrada por composição (${colunasComposicao.join(',')}). idHml: ${idHmlParaUpdate}.`);
        }
        return cy.wrap(idHmlParaUpdate);
      });
    });
  } else {
    chain = chain.then(() => cy.wrap(idHmlParaUpdate));
  }

  return chain.then((finalIdHml) => {
    linha.idHml = finalIdHml;

    if (finalIdHml) {
      return cy.consultarDados(nomeTabela, finalIdHml, 'hml', 'id').then((registrosHml) => {
        const registroHmlAtual = Array.isArray(registrosHml) && registrosHml.length > 0 ? registrosHml[0] : null;

        if (registroHmlAtual && compararObjetosParaUpdate(linha, registroHmlAtual)) {
          cy.log(`[HML][UPSERT] Entidade '${nomeTabela}' (idHml: ${finalIdHml}) já está sincronizada. Pulando UPDATE.`);
          return cy.wrap(linha);
        } else {
          cy.log(`[HML][UPSERT] Entidade '${nomeTabela}' (idHml: ${finalIdHml}) com diferenças ou não encontrada. Realizando UPDATE.`);
          const queryUpdate = construirQueryUpdate(nomeTabela, linha, finalIdHml);
          if (!queryUpdate) {
            cy.log(`[HML][UPSERT] Nenhuma query de UPDATE gerada para '${nomeTabela}'. Pulando.`);
            return cy.wrap(linha);
          }
          registrarLogSql('hml', 'UPDATE', nomeTabela, queryUpdate);
          return cy.executarSql(queryUpdate, 'hml').then(() => cy.wrap(linha));
        }
      });
    } else {
      cy.log(`[HML][UPSERT] Entidade '${nomeTabela}' não encontrada em HML. Realizando INSERT.`);
      const queryInsert = construirQueryInsert(nomeTabela, linha);
      if (!queryInsert) {
        cy.log(`[HML][UPSERT] Nenhuma query de INSERT gerada para '${nomeTabela}'. Pulando.`);
        linha.idHml = null;
        return cy.wrap(linha);
      }
      registrarLogSql('hml', 'INSERT', nomeTabela, queryInsert);
      return cy.executarSql(queryInsert, 'hml').then((execResult) => {
        const rs = execResult && execResult.recordset ? execResult.recordset : [];
        linha.idHml = Array.isArray(rs) && rs.length > 0 ? rs[0].id : null;
        return cy.wrap(linha);
      });
    }
  });
});

/**
 * Copia os dados de uma entidade específica do ambiente de produção para um arquivo JSON.
 * @param {string} nomeEntidade - Chave da entidade no MAPEAMENTO_TABELAS (ex: 'MC_CAD_PRODUTO').
 * @param {string|number} idInicial - O ID do registro principal a ser copiado, '*' para todos, ou uma string 'TOP N' para limitar.
 */
Cypress.Commands.add('copiarDadosEntidadePrincipal', (nomeEntidade, idInicial) => {
  const entidade = MAPEAMENTO_TABELAS[nomeEntidade];
  if (!entidade) {
    throw new Error(`Entidade '${nomeEntidade}' não encontrada no mapeamento de tabelas.`);
  }

  let filtroParaConsulta = idInicial;
  let customSelectTop = null;

  if (typeof idInicial === 'string' && idInicial.toUpperCase().startsWith('TOP')) {
    customSelectTop = idInicial;
    filtroParaConsulta = '*';
    cy.log(`[PROD][COPIA] Entidade=${entidade.nomeTabela} | Custom SELECT: ${customSelectTop}`);
  } else {
    cy.log(`[PROD][COPIA] Entidade=${entidade.nomeTabela} | id=${idInicial}`);
  }

  return cy.consultarDados(entidade.nomeTabela, filtroParaConsulta, 'prod', 'id', customSelectTop).then((resultado) => {
    return cy.salvarDadosEmJson(`${entidade.nomeArquivo}.json`, resultado);
  });
});

/**
 * Copia as dependências de uma entidade do ambiente de produção para arquivos JSON.
 * @param {string} nomeEntidadePrincipal - Chave da entidade principal (ex: 'MC_CAD_PRODUTO').
 */
Cypress.Commands.add('copiarDependencias', (nomeEntidadePrincipal) => {
  const entidades = Object.values(MAPEAMENTO_TABELAS);
  const entidadePrincipal = MAPEAMENTO_TABELAS[nomeEntidadePrincipal];

  if (!entidadePrincipal) {
    throw new Error(`Entidade principal '${nomeEntidadePrincipal}' não encontrada no mapeamento.`);
  }

  const dependencias = entidades.filter(e => e.nomeArquivo !== entidadePrincipal.nomeArquivo);

  return cy.wrap(dependencias, { log: false }).each((entidadeDependencia) => {
    const arquivoReferencia = entidadeDependencia.arquivoReferencia;
    const colunaReferencia = entidadeDependencia.colunaReferencia;
    const colunaCondicao = entidadeDependencia.colunaCondicao || 'id';

    if (!arquivoReferencia || !colunaReferencia) {
      cy.log(`[PROD][COPIA_DEP] Entidade '${entidadeDependencia.nomeTabela}' sem arquivoReferencia ou colunaReferencia. Pulando.`);
      return;
    }

    return cy.lerColunaDeArquivo(`${arquivoReferencia}.json`, colunaReferencia).then((ids) => {
      if (ids && ids.length > 0) {
        cy.log(
          `[PROD][COPIA_DEP] Tabela=${entidadeDependencia.nomeTabela} | ids=${ids.length} | colunaCondicao=${colunaCondicao}`
        );
        return cy.consultarDados(entidadeDependencia.nomeTabela, ids, 'prod', colunaCondicao).then((resultado) => {
          return cy.salvarDadosEmJson(`${entidadeDependencia.nomeArquivo}.json`, resultado);
        });
      } else {
        cy.log(`[PROD][COPIA_DEP] Nenhum ID encontrado para a tabela '${entidadeDependencia.nomeTabela}'. Pulando consulta.`);
      }
    });
  });
});

/**
 * Pesquisa registros no HML e adiciona o idHml aos JSONs para entidades com nível de dependência < 5.
 */
Cypress.Commands.add('pesquisarIdHmlEAtualizarJson', () => {
  const entidadesParaPesquisa = Object.values(MAPEAMENTO_TABELAS)
    .filter((e) => Number(e.nivelDependencia ?? 999) < 5)
    .sort((a, b) => Number(a.nivelDependencia ?? 999) - Number(b.nivelDependencia ?? 999));

  return cy.wrap(entidadesParaPesquisa, { log: false }).each((entidade) => {
    const nomeArquivo = `${entidade.nomeArquivo}.json`;
    const caminhoArquivo = `cypress/output/${nomeArquivo}`;

    const colunasComposicao =
      Array.isArray(entidade.composicao) && entidade.composicao.length > 0 ? entidade.composicao : ['descricao'];

    return cy.lerJsonDeOutput(nomeArquivo).then((linhas) => {
      if (linhas === null) {
        cy.log(`[HML][MATCH] Arquivo inexistente (pulando): ${caminhoArquivo}`);
        return;
      }
      if (!Array.isArray(linhas) || linhas.length === 0) {
        cy.log(`[HML][MATCH] JSON vazio (pulando): ${caminhoArquivo}`);
        return;
      }

      cy.log(`[HML][MATCH] ${entidade.nomeTabela} | registros no JSON: ${linhas.length} | chave: ${colunasComposicao.join(',')}`);

      return cy.wrap(linhas, { log: false }).each((linha, index) => {
        return cy.buscarIdHmlPorComposicao(entidade.nomeTabela, colunasComposicao, linha).then((idHml) => {
          linha.idHml = idHml;
        });
      }).then(() => {
        return cy.salvarDadosEmJson(nomeArquivo, linhas);
      });
    });
  });
});

/**
 * Processa as tabelas por nível de dependência, aplicando relacionamentos e realizando UPSERT no HML.
 * @param {number} nivel - O nível de dependência a ser processado.
 */
Cypress.Commands.add('processarTabelasPorNivel', (nivel) => {
  const entidadesDoNivel = Object.values(MAPEAMENTO_TABELAS)
    .filter((e) => Number(e.nivelDependencia ?? 999) === nivel)
    .sort((a, b) => String(a.nomeArquivo).localeCompare(String(b.nomeArquivo)));

  cy.log(`[HML][PROCESSAR][NIVEL ${nivel}] Tabelas encontradas: ${entidadesDoNivel.length}`);

  return cy.wrap(entidadesDoNivel, { log: false }).each((entidade) => {
    const nomeArquivo = `${entidade.nomeArquivo}.json`;
    const caminhoArquivo = `cypress/output/${nomeArquivo}`;

    return cy.lerJsonDeOutput(nomeArquivo).then((linhas) => {
      if (linhas === null) {
        cy.log(`[HML][PROCESSAR][NIVEL ${nivel}] Arquivo inexistente (pulando): ${caminhoArquivo}`);
        return cy.wrap(null);
      }
      if (!Array.isArray(linhas) || linhas.length === 0) {
        cy.log(`[HML][PROCESSAR][NIVEL ${nivel}] JSON vazio (pulando): ${caminhoArquivo}`);
        return cy.wrap(null);
      }

      let chainRelacionamento = cy.wrap(linhas, { log: false });
      if (entidade.colunasDependencia && entidade.colunasDependencia.length > 0) {
        cy.log(`[JSON][RELATE][NIVEL ${nivel}][${entidade.nomeTabela}] Aplicando ${entidade.colunasDependencia.length} dependências.`);
        chainRelacionamento = cy.aplicarDependenciasEmJson(linhas, entidade.colunasDependencia);
      }

      return chainRelacionamento.then((linhasAtualizadas) => {
        cy.log(`[HML][UPSERT][NIVEL ${nivel}][${entidade.nomeTabela}] registros no JSON: ${linhasAtualizadas.length}`);

        return cy.then(() => {
          return cy.wrap(linhasAtualizadas, { log: false }).each((linha) => {
            return cy.criarOuAtualizarRegistro(entidade, linha);
          });
        }).then(() => {
          return cy.salvarDadosEmJson(nomeArquivo, linhasAtualizadas);
        });
      });
    });
  });
});