import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que possuo uma lista de ids de esteiras que preciso finalizar de esteira de {string}", (tipoEsteira) => {
    ids = [12376];
    env = 'prod'
    tipoEsteiraAtual = tipoEsteira
    idComite = 622
    idAnalista = 19
    parecer = `AVANÇO AUTOMÁTICO - POC's LARCA`
    cy.log(`Tipo de esteira: ${tipoEsteira}`);

    cnpjs = [
    ]
    cnpjs.forEach((cnpj) => {
      cy.criarPocEAvancar(cnpj)
    });
    //cy.pause()
});

When("realizo o avanco da etapa {string}", (etapa) => {
  ids.forEach((id) => {
    cy.log(`Avançando esteira ${id} da etapa: ${etapa}`);
    cy.avancarEtapa(tipoEsteiraAtual, id, etapa, env, idComite, idAnalista, parecer);
  });
});

Then("realizo as seguintes {string}", (validacoes) => {
});

When("consulto o status das esteiras", () => {
});

Then("Todas devem estar finalizadas", () => {
});