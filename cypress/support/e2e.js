import './commands'
import './querySQL'
import './requests'
import './utils'

Cypress.Commands.add('executarQuerySQL', (env, sql) => {
  console.log('Executando query em ' + env + ': ' + sql)
  return cy.task('queryDB', {
    env,
    sql,
  })
})