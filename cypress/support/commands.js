import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
import MAPEAMENTOS_ETAPAS from '../utils/mapeamentoEtapas';
import tokens from '../temp/tokens.json';

const multiflow = MAPEAMENTOS_APIS.MULTIFLOW
const etapas = MAPEAMENTOS_ETAPAS

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
  const bhml = {
    baseUrl: Cypress.env('BHML_API_BASE_URL'),
    loginUrl: Cypress.env('BHML_API_LOGIN_URL'),
    loginUsername: Cypress.env('BHML_API_USERNAME'),
    loginPassword: Cypress.env('BHML_API_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('BHML_API_LOGIN_URL')}/auth/realms/beyondbanking-hml/protocol/openid-connect/token`,
    token: tokens?.bhml?.token ?? ''
  };

  if (ambiente === 'prod') {
    return cy.wrap(prod);
  } else if (ambiente === 'hml') {
    return cy.wrap(hml);
  } else if (ambiente === 'keycloak') {
    return cy.wrap(keycloak);
  } else if (ambiente === 'bhml') {
    return cy.wrap(bhml);
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

    if (
      ['PRODUTO', 'GRUPOS_KEYCLOAK', 'MULTIFLOW', 'SELECIONAR_CEDENTE'].includes(chaveEntidade)
    ) {
      continue
    }
      cy.pesquisarDependencias(entidade);
    }
  }
});

Cypress.Commands.add('criarItensInexistentesPorNivel', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];

    if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia !== nivel) continue;

    const method         = entidade.method        || 'POST';
    const caminhoArquivo = `cypress/output/${entidade.nomeArquivo}`;
    const campoDescricao = entidade.campoDescricao || 'descricao';
    const chavesIgnoradas = [
      'idHml',
      'id',
      'dataCadastro',
      'dataUltimaAlteracao',
      'usuarioCadastro',
      'usuarioUltimaAlteracao',
      ...(entidade.chavesIgnoradas || [])
    ];

    cy.readFile(caminhoArquivo).then((itens) => {
      const itensValidos = itens.filter((item) => item.idHml === null);

      itensValidos.forEach((item) => {
        const body = Object.fromEntries(
          Object.entries(item).filter(([chave]) => !chavesIgnoradas.includes(chave))
        );

        cy.executarRequest('hml', entidade.url, body, method).then((resultado) => {
          cy.setIdHmlPorDescricao(resultado.body['id'], item[campoDescricao], entidade.nomeArquivo, campoDescricao);
        });
      });
    });
  }
});

Cypress.Commands.add('atualizarItensExistentesPorNivel', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];

    if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia !== nivel) continue;

    const method          = entidade.method          || 'POST';
    const chavesIgnoradas = [
      'idHml',
      'id',
      'dataCadastro',
      'dataUltimaAlteracao',
      'usuarioCadastro',
      'usuarioUltimaAlteracao',
      ...(entidade.chavesIgnoradas || [])
    ];

    cy.readFile(`cypress/output/${entidade.nomeArquivo}`).then((itens) => {
      const itensValidos = itens.filter((item) => item.idHml !== null);

      itensValidos.forEach((item) => {
        const camposDoItem = Object.fromEntries(
          Object.entries(item).filter(([chave]) => !chavesIgnoradas.includes(chave))
        );

        const body = {
          ...camposDoItem,
          id: String(item.idHml),
        };

        cy.executarRequest('hml', entidade.url, body, method);
      });
    });
  }
});

Cypress.Commands.add('pesquisarItensPorNivel', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade       = MAPEAMENTOS_APIS[chaveEntidade];
    const nomeArquivo    = entidade.nomeArquivo;
    const campoDescricao = entidade.campoDescricao || 'descricao';
    const contentBusca   = entidade.contentBusca || 'falseId';

    if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia !== nivel) continue;

    if(Array.isArray(contentBusca)) {
      cy.lerColunaDeArquivo(nomeArquivo, contentBusca[0], 'falseId').then((dadosDoArquivo) => {
        for (const dado of dadosDoArquivo) {
          const dadoEncoded = encodeURIComponent(dado);
          cy.executarRequest('hml', `${entidade.urlBusca}${dadoEncoded}`).then((resposta) => {
            const itens = resposta.body?.content || [];
            console.log(itens)
            
            const itemEncontrado = itens.find((item) =>
              console.log(contentBusca[1])
              //console.log(item?.[contentBusca[1]]?.trim()?.toLowerCase())// === dado.trim().toLowerCase()
              
            );
            cy.pause()
          });
        }
      });
    } else {
      cy.lerColunaDeArquivo(nomeArquivo, campoDescricao, contentBusca).then((dadosDoArquivo) => {
        for (const dado of dadosDoArquivo) {
          const dadoEncoded = encodeURIComponent(dado);

          cy.executarRequest('hml', `${entidade.urlBusca}${dadoEncoded}`).then((resposta) => {
            const itens = resposta.body?.content || [];

            const itemEncontrado = itens.find((item) =>
              item?.[campoDescricao]?.trim()?.toLowerCase() === dado.trim().toLowerCase()
            );

            const id = itemEncontrado?.id ?? null;

            if (id === null) {
              cy.log(`[LOG] - Registro "${dado}" não encontrado exatamente no ambiente, setando null`);
            }

            cy.setIdHmlPorDescricao(id, dado, nomeArquivo, campoDescricao);
          });
        }
      });
    }
  } 
});

Cypress.Commands.add('setIdHmlPorDescricao', (id, descricao, nomeArquivo, campoDescricao) => {
  const filePath = `cypress/output/${nomeArquivo}`;

  cy.readFile(filePath, { log: false }).then((conteudo) => {
    const item = conteudo.find((entry) => entry[campoDescricao] === descricao);

    if (!item) {
      throw new Error(
        `[setIdHmlPorDescricao] Nenhum item encontrado onde "${campoDescricao}" é "${descricao}" em "${nomeArquivo}".`
      );
    }

    item.idHml = id;
    cy.log(`[LOG] Setando idHml: ${id} para "${campoDescricao}: ${descricao}"`);
    cy.writeFile(filePath, conteudo, { log: false });
  });
});

Cypress.Commands.add('atualizarIdsDeDependencias', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    const entidade = MAPEAMENTOS_APIS[chaveEntidade];
    if (
      !Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade) 
      || chaveEntidade === 'GRUPOS_KEYCLOAK'
      || entidade.nivelDependencia !== nivel
      || !entidade.dependencia
      || entidade.dependencia.length === 0
    ) continue;

    cy.log(`Atualizando IDs de dependências para a entidade: ${chaveEntidade} (Nível ${nivel})`);
    
    cy.readFile(`cypress/output/${entidade.nomeArquivo}`).then((itens) => {
      entidade.dependencia.forEach((dependencia) => {
        cy.readFile(`cypress/output/${dependencia.arquivoDependencia}`).then((dependencias) => {
          
          const listaDependencias = Array.isArray(dependencias[0])
            ? dependencias.flat()
            : dependencias
          
          itens.forEach((item) => {
            const idOriginal = Cypress._.get(
              item,
              dependencia.idSubstituido
            )
            if (!idOriginal) return;

            const equivalente = dependencias.find(
              (dependenciaItem) =>
                dependenciaItem[dependencia.idDependecia] === idOriginal
            )
            if (!equivalente) {
              cy.log(`Equivalente não encontrado para ID ${idOriginal}`)
              return
            }
            Cypress._.set(
              item,
              dependencia.idSubstituido,
              equivalente.idHml
            )
          })
        })
      })
      cy.writeFile(
        `cypress/output/${entidade.nomeArquivo}`,
        itens
      );
    });
  }
});

Cypress.Commands.add('processarEntidadesPorNivel', (nivel) => {
  cy.log(`iniciando o command atualizarIdsDeDependencias para o nível ${nivel}`)
  cy.atualizarIdsDeDependencias(nivel)
  cy.log(`iniciando o command pesquisarItensPorNivel para o nível ${nivel}`)
  cy.pesquisarItensPorNivel(nivel)
  //cy.log(`iniciando o command atualizarItensExistentesPorNivel para o nível ${nivel}`)
  //cy.atualizarItensExistentesPorNivel(nivel)
  //cy.log(`iniciando o command criarItensInexistentesPorNivel para o nível ${nivel}`)
  //cy.criarItensInexistentesPorNivel(nivel)
});

Cypress.Commands.add('verificarDiretorioNaoVazio', (caminho) => {
  cy.task('listarArquivos', caminho).then((arquivos) => {
    expect(arquivos.length, `Diretório "${caminho}" está vazio`).to.be.greaterThan(0);
  });
});