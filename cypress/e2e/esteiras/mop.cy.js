const TABELAS_COM_ATIVO = Cypress.env('TABELAS_COM_ATIVO')
const DEPENDENCIAS_MAP = Cypress.env('DEPENDENCIAS_MAP')

// PIPELINE PROD → HML
describe('Pipeline completo PROD → HML (Dependências + Produto Upsert)', () => {

  // 01 - SNAPSHOT ESTEIRA × PRODUTO (PROD)
  it.skip('01 - Snapshot esteira × produto (PROD)', () => {
    cy.vinculosMop()
  })

  // 02 - PRODUTOS COMPLETOS (PROD)
  it.skip('02 - Buscar produtos completos (PROD)', () => {
    cy.readFile('cypress/exports/vinculo-esteira-prod.json').then(vinculos => {
      const idsProduto = [...new Set(vinculos.map(v => v.idProduto))]
      cy.produtosCompletos(idsProduto)
    })
  })

  // 03 - RESOLVER DEPENDÊNCIAS (PROD)
  it.skip('03 - Resolver dependências (PROD)', () => {
    cy.readFile('cypress/exports/produtos-prod.json').then(produtos => {
      cy.resolverDependencias(produtos)
    })
  })

  // 04 - CLASSIFICAR DEPENDÊNCIAS (HML)
  it.skip('04 - Classificar dependências no HML', () => {
    cy.readFile('cypress/exports/produtos-prod-com-dependencias.json')
      .then(produtos => {
        cy.classificarDependencias(produtos)
      })
  })
  
  // 05 - CRIAR DEPENDÊNCIAS (HML)
  it('05 - Criar dependências no HML', () => {
    cy.readFile('cypress/exports/dependencias-hml-classificadas.json')
      .then(({ criar }) => {
        cy.criarDependencia(criar)
      })
  })

  // 06 - ATUALIZAR DEPENDÊNCIAS (HML)
  it.skip('06 - Atualizar dependências no HML', () => {
    cy.readFile('cypress/exports/dependencias-hml-classificadas.json')
      .then(({ atualizar }) => {
        cy.atualizarDependencia(atualizar)
      })
  })

  // 07 - Recarregar IDs finais das dependências no HML
  it.skip('07 - Recarregar IDs das dependências no HML', () => {
    cy.readFile('cypress/exports/produtos-prod-com-dependencias.json')
      .then(produtos => {
        cy.recarregarIdsDependencias(produtos)
      })
  })

  // 08 - Criar ou atualizar produto no HML (FULL COPY DO PROD)
  it.skip('08 - Criar ou atualizar produto no HML', () => {
    cy.readFile('cypress/exports/produtos-hml-com-ids.json')
      .then((produtos) => {
        cy.criarOuAtualizarProduto(produtos)
      })
  })
})