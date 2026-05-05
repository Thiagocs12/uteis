import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
import MAPEAMENTOS_ETAPAS from '../utils/mapeamentoEtapas';
import tokens from '../temp/tokens.json';

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

Cypress.Commands.add('processarEntidadesPorNivel', (nivel) => {
  cy.pesquisarItensPorNivel(nivel)
  cy.atualizarItensExistentesPorNivel(nivel)
  cy.criarItensInexistentesPorNivel(nivel)
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

    cy.lerColunaDeArquivo(nomeArquivo, campoDescricao, contentBusca).then((dadosDoArquivo) => {
      for (const dado of dadosDoArquivo) {
        const dadoEncoded = encodeURIComponent(dado);
        cy.executarRequest('hml', `${entidade.urlBusca}${dadoEncoded}`).then((resposta) => {
          const primeiroItem = resposta.body?.content?.[0];
          const id           = primeiroItem?.id ?? null;
          if (id === null) {
            cy.log(`[LOG] - Registro "${dado}" não encontrado no ambiente, setando null`);
          }
          cy.setIdHmlPorDescricao(id, dado, nomeArquivo, campoDescricao);
        });
      } 
    });
  }
});


Cypress.Commands.add('pesquisarEntidadesEmHml', () => {
  const resolverCampo = (obj, caminho) =>
    caminho.split('.').reduce((acc, chave) => acc?.[chave], obj);

  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade       = MAPEAMENTOS_APIS[chaveEntidade];
    const nomeArquivo    = entidade.nomeArquivo;
    const campoDescricao = entidade.campoDescricao || 'descricao';
    const contentBusca   = entidade.contentBusca || 'falseId';

    if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia >= 5) continue;

    const isBuscaComposta = Array.isArray(contentBusca);

    if (isBuscaComposta) {
      const [colunaBusca, colunaVerificacao] = contentBusca;
      const filePath = `cypress/output/${nomeArquivo}`;

      cy.readFile(filePath, { log: false }).then((conteudo) => {
        for (const item of conteudo) {
          const valorBusca       = resolverCampo(item, colunaBusca);
          const valorVerificacao = resolverCampo(item, colunaVerificacao);

          if (!valorBusca) continue;

          const dadoEncoded = encodeURIComponent(valorBusca);

          cy.executarRequest('hml', `${entidade.urlBusca}${dadoEncoded}`).then((resposta) => {
            const primeiroItem        = resposta.body?.content?.[0];
            const valorVerificacaoApi = resolverCampo(primeiroItem, colunaVerificacao) ?? null;
            const verificacaoBate     = valorVerificacaoApi === valorVerificacao;

            const id = verificacaoBate ? (primeiroItem?.id ?? null) : null;

            if (!verificacaoBate) {
              cy.log(`[LOG] - Verificação falhou para "${valorBusca}": esperado "${valorVerificacao}", recebido "${valorVerificacaoApi}". Setando idHml = null`);
            }

            cy.setIdHmlPorDescricao(id, resolverCampo(item, campoDescricao), nomeArquivo, campoDescricao);
          });
        }
      });

    } else {
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

Cypress.Commands.add('avancarEtapa', (tipoEsteira, id, etapa, env, idEtapa, idEsteira) => {
  if (etapa === 'Distribuição') {
    cy.avancarDistribuicao
  }
})

Cypress.Commands.add('avancarDistribuicao', (id, env, idEsteira, etapa, idComite, idAnalista, ) => {
  const distribuicao = etapas.DISTRIBUICAO
  const body = {
    idComite: idComite, // pode deixar fixo ou parametrizar depois
    propostas: [
      {
        id: id,
        idAnalista: idAnalista // ideal também parametrizar
      }
    ]
  }
  return cy.verificarEtapaEsteira(env, idEsteira, etapa).then(() => {
    return cy.wrap(distribuicao.etapasParaAvanco).each((requisicao) => {
      const url = `${distribuicao.baseUrl}/${distribuicao[requisicao]}`        
      return cy.executarRequest(env, url, body).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })
});

Cypress.Commands.add('verificarEtapaEsteira', (env, idEsteira, etapa) => {
  cy.executarRequest(env, `mc-multiflow-ms/api/v1/esteira/pesquisarporid/${idEsteira}`).then((response) => {
    i = response.body['etapas'].length - 1
    console.log(response.body['etapas'][i]['origem']['modeloEtapa']['nome'])
    expect(response.body['etapas'][i]['origem']['modeloEtapa']['nome']).to.eq(etapa) 
  });
});

Cypress.Commands.add('pegarIdEsteira', (tipoEsteira, id, env) => {
  if (tipoEsteira === 'poc') {
    cy.executarRequest(env, `mc-poc-ms/api/v1/proposta/findProposta/${id}`).then((response) => {
      return {
        idEtapa: response.body.idEtapa,
        idEsteira: response.body.idEsteira
      }
    })
  } 
});