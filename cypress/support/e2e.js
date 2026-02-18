import './commands'
import './querySQL'
import './utils'

Cypress.Commands.add('executarQuerySQL', (env, sql) => {
  console.log('Executando query em ' + env + ': ' + sql)
  return cy.task('queryDB', {
    env,
    sql,
  })
})