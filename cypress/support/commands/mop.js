Cypress.Commands.add('produtosCompletos', (idsProduto) => {
  const produtos = []
  cy.wrap(idsProduto).each(id => {
    cy.executarQuery(
      'PROD',
      `SELECT * FROM dbo.MC_CAD_PRODUTO WHERE id = @id`,
      { id }
    ).then(res => produtos.push(res.recordset[0]))
  }).then(() => {
    cy.task('file:save', {
      filename: 'produtos-prod.json',
      data: produtos
    })
  })
})

Cypress.Commands.add('resolverDependencias', (produtos) => {
  const produtosComDependencias = []
  const erros = []
  const dependenciasMap = Cypress.env('DEPENDENCIAS_MAP')
  const cacheDependencias = {}
  cy.wrap(produtos).each(produto => {
    const payload = { produto, dependencias: {} }
    cy.wrap(dependenciasMap).each(depMap => {
      if (depMap.nome === 'grupoProdutoRisco') return
      const idProd = produto[depMap.campo]
      if (!idProd) return
      const cacheKey = `${depMap.tabela}:${idProd}`
      if (cacheDependencias[cacheKey]) {
        payload.dependencias[depMap.nome] = {
          idProd,
          ref: cacheKey
        }
        return
      }
      cy.executarQuery(
        'PROD',
        `SELECT * FROM dbo.${depMap.tabela} WHERE id = @id`,
        { id: idProd }
      ).then(res => {
        if (!res.recordset.length) {
          erros.push(`Produto ${produto.id} → ${depMap.tabela} (${idProd})`)
          return
        }
        const registro = res.recordset[0]
        cacheDependencias[cacheKey] = registro
        payload.dependencias[depMap.nome] = {
          idProd,
          ref: cacheKey
        }
        if (depMap.nome === 'grupoProduto') {
          const riscoKey = `MC_CAD_GRUPO_PRODUTO_RISCO:${registro.idGrupoProdutoRisco}`
          if (cacheDependencias[riscoKey]) return
          cy.executarQuery(
            'PROD',
            `SELECT * FROM dbo.MC_CAD_GRUPO_PRODUTO_RISCO WHERE id = @id`,
            { id: registro.idGrupoProdutoRisco }
          ).then(r => {
            if (r.recordset.length) {
              cacheDependencias[riscoKey] = r.recordset[0]
            }
          })
        }
      })
    }).then(() => {
      produtosComDependencias.push(payload)
    })
  }).then(() => {
    if (erros.length) throw new Error(erros.join('\n'))

    cy.task('file:save', {
      filename: 'produtos-prod-com-dependencias.json',
      data: {
        produtos: produtosComDependencias,
        dependenciasResolvidas: cacheDependencias
      }
    })
  })
})


Cypress.Commands.add('classificarDependencias', ({ dependenciasResolvidas }) => {
  const result = { criar: [], atualizar: [] }

  const dependenciasMap = Cypress.env('DEPENDENCIAS_MAP')

  // índice rápido por tabela
  const mapPorTabela = Object.fromEntries(
    dependenciasMap.map(d => [d.tabela, d])
  )

  cy.wrap(Object.entries(dependenciasResolvidas)).each(
    ([cacheKey, registroProd]) => {

      const [tabela, idProd] = cacheKey.split(':')
      const depMap = mapPorTabela[tabela]
      if (!depMap) return

      cy.executarQuery(
        'DEV',
        `SELECT id FROM dbo.${tabela} WHERE descricao = @descricao`,
        { descricao: registroProd.descricao }
      ).then(res => {
        result[res.recordset.length ? 'atualizar' : 'criar'].push({
          tabela,
          idProd: Number(idProd),
          idHml: res.recordset[0]?.id,
          dadosProd: registroProd
        })
      })
    }
  ).then(() => {
    cy.task('file:save', {
      filename: 'dependencias-hml-classificadas.json',
      data: result
    })
  })
})

