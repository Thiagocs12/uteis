import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
import tokens from '../temp/tokens.json';

/**
 * @description Define e retorna os dados base para um ambiente específico.
 * @param {string} ambiente - O nome do ambiente ('prod', 'hml', 'keycloak').
 * @returns {Cypress.Chainable<object>} Um objeto contendo baseUrl, loginUrl, loginUsername e loginPassword.
 */
Cypress.Commands.add('definirAmbiente', (ambiente) => {
  const prod = {
    baseUrl: Cypress.env('PROD_API_BASE_URL'),
    loginUrl: Cypress.env('PROD_API_LOGIN_URL'),
    loginUsername: Cypress.env('PROD_API_USERNAME'),
    loginPassword: Cypress.env('PROD_API_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('PROD_API_LOGIN_URL')}/auth/realms/multiplicacapital/protocol/openid-connect/token`,
    token: tokens?.prod?.token ?? ''
  };
  const hml = {
    baseUrl: Cypress.env('HML_API_BASE_URL'),
    loginUrl: Cypress.env('HML_API_LOGIN_URL'),
    loginUsername: Cypress.env('HML_API_USERNAME'),
    loginPassword: Cypress.env('HML_API_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('HML_API_LOGIN_URL')}/auth/realms/multiplicacapital/protocol/openid-connect/token`,
    token: tokens?.hml?.token ?? ''
  };
  const keycloak = {
    baseUrl: Cypress.env('HML_KEYCLOAK_BASE_URL'),
    loginUrl: Cypress.env('HML_KEYCLOAK_LOGIN_URL'),
    loginUsername: Cypress.env('HML_KEYCLOAK_USERNAME'),
    loginPassword: Cypress.env('HML_KEYCLOAK_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('HML_KEYCLOAK_LOGIN_URL')}/auth/realms/master/protocol/openid-connect/token`,
    token: tokens?.keycloak?.token ?? ''
  };

  if (ambiente === 'prod') {
    return cy.wrap(prod);
  } else if (ambiente === 'hml') {
    return cy.wrap(hml);
  } else if (ambiente === 'keycloak') {
    return cy.wrap(keycloak);
  } else {
    throw new Error(`Ambiente desconhecido: ${ambiente}`);
  }
});

/**
 * Lê um arquivo JSON do diretório 'cypress/output'.
 * Retorna null se o arquivo não existir ou estiver vazio.
 * @param {string} nomeArquivo - Nome do arquivo JSON (ex: 'meuArquivo.json').
 * @returns {Cypress.Chainable<Array<object>|null>} Conteúdo do JSON ou null.
 */
Cypress.Commands.add('lerJsonDeOutput', (nomeArquivo) => {
  const caminhoArquivo = `cypress/output/${nomeArquivo}`;
  return cy.task('lerJsonSeExistir', { caminhoArquivo }, { log: false });
});

/**
 * Lê uma coluna específica de um arquivo JSON de output.
 * @param {string} nomeArquivo - Nome do arquivo JSON.
 * @param {string} nomeColuna - Nome da coluna a ser lida.
 * @returns {Cypress.Chainable<Array<any>>} Array com os valores da coluna.
 */
Cypress.Commands.add('lerColunaDeArquivo', (nomeArquivo, nomeColuna, content = true) => {
  return cy.lerJsonDeOutput(nomeArquivo).then((conteudoArquivo) => {
    const valoresUnicos = new Set();
    if (content === 'content') {
      if (conteudoArquivo && conteudoArquivo['content']) {
        for (let i = 0; i < conteudoArquivo['content'].length; i++) {
          const item = conteudoArquivo['content'][i];
          if (item && item[nomeColuna] && item[nomeColuna]['id'] !== undefined) {
            valoresUnicos.add(item[nomeColuna]['id']);
          }
        }
      }
    } else if (content === 'ligacao') {
      if (conteudoArquivo && conteudoArquivo['content']) {
        for (let i = 0; i < conteudoArquivo['content'].length; i++) {
          const item = conteudoArquivo['content'][i];
          valoresUnicos.add(item['id']);
        }
      }
    } else if (content === 'lista') {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        for (let j = 0; j < conteudoArquivo[i].length; j++) {
          const item = conteudoArquivo[i][j];
          if (item && item[nomeColuna] && item[nomeColuna]['id'] !== undefined) {
            valoresUnicos.add(item[nomeColuna]['id']);
          }
        }
      }
    } else if (content === 'listaId') {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        for (let j = 0; j < conteudoArquivo[i].length; j++) {
          const item = conteudoArquivo[i][j];
          if (item && item[nomeColuna] && item[nomeColuna] !== undefined) {
            valoresUnicos.add(item[nomeColuna]);
          }
        }
      }
    } else if (content === 'falseId') {
      for (let i = 0; i < conteudoArquivo.length; i++) {
          const item = conteudoArquivo[i];
          if (item && item[nomeColuna] && item[nomeColuna] !== undefined) {
            valoresUnicos.add(item[nomeColuna]);
        }
      }
    } else if (content === 'contentId') {
      if (conteudoArquivo && conteudoArquivo['content']) {
        for (let i = 0; i < conteudoArquivo['content'].length; i++) {
          const item = conteudoArquivo['content'][i];
          if (item && item[nomeColuna] !== undefined) {
            valoresUnicos.add(item[nomeColuna]);
          }
        }
      }
    } else if (content === 'teste') {
      console.log('ESSE', conteudoArquivo[0][nomeColuna]);
      cy.pause()
    } else {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        const item = conteudoArquivo[i];
        if (item && item[nomeColuna] && item[nomeColuna]['id'] !== undefined) {
          valoresUnicos.add(item[nomeColuna]['id']);
        }
      }
    }
    return cy.wrap(Array.from(valoresUnicos));
  });
});

Cypress.Commands.add('pesquisarDependencias', (entidade) => {
  if (!entidade || !entidade.nomeArquivoReferencia || !entidade.campoBusca || !entidade.nomeArquivo || !entidade.urlBuscaId) {
    throw new Error(`Configuração de entidade inválida para pesquisarDependencias. Verifique as propriedades: {nomeArquivoReferencia}, {campoBusca}, {nomeArquivo}, {urlBuscaId}.`);
  }

  const nomeArquivoReferencia = entidade.nomeArquivoReferencia
  const campoBusca = entidade.campoBusca
  const nomeArquivo = entidade.nomeArquivo
  const urlBuscaId = entidade.urlBuscaId
  const content = entidade.content
  const valores = [];

  return cy.lerColunaDeArquivo(nomeArquivoReferencia, campoBusca, content).then((dadosDoArquivo) => {
    const idsUnicos = [...new Set(dadosDoArquivo)];

    for (const id of idsUnicos) {
      cy.executarRequest('prod', `${urlBuscaId}${id}`).then((resposta) => {
        valores.push(resposta.body)
      });
    }
    cy.writeFile(`cypress/output/${nomeArquivo}`, valores);
  });
});

Cypress.Commands.add('pesquisarDependenciasLigacao', () => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) {
      const entidade = MAPEAMENTOS_APIS[chaveEntidade];

      if (chaveEntidade === 'PRODUTO' || chaveEntidade === 'GRUPOS_KEYCLOAK') {
        continue;
      }
      cy.pesquisarDependencias(entidade);
    }
  }
});

Cypress.Commands.add('pesquisarEntidadesEmHml', () => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) {
      const entidade = MAPEAMENTOS_APIS[chaveEntidade];
      const nomeArquivo = entidade.nomeArquivo;
      const campoDescricao = entidade.campoDescricao || 'descricao';
      const contentBusca = entidade.contentBusca || 'falseId';

      if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia >= 5) {
        continue;
      }

      cy.lerColunaDeArquivo(nomeArquivo, campoDescricao, contentBusca).then((dadosDoArquivo) => {
        for (const dado of dadosDoArquivo) {
          const dadoEncoded = encodeURIComponent(dado)
          cy.executarRequest('hml', `${entidade.urlBusca}${dadoEncoded}`).then((resposta) => {
            const primeiroItem = resposta.body?.content?.[0];
            const id = primeiroItem?.id ?? null;
            //console.log(resposta.body['content'][0]['id']);
            //cy.pause();
            if (id != null) {
              cy.log(`[LOG] - Registro ${dado} não encontrado no ambiente setando null`)
            }
            cy.setIdHmlPorDescricao(id, dado, nomeArquivo)
          });
        }
      }); 
    } //cy.pause()
  }
});

Cypress.Commands.add('setIdHmlPorDescricao', (id, descricao, nomeArquivo) => {
  const filePath = `cypress/output/${nomeArquivo}`;

  cy.readFile(filePath, { log: false }).then((conteudo) => {
    const item = conteudo.find((entry) => entry.descricao === descricao);

    if (!item) {
      throw new Error(
        `[setIdHmlPorDescricao] Nenhum item encontrado com a descrição "${descricao}" em "${nomeArquivo}".`
      );
    }

    item.idHml = id;
    cy.log(`[LOG] Setando o idHml: ${id} para o item ${descricao}`)
    cy.writeFile(filePath, conteudo, { log: false });
  });
});