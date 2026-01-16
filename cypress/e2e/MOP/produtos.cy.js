describe('MOP - Produtos', () => {
  it('Exporta vínculo de esteira', () => {
    cy.buscarVinculoEsteira('prod').then((rows) => {
      expect(rows).to.be.an('array')

      cy.writeFile(
        'cypress/output/mc_mop_vinculo_esteira_prod.json',
        rows
      )
    })
  })
})