Cypress.Commands.add('criarDependencia', (criar) => {
  const TABELAS_COM_ATIVO = Cypress.env('TABELAS_COM_ATIVO')
  if (!criar?.length) return
    const ordemCriacao = [
      'MC_CAD_GRUPO_PRODUTO_RISCO', 'MC_CAD_GRUPO_PRODUTO', 'MC_CAD_SUBPRODUTO',
      'MC_CAD_FOCO_NEGOCIO', 'MC_CAD_TIPO_PRODUTO', 'MC_CAD_CLASSIFICACAO_PRODUTO',
      'MC_CAD_PRODUTO_INDEXADOR', 'MC_CAD_PRODUTO_TP_RECEBIMENTO'
    ]
    const criarOrdenado = [...criar].sort(
      (a, b) => ordemCriacao.indexOf(a.tabela) - ordemCriacao.indexOf(b.tabela)
    )
    cy.wrap(criarOrdenado).each(({ tabela, dadosProd }) => {
      cy.executarQuery(
        'DEV',
        `SELECT id FROM dbo.${tabela} WHERE descricao = @descricao`,
        { descricao: dadosProd.descricao }
      ).then(res => {
        if (res.recordset.length) return
        const usaAtivo = TABELAS_COM_ATIVO.includes(tabela)
        const ativo = dadosProd.ativo === true
        // GRUPO PRODUTO RISCO
        if (tabela === 'MC_CAD_GRUPO_PRODUTO_RISCO') {
          return cy.executarQuery('DEV', `
            INSERT INTO dbo.MC_CAD_GRUPO_PRODUTO_RISCO
            (
              idConsultoriaEspecializada, descricao, ${usaAtivo ? 'ativo,' : ''}
              diasVencidoConsideraLiquidez, usuarioCadastro, dataCadastro,
              usuarioUltimaAlteracao, dataUltimaAlteracao
            )
            VALUES
            (
              @idConsultoria, @descricao, ${usaAtivo ? '@ativo,' : ''}
              @dias, 'automacao', GETDATE(), 'automacao',GETDATE()
            )
          `, {
            idConsultoria: dadosProd.idConsultoriaEspecializada,
            descricao: dadosProd.descricao,
            ...(usaAtivo && { ativo }),
            dias: dadosProd.diasVencidoConsideraLiquidez ?? null
          })
        }
        // GRUPO PRODUTO
        if (tabela === 'MC_CAD_GRUPO_PRODUTO') {
          return cy.executarQuery('DEV', `
            INSERT INTO dbo.MC_CAD_GRUPO_PRODUTO
            (
              idConsultoriaEspecializada, descricao, ${usaAtivo ? 'ativo,' : ''}
              idGrupoProdutoRisco, usuarioCadastro, dataCadastro,
              usuarioUltimaAlteracao, dataUltimaAlteracao
            )
            VALUES
            (
              @idConsultoria, @descricao, ${usaAtivo ? '@ativo,' : ''}
              @idRisco, 'automacao', GETDATE(), 'automacao', GETDATE()
            )
          `, {
            idConsultoria: dadosProd.idConsultoriaEspecializada,
            descricao: dadosProd.descricao,
            ...(usaAtivo && { ativo }),
            idRisco: dadosProd.idGrupoProdutoRisco
          })
        }
        // DEFAULT
        return cy.executarQuery('DEV', `
          INSERT INTO dbo.${tabela}
          (
            idConsultoriaEspecializada, descricao, ${usaAtivo ? 'ativo,' : ''}
            usuarioCadastro, dataCadastro, usuarioUltimaAlteracao, dataUltimaAlteracao
          )
          VALUES
          (
            @idConsultoria, @descricao, ${usaAtivo ? '@ativo,' : ''}
            'automacao', GETDATE(), 'automacao', GETDATE()
          )
        `, {
          idConsultoria: dadosProd.idConsultoriaEspecializada,
          descricao: dadosProd.descricao,
          ...(usaAtivo && { ativo })
        })
      })
    })
})

