import './commands'
import './helpers'
import './queries'
import './requests'

Cypress.on('uncaught:exception', (err) => {
  if (
    /Cannot read properties of undefined \(reading 'content'\)/.test(err.message) ||
    /Request failed with status code 502/.test(err.message) ||
    /Request failed with status code 406/.test(err.message) ||
    /Request failed with status code 404/.test(err.message) ||
    /Request failed with status code 500/.test(err.message) ||
    /Network Error/.test(err.message) ||
    err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
    err.message.includes('ResizeObserver loop limit exceeded')
  ) {
    return false
  }
})

Cypress.env('DEPENDENCIAS_MAP', [
 { nome: 'focoNegocio',           campo: 'idFocoNegocio',           tabela: 'MC_CAD_FOCO_NEGOCIO',           campoDescricao: 'descricao' },
 { nome: 'tipoProduto',           campo: 'idTipoProduto',           tabela: 'MC_CAD_TIPO_PRODUTO',           campoDescricao: 'descricao' },
 { nome: 'classificacaoProduto',  campo: 'idClassificacaoProduto',  tabela: 'MC_CAD_CLASSIFICACAO_PRODUTO',  campoDescricao: 'descricao' },
 { nome: 'indexador',             campo: 'idIndexador',             tabela: 'MC_CAD_PRODUTO_INDEXADOR',      campoDescricao: 'descricao' },
 { nome: 'tipoRecebimento',       campo: 'idTipoRecebimento',       tabela: 'MC_CAD_PRODUTO_TP_RECEBIMENTO', campoDescricao: 'descricao' },
 { nome: 'grupoProduto',          campo: 'idGrupoProduto',          tabela: 'MC_CAD_GRUPO_PRODUTO',          campoDescricao: 'descricao' },
 { nome: 'grupoProdutoRisco',     campo: 'idGrupoProdutoRisco',     tabela: 'MC_CAD_GRUPO_PRODUTO_RISCO',    campoDescricao: 'descricao' },
 { nome: 'subProduto',            campo: 'idSubProduto',            tabela: 'MC_CAD_SUBPRODUTO',             campoDescricao: 'descricao' },
 { nome: 'produtoManterCobranca', campo: 'idProdutoManterCobranca', tabela: 'MC_CAD_PRODUTO',                campoDescricao: 'descricao' }
])

Cypress.env('TABELAS_COM_ATIVO', [
  'MC_CAD_FOCO_NEGOCIO',
  'MC_CAD_TIPO_PRODUTO',
  'MC_CAD_CLASSIFICACAO_PRODUTO',
  'MC_CAD_GRUPO_PRODUTO',
  'MC_CAD_GRUPO_PRODUTO_RISCO',
  'MC_CAD_SUBPRODUTO'
])
