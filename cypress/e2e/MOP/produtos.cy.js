const ENTIDADES_CONFIG = require('../../support/utils/mop/produtos')

const ENTIDADES_EXCLUIDAS = [
  'SELECT_CAD_PRODUTO_KIT',
  'SELECT_CAD_PRODUTO_TARIFA',
  'SELECT_CAD_PRODUTO_GARANTIA'
]

const ENTIDADES_COM_DEPENDENCIAS = [
  'SELECT_FOCO_NEGOCIO',
  'SELECT_TIPO_PRODUTO',
  'SELECT_CLASSIFICACAO_PRODUTO',
  'SELECT_SUBPRODUTO',
  'SELECT_PRODUTO_INDEXADOR',
  'SELECT_PRODUTO_TP_RECEBIMENTO',
  'CAD_GRUPO_PRODUTO_RISCO'
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

  it('Atualizo os registros de hml que não possuem dependências', () => {
    Object.keys(ENTIDADES_CONFIG)
      .filter(entidade => ENTIDADES_COM_DEPENDENCIAS.includes(entidade))
      .forEach(entidade => {
      cy.atualizarComDadosProd(entidade)
    })
  })
})