Cypress.Commands.add('atualizarDependencia', (atualizar) => {
  const TABELAS_COM_ATIVO = Cypress.env('TABELAS_COM_ATIVO')
  if (!atualizar?.length) return
  cy.wrap(atualizar).each(({ tabela, idHml, dadosProd }) => {
    const usaAtivo = TABELAS_COM_ATIVO.includes(tabela)
    const ativo = dadosProd.ativo === true
    cy.executarQuery(
      'DEV',
      `
        UPDATE dbo.${tabela}
        SET
          descricao = @descricao
          ${usaAtivo ? ', ativo = @ativo' : ''}
          , usuarioUltimaAlteracao = 'automacao'
          , dataUltimaAlteracao = GETDATE()
        WHERE id = @id
      `,
      {
        id: idHml,
        descricao: dadosProd.descricao,
        ...(usaAtivo && { ativo })
      }
    )
  })
})

Cypress.Commands.add('recarregarIdsDependencias', (produtos) => {
  cy.wrap(produtos).each(item => {
    const dependenciasMap = Cypress.env('DEPENDENCIAS_MAP')
    const { dependencias } = item
    cy.wrap(dependenciasMap).each(depMap => {
      const dep = dependencias[depMap.nome]
      if (!dep) return
      cy.executarQuery(
        'DEV',
        `
          SELECT id
          FROM dbo.${depMap.tabela}
          WHERE ${depMap.campoDescricao} = @descricao
        `,
        { descricao: dep.descricao }
      ).then(res => {
        if (!res.recordset.length) {
          throw new Error(
            `Dependência ${depMap.nome} (${dep.descricao}) não encontrada no HML`
          )
        }
        dep.idHml = res.recordset[0].id
      })
    })
  }).then(() => {
    cy.task('file:save', {
      filename: 'produtos-hml-com-ids.json',
      data: produtos
    })
  })
})

Cypress.Commands.add('criarOuAtualizarProduto', (produtos) => {
  cy.wrap(produtos).each(({ produto, dependencias }) => {
  // 1) BASE DO PRODUTO = PROD (FONTE DE VERDADE)
  const produtoHml = {
    ...produto,
    // FKs substituídas por IDs do HML
    idFocoNegocio: dependencias.focoNegocio.idHml,
    idTipoProduto: dependencias.tipoProduto.idHml,
    idClassificacaoProduto: dependencias.classificacaoProduto.idHml,
    idSubProduto: dependencias.subProduto.idHml,
    idIndexador: dependencias.indexador.idHml,
    idTipoRecebimento: dependencias.tipoRecebimento.idHml,
    idGrupoProduto: dependencias.grupoProduto.idHml,
    idProdutoManterCobranca:
      dependencias.produtoManterCobranca?.idHml ?? null
  }
  // 2) REMOVE CAMPOS QUE NÃO DEVEM SER PERSISTIDOS
  delete produtoHml.id
  delete produtoHml.usuarioCadastro
  delete produtoHml.usuarioUltimaAlteracao
  delete produtoHml.dataCadastro
  delete produtoHml.dataUltimaAlteracao
  // 3) VERIFICA SE O PRODUTO JÁ EXISTE NO HML
  cy.executarQuery(
    'DEV',
    `
      SELECT id
      FROM dbo.MC_CAD_PRODUTO
      WHERE descricao = @descricao
    `,
    { descricao: produtoHml.descricao }
  ).then((res) => {
    // UPDATE
    if (res.recordset.length > 0) {
      produtoHml.id = res.recordset[0].id
      return cy.executarQuery(
        'DEV',
        `
          UPDATE dbo.MC_CAD_PRODUTO
          SET
            ${Object.keys(produtoHml)
              .filter(k => k !== 'id')
              .map(k => `${k} = @${k}`)
              .join(',\n')},
            usuarioUltimaAlteracao = 'automacao',
            dataUltimaAlteracao = GETDATE()
          WHERE id = @id
        `,
        produtoHml
      )
    }
    // INSERT
    return cy.executarQuery(
      'DEV',
      `
        INSERT INTO dbo.MC_CAD_PRODUTO
        (
          ${Object.keys(produtoHml).join(',\n')},
          usuarioCadastro, dataCadastro, usuarioUltimaAlteracao,
          dataUltimaAlteracao
        )
        VALUES
        (
          ${Object.keys(produtoHml).map(k => `@${k}`).join(',\n')},
          'automacao', GETDATE(), 'automacao', GETDATE()
        )
      `,
      produtoHml
    )
  })
})  })