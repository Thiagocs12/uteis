// cypress/support/commands.js

// Certifique-se de que este arquivo é importado em cypress/support/e2e.js
// import './commands'

Cypress.Commands.add('validarOuObterToken', (ambiente) => {
  const caminhoArquivoTokens = 'cypress/temp/tokens.json';

  // --- Configurações por Ambiente ---
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
      apiBaseUrl: Cypress.env('HML_KEYCLOAK_BASE_URL'), // Nova variável para a base da API Admin
      usuario: Cypress.env('HML_KEYCLOAK_USERNAME'),
      senha: Cypress.env('HML_KEYCLOAK_PASSWORD'),
      urlLoginUI: 'https://keycloak-new-2.grupomultiplica.com.br/auth/realms/master/protocol/openid-connect/auth?client_id=security-admin-console&redirect_uri=https%3A%2F%2Fkeycloak-new-2.grupomultiplica.com.br%2Fauth%2Fadmin%2Fmaster%2Fconsole%2F&state=55550387-5ff2-42cc-9269-4484a2788e96&response_mode=query&response_type=code&scope=openid&nonce=73a19086-c992-4247-a95a-97e494391c4c&code_challenge=t61_j-zdImkCGCc1vCdMVWOz6kVi5dkMkKFJdHOdAEY&code_challenge_method=S256',
      urlValidacaoToken: 'https://keycloak-new-2.grupomultiplica.com.br/auth/admin/realms/multiplicacapital/clients?first=0&max=11', // URL de validação específica
      urlTokenApiIntercept: 'https://keycloak-new-2.grupomultiplica.com.br/auth/realms/master/protocol/openid-connect/token', // Endpoint para capturar o token do realm master
      clientIdUI: 'security-admin-console',
    },
  };

  const ambienteAtual = configAmbiente[ambiente];

  if (!ambienteAtual) {
    throw new Error(`Ambiente '${ambiente}' não configurado. Use 'prod', 'homolog' ou 'keycloak'.`);
  }

  // Normaliza apiBaseUrl
  if (ambienteAtual.apiBaseUrl && ambienteAtual.apiBaseUrl.endsWith('/')) {
    ambienteAtual.apiBaseUrl = ambienteAtual.apiBaseUrl.slice(0, -1);
  }

  const dominioLogin = ambienteAtual.urlLoginUI ? new URL(ambienteAtual.urlLoginUI).origin : null;

  // --- Funções Auxiliares ---

  // Tenta validar um token existente usando a URL de validação apropriada
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

    // Constrói a URL de validação completa
    const urlCompletaValidacao = ambiente === 'keycloak'
      ? ambienteAtual.urlValidacaoToken // Para keycloak, a URL já é completa
      : `${ambienteAtual.apiBaseUrl}${ambienteAtual.urlValidacaoToken}`; // Para prod/homolog, concatena com apiBaseUrl

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

  // Realiza o login via UI e captura o token
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

  // --- Fluxo Principal ---

  cy.then(() => {
    return cy.task('lerJsonSeExistir', { caminhoArquivo: caminhoArquivoTokens });
  }).then((todosOsTokens) => {
    const tokensPorAmbiente = todosOsTokens || {};
    let tokenDoAmbiente = tokensPorAmbiente[ambiente] ? tokensPorAmbiente[ambiente].token : null;

    return tentarValidarTokenExistente(tokenDoAmbiente).then(({ valido }) => {
      if (valido) {
        return; // Token existente é válido, finaliza
      }

      // Se o token não for válido, procede com o login
      return realizarLoginUI().then((novoToken) => {
        tokensPorAmbiente[ambiente] = { token: novoToken };
        return cy.task('escreverJson', { caminhoArquivo: caminhoArquivoTokens, dados: tokensPorAmbiente });
      });
    });
  });
});