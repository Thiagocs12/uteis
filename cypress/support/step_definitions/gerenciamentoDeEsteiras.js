// cypress/support/step_definitions/gerenciamentoDeProdutos.js
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('verifico se estou com tokens válidos para as APIs', () => {
  cy.validarOuObterToken('keycloak');
  cy.validarOuObterToken('homolog');
  cy.validarOuObterToken('prod');
});

When('busco as esteiras vinculadas ao produto principal', () => {
  cy.copiarDadosEntidadesMapeadas('prod');
});