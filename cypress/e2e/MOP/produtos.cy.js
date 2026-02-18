const ENTIDADES_CONFIG = require('../../support/utils/mop/produtos')

const ENTIDADES_EXCLUIDAS = [
  'SELECT_CAD_PRODUTO_KIT',
  'SELECT_CAD_PRODUTO_TARIFA',
  'SELECT_CAD_PRODUTO_GARANTIA'
]

describe('MOP - Produtos', () => {
  it('Exporta vínculo de esteira', () => {
    cy.buscarVinculoEsteira()
    Object.keys(ENTIDADES_CONFIG).forEach((entidade) => {
      cy.buscarItens(entidade)
    })
  })

  it('Verifica o que existe em hml por descrição', () => {
    Object.keys(ENTIDADES_CONFIG)
      .filter(entidade => !ENTIDADES_EXCLUIDAS.includes(entidade))
      .forEach(entidade => {
      cy.buscarPorDescricaoNoHML(entidade)
    })
  })
})
