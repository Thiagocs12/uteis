const SELECT_VINCULO_ESTEIRA = `
  select
    idProduto,
    codigoModeloEsteira,
    codigoModeloEsteira2
  from MC_MOP_VINCULO_ESTEIRA
  where idProduto = 120
  ORDER BY idProduto asc
`

const SELECT_ID = (tabela, campoBusca, ids) => `
  select *
  from ${tabela}
  where ${campoBusca} in (${ids.join(',')})`

const SELECT_DESCRICAO = (tabela, descricoes) => `
  select *
  from ${tabela}
  where descricao in (${descricoes.map(d => `'${d}'`).join(',')})
`
const update = (tabela, descricoes) => `
  select *
  from ${tabela}
  where descricao in (${descricoes.map(d => `'${d}'`).join(',')})
`

module.exports = {
  SELECT_VINCULO_ESTEIRA,
  SELECT_ID,
  SELECT_DESCRICAO
}
