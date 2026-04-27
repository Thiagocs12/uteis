Cypress.Commands.add('executarRequest', (ambiente, api) => { 
  return cy.definirAmbiente(ambiente).then(({ baseUrl, token }) => {
    const tokenAutorizacao = `Bearer ${token}`;
    const urlCompleta = `${baseUrl}/${api}`;
  return cy.request({
    method: 'GET',
    url: urlCompleta,
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'authorization': tokenAutorizacao,
    },
    failOnStatusCode: false
  }).then((resposta) => {
    return cy.wrap(resposta);
  });
  })
});
