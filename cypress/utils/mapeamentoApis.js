const MAPEAMENTOS_APIS = {
  /*PRODUTO: {
    url: 'mc-cadastro-ms/api/v1/produto/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/produto/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/produto/',
    urlListAll: 'mc-cadastro-ms/api/v1/produto/listAll',
    nomeArquivo: '1 - Produtos.json',
    nivelDependencia: 3
  },*/
  CLASSIFICACAO_PRODUTO: {
    url: 'mc-cadastro-ms/api/v1/classificacaoProduto/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/classificacaoProduto/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/classificacaoProduto/',
    nomeArquivo: '2 - Classificacoes.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'classificacaoProduto',
    //content: 'teste'
  },
  /*GRUPO_PRODUTO: {
    url: 'mc-cadastro-ms/api/v1/grupoProduto/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/grupoProduto/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/grupoProduto/',
    nomeArquivo: '3 - GrupoProdutos.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'grupoProduto',
    //content: 'false'
  },
  SUB_PRODUTO: {
    url: 'mc-cadastro-ms/api/v1/subProduto/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/subProduto/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/subProduto/',
    nomeArquivo: '33 - SubProdutos.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'subProduto',
    //content: 'false'
  },
  FOCO_NEGOCIO: {
    url: 'mc-cadastro-ms/api/v1/focoNegocio/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/focoNegocio/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/focoNegocio/',
    nomeArquivo: '4 - FocosNegocio.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'focoNegocio',
    //content: 'false'
  },
  TIPO_PRODUTO: {
    url: 'mc-cadastro-ms/api/v1/tipoProduto/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/tipoProduto/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/tipoProduto/',
    nomeArquivo: '5 - TiposProduto.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'tipoProduto',
    //content: 'false'
  },
  PRODUTO_INDEXADOR: {
    url: 'mc-cadastro-ms/api/v1/produtoIndexador/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/produtoIndexador/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/produtoIndexador/',
    nomeArquivo: '6 - ProdutosIndexadores.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'produtoIndexador',
    //content: 'false'
  },
  TIPO_RECEBIMENTO: {
    url: 'mc-cadastro-ms/api/v1/produtoTPRecebimento/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/produtoTPRecebimento/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/produtoTPRecebimento/',
    nomeArquivo: '7 - TiposRecebimento.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'produtoTPRecebimento',
    //content: 'false'
  },
  SEGMENTO_TARIFADOR: {
    url: 'mc-cadastro-ms/api/v1/segmentoTarifador/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/segmentoTarifador/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/segmentoTarifador/',
    nomeArquivo: '8 - SegmentosTarifadores.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '4 - FocosNegocio.json',
    campoBusca: 'segmentoTarifador',
    content: false
  },
  GRUPO_PRODUTO_RISCO: {
    url: 'mc-cadastro-ms/api/v1/grupoProdutoRisco/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/grupoProdutoRisco/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/grupoProdutoRisco/',
    nomeArquivo: '9 - GruposProdutoRisco.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '3 - GrupoProdutos.json',
    campoBusca: 'grupoProdutoRisco',
    content: false
  },
  PRODUTO_KIT: {
    urlBuscaId: 'mc-cadastro-ms/api/v1/produtoKit/findAllProdutoKitByProdutoId/',
    nomeArquivo: '10 - ProdutosKit.json',
    nivelDependencia: 5,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'id',
    content: 'falseId',
    contentBusca: ['produto', 'kitDocumento']
  },
  PRODUTO_GARANTIA: {
    urlBuscaId: 'mc-cadastro-ms/api/v1/produtoGarantia/findAllProdutoGarantiaByProdutoId/',
    nomeArquivo: '11 - ProdutosGarantia.json',
    nivelDependencia: 5,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'id',
    content: 'falseId'
  },
  PRODUTO_TARIFA: {
    urlBuscaId: 'mc-cadastro-ms/api/v1/produtoTarifa/findAllProdutoTarifaByProdutoId/',
    nomeArquivo: '12 - ProdutosTarifa.json',
    nivelDependencia: 5,
    nomeArquivoReferencia: '1 - Produtos.json',
    campoBusca: 'id',
    content: 'falseId'
  },*/
  GARANTIA_CATEGORIA: {
    urlBuscaId: 'mc-cadastro-ms/api/v1/garantiaCategoria/findAllGarantiaCategoriaByProduto/',
    urlBusca: 'mc-cadastro-ms/api/v1/garantiaCategoria/search/0?descricao=',
    nomeArquivo: '13 - GarantiasCategorias.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '11 - ProdutosGarantia.json',
    campoBusca: 'garantiaCategoria',
    content: 'lista',
    contentBusca: 'listaId'
  },
  TIPO_GARANTIA: {
    url: 'mc-cadastro-ms/api/v1/garantiaTipo/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/garantiaTipo/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/garantiaTipo/',
    nomeArquivo: '14 - TiposGarantia.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '13 - GarantiasCategorias.json',
    campoBusca: 'tipoGarantia',
    content: 'lista'
  },
  NIVEL_GARANTIA: {
    url: 'mc-cadastro-ms/api/v1/garantiaNivel/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/garantiaNivel/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/garantiaNivel/',
    nomeArquivo: '15 - NiveisGarantia.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '13 - GarantiasCategorias.json',
    campoBusca: 'garantiaNivel',
    content: 'lista'
  },
  CLASSIFICACAO_GARANTIA: {
    url: 'mc-cadastro-ms/api/v1/garantiaClassificacao/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/garantiaClassificacao/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/garantiaClassificacao/',
    nomeArquivo: '16 - ClassificacoesGarantia.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '13 - GarantiasCategorias.json',
    campoBusca: 'idGarantiaClassificacao',
    content: 'listaId'
  },
  GRUPO_GARANTIA :{
    url: 'mc-cadastro-ms/api/v1/grupoGarantia/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/grupoGarantia/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/grupoGarantia/',
    nomeArquivo: '17 - GruposGarantia.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '13 - GarantiasCategorias.json',
    campoBusca: 'grupoGarantia',
    content: 'lista'
  },
  TARIFA :{
    url: 'mc-cadastro-ms/api/v1/tarifa/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/tarifa/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/tarifa/',
    nomeArquivo: '18 - Tarifas.json',
    nivelDependencia: 4,
    nomeArquivoReferencia: '12 - ProdutosTarifa.json',
    campoBusca: 'tarifa',
    content: 'lista',
    campoDescricao: 'nomeTarifa'
  },
  EVENTO :{
    url: 'mc-cadastro-ms/api/v1/evento/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/evento/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/evento/',
    nomeArquivo: '19 - Eventos.json',
    nivelDependencia: 3,
    nomeArquivoReferencia: '18 - Tarifas.json',
    campoBusca: 'entidadeTarifador',
    content: false
  },
  TIPO_EVENTO :{
    url: 'mc-cadastro-ms/api/v1/tipoEvento/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/tipoEvento/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/tipoEvento/',
    nomeArquivo: '20 - TiposEvento.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '19 - Eventos.json',
    campoBusca: 'tipoEvento',
    content: false
  },
  SITUACAO :{
    url: 'mc-cadastro-ms/api/v1/situacao/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/situacao/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/situacao/',
    nomeArquivo: '21 - Situacoes.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '19 - Eventos.json',
    campoBusca: 'situacao',
    content: 'falseId'
  },
  TIPO_SITUACAO: {
    url: 'mc-cadastro-ms/api/v1/tipoSituacao/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/tipoSituacao/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/tipoSituacao/',
    nomeArquivo: '22 - TipoSituacao.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '21 - Situacoes.json',
    campoBusca: 'tipoSituacao',
    content: false
  },
  KIT_DOCUMENTO :{
    url: 'mc-cadastro-ms/api/v1/kitDocumentos/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/kitDocumentos/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/kitDocumentos/',
    nomeArquivo: '23 - KitsDocumentos.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '10 - ProdutosKit.json',
    campoBusca: 'kitDocumento',
    content: 'lista'
  },
  DOCUMENTO_KIT: {
    urlBuscaId: 'mc-cadastro-ms/api/v1/documentoKit/findAllDocumentoKitByKitDocumentoId/',
    nomeArquivo: '24 - DocumentosKit.json',
    nivelDependencia: 5,
    nomeArquivoReferencia: '23 - KitsDocumentos.json',
    campoBusca: 'id',
    content: 'falseId'
  },
  DOCUMENTO :{
    url: 'mc-cadastro-ms/api/v1/documento/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/documento/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/documento/',
    nomeArquivo: '25 - Documentos.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '24 - DocumentosKit.json',
    campoBusca: 'documento',
    content: 'lista'
  },
  DOCUMENTO_CONSULTA :{
    urlBuscaId: 'mc-cadastro-ms/api/v1/documento-consulta/documento/',
    nomeArquivo: '26 - DocumentosConsulta.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '25 - Documentos.json',
    campoBusca: 'id',
    content: 'falseId'
  },
  DOCUMENTO_PARTE :{
    urlBuscaId: 'mc-cadastro-ms/api/v1/documentoParte/findAllByDocumentoId/',
    nomeArquivo: '27 - DocumentoParte.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '25 - Documentos.json',
    campoBusca: 'id',
    content: 'falseId'
  },
  DOCUMENTO_SECAO :{
    urlBuscaId: 'mc-cadastro-ms/api/v1/documentoSecao/findAllByDocumentoId/',
    nomeArquivo: '28 - DocumentosSecao.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '25 - Documentos.json',
    campoBusca: 'id',
    content: 'falseId'
  },
  DOCUMENTO_CARTAO_ASSINATURA :{
    urlBuscaId: 'mc-cadastro-ms/api/v1/documentoCartaoAssinatura/findAllDocumentoCartaoAssinaturaByDocumentoId/',
    nomeArquivo: '29 - DocumentoCartaoAssinatura.json',
    nivelDependencia: 5,
    nomeArquivoReferencia: '25 - Documentos.json',
    campoBusca: 'id',
    content: 'falseId'
  },
  CARTAO_ASSINATURA :{
    url: 'mc-cadastro-ms/api/v1/cartaoAssinatura/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/cartaoAssinatura/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/cartaoAssinatura/',
    nomeArquivo: '30 - CartaoAssinatura.json',
    nivelDependencia: 2,
    nomeArquivoReferencia: '29 - DocumentoCartaoAssinatura.json',
    campoBusca: 'idCartaoAssinatura',
    content: 'listaId'
  },
  TITULO_ASSINATURA :{
    url: 'mc-cadastro-ms/api/v1/tituloAssinatura/search/0?',
    urlBusca: 'mc-cadastro-ms/api/v1/tituloAssinatura/search/0?descricao=',
    urlBuscaId: 'mc-cadastro-ms/api/v1/tituloAssinatura/',
    nomeArquivo: '31 - TituloAssinatura.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '30 - CartaoAssinatura.json',
    campoBusca: 'tituloAssinatura',
    content: false
  },
  ENTIDADE: {
    urlBuscaId: 'mc-cadastro-ms/api/v1/tituloAssinatura/',
    nomeArquivo: '32 - Entidades.json',
    nivelDependencia: 1,
    nomeArquivoReferencia: '27 - DocumentoParte.json',
    campoBusca: 'idEntidade',
    content: 'listaId' 
  },
  GRUPOS_KEYCLOAK: {
    url: 'auth/admin/realms/multiplicacapital/groups?',
    urlBusca: 'auth/admin/realms/multiplicacapital/groups?search=',
  }
};

export default MAPEAMENTOS_APIS;
