const mop = require('./mop')

module.exports = {
  mop
}

Cypress.Commands.add('executarQuery', (env, sql, params = {}) => {
  return cy.task('db:exec', { env, sql, params })
})

//exemplo de uso

//cy.executarQuery('PROD', 'SELECT * FROM MC_MOP_OPERACAO WHERE id = @id', { id: 10 })
//cy.executarQuery('DEV',  'SELECT * FROM MC_MOP_OPERACAO WHERE id = @id', { id: 10 })
