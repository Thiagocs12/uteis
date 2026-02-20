const SELECT_VINCULO_ESTEIRA = `
  select
    idProduto,
    codigoModeloEsteira,
    codigoModeloEsteira2
  from MC_MOP_VINCULO_ESTEIRA
  where idProduto = 383
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
const UPDATE = (tabela, registro) => {
  const colunas = Object.keys(registro)
    .filter(col => col !== 'idHml' && col !== 'id')
    .map(col => {
      const valor = registro[col]
      if (valor === null) return `${col} = NULL`
      if (typeof valor === 'string') return `${col} = '${valor.replace(/'/g, "''")}'`
      if (typeof valor === 'boolean') return `${col} = ${valor ? 1 : 0}`
      return `${col} = ${valor}`
    })
    .join(', ')

  return console.log(`UPDATE ${tabela} SET ${colunas} WHERE id = ${registro.idHml}`)
}

module.exports = {
  SELECT_VINCULO_ESTEIRA,
  SELECT_ID,
  SELECT_DESCRICAO,
  UPDATE
}

