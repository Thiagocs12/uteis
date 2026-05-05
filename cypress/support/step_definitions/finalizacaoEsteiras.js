import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que possuo uma lista de ids de esteiras que preciso finalizar de esteira de {string}", (tipoEsteira) => {
    ids = [3551, 3552];
    env = 'hml'
    tipoEsteiraAtual = tipoEsteira

    cy.log(`Tipo de esteira: ${tipoEsteira}`);
});

When("realizo o avanco da etapa {string}", (etapa) => {
  ids.forEach((id) => {
    cy.log(`Avançando esteira ${id} da etapa: ${etapa}`);
    cy.pegarIdEsteira(tipoEsteiraAtual, id, env).then(({idEtapa, idEsteira}) => {
        cy.avancarEtapa(tipoEsteiraAtual, id, etapa, env, idEtapa, idEsteira);
    })
  });
});

Then("realizo as seguintes {string}", (validacoes) => {
});

When("consulto o status das esteiras", () => {
});

Then("Todas devem estar finalizadas", () => {
});
/*

When('realizo o avanco da etapa "{string}"', (etapa) => {
  //ids.forEach((id) => {
  //  //cy.log(`Avançando esteira ${id} para etapa: ${etapa}`);
  //  //cy.avancarEtapa(tipoEsteiraAtual, id, etapa, 'hml'); // implementar comando conforme sua app
  //});
});

Then('realizo as seguintes "{string}"', (validacoes) => {
  //ids.forEach((id) => {
  //  cy.log(`Realizando validações "${validacoes}" para esteira ${id}`);
  //  cy.realizarValidacoes(id, validacoes); // implementar conforme sua regra
  //});
});

// --------------------------------------
// Esquema do Cenário: Verificar se as esteiras foram finalizadas
// --------------------------------------

When("consulto o status das esteiras", () => {
  //ids.forEach((id) => {
  //  cy.log(`Consultando status da esteira ${id}`);
  //  cy.consultarStatusEsteira(id); // se quiser só consultar, sem assert aqui
  //});
});

Then("Todas devem estar finalizadas", () => {
  //ids.forEach((id) => {
  //  cy.log(`Verificando se esteira ${id} está finalizada`);
  //  cy.verificarStatusFinalizado(id); // aqui entra o assert de finalização
  //});
});*/