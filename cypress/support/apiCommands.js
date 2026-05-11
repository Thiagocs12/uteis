import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
const multiflow = MAPEAMENTOS_APIS.MULTIFLOW

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

Cypress.Commands.add('criarPocEAvancar', (cnpj) => {
  cy.executarRequest2(
    'hml',
    'mc-poc-ms/api/v1/proposta',
    {
      cnpj,
      tipoProposta: {
        id: 1,
        descricao: 'NOVA'
      },
      prospect: {
        tipoProspect: {
          id: 13,
          descricao: 'NOVA - LARCA'
        },
        gerenteComercial: {
          id: 93
        }
      },
      tipoEmpresa: 'MATRIZ'
    },
    'POST',
    false
  ).then((resposta) => {
    if (!resposta || resposta.status !== 200) {
      cy.log(`Erro ao criar proposta para o CNPJ: ${cnpj}`)
      return
    }

    cy.wait(1000)

    cy.pegarIdEsteira('poc', resposta.body.id, 'hml').then(({idEtapa, idEsteira}) => {
      cy.avancarEtapaPadrao(multiflow, idEsteira, idEtapa, 'TESTE AUTOMACAO')

      cy.wait(2000)

      cy.pegarIdEsteira('poc', resposta.body.id, 'hml').then(({idEtapa, idEsteira}) => {
        cy.avancarEtapaPadrao(multiflow, idEsteira, idEtapa, 'TESTE AUTOMACAO')
      })
    })
  })
})

Cypress.Commands.add('executarRequest2', (ambiente, api, body = '', method = 'GET', fail = true) => { 
  return cy.definirAmbiente(ambiente).then(({ baseUrl, token }) => {
    const tokenAutorizacao = `Bearer ${token}`;
    const urlCompleta = `${baseUrl}/${api}`;

    const curl = `
      curl -X ${method} '${urlCompleta}' \
      -H 'accept: application/json, text/plain, */*' \
      -H 'accept-language: pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
      -H 'authorization: ${tokenAutorizacao}' \
      -H 'content-type: application/json' \
      ${body ? `-d '${JSON.stringify(body)}'` : ''}
    `;

    console.log('CURL REQUEST:\n', curl);
    cy.pause()
    return cy.request({
      method,
      url: urlCompleta,
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        authorization: tokenAutorizacao,
        'content-type': 'application/json'
      },
      body,
      failOnStatusCode: fail
    }).then((resposta) => {
      return cy.wrap(resposta);
    });
  });
});