const ENTIDADES_CONFIG = {
  SELECT_PRODUTOS: {
    nomeArquivo: 'vinculo_esteira_prod',
    campoId: 'idProduto',
    tabela: 'MC_CAD_PRODUTO', 
    salvarComo: '1 - SELECT_PRODUTOS',
  },
  SELECT_PRODUTOS_MANTER_EM_CORBANCA: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idProdutoManterCobranca',
    tabela: 'MC_CAD_PRODUTO', 
    salvarComo: '1 - SELECT_PRODUTOS',
    overwrite: false,
  },
  SELECT_FOCO_NEGOCIO: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idFocoNegocio',
    tabela: 'MC_CAD_FOCO_NEGOCIO', 
    salvarComo: '3 - SELECT_FOCO_NEGOCIO',
  },
  SELECT_TIPO_PRODUTO: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idTipoProduto',
    tabela: 'MC_CAD_TIPO_PRODUTO', 
    salvarComo: '4 - SELECT_TIPO_PRODUTO',
  },
  SELECT_CLASSIFICACAO_PRODUTO: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idClassificacaoProduto',
    tabela: 'MC_CAD_CLASSIFICACAO_PRODUTO', 
    salvarComo: '5 - SELECT_CLASSIFICACAO_PRODUTO',
  },
  SELECT_SUBPRODUTO: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idSubProduto',
    tabela: 'MC_CAD_SUBPRODUTO', 
    salvarComo: '6 - SELECT_SUBPRODUTO',
  },
  SELECT_PRODUTO_INDEXADOR: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idIndexador',
    tabela: 'MC_CAD_PRODUTO_INDEXADOR', 
    salvarComo: '7 - SELECT_PRODUTO_INDEXADOR',
  },
  SELECT_PRODUTO_TP_RECEBIMENTO: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idTipoRecebimento',
    tabela: 'MC_CAD_PRODUTO_TP_RECEBIMENTO', 
    salvarComo: '8 - SELECT_PRODUTO_TP_RECEBIMENTO',
  },
  SELECT_GRUPO_PRODUTO: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'idGrupoProduto',
    tabela: 'MC_CAD_GRUPO_PRODUTO', 
    salvarComo: '9 - SELECT_GRUPO_PRODUTO',
  },
  SELECT_CAD_PRODUTO_KIT: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'id',
    tabela: 'MC_CAD_PRODUTO_KIT', 
    campoBusca: 'idProduto',
    salvarComo: '10 - SELECT_CAD_PRODUTO_KIT',
  },
  SELECT_CAD_PRODUTO_TARIFA: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'id',
    tabela: 'MC_CAD_PRODUTO_TARIFA', 
    campoBusca: 'idProduto',
    salvarComo: '11 - SELECT_CAD_PRODUTO_TARIFA',
  },
  SELECT_CAD_PRODUTO_GARANTIA: {
    nomeArquivo: '1 - SELECT_PRODUTOS',
    campoId: 'id',
    tabela: 'MC_CAD_PRODUTO_GARANTIA', 
    campoBusca: 'idProduto',
    salvarComo: '12 - SELECT_CAD_PRODUTO_GARANTIA',
  },
  SELECT_CAD_GARANTIA_CATEGORIA: {
    nomeArquivo: '12 - SELECT_CAD_PRODUTO_GARANTIA',
    campoId: 'idGarantiaCategoria',
    tabela: 'MC_CAD_GARANTIA_CATEGORIA', 
    salvarComo: '13 - SELECT_CAD_GARANTIA_CATEGORIA',
  },
  SELECT_CAD_TARIFA: {
    nomeArquivo: '11 - SELECT_CAD_PRODUTO_TARIFA',
    campoId: 'idTarifa',
    tabela: 'MC_CAD_TARIFA', 
    salvarComo: '14 - SELECT_CAD_TARIFA',
  },
  SELECT_CAD_KIT_DOCUMENTO: {
    nomeArquivo: '10 - SELECT_CAD_PRODUTO_KIT',
    campoId: 'idKitDocumento',
    tabela: 'MC_CAD_KIT_DOCUMENTO', 
    salvarComo: '15 - SELECT_CAD_KIT_DOCUMENTO',
  },
  SELECT_CAD_GARANTIA_CLASSIFICACAO: {
    nomeArquivo: '13 - SELECT_CAD_GARANTIA_CATEGORIA',
    campoId: 'idGarantiaClassificacao',
    tabela: 'MC_CAD_GARANTIA_CLASSIFICACAO', 
    salvarComo: '16 - SELECT_CAD_GARANTIA_CLASSIFICACAO',
  },
  SELECT_CAD_TIPO_GARANTIA: {
    nomeArquivo: '13 - SELECT_CAD_GARANTIA_CATEGORIA',
    campoId: 'idTipoGarantia',
    tabela: 'MC_CAD_TIPO_GARANTIA', 
    salvarComo: '17 - SELECT_CAD_TIPO_GARANTIA',
  },
  SELECT_CAD_GARANTIA_NIVEL: {
    nomeArquivo: '13 - SELECT_CAD_GARANTIA_CATEGORIA',
    campoId: 'idGarantiaNivel',
    tabela: 'MC_CAD_GARANTIA_NIVEL', 
    salvarComo: '18 - SELECT_CAD_GARANTIA_NIVEL',
  },
  SELECT_CAD_GRUPO_GARANTIA: {
    nomeArquivo: '13 - SELECT_CAD_GARANTIA_CATEGORIA',
    campoId: 'idGrupoGarantia',
    tabela: 'MC_CAD_GRUPO_GARANTIA', 
    salvarComo: '19 - SELECT_CAD_GRUPO_GARANTIA',
  },
}

module.exports = ENTIDADES_CONFIG

