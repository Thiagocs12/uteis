import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
const CLASSIFICACAO_PRODUTO = MAPEAMENTOS_APIS.CLASSIFICACAO_PRODUTO;
const GRUPOS_KEYCLOAK = MAPEAMENTOS_APIS.GRUPOS_KEYCLOAK;

Cypress.Commands.add('verificarTokens', (ambiente) => {
  if (ambiente !== 'keycloak') {
    return cy.executarRequest(ambiente, `${CLASSIFICACAO_PRODUTO.urlBusca}PRODUTO`).then((response) => {
      if (response.status === 200) return;
      cy.loginUi(ambiente);
    });
  }
  else if (ambiente === 'keycloak') {
    return cy.executarRequest(ambiente, `${GRUPOS_KEYCLOAK.urlBusca}APC`).then((response) => {
      if (response.status === 200) return;
      cy.loginUi(ambiente);
    });
  }
});

Cypress.Commands.add('loginUi', (ambiente) => {
  cy.definirAmbiente(ambiente).then(({ loginUrl, baseUrl, loginUsername, loginPassword, urlTokenApiIntercept }) => {

    cy.intercept('POST', urlTokenApiIntercept).as('obterToken');

    const baseOrigin     = new URL(baseUrl).origin;
    const keycloakOrigin = new URL(loginUrl).origin;

    // Comparação feita ANTES do visit — sem depender de runtime redirect
    const precisaDeCrossOrigin = baseOrigin !== keycloakOrigin;

    cy.visit(baseUrl);

    if (precisaDeCrossOrigin) {
      // prod / hml — app redireciona para Keycloak (cross-origin)
      cy.origin(
        keycloakOrigin,
        { args: { loginUsername, loginPassword, keycloakOrigin } },
        ({ loginUsername, loginPassword, keycloakOrigin }) => {
          cy.url({ timeout: 20000 }).should('include', keycloakOrigin);
          cy.get('#username').should('be.visible').type(loginUsername, { log: false });
          cy.get('#password').should('be.visible').type(loginPassword, { log: false });
          cy.get('#kc-login').should('be.visible').click();
        }
      );
    } else {
      // keycloak — baseUrl já é o próprio Keycloak, sem redirect
      cy.url({ timeout: 20000 }).should('include', keycloakOrigin);
      cy.get('#username').should('be.visible').type(loginUsername, { log: false });
      cy.get('#password').should('be.visible').type(loginPassword, { log: false });
      cy.get('#kc-login').should('be.visible').click();
    }

    cy.wait('@obterToken', { timeout: 20000 }).then((interception) => {
      const accessToken = interception?.response?.body?.access_token;

      if (!accessToken) {
        throw new Error(
          `[loginUi] Token não encontrado na resposta para o ambiente "${ambiente}".`
        );
      }

      const filePath = 'cypress/temp/tokens.json';

      cy.readFile(filePath, { log: false, timeout: 5000 })
        .then(
          (existentes) => (typeof existentes === 'object' && existentes !== null ? existentes : {}),
          (err) => {
            if (err.code === 'ENOENT') return {};
            throw new Error(`[loginUi] Erro ao ler tokens.json: ${err.message}`);
          }
        )
        .then((tokens) => {
          tokens[ambiente] = { token: accessToken };
          cy.writeFile(filePath, tokens, { log: false });
        });
    });

    cy.url({ timeout: 15000 }).should('include', baseUrl);
  });
});