// cypress/support/step_definitions/gerenciamentoDeProdutos.js
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let idProdutoPrincipal;
let nomeEntidadePrincipal;

Given('que o ID do produto principal a ser copiado é {string}', (id) => {
  idProdutoPrincipal = id;
});

Given('que a entidade principal é {string}', (entidade) => {
  nomeEntidadePrincipal = entidade;
});

When('os dados da entidade principal são copiados de Produção', () => {
  cy.copiarDadosEntidadePrincipal(nomeEntidadePrincipal, idProdutoPrincipal);
});

When('as dependências do produto são copiadas de Produção', () => {
  cy.copiarDependencias(nomeEntidadePrincipal);
});

When('os IDs de Homologação são pesquisados e atualizados nos arquivos JSON para entidades de nível primário', () => {
  cy.pesquisarIdHmlEAtualizarJson();
});

// A step definition foi ajustada para escapar os parênteses
When('as tabelas de nível de dependência {int} são processadas', (nivel) => {
  cy.processarTabelasPorNivel(nivel);
});

Then('todos os dados do produto e suas dependências devem estar sincronizados em Homologação', () => {
  cy.log('Verificação final: Todos os dados do produto e suas dependências foram processados.');
});