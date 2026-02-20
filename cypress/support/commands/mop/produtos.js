const ENTIDADES_CONFIG = require('../../utils/mop/produtos')

const {
  SELECT_VINCULO_ESTEIRA,
  SELECT_DESCRICAO,
  SELECT_ID,
  UPDATE
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
      const sql = SELECT_ID(config.tabela, campo, ids)
      return cy.executarQuerySQL('prod', sql).then((resultado) => {
        if (config.salvarComo) {
          return cy.salvarDados(resultado, config.salvarComo, 'dados', overwrite)
        }
        return resultado
      })
    }
  })
})

Cypress.Commands.add('buscarPorDescricaoNoHML', (nomeArquivo, env = 'hml') => {
  const config = ENTIDADES_CONFIG[nomeArquivo]
  const path = `cypress/output/dados/${config.salvarComo}.json`
  return cy.readFile(path).then(dados => {
    const descricoes = dados.map(d => d.descricao).filter(Boolean)
    if (!descricoes.length) return
    const sql = SELECT_DESCRICAO(config.tabela, descricoes)
    return cy.executarQuerySQL(env, sql).then(resultadoHML => {
      const mapHml = new Map(resultadoHML.map(r => [r.descricao, r.id]))
      dados.forEach(item => {
        item.idHml = mapHml.get(item.descricao) ?? null
      })
      return cy.writeFile(path, dados)
    })
  })
})

Cypress.Commands.add('atualizarComDadosProd', (nomeArquivo) => {
  const config = ENTIDADES_CONFIG[nomeArquivo]
  const path = `cypress/output/dados/${config.salvarComo}.json`

  return cy.readFile(path).then(dados => {
    const registrosComIdHml = dados.filter(d => d.idHml != null)
    const registrosSemIdHml = dados.filter(d => d.idHml == null)

    if (registrosSemIdHml.length > 0) {
      console.log(`⚠️ ${registrosSemIdHml.length} registros ignorados (idHml vazio)`)
    }

    if (!registrosComIdHml.length) {
      console.log(`❌ Nenhum registro com idHml encontrado em ${nomeArquivo}`)
      return
    }

    registrosComIdHml.forEach(registro => {
      const sql = UPDATE(config.tabela, registro)
      //cy.executarQuerySQL('hml', sql)
    })

    console.log(`✅ ${registrosComIdHml.length} registros atualizados`)
  })
})


