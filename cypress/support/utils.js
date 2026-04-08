Cypress.Commands.add('validarOuObterToken', (ambiente) => {
  const caminhoArquivoTokens = 'cypress/temp/tokens.json';
  let apiBaseUrl = ambiente === 'prod' ? Cypress.env('PROD_API_BASE_URL') : Cypress.env('HML_API_BASE_URL');
  const usuario = ambiente === 'prod' ? Cypress.env('PROD_API_USERNAME') : Cypress.env('HML_API_USERNAME');
  const senha = ambiente === 'prod' ? Cypress.env('PROD_API_PASSWORD') : Cypress.env('HML_API_PASSWORD');
  const urlLoginUI = ambiente === 'prod' ? Cypress.env('PROD_API_LOGIN_URL') : Cypress.env('HML_API_LOGIN_URL');

  if (apiBaseUrl.endsWith('/')) {
    apiBaseUrl = apiBaseUrl.slice(0, -1);
  }

  const dominioLogin = new URL(urlLoginUI).origin;

  const urlApiClassificacaoProduto = `${apiBaseUrl}/mc-cadastro-ms/api/v1/classificacaoProduto/search/0?descricao=PRODUTO`;
  const urlTokenApiIntercept = '**/auth/realms/multiplicacapital/protocol/openid-connect/token';

  cy.then(() => {
    return cy.task('lerJsonSeExistir', { caminhoArquivo: caminhoArquivoTokens });
  }).then((todosOsTokens) => {
    const tokensPorAmbiente = todosOsTokens || {};
    let tokenDoAmbiente = tokensPorAmbiente[ambiente] ? tokensPorAmbiente[ambiente].token : null;

    const tentarValidarToken = (tokenParaValidar) => {
      if (!tokenParaValidar) {
        return cy.wrap({ valido: false, motivoFalha: 'nao_encontrado' });
      }

      const headersParaRequisicao = {
        'Authorization': `Bearer ${tokenParaValidar}`,
        'accept': 'application/json',
        'User-Agent': 'Cypress/1.0',
        'Accept-Encoding': 'identity',
      };

      return cy.request({
        method: 'GET',
        url: urlApiClassificacaoProduto,
        headers: headersParaRequisicao,
        failOnStatusCode: false,
        gzip: false,
        encoding: 'utf8',
      }).then((response) => {
        if (response.status === 200) {
          Cypress.env('tokenAcesso', tokenParaValidar);
          return { valido: true, motivoFalha: null };
        } else {
          Cypress.log({
            name: 'validarOuObterToken',
            message: `Token inválido (status: ${response.status}). Removendo arquivo de token para forçar novo login.`,
          });
          return cy.task('removerPasta', { path: caminhoArquivoTokens }).then(() => {
            return { valido: false, motivoFalha: `status_${response.status}` };
          });
        }
      });
    };

    tentarValidarToken(tokenDoAmbiente).then(({ valido, motivoFalha }) => {
      if (valido) {
        return; 
      }
      cy.intercept('POST', urlTokenApiIntercept).as('obterNovoToken');

      cy.origin(dominioLogin, { args: { urlLoginUI, usuario, senha } }, ({ urlLoginUI, usuario, senha }) => {
        cy.visit(urlLoginUI);
        cy.get('#username').type(usuario);
        cy.get('#password').type(senha);
        cy.contains('Entrar').click();
      });

      cy.wait('@obterNovoToken').then((interception) => {
        const novoToken = interception.response.body.access_token;
        if (novoToken) {
          Cypress.env('tokenAcesso', novoToken);
          tokensPorAmbiente[ambiente] = { token: novoToken };
          return cy.task('escreverJson', { caminhoArquivo: caminhoArquivoTokens, dados: tokensPorAmbiente });
        };
      });
    });
  });
});