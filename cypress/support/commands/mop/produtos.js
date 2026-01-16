import { SELECT_VINCULO_ESTEIRA } from '../../querySQL'

Cypress.Commands.add('buscarVinculoEsteira', (env = 'prod') => {
  return cy.task('queryDB', {
    env,
    sql: SELECT_VINCULO_ESTEIRA
  })
})
