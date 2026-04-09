
/**
 * EXAMPLAR DE MAPEAMENTO DE TABELAS PARA PRODUTOS
 * 
 *MC_CAD_DOCUMENTO_SECAO: {
    nomeTabela: 'MC_CAD_DOCUMENTO_SECAO',
    nomeArquivo: 'Produtos/26 - MC_CAD_DOCUMENTO_SECAO',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    composicao: ['idDocumento', 'descricao'],
    colunasDependencia: [
      { colunaSubstituida: 'idDocumento', arquivoBusca: 'Produtos/24 - MC_CAD_DOCUMENTO'},
    ]
  },
 */

const MAPEAMENTO_TABELAS = {
  MC_CAD_PRODUTO: {
    nomeTabela: 'MC_CAD_PRODUTO',
    nomeArquivo: 'Produtos/1 - MC_CAD_PRODUTO',
    nivelDependencia: 3,
    colunasDependencia: [
        { colunaSubstituida: 'idGrupoProduto', arquivoBusca: 'Produtos/4 - MC_CAD_GRUPO_PRODUTO'},
        { colunaSubstituida: 'idClassificacaoProduto', arquivoBusca: 'Produtos/6 - MC_CAD_CLASSIFICACAO_PRODUTO'},
        { colunaSubstituida: 'idTipoProduto', arquivoBusca: 'Produtos/32 - MC_CAD_TIPO_PRODUTO'},
        { colunaSubstituida: 'idSubProduto', arquivoBusca: 'Produtos/7 - MC_CAD_SUBPRODUTO'},
        { colunaSubstituida: 'idIndexador', arquivoBusca: 'Produtos/8 - MC_CAD_PRODUTO_INDEXADOR'},
        { colunaSubstituida: 'idTipoRecebimento', arquivoBusca: 'Produtos/9 - MC_CAD_PRODUTO_TP_RECEBIMENTO'},
        { colunaSubstituida: 'idFocoNegocio', arquivoBusca: 'Produtos/2 - MC_CAD_FOCO_NEGOCIO'}
    ]
  },
  MC_CAD_FOCO_NEGOCIO: {
    nomeTabela: 'MC_CAD_FOCO_NEGOCIO',
    nomeArquivo: 'Produtos/2 - MC_CAD_FOCO_NEGOCIO',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idFocoNegocio',
    // colunasDependencia (array):
    // - colunaSubstituida: coluna no JSON atual que será substituída
    // - arquivoBusca: aProdutos/rquivo onde vamos buscar (padrão: match id -> idHml)
    colunasDependencia: [
      { colunaSubstituida: 'idSegmentoTarifador', arquivoBusca: 'Produtos/3 - MC_CAD_SEGMENTO_TARIFADOR' },
    ],
  },
  MC_CAD_SEGMENTO_TARIFADOR: {
    nomeTabela: 'MC_CAD_SEGMENTO_TARIFADOR',
    nomeArquivo: 'Produtos/3 - MC_CAD_SEGMENTO_TARIFADOR',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/2 - MC_CAD_FOCO_NEGOCIO',
    colunaReferencia: 'idSegmentoTarifador',
  },
  MC_CAD_GRUPO_PRODUTO: {
    nomeTabela: 'MC_CAD_GRUPO_PRODUTO',
    nomeArquivo: 'Produtos/4 - MC_CAD_GRUPO_PRODUTO',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idGrupoProduto',
    colunasDependencia: [
      { colunaSubstituida: 'idGrupoProdutoRisco', arquivoBusca: 'Produtos/5 - MC_CAD_GRUPO_PRODUTO_RISCO' },
    ],
  },
  MC_CAD_GRUPO_PRODUTO_RISCO: {
    nomeTabela: 'MC_CAD_GRUPO_PRODUTO_RISCO',
    nomeArquivo: 'Produtos/5 - MC_CAD_GRUPO_PRODUTO_RISCO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/4 - MC_CAD_GRUPO_PRODUTO',
    colunaReferencia: 'idGrupoProdutoRisco',
  },
  MC_CAD_CLASSIFICACAO_PRODUTO: {
    nomeTabela: 'MC_CAD_CLASSIFICACAO_PRODUTO',
    nomeArquivo: 'Produtos/6 - MC_CAD_CLASSIFICACAO_PRODUTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idClassificacaoProduto',
  },
  MC_CAD_TIPO_PRODUTO: {
    nomeTabela: 'MC_CAD_TIPO_PRODUTO',
    nomeArquivo: 'Produtos/32 - MC_CAD_TIPO_PRODUTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idTipoProduto',
  },
  MC_CAD_SUBPRODUTO: {
    nomeTabela: 'MC_CAD_SUBPRODUTO',
    nomeArquivo: 'Produtos/7 - MC_CAD_SUBPRODUTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idSubProduto',
  },
  MC_CAD_PRODUTO_INDEXADOR: {
    nomeTabela: 'MC_CAD_PRODUTO_INDEXADOR',
    nomeArquivo: 'Produtos/8 - MC_CAD_PRODUTO_INDEXADOR',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idIndexador',
  },
  MC_CAD_PRODUTO_TP_RECEBIMENTO: {
    nomeTabela: 'MC_CAD_PRODUTO_TP_RECEBIMENTO',
    nomeArquivo: 'Produtos/9 - MC_CAD_PRODUTO_TP_RECEBIMENTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idTipoRecebimento',
  },
  MC_CAD_PRODUTO_KIT: {
    nomeTabela: 'MC_CAD_PRODUTO_KIT',
    nomeArquivo: 'Produtos/10 - MC_CAD_PRODUTO_KIT',
    nivelDependencia: 5,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idProduto',
    colunasDependencia: [
      {colunaSubstituida: 'idProduto', arquivoBusca: 'Produtos/1 - MC_CAD_PRODUTO'},
      {colunaSubstituida: 'idKitDocumento', arquivoBusca: 'Produtos/22 - MC_CAD_KIT_DOCUMENTO'},
    ],
    composicao: ['idProduto', 'idKitDocumento'],
  },
  MC_CAD_PRODUTO_GARANTIA: {
    nomeTabela: 'MC_CAD_PRODUTO_GARANTIA',
    nomeArquivo: 'Produtos/11 - MC_CAD_PRODUTO_GARANTIA',
    nivelDependencia: 5,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idProduto',
    colunasDependencia: [
      {colunaSubstituida: 'idProduto', arquivoBusca: 'Produtos/1 - MC_CAD_PRODUTO'},
      {colunaSubstituida: 'idGarantiaCategoria', arquivoBusca: 'Produtos/13 - MC_CAD_GARANTIA_CATEGORIA'},
    ],
    composicao: ['idProduto', 'idGarantiaCategoria'],
  },
  MC_CAD_PRODUTO_TARIFA: {
    nomeTabela: 'MC_CAD_PRODUTO_TARIFA',
    nomeArquivo: 'Produtos/12 - MC_CAD_PRODUTO_TARIFA',
    nivelDependencia: 5,
    arquivoReferencia: 'Produtos/1 - MC_CAD_PRODUTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idProduto',
    colunasDependencia: [
      {colunaSubstituida: 'idProduto', arquivoBusca: 'Produtos/1 - MC_CAD_PRODUTO'},
      {colunaSubstituida: 'idTarifa', arquivoBusca: 'Produtos/17 - MC_CAD_TARIFA'},
    ],
    composicao: ['idProduto', 'idTarifa'],
  },
  MC_CAD_GARANTIA_CATEGORIA: {
    nomeTabela: 'MC_CAD_GARANTIA_CATEGORIA',
    nomeArquivo: 'Produtos/13 - MC_CAD_GARANTIA_CATEGORIA',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/11 - MC_CAD_PRODUTO_GARANTIA',
    colunaReferencia: 'idGarantiaCategoria',
    colunasDependencia: [
      { colunaSubstituida: 'idGarantiaNivel', arquivoBusca: 'Produtos/16 - MC_CAD_GARANTIA_NIVEL' },
      { colunaSubstituida: 'idGarantiaClassificacao', arquivoBusca: 'Produtos/15 - MC_CAD_GARANTIA_CLASSIFICACAO' },
      { colunaSubstituida: 'idTipoGarantia', arquivoBusca: 'Produtos/14 - MC_CAD_TIPO_GARANTIA' },
      { colunaSubstituida: 'idGrupoGarantia', arquivoBusca: 'Produtos/33 - MC_CAD_GRUPO_GARANTIA' },
    ],
  },
  MC_CAD_TIPO_GARANTIA: {
    nomeTabela: 'MC_CAD_TIPO_GARANTIA',
    nomeArquivo: 'Produtos/14 - MC_CAD_TIPO_GARANTIA',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idTipoGarantia',
  },
  MC_CAD_GARANTIA_CLASSIFICACAO: {
    nomeTabela: 'MC_CAD_GARANTIA_CLASSIFICACAO',
    nomeArquivo: 'Produtos/15 - MC_CAD_GARANTIA_CLASSIFICACAO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idGarantiaClassificacao',
  },
  MC_CAD_GARANTIA_NIVEL: {
    nomeTabela: 'MC_CAD_GARANTIA_NIVEL',
    nomeArquivo: 'Produtos/16 - MC_CAD_GARANTIA_NIVEL',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idGarantiaNivel',
  },
  MC_CAD_GRUPO_GARANTIA: {
    nomeTabela: 'MC_CAD_GRUPO_GARANTIA',
    nomeArquivo: 'Produtos/33 - MC_CAD_GRUPO_GARANTIA',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idGrupoGarantia',
  },
  MC_CAD_TARIFA: {
    nomeTabela: 'MC_CAD_TARIFA',
    nomeArquivo: 'Produtos/17 - MC_CAD_TARIFA',
    nivelDependencia: 4,
    arquivoReferencia: 'Produtos/12 - MC_CAD_PRODUTO_TARIFA',
    colunaReferencia: 'idTarifa',
    composicao: ['codigoSubcategoria', 'nomeTarifa'],
    colunasDependencia: [
      { colunaSubstituida: 'idEventoTarifador', arquivoBusca: 'Produtos/18 - MC_CAD_EVENTO'},
    ]
  },
  MC_CAD_EVENTO: {
    nomeTabela: 'MC_CAD_EVENTO',
    nomeArquivo: 'Produtos/18 - MC_CAD_EVENTO',
    nivelDependencia: 3,
    arquivoReferencia: 'Produtos/17 - MC_CAD_TARIFA',
    colunaReferencia: 'idEventoTarifador',
    composicao: ['descricao'],
    colunasDependencia: [
      { colunaSubstituida: 'idTipoEvento', arquivoBusca: 'Produtos/19 - MC_CAD_TIPO_EVENTO'},
      { colunaSubstituida: 'idSituacao', arquivoBusca: 'Produtos/20 - MC_CAD_SITUACAO'}
    ]
  },
  MC_CAD_TIPO_EVENTO: {
    nomeTabela: 'MC_CAD_TIPO_EVENTO',
    nomeArquivo: 'Produtos/19 - MC_CAD_TIPO_EVENTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/18 - MC_CAD_EVENTO',
    colunaReferencia: 'idTipoEvento',
  },
  MC_CAD_SITUACAO: {
    nomeTabela: 'MC_CAD_SITUACAO',
    nomeArquivo: 'Produtos/20 - MC_CAD_SITUACAO',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/18 - MC_CAD_EVENTO',
    colunaReferencia: 'idSituacao',
    composicao: ['idTipoSituacao', 'descricao'],
  },
  MC_CAD_TIPO_SITUACAO: {
    nomeTabela: 'MC_CAD_TIPO_SITUACAO',
    nomeArquivo: 'Produtos/21 - MC_CAD_TIPO_SITUACAO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/20 - MC_CAD_SITUACAO',
    colunaReferencia: 'idTipoSituacao',
    colunasDependencia: [{ colunaSubstituida: 'idTipoSituacao', arquivoBusca: 'Produtos/21 - MC_CAD_TIPO_SITUACAO' }],
  },
  MC_CAD_KIT_DOCUMENTO: {
    nomeTabela: 'MC_CAD_KIT_DOCUMENTO',
    nomeArquivo: 'Produtos/22 - MC_CAD_KIT_DOCUMENTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/10 - MC_CAD_PRODUTO_KIT',
    colunaReferencia: 'idKitDocumento',
  },
  MC_CAD_DOCUMENTO_KIT: {
    nomeTabela: 'MC_CAD_DOCUMENTO_KIT',
    nomeArquivo: 'Produtos/23 - MC_CAD_DOCUMENTO_KIT',
    nivelDependencia: 5,
    arquivoReferencia: 'Produtos/22 - MC_CAD_KIT_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idKitDocumento',
    colunasDependencia: [
      {colunaSubstituida: 'idDocumento', arquivoBusca: 'Produtos/24 - MC_CAD_DOCUMENTO'},
      {colunaSubstituida: 'idKitDocumento', arquivoBusca: 'Produtos/22 - MC_CAD_KIT_DOCUMENTO'},
    ],
    composicao: ['idDocumento', 'idKitDocumento'],
  },
  MC_CAD_DOCUMENTO: {
    nomeTabela: 'MC_CAD_DOCUMENTO',
    nomeArquivo: 'Produtos/24 - MC_CAD_DOCUMENTO',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/23 - MC_CAD_DOCUMENTO_KIT',
    colunaReferencia: 'idDocumento',
  },
  MC_CAD_DOCUMENTO_CONSULTA: {
    nomeTabela: 'MC_CAD_DOCUMENTO_CONSULTA',
    nomeArquivo: 'Produtos/25 - MC_CAD_DOCUMENTO_CONSULTA',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    composicao: ['idDocumento', 'descricao'],
    colunasDependencia: [{ colunaSubstituida: 'idDocumento', arquivoBusca: 'Produtos/24 - MC_CAD_DOCUMENTO' }],
  },
  MC_CAD_DOCUMENTO_SECAO: {
    nomeTabela: 'MC_CAD_DOCUMENTO_SECAO',
    nomeArquivo: 'Produtos/26 - MC_CAD_DOCUMENTO_SECAO',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    composicao: ['idDocumento', 'descricao'],
    colunasDependencia: [
      { colunaSubstituida: 'idDocumento', arquivoBusca: 'Produtos/24 - MC_CAD_DOCUMENTO' }
    ],
  },
  MC_CAD_DOCUMENTO_CARTAO_ASSINATURA: {
    nomeTabela: 'MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    nomeArquivo: 'Produtos/27 - MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    nivelDependencia: 5,
    arquivoReferencia: 'Produtos/24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    colunasDependencia: [
      {colunaSubstituida: 'idDocumento', arquivoBusca: 'Produtos/24 - MC_CAD_DOCUMENTO'},
      {colunaSubstituida: 'idCartaoAssinatura', arquivoBusca: 'Produtos/28 - MC_CAD_CARTAO_ASSINATURA'},
    ],
    composicao: ['idDocumento', 'idCartaoAssinatura'],
  },
  MC_CAD_CARTAO_ASSINATURA: {
    nomeTabela: 'MC_CAD_CARTAO_ASSINATURA',
    nomeArquivo: 'Produtos/28 - MC_CAD_CARTAO_ASSINATURA',
    nivelDependencia: 2,
    arquivoReferencia: 'Produtos/27 - MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    colunaReferencia: 'idCartaoAssinatura',
    composicao: ['nome', 'cpf'],
    colunasDependencia: [
      { colunaSubstituida: 'idTituloAssinatura', arquivoBusca: 'Produtos/29 - MC_CAD_TITULO_ASSINATURA' }
    ],
  },
  MC_CAD_TITULO_ASSINATURA: {
    nomeTabela: 'MC_CAD_TITULO_ASSINATURA',
    nomeArquivo: 'Produtos/29 - MC_CAD_TITULO_ASSINATURA',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/28 - MC_CAD_CARTAO_ASSINATURA',
    colunaReferencia: 'idTituloAssinatura',
  },
  MC_CAD_DOCUMENTO_PARTE: {
    nomeTabela: 'MC_CAD_DOCUMENTO_PARTE',
    nomeArquivo: 'Produtos/30 - MC_CAD_DOCUMENTO_PARTE',
    nivelDependencia: 5,
    arquivoReferencia: 'Produtos/24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    colunasDependencia: [
      {colunaSubstituida: 'idDocumento', arquivoBusca: 'Produtos/24 - MC_CAD_DOCUMENTO'},
      {colunaSubstituida: 'idEntidade', arquivoBusca: 'Produtos/31 - MC_CAD_ENTIDADE'},
    ],
    composicao: ['idDocumento', 'idEntidade'],
  },
  MC_CAD_ENTIDADE: {
    nomeTabela: 'MC_CAD_ENTIDADE',
    nomeArquivo: 'Produtos/31 - MC_CAD_ENTIDADE',
    nivelDependencia: 1,
    arquivoReferencia: 'Produtos/30 - MC_CAD_DOCUMENTO_PARTE',
    colunaReferencia: 'idEntidade',
  },
  MC_MOP_VINCULO_ESTEIRA: {
    nomeTabela: 'MC_MOP_VINCULO_ESTEIRA',
    nomeArquivo: 'Esteiras/1 - MC_MOP_VINCULO_ESTEIRA',
  },
};

export default MAPEAMENTO_TABELAS;
