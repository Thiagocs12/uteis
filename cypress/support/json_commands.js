// cypress/support/json_commands.js
import {
  normalizarNomeArquivoJson,
  construirMapaIds
} from './json_helpers';

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

        linhas.forEach(linha => {
          const valorOriginal = linha[colunaSubstituida];
          const idHmlCorrespondente = mapaIds[valorOriginal];

          if (idHmlCorrespondente !== undefined && idHmlCorrespondente !== null) {
            linha[colunaSubstituida] = idHmlCorrespondente;
          } else {
            if (valorOriginal === undefined || valorOriginal === null) {
                linha[colunaSubstituida] = null;
            } else {
                cy.log(`[AVISO][APLICAR_DEP] Dependência para '${colunaSubstituida}' com valor '${valorOriginal}' não resolvida no arquivo '${arquivoBusca}'. Preservando valor original.`);
            }
          }
        });
      });
    });
  });

  return chain.then(() => linhas);
});