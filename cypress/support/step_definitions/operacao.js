// cypress/e2e/steps/esteiras.steps.js

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que possuo uma lista arquivos para subir esteiras de operação', () => {
  cy.verificarDiretorioNaoVazio('cypress/fixtures/xmls/naoProcessados');
});

When('crio a operação', () => {
});

Given('que possuo uma operação no backoffice', () => {
});

Then('realizo as seguintes {string}', (validacoes) => {
});
