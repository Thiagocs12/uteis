// cypress/support/api_commands.js
import mapeamentoDeEsteiras from '../utils/mapeamentoDeEsteiras'; // Importa o mapeamento de esteiras

function obterValorPorCaminho(obj, path) {
  if (!obj || !path) return undefined;
  const partes = path.split('.');
  let valorAtual = obj;
  for (let i = 0; i < partes.length; i++) {
    const parte = partes[i];
    if (Array.isArray(valorAtual)) {
      const resultadosArray = [];
      for (const itemArray of valorAtual) {
        const res = obterValorPorCaminho(itemArray, partes.slice(i).join('.'));
        if (res !== undefined) {
          if (Array.isArray(res)) {
            resultadosArray.push(...res);
          } else {
            resultadosArray.push(res);
          }
        }
      }
      return resultadosArray.flat();
    } else if (typeof valorAtual === 'object' && valorAtual !== null && parte in valorAtual) {
      valorAtual = valorAtual[parte];
    } else {
      return undefined;
    }
  }
  return valorAtual;
}

Cypress.Commands.add('validarOuObterToken', (ambiente) => {
  const caminhoArquivoTokens = 'cypress/temp/tokens.json';

  const configAmbiente = {
    prod: {
      apiBaseUrl: Cypress.env('PROD_API_BASE_URL'),
      usuario: Cypress.env('PROD_API_USERNAME'),
      senha: Cypress.env('PROD_API_PASSWORD'),
      urlLoginUI: Cypress.env('PROD_API_LOGIN_URL'),
      urlValidacaoToken: '/mc-cadastro-ms/api/v1/classificacaoProduto/search/0?descricao=PRODUTO',
      urlTokenApiIntercept: '**/auth/realms/multiplicacapital/protocol/openid-connect/token',
      clientIdUI: 'autenticacao',
    },
    homolog: {
      apiBaseUrl: Cypress.env('HML_API_BASE_URL'),
      usuario: Cypress.env('HML_API_USERNAME'),
      senha: Cypress.env('HML_API_PASSWORD'),
      urlLoginUI: Cypress.env('HML_API_LOGIN_URL'),
      urlValidacaoToken: '/mc-cadastro-ms/api/v1/classificacaoProduto/search/0?descricao=PRODUTO',
      urlTokenApiIntercept: '**/auth/realms/multiplicacapital/protocol/openid-connect/token',
      clientIdUI: 'autenticacao',
    },
    keycloak: {
      apiBaseUrl: Cypress.env('HML_KEYCLOAK_BASE_URL'),
      usuario: Cypress.env('HML_KEYCLOAK_USERNAME'),
      senha: Cypress.env('HML_KEYCLOAK_PASSWORD'),
      urlLoginUI: 'https://keycloak-new-2.grupomultiplica.com.br/auth/realms/master/protocol/openid-connect/auth?client_id=security-admin-console&redirect_uri=https%3A%2F%2Fkeycloak-new-2.grupomultiplica.com.br%2Fauth%2Fadmin%2Fmaster%2Fconsole%2F&state=55550387-5ff2-42cc-9269-4484a2788e96&response_mode=query&response_type=code&scope=openid&nonce=73a19086-c992-4247-a95a-97e494391c4c&code_challenge=t61_j-zdImkCGCc1vCdMVWOz6kVi5dkMkKFJdHOdAEY&code_challenge_method=S256',
      urlValidacaoToken: 'https://keycloak-new-2.grupomultiplica.com.br/auth/admin/realms/multiplicacapital/clients?first=0&max=11',
      urlTokenApiIntercept: 'https://keycloak-new-2.grupomultiplica.com.br/auth/realms/master/protocol/openid-connect/token',
      clientIdUI: 'security-admin-console',
    },
  };

  const ambienteAtual = configAmbiente[ambiente];

  if (!ambienteAtual) {
    throw new Error(`Ambiente '${ambiente}' não configurado. Use 'prod', 'homolog' ou 'keycloak'.`);
  }

  if (ambienteAtual.apiBaseUrl && ambienteAtual.apiBaseUrl.endsWith('/')) {
    ambienteAtual.apiBaseUrl = ambienteAtual.apiBaseUrl.slice(0, -1);
  }

  const dominioLogin = ambienteAtual.urlLoginUI ? new URL(ambienteAtual.urlLoginUI).origin : null;

  const tentarValidarTokenExistente = (tokenParaValidar) => {
    if (!tokenParaValidar || !ambienteAtual.urlValidacaoToken) {
      return cy.wrap({ valido: false, motivoFalha: 'nao_encontrado' });
    }

    const headersParaRequisicao = {
      'Authorization': `Bearer ${tokenParaValidar}`,
      'accept': 'application/json',
      'User-Agent': 'Cypress/1.0',
      'Accept-Encoding': 'identity',
    };

    const urlCompletaValidacao = ambiente === 'keycloak'
      ? ambienteAtual.urlValidacaoToken
      : `${ambienteAtual.apiBaseUrl}${ambienteAtual.urlValidacaoToken}`;

    Cypress.log({
      name: 'validarOuObterToken',
      message: `Tentando validar token existente para ${ambiente} em: ${urlCompletaValidacao}`,
    });

    return cy.request({
      method: 'GET',
      url: urlCompletaValidacao,
      headers: headersParaRequisicao,
      failOnStatusCode: false,
      gzip: false,
      encoding: 'utf8',
    }).then((response) => {
      if (response.status === 200) {
        Cypress.env('tokenAcesso', tokenParaValidar);
        Cypress.log({
          name: 'validarOuObterToken',
          message: `Token existente para ${ambiente} é válido.`,
        });
        return { valido: true, motivoFalha: null };
      } else {
        Cypress.log({
          name: 'validarOuObterToken',
          message: `Token inválido para ${ambiente} (status: ${response.status}). Removendo arquivo de token para forçar novo login.`,
          consoleProps: () => ({ response }),
        });
        return cy.task('removerPasta', { path: caminhoArquivoTokens }).then(() => {
          return { valido: false, motivoFalha: `status_${response.status}` };
        });
      }
    });
  };

  const realizarLoginUI = () => {
    if (!ambienteAtual.urlLoginUI || !dominioLogin || !ambienteAtual.usuario || !ambienteAtual.senha) {
      throw new Error(`Variáveis de ambiente de login UI (URL, Usuário, Senha) não configuradas para o ambiente ${ambiente}.`);
    }

    Cypress.log({
      name: 'validarOuObterToken',
      message: `Realizando login via UI para o ambiente ${ambiente}.`,
    });

    cy.intercept('POST', ambienteAtual.urlTokenApiIntercept).as('obterNovoToken');

    cy.origin(dominioLogin, { args: { urlLoginUI: ambienteAtual.urlLoginUI, usuario: ambienteAtual.usuario, senha: ambienteAtual.senha } }, ({ urlLoginUI, usuario, senha }) => {
      cy.visit(urlLoginUI);
      cy.get('#username').type(usuario);
      cy.get('#password').type(senha);
      cy.get('#kc-login').click();
    });

    return cy.wait('@obterNovoToken').then((interception) => {
      const novoToken = interception.response.body.access_token;
      if (novoToken) {
        Cypress.env('tokenAcesso', novoToken);
        return novoToken;
      } else {
        throw new Error(`Não foi possível obter o token de acesso após o login UI para o ambiente ${ambiente}.`);
      }
    });
  };

  cy.then(() => {
    return cy.task('lerJsonSeExistir', { caminhoArquivo: caminhoArquivoTokens });
  }).then((todosOsTokens) => {
    const tokensPorAmbiente = todosOsTokens || {};
    let tokenDoAmbiente = tokensPorAmbiente[ambiente] ? tokensPorAmbiente[ambiente].token : null;

    return tentarValidarTokenExistente(tokenDoAmbiente).then(({ valido }) => {
      if (valido) {
        return;
      }

      return realizarLoginUI().then((novoToken) => {
        tokensPorAmbiente[ambiente] = { token: novoToken };
        return cy.task('escreverJson', { caminhoArquivo: caminhoArquivoTokens, dados: tokensPorAmbiente });
      });
    });
  });
});

/**
 * Copia dados de entidades mapeadas via API.
 * @param {'hml'|'prod'} ambienteOrigem - Ambiente de onde os dados serão copiados.
 * @param {object} mapeamentoEntidades - O objeto de mapeamento de entidades a ser usado (ex: mapeamentoDeEsteiras).
 */
Cypress.Commands.add('copiarDadosEntidadesViaApi', (ambienteOrigem = 'prod', mapeamentoEntidades) => {
  Cypress.log({
    name: 'copiarDadosEntidadesViaApi',
    message: `Iniciando cópia de dados de entidades via API do ambiente ${ambienteOrigem}.`,
  });

  let apiBaseUrl = ambienteOrigem === 'prod' ? Cypress.env('PROD_API_BASE_URL') : Cypress.env('HML_API_BASE_URL');
  if (!apiBaseUrl) {
    throw new Error(`URL base da API não configurada para o ambiente ${ambienteOrigem}. Verifique suas variáveis de ambiente.`);
  }
  if (apiBaseUrl.endsWith('/')) {
    apiBaseUrl = apiBaseUrl.slice(0, -1);
  }

  cy.validarOuObterToken(ambienteOrigem).then(() => {
    const token = Cypress.env('tokenAcesso');
    if (!token) {
      throw new Error('Token de acesso não disponível após validação/obtenção. Verifique o comando validarOuObterToken.');
    }

    cy.wrap(Object.entries(mapeamentoEntidades)).each(([nomeEntidade, configEntidade]) => {
      const { endpointPesquisaPorId, arquivoReferencia, nomeArquivo, colunaReferencia } = configEntidade;

      if (!endpointPesquisaPorId || !arquivoReferencia || !nomeArquivo || !colunaReferencia) {
        Cypress.log({
          name: 'copiarDadosEntidadesViaApi',
          message: `Configuração incompleta para a entidade '${nomeEntidade}'. Pulando.`,
          consoleProps: () => ({ configEntidade }),
        });
        return;
      }

      const caminhoArquivoReferencia = `${arquivoReferencia}`;
      const caminhoArquivoSaida = `cypress/output/${nomeArquivo}.json`;

      Cypress.log({
        name: 'copiarDadosEntidadesViaApi',
        message: `Processando entidade: ${nomeEntidade}. Tentando ler IDs de ${caminhoArquivoReferencia}.`,
      });

      cy.lerJsonDeOutput(caminhoArquivoReferencia).then((dadosReferencia) => {
        if (dadosReferencia === null || dadosReferencia.length === 0) {
          Cypress.log({
            name: 'copiarDadosEntidadesViaApi',
            message: `Arquivo de referência '${caminhoArquivoReferencia}' não encontrado, vazio ou inválido para a entidade ${nomeEntidade}. Pulando.`,
            type: 'warning',
          });
          return;
        }

        const listaDeItens = Array.isArray(dadosReferencia) ? dadosReferencia : [dadosReferencia];

        let idsParaPesquisar = [];
        listaDeItens.forEach(item => {
          const valorExtraido = obterValorPorCaminho(item, colunaReferencia);
          if (valorExtraido !== undefined) {
            if (Array.isArray(valorExtraido)) {
              idsParaPesquisar.push(...valorExtraido);
            } else {
              idsParaPesquisar.push(valorExtraido);
            }
          }
        });
        idsParaPesquisar = [...new Set(idsParaPesquisar.filter(Boolean))];

        if (idsParaPesquisar.length === 0) {
          Cypress.log({
            name: 'copiarDadosEntidadesViaApi',
            message: `Nenhum ID válido encontrado na coluna '${colunaReferencia}' do arquivo ${caminhoArquivoReferencia} para a entidade ${nomeEntidade}. Pulando.`,
          });
          return;
        }

        Cypress.log({
          name: 'copiarDadosEntidadesViaApi',
          message: `Encontrados ${idsParaPesquisar.length} IDs para a entidade ${nomeEntidade}.`,
          consoleProps: () => ({ idsParaPesquisar }),
        });

        const headersParaRequisicao = {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'User-Agent': 'Cypress/1.0',
          'Accept-Encoding': 'identity',
        };

        const todosOsDadosDaEntidade = [];

        cy.wrap(idsParaPesquisar).each((id) => {
          const urlCompleta = `${apiBaseUrl}${endpointPesquisaPorId}${id}`;
          Cypress.log({
            name: 'copiarDadosEntidadesViaApi',
            message: `Buscando ${nomeEntidade} ID: ${id} em ${urlCompleta}.`,
          });

          cy.request({
            method: 'GET',
            url: urlCompleta,
            headers: headersParaRequisicao,
            failOnStatusCode: false,
            gzip: false,
            encoding: 'utf8',
          }).then((response) => {
            if (response.status === 200) {
              todosOsDadosDaEntidade.push(response.body);
              Cypress.log({
                name: 'copiarDadosEntidadesViaApi',
                message: `Dados de ${nomeEntidade} ID ${id} obtidos com sucesso.`,
              });
            } else {
              Cypress.log({
                name: 'copiarDadosEntidadesViaApi',
                message: `Falha ao obter dados de ${nomeEntidade} ID ${id} (status: ${response.status}). Detalhes: ${JSON.stringify(response.body)}`,
                consoleProps: () => ({ response }),
                type: 'error',
              });
            }
          });
        }).then(() => {
          if (todosOsDadosDaEntidade.length > 0) {
            Cypress.log({
              name: 'copiarDadosEntidadesViaApi',
              message: `Salvando ${todosOsDadosDaEntidade.length} registros de ${nomeEntidade} em ${caminhoArquivoSaida}.`,
            });
            cy.task('escreverJson', { caminhoArquivo: caminhoArquivoSaida, dados: todosOsDadosDaEntidade });
          } else {
            Cypress.log({
              name: 'copiarDadosEntidadesViaApi',
              message: `Nenhum dado obtido para ${nomeEntidade}. Arquivo ${caminhoArquivoSaida} não será criado/atualizado.`,
            });
          }
        });
      });
    });
  });
});