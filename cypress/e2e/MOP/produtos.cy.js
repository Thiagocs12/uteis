const ENTIDADES = [
  'SELECT_PRODUTOS',
  'SELECT_PRODUTOS_MANTER_EM_CORBANCA',
  'SELECT_FOCO_NEGOCIO',
  'SELECT_TIPO_PRODUTO',
  'SELECT_CLASSIFICACAO_PRODUTO',
  'SELECT_SUBPRODUTO',
  'SELECT_PRODUTO_INDEXADOR',
  'SELECT_PRODUTO_TP_RECEBIMENTO',
  'SELECT_GRUPO_PRODUTO',
  'SELECT_CAD_PRODUTO_KIT',
  'SELECT_CAD_PRODUTO_TARIFA',
  'SELECT_CAD_PRODUTO_GARANTIA',
  'SELECT_CAD_GARANTIA_CATEGORIA',
  'SELECT_CAD_TARIFA',
  'SELECT_CAD_KIT_DOCUMENTO'
]

describe('MOP - Produtos', () => {
  it('Exporta vínculo de esteira', () => {
    for (const entidade of ENTIDADES) {
      cy.buscarItens(entidade)
    } 
  })
  it.skip('Busca produtos do arquivo de vínculo de esteira', () => {
    cy.buscarItens()
  })

  it.skip('Verifica o que existe em hml por descrição', () => {
    cy.buscarPorDescricaoNoHML('SELECT_PRODUTOS')
    cy.buscarPorDescricaoNoHML('SELECT_FOCO_NEGOCIO')
    cy.buscarPorDescricaoNoHML('SELECT_TIPO_PRODUTO')
    cy.buscarPorDescricaoNoHML('SELECT_CLASSIFICACAO_PRODUTO')
    cy.buscarPorDescricaoNoHML('SELECT_SUBPRODUTO')
    cy.buscarPorDescricaoNoHML('SELECT_PRODUTO_INDEXADOR')
    cy.buscarPorDescricaoNoHML('SELECT_PRODUTO_TP_RECEBIMENTO')
    cy.buscarPorDescricaoNoHML('SELECT_GRUPO_PRODUTO')
  })
  it.skip('Busca entidades terceiras vinculadas aos produtos', () => {
  })

  it.skip('Busca as relações das entidades terceiras', () => {
    cy.buscarItens('SELECT_KIT_PRODUTOS', 'idKitProduto')
  })
})
