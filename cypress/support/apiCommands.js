Cypress.Commands.add('executarRequest', (ambiente, api, body = '', method = 'GET', fail = true) => { 
  return cy.definirAmbiente(ambiente).then(({ baseUrl, token }) => {
    const tokenAutorizacao = `Bearer ${token}`;
    const urlCompleta = `${baseUrl}/${api}`;
  return cy.request({
    method: method,
    url: urlCompleta,
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'authorization': tokenAutorizacao,
      'content-type' : 'application/json'
    },
    body,
    failOnStatusCode: fail
  }).then((resposta) => {
    return cy.wrap(resposta);
  });
  })
});
