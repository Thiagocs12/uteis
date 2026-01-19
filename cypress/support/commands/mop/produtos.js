const ENTIDADES_CONFIG = require('../../utils/mop/produtos')

const {
  SELECT_VINCULO_ESTEIRA,
  SELECT_DESCRICAO
} = require('../../querySQL')

Cypress.Commands.add('salvarDados', (dados, nomeArquivo, path = 'dados', overwrite = true, campoId = 'id') => {
    const filePath = `cypress/output/${path}/${nomeArquivo}.json`
    if (overwrite) {
      return cy.writeFile(filePath, dados)
    }
    return cy.readFile(filePath, { failOnNonExistence: false })
      .then((conteudoAtual) => {
        const existente = Array.isArray(conteudoAtual) ? conteudoAtual : []
        const novos = Array.isArray(dados) ? dados : [dados]
        const map = new Map()
        existente.forEach(item => {
          if (item && item[campoId] != null) {
            map.set(item[campoId], item)
          }
        })
        novos.forEach(item => {
          if (item && item[campoId] != null) {
            map.set(item[campoId], item)
          }
        })
        const resultadoFinal = Array.from(map.values())
        return cy.writeFile(filePath, resultadoFinal)
      })
  }
)

Cypress.Commands.add('buscarVinculoEsteira', (env = 'prod') => {
  return cy.executarQuerySQL(env, SELECT_VINCULO_ESTEIRA).then((resultado) => {
    cy.salvarDados(resultado, 'vinculo_esteira_prod')
  })
})

Cypress.Commands.add('buscarItens', (entidade) => {
  const config = ENTIDADES_CONFIG[entidade]
  const path = `cypress/output/dados/${config.nomeArquivo}.json`
  if (!config) {
    throw new Error(`Entidade "${entidade}" não configurada`)
  }
  return cy.readFile(path).then((vinculos) => {
    expect(vinculos).to.be.an('array')
    const ids = vinculos
      .map(v => v[config.campoId])
      .filter(id => id != null)
    if (!ids.length) {
      console.log(`Nenhum ID encontrado para a entidade ${entidade}`)
    } else {
      const campo = config.campoBusca !== undefined ? config.campoBusca : 'id'
      const overwrite = config.overwrite !== undefined ? config.overwrite : true
      const sql = config.query(config.tabela, campo, ids)
      return cy.executarQuerySQL('prod', sql).then((resultado) => {
        if (config.salvarComo) {
          return cy.salvarDados(resultado, config.salvarComo, 'dados', overwrite)
        }
        return resultado
      })
    }
  })
})

Cypress.Commands.add('buscarPorDescricaoNoHML', (nomeArquivo = 'SELECT_PRODUTOS', env = 'hml') => {
  const config = ENTIDADES_CONFIG[nomeArquivo]
  const path = `cypress/output/dados/${config.nomeArquivo}.json`
  return cy.readFile(path).then((dados) => {
    const descricoes = dados.map(d => d.descricao).filter(Boolean)
    if (descricoes.length > 0) {
      const sql = SELECT_DESCRICAO(config.tabela, descricoes)
      return cy.executarQuerySQL(env, sql).then((resultadoHML) => {
        const mapHml = new Map()
        resultadoHML.forEach(r => {
          mapHml.set(r.descricao, r.id)
        })
        const encontrados = []
        const naoEncontrados = []
        dados.forEach(item => {
          if (mapHml.has(item.descricao)) {
            encontrados.push({
              id: item.id,
              idHml: mapHml.get(item.descricao),
              descricao: item.descricao
            })
          } else {
            naoEncontrados.push({
              id: item.id,
              descricao: item.descricao
            })
          }
        })
        return cy.salvarDados(encontrados, `${nomeArquivo}_ENCONTRADOS.json`, 'classificacao').then(() => {
          return cy.salvarDados(naoEncontrados, `${nomeArquivo}_NAO_ENCONTRADOS.json`, 'classificacao')
        })
      })
    }
  })
})

