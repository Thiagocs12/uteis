import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
const multiflow = MAPEAMENTOS_APIS.MULTIFLOW;

Cypress.Commands.add('executarRequest', (ambiente, api, body = '', method = 'GET', fail = true) => {
  // Se o ambiente for 'bhml', usa o token do 'bhml' mas a baseUrl do 'hml'
  if (ambiente === 'bhml' || ambiente === 'bprod') {
    return cy.definirAmbiente('bhml').then(({ token }) => {
      return cy.definirAmbiente('hml').then(({ baseUrl }) => {
        const tokenAutorizacao = `Bearer ${token}`;
        const urlCompleta = `${baseUrl}/${api}`;

        return cy.request({
          method,
          url: urlCompleta,
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            authorization: tokenAutorizacao,
            'content-type': 'application/json',
          },
          body,
          failOnStatusCode: fail,
        });
      });
    });
  }

  // Fluxo padrão para todos os outros ambientes
  return cy.definirAmbiente(ambiente).then(({ baseUrl, token }) => {
    const tokenAutorizacao = `Bearer ${token}`;
    const urlCompleta = `${baseUrl}/${api}`;

    return cy.request({
      method,
      url: urlCompleta,
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        authorization: tokenAutorizacao,
        'content-type': 'application/json',
      },
      body,
      failOnStatusCode: fail,
    });
  });
});