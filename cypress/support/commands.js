// cypress/support/commands.js
import {
  escaparAspasSql,
  paraLiteralSql,
  construirClausulaWhere,
  construirQueryInsert,
  construirQueryUpdate,
  registrarLogSql
} from './db_helpers';
import {
  normalizarNomeArquivoJson,
  construirMapaIds,
  substituirColunaPorMapa
} from './json_helpers';
import { compararObjetosParaUpdate } from './object_helpers';
import MAPEAMENTO_TABELAS from '../utils/mapeamentoDeTabelas'; // Importa o mapeamento de tabelas

// -------------------------------------
// Comandos de Banco de Dados
// -------------------------------------

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
  const selectTopClause = customSelectTop ? customSelectTop : ''; // Adiciona a cláusula TOP se fornecida

  if (filtroDados === '*') {
    clausulaWhere = ''; // Consulta toda a tabela
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
        return cy.wrap([]); // Retorna um array vazio para não quebrar a chain
      }
    } else {
      const valores = Array.isArray(dadosFiltroProcessados)
        ? dadosFiltroProcessados.map(v => paraLiteralSql(v)).join(', ')
        : paraLiteralSql(dadosFiltroProcessados);

      if (valores.toLowerCase() === "null") { // Se o valor for a string 'null'
        clausulaWhere = `WHERE [${colunaCondicao}] IS NULL`;
      } else {
        clausulaWhere = `WHERE [${colunaCondicao}] IN (${valores})`;
      }
    }
  } else if (filtroDados === null) { // Se filtroDados for explicitamente null (JS null)
    clausulaWhere = `WHERE [${colunaCondicao}] IS NULL`;
  }

  // A query agora inclui a cláusula TOP
  query = `SELECT ${selectTopClause} * FROM [${nomeTabela}] ${clausulaWhere}`.trim();
  registrarLogSql(ambiente, 'SELECT', nomeTabela, query);

  // Não executa a query se não houver filtro válido e não for para buscar tudo
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

// -------------------------------------
// Comandos de Manipulação de JSON
// -------------------------------------

/**
 * Lê um arquivo JSON do diretório 'cypress/output'.
 * Retorna null se o arquivo não existir ou estiver vazio.
 * @param {string} nomeArquivo - Nome do arquivo JSON (ex: 'meuArquivo.json').
 * @returns {Cypress.Chainable<Array<object>|null>} Conteúdo do JSON ou null.
 */
Cypress.Commands.add('lerJsonDeOutput', (nomeArquivo) => {
  const caminhoArquivo = `cypress/output/${normalizarNomeArquivoJson(nomeArquivo)}`;
  return cy.task('lerJsonSeExistir', { caminhoArquivo }, { log: false });
});

/**
 * Salva dados em um arquivo JSON no diretório 'cypress/output'.
 * @param {string} nomeArquivo - Nome do arquivo JSON (ex: 'meuArquivo.json').
 * @param {Array<object>|object} dados - Dados a serem salvos.
 * @param {object} [opcoes] - Opções adicionais.
 * @param {boolean} [opcoes.sobrescrever=true] - Se deve sobrescrever o arquivo existente.
 * @param {string} [opcoes.chaveUnica=null] - Coluna para identificar registros únicos ao adicionar.
 * @returns {Cypress.Chainable<object>} Objeto com status da operação.
 */
Cypress.Commands.add('salvarDadosEmJson', (nomeArquivo, dados, opcoes = {}) => {
  const { sobrescrever = true, chaveUnica = null } = opcoes;
  const caminhoArquivo = `cypress/output/${normalizarNomeArquivoJson(nomeArquivo)}`;

  if (sobrescrever) {
    return cy.task('escreverJson', { caminhoArquivo, dados }, { log: false }).then((sucesso) => {
      return { sucesso, caminho: caminhoArquivo, registrosSalvos: Array.isArray(dados) ? dados.length : (sucesso ? 1 : 0) };
    });
  }

  // Se não sobrescrever, tenta ler o existente e adicionar/mesclar
  return cy.lerJsonDeOutput(nomeArquivo).then((dadosExistentes) => {
    const existentes = Array.isArray(dadosExistentes) ? dadosExistentes : [];
    let dadosParaSalvar = Array.isArray(dados) ? dados : [dados];
    let registrosAdicionados = 0;

    if (chaveUnica && existentes.length > 0) {
      const chavesExistentes = new Set(existentes.map((item) => item && item[chaveUnica]));
      const novosRegistros = dadosParaSalvar.filter((novoItem) => !chavesExistentes.has(novoItem && novoItem[chaveUnica]));
      registrosAdicionados = novosRegistros.length;
      dadosParaSalvar = novosRegistros;
    } else {
      registrosAdicionados = dadosParaSalvar.length;
    }

    const dadosFinais = [...existentes, ...dadosParaSalvar];

    return cy.task('escreverJson', { caminhoArquivo, dados: dadosFinais }, { log: false }).then((sucesso) => {
      return { sucesso, caminho: caminhoArquivo, registrosSalvos: registrosAdicionados };
    });
  });
});

/**
 * Lê uma coluna específica de um arquivo JSON de output.
 * @param {string} nomeArquivo - Nome do arquivo JSON.
 * @param {string} nomeColuna - Nome da coluna a ser lida.
 * @returns {Cypress.Chainable<Array<any>>} Array com os valores da coluna.
 */
Cypress.Commands.add('lerColunaDeArquivo', (nomeArquivo, nomeColuna) => {
  return cy.lerJsonDeOutput(nomeArquivo).then((conteudoArquivo) => {
    if (!Array.isArray(conteudoArquivo) || conteudoArquivo.length === 0) return [];
    return conteudoArquivo
      .map((item) => item && item[nomeColuna])
      .filter((valor) => valor !== undefined);
  });
});

/**
 * Aplica dependências em um array de linhas JSON, substituindo FKs.
 * Se um idHml correspondente não for encontrado, o valor original da coluna é PRESERVADO.
 * @param {Array<object>} linhas - Array de objetos (linhas do JSON) a serem modificadas.
 * @param {Array<object>} colunasDependencia - Array de objetos de dependência (do mapeamento de tabelas).
 * @returns {Cypress.Chainable<Array<object>>} O array de linhas modificado.
 */
Cypress.Commands.add('aplicarDependenciasEmJson', (linhas, colunasDependencia) => {
  if (!Array.isArray(linhas) || linhas.length === 0) return cy.wrap(linhas, { log: false });

  const dependencias = Array.isArray(colunasDependencia)
    ? colunasDependencia
    : (colunasDependencia ? [colunasDependencia] : []);

  let chain = cy.wrap(null, { log: false });

  dependencias.forEach((dep) => {
    chain = chain.then(() => {
      const colunaSubstituida = dep && dep.colunaSubstituida;
      const arquivoBusca = dep && dep.arquivoBusca;

      if (!colunaSubstituida || !arquivoBusca) return;

      const colunaBuscaMapa = dep.colunaBusca || 'id';
      const colunaValorMapa = dep.colunaValor || 'idHml';

      return cy.lerJsonDeOutput(arquivoBusca).then((linhasDependencia) => {
        const mapaIds = construirMapaIds(linhasDependencia || [], colunaBuscaMapa, colunaValorMapa);

        // NOVO: Iterar sobre as linhas e aplicar a substituição
        linhas.forEach(linha => {
          const valorOriginal = linha[colunaSubstituida];
          const idHmlCorrespondente = mapaIds[valorOriginal];

          if (idHmlCorrespondente !== undefined && idHmlCorrespondente !== null) {
            linha[colunaSubstituida] = idHmlCorrespondente;
          } else {
            // Se não encontrou um idHml, PRESERVA o valor original
            // ou define como null se o valor original já era null/undefined
            // Para evitar o erro "Cannot insert NULL", vamos preservar o original
            // ou deixar como null APENAS se o original já era null.
            if (valorOriginal === undefined || valorOriginal === null) {
                linha[colunaSubstituida] = null; // Mantém null se já era null/undefined
            } else {
                // Se o valor original não era null, mas não encontramos um idHml,
                // logamos um aviso e PRESERVAMOS o valor original.
                cy.log(`[AVISO][APLICAR_DEP] Dependência para '${colunaSubstituida}' com valor '${valorOriginal}' não resolvida no arquivo '${arquivoBusca}'. Preservando valor original.`);
                // linha[colunaSubstituida] = valorOriginal; // Já está com o valor original, não precisa reatribuir
            }
          }
        });
      });
    });
  });

  return chain.then(() => linhas);
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

          // NOVO LOG: Inspecionar a linha antes de construir a query de UPDATE
          cy.log(`[DEBUG][criarOuAtualizarRegistro] Linha para UPDATE em ${nomeTabela} (idHml: ${finalIdHml}):`, linha);
          cy.log(`[DEBUG][criarOuAtualizarRegistro] idTipoGarantia na linha:`, linha.idTipoGarantia, `(Tipo: ${typeof linha.idTipoGarantia})`);
          cy.log(`[DEBUG][criarOuAtualizarRegistro] idGarantiaClassificacao na linha:`, linha.idGarantiaClassificacao, `(Tipo: ${typeof linha.idGarantiaClassificacao})`);
          cy.log(`[DEBUG][criarOuAtualizarRegistro] idGrupoGarantia na linha:`, linha.idGrupoGarantia, `(Tipo: ${typeof linha.idGrupoGarantia})`);


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

// -------------------------------------
// Comandos de Orquestração de Dados (Alto Nível)
// -------------------------------------

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

  // Verifica se idInicial é uma string e começa com 'TOP'
  if (typeof idInicial === 'string' && idInicial.toUpperCase().startsWith('TOP')) {
    customSelectTop = idInicial; // Usa a string 'TOP N' diretamente
    filtroParaConsulta = '*'; // Define como '*' para que consultarDados não adicione WHERE, mas use o TOP
    cy.log(`[PROD][COPIA] Entidade=${entidade.nomeTabela} | Custom SELECT: ${customSelectTop}`);
  } else {
    cy.log(`[PROD][COPIA] Entidade=${entidade.nomeTabela} | id=${idInicial}`);
  }

  // Passa o customSelectTop para o comando consultarDados
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

  // Filtra as dependências, excluindo a entidade principal
  const dependencias = entidades.filter(e => e.nomeArquivo !== entidadePrincipal.nomeArquivo);

  return cy.wrap(dependencias, { log: false }).each((entidadeDependencia) => {
    const arquivoReferencia = entidadeDependencia.arquivoReferencia;
    const colunaReferencia = entidadeDependencia.colunaReferencia;
    const colunaCondicao = entidadeDependencia.colunaCondicao || 'id'; // Default 'id'

    if (!arquivoReferencia || !colunaReferencia) {
      cy.log(`[PROD][COPIA_DEP] Entidade '${entidadeDependencia.nomeTabela}' sem arquivoReferencia ou colunaReferencia. Pulando.`);
      return;
    }

    return cy.lerColunaDeArquivo(`${arquivoReferencia}.json`, colunaReferencia).then((ids) => {
      if (ids && ids.length > 0) {
        cy.log(
          `[PROD][COPIA_DEP] Tabela=${entidadeDependencia.nomeTabela} | ids=${ids.length} | colunaCondicao=${colunaCondicao}`
        );
        // Dependências sempre consultam IDs específicos, não TOP
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
        return cy.wrap(null); // Garante retorno de chain
      }
      if (!Array.isArray(linhas) || linhas.length === 0) {
        cy.log(`[HML][PROCESSAR][NIVEL ${nivel}] JSON vazio (pulando): ${caminhoArquivo}`);
        return cy.wrap(null); // Garante retorno de chain
      }

      // 1. Aplicar relacionamentos (se houver colunas de dependência)
      let chainRelacionamento = cy.wrap(linhas, { log: false });
      if (entidade.colunasDependencia && entidade.colunasDependencia.length > 0) {
        cy.log(`[JSON][RELATE][NIVEL ${nivel}][${entidade.nomeTabela}] Aplicando ${entidade.colunasDependencia.length} dependências.`);
        chainRelacionamento = cy.aplicarDependenciasEmJson(linhas, entidade.colunasDependencia);
      }

      // 2. Realizar UPSERT no HML
      return chainRelacionamento.then((linhasAtualizadas) => {
        cy.log(`[HML][UPSERT][NIVEL ${nivel}][${entidade.nomeTabela}] registros no JSON: ${linhasAtualizadas.length}`);

        // O problema pode estar aqui: o .each retorna o array, e o .then() subsequente
        // pode estar recebendo esse array como um valor síncrono.
        // Vamos garantir que a chain seja mantida explicitamente.
        return cy.then(() => { // <--- NOVO: Adiciona um cy.then() explícito para manter a chain
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