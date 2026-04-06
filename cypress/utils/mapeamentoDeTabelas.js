
/**
 * EXAMPLAR DE MAPEAMENTO DE TABELAS PARA PRODUTOS
 * 
 *MC_CAD_DOCUMENTO_SECAO: {
    nomeTabela: 'MC_CAD_DOCUMENTO_SECAO',
    nomeArquivo: '26 - MC_CAD_DOCUMENTO_SECAO',
    nivelDependencia: 2,
    arquivoReferencia: '24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    composicao: ['idDocumento', 'descricao'],
    colunasDependencia: [
      { colunaSubstituida: 'idDocumento', arquivoBusca: '24 - MC_CAD_DOCUMENTO'},
    ]
  },
 */

const MAPEAMENTO_TABELAS = {
  MC_CAD_PRODUTO: {
    nomeTabela: 'MC_CAD_PRODUTO',
    nomeArquivo: '1 - MC_CAD_PRODUTO',
    nivelDependencia: 3,
    colunasDependencia: [
        { colunaSubstituida: 'idGrupoProduto', arquivoBusca: '4 - MC_CAD_GRUPO_PRODUTO'},
        { colunaSubstituida: 'idClassificacaoProduto', arquivoBusca: '6 - MC_CAD_CLASSIFICACAO_PRODUTO'},
        { colunaSubstituida: 'idTipoProduto', arquivoBusca: '32 - MC_CAD_TIPO_PRODUTO'},
        { colunaSubstituida: 'idSubProduto', arquivoBusca: '7 - MC_CAD_SUBPRODUTO'},
        { colunaSubstituida: 'idIndexador', arquivoBusca: '8 - MC_CAD_PRODUTO_INDEXADOR'},
        { colunaSubstituida: 'idTipoRecebimento', arquivoBusca: '9 - MC_CAD_PRODUTO_TP_RECEBIMENTO'},
        { colunaSubstituida: 'idFocoNegocio', arquivoBusca: '2 - MC_CAD_FOCO_NEGOCIO'}
    ]
  },
  MC_CAD_FOCO_NEGOCIO: {
    nomeTabela: 'MC_CAD_FOCO_NEGOCIO',
    nomeArquivo: '2 - MC_CAD_FOCO_NEGOCIO',
    nivelDependencia: 2,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idFocoNegocio',
    // colunasDependencia (array):
    // - colunaSubstituida: coluna no JSON atual que será substituída
    // - arquivoBusca: arquivo onde vamos buscar (padrão: match id -> idHml)
    colunasDependencia: [
      { colunaSubstituida: 'idSegmentoTarifador', arquivoBusca: '3 - MC_CAD_SEGMENTO_TARIFADOR' },
    ],
  },
  MC_CAD_SEGMENTO_TARIFADOR: {
    nomeTabela: 'MC_CAD_SEGMENTO_TARIFADOR',
    nomeArquivo: '3 - MC_CAD_SEGMENTO_TARIFADOR',
    nivelDependencia: 1,
    arquivoReferencia: '2 - MC_CAD_FOCO_NEGOCIO',
    colunaReferencia: 'idSegmentoTarifador',
  },
  MC_CAD_GRUPO_PRODUTO: {
    nomeTabela: 'MC_CAD_GRUPO_PRODUTO',
    nomeArquivo: '4 - MC_CAD_GRUPO_PRODUTO',
    nivelDependencia: 2,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idGrupoProduto',
    colunasDependencia: [
      { colunaSubstituida: 'idGrupoProdutoRisco', arquivoBusca: '5 - MC_CAD_GRUPO_PRODUTO_RISCO' },
    ],
  },
  MC_CAD_GRUPO_PRODUTO_RISCO: {
    nomeTabela: 'MC_CAD_GRUPO_PRODUTO_RISCO',
    nomeArquivo: '5 - MC_CAD_GRUPO_PRODUTO_RISCO',
    nivelDependencia: 1,
    arquivoReferencia: '4 - MC_CAD_GRUPO_PRODUTO',
    colunaReferencia: 'idGrupoProdutoRisco',
  },
  MC_CAD_CLASSIFICACAO_PRODUTO: {
    nomeTabela: 'MC_CAD_CLASSIFICACAO_PRODUTO',
    nomeArquivo: '6 - MC_CAD_CLASSIFICACAO_PRODUTO',
    nivelDependencia: 1,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idClassificacaoProduto',
  },
  MC_CAD_TIPO_PRODUTO: {
    nomeTabela: 'MC_CAD_TIPO_PRODUTO',
    nomeArquivo: '32 - MC_CAD_TIPO_PRODUTO',
    nivelDependencia: 1,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idTipoProduto',
  },
  MC_CAD_SUBPRODUTO: {
    nomeTabela: 'MC_CAD_SUBPRODUTO',
    nomeArquivo: '7 - MC_CAD_SUBPRODUTO',
    nivelDependencia: 1,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idSubProduto',
  },
  MC_CAD_PRODUTO_INDEXADOR: {
    nomeTabela: 'MC_CAD_PRODUTO_INDEXADOR',
    nomeArquivo: '8 - MC_CAD_PRODUTO_INDEXADOR',
    nivelDependencia: 1,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idIndexador',
  },
  MC_CAD_PRODUTO_TP_RECEBIMENTO: {
    nomeTabela: 'MC_CAD_PRODUTO_TP_RECEBIMENTO',
    nomeArquivo: '9 - MC_CAD_PRODUTO_TP_RECEBIMENTO',
    nivelDependencia: 1,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'idTipoRecebimento',
  },
  MC_CAD_PRODUTO_KIT: {
    nomeTabela: 'MC_CAD_PRODUTO_KIT',
    nomeArquivo: '10 - MC_CAD_PRODUTO_KIT',
    nivelDependencia: 5,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idProduto',
    colunasDependencia: [
      {colunaSubstituida: 'idProduto', arquivoBusca: '1 - MC_CAD_PRODUTO'},
      {colunaSubstituida: 'idKitDocumento', arquivoBusca: '22 - MC_CAD_KIT_DOCUMENTO'},
    ],
    composicao: ['idProduto', 'idKitDocumento'],
  },
  MC_CAD_PRODUTO_GARANTIA: {
    nomeTabela: 'MC_CAD_PRODUTO_GARANTIA',
    nomeArquivo: '11 - MC_CAD_PRODUTO_GARANTIA',
    nivelDependencia: 5,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idProduto',
    colunasDependencia: [
      {colunaSubstituida: 'idProduto', arquivoBusca: '1 - MC_CAD_PRODUTO'},
      {colunaSubstituida: 'idGarantiaCategoria', arquivoBusca: '13 - MC_CAD_GARANTIA_CATEGORIA'},
    ],
    composicao: ['idProduto', 'idGarantiaCategoria'],
  },
  MC_CAD_PRODUTO_TARIFA: {
    nomeTabela: 'MC_CAD_PRODUTO_TARIFA',
    nomeArquivo: '12 - MC_CAD_PRODUTO_TARIFA',
    nivelDependencia: 5,
    arquivoReferencia: '1 - MC_CAD_PRODUTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idProduto',
    colunasDependencia: [
      {colunaSubstituida: 'idProduto', arquivoBusca: '1 - MC_CAD_PRODUTO'},
      {colunaSubstituida: 'idTarifa', arquivoBusca: '17 - MC_CAD_TARIFA'},
    ],
    composicao: ['idProduto', 'idTarifa'],
  },
  MC_CAD_GARANTIA_CATEGORIA: {
    nomeTabela: 'MC_CAD_GARANTIA_CATEGORIA',
    nomeArquivo: '13 - MC_CAD_GARANTIA_CATEGORIA',
    nivelDependencia: 2,
    arquivoReferencia: '11 - MC_CAD_PRODUTO_GARANTIA',
    colunaReferencia: 'idGarantiaCategoria',
    colunasDependencia: [
      { colunaSubstituida: 'idGarantiaNivel', arquivoBusca: '16 - MC_CAD_GARANTIA_NIVEL' },
      { colunaSubstituida: 'idGarantiaClassificacao', arquivoBusca: '15 - MC_CAD_GARANTIA_CLASSIFICACAO' },
      { colunaSubstituida: 'idTipoGarantia', arquivoBusca: '14 - MC_CAD_TIPO_GARANTIA' },
      { colunaSubstituida: 'idGrupoGarantia', arquivoBusca: '33 - MC_CAD_GRUPO_GARANTIA' },
    ],
  },
  MC_CAD_TIPO_GARANTIA: {
    nomeTabela: 'MC_CAD_TIPO_GARANTIA',
    nomeArquivo: '14 - MC_CAD_TIPO_GARANTIA',
    nivelDependencia: 1,
    arquivoReferencia: '13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idTipoGarantia',
  },
  MC_CAD_GARANTIA_CLASSIFICACAO: {
    nomeTabela: 'MC_CAD_GARANTIA_CLASSIFICACAO',
    nomeArquivo: '15 - MC_CAD_GARANTIA_CLASSIFICACAO',
    nivelDependencia: 1,
    arquivoReferencia: '13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idGarantiaClassificacao',
  },
  MC_CAD_GARANTIA_NIVEL: {
    nomeTabela: 'MC_CAD_GARANTIA_NIVEL',
    nomeArquivo: '16 - MC_CAD_GARANTIA_NIVEL',
    nivelDependencia: 1,
    arquivoReferencia: '13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idGarantiaNivel',
  },
  MC_CAD_GRUPO_GARANTIA: {
    nomeTabela: 'MC_CAD_GRUPO_GARANTIA',
    nomeArquivo: '33 - MC_CAD_GRUPO_GARANTIA',
    nivelDependencia: 1,
    arquivoReferencia: '13 - MC_CAD_GARANTIA_CATEGORIA',
    colunaReferencia: 'idGrupoGarantia',
  },
  MC_CAD_TARIFA: {
    nomeTabela: 'MC_CAD_TARIFA',
    nomeArquivo: '17 - MC_CAD_TARIFA',
    nivelDependencia: 4,
    arquivoReferencia: '12 - MC_CAD_PRODUTO_TARIFA',
    colunaReferencia: 'idTarifa',
    composicao: ['codigoSubcategoria', 'nomeTarifa'],
    colunasDependencia: [
      { colunaSubstituida: 'idEventoTarifador', arquivoBusca: '18 - MC_CAD_EVENTO'},
    ]
  },
  MC_CAD_EVENTO: {
    nomeTabela: 'MC_CAD_EVENTO',
    nomeArquivo: '18 - MC_CAD_EVENTO',
    nivelDependencia: 3,
    arquivoReferencia: '17 - MC_CAD_TARIFA',
    colunaReferencia: 'idEventoTarifador',
    composicao: ['descricao'],
    colunasDependencia: [
      { colunaSubstituida: 'idTipoEvento', arquivoBusca: '19 - MC_CAD_TIPO_EVENTO'},
      { colunaSubstituida: 'idSituacao', arquivoBusca: '20 - MC_CAD_SITUACAO'}
    ]
  },
  MC_CAD_TIPO_EVENTO: {
    nomeTabela: 'MC_CAD_TIPO_EVENTO',
    nomeArquivo: '19 - MC_CAD_TIPO_EVENTO',
    nivelDependencia: 1,
    arquivoReferencia: '18 - MC_CAD_EVENTO',
    colunaReferencia: 'idTipoEvento',
  },
  MC_CAD_SITUACAO: {
    nomeTabela: 'MC_CAD_SITUACAO',
    nomeArquivo: '20 - MC_CAD_SITUACAO',
    nivelDependencia: 2,
    arquivoReferencia: '18 - MC_CAD_EVENTO',
    colunaReferencia: 'idSituacao',
    composicao: ['idTipoSituacao', 'descricao'],
  },
  MC_CAD_TIPO_SITUACAO: {
    nomeTabela: 'MC_CAD_TIPO_SITUACAO',
    nomeArquivo: '21 - MC_CAD_TIPO_SITUACAO',
    nivelDependencia: 1,
    arquivoReferencia: '20 - MC_CAD_SITUACAO',
    colunaReferencia: 'idTipoSituacao',
    colunasDependencia: [{ colunaSubstituida: 'idTipoSituacao', arquivoBusca: '21 - MC_CAD_TIPO_SITUACAO' }],
  },
  MC_CAD_KIT_DOCUMENTO: {
    nomeTabela: 'MC_CAD_KIT_DOCUMENTO',
    nomeArquivo: '22 - MC_CAD_KIT_DOCUMENTO',
    nivelDependencia: 1,
    arquivoReferencia: '10 - MC_CAD_PRODUTO_KIT',
    colunaReferencia: 'idKitDocumento',
  },
  MC_CAD_DOCUMENTO_KIT: {
    nomeTabela: 'MC_CAD_DOCUMENTO_KIT',
    nomeArquivo: '23 - MC_CAD_DOCUMENTO_KIT',
    nivelDependencia: 5,
    arquivoReferencia: '22 - MC_CAD_KIT_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idKitDocumento',
    colunasDependencia: [
      {colunaSubstituida: 'idDocumento', arquivoBusca: '24 - MC_CAD_DOCUMENTO'},
      {colunaSubstituida: 'idKitDocumento', arquivoBusca: '22 - MC_CAD_KIT_DOCUMENTO'},
    ],
    composicao: ['idDocumento', 'idKitDocumento'],
  },
  MC_CAD_DOCUMENTO: {
    nomeTabela: 'MC_CAD_DOCUMENTO',
    nomeArquivo: '24 - MC_CAD_DOCUMENTO',
    nivelDependencia: 1,
    arquivoReferencia: '23 - MC_CAD_DOCUMENTO_KIT',
    colunaReferencia: 'idDocumento',
  },
  MC_CAD_DOCUMENTO_CONSULTA: {
    nomeTabela: 'MC_CAD_DOCUMENTO_CONSULTA',
    nomeArquivo: '25 - MC_CAD_DOCUMENTO_CONSULTA',
    nivelDependencia: 2,
    arquivoReferencia: '24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    composicao: ['idDocumento', 'descricao'],
    colunasDependencia: [{ colunaSubstituida: 'idDocumento', arquivoBusca: '24 - MC_CAD_DOCUMENTO' }],
  },
  MC_CAD_DOCUMENTO_SECAO: {
    nomeTabela: 'MC_CAD_DOCUMENTO_SECAO',
    nomeArquivo: '26 - MC_CAD_DOCUMENTO_SECAO',
    nivelDependencia: 2,
    arquivoReferencia: '24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    composicao: ['idDocumento', 'descricao'],
    colunasDependencia: [
      { colunaSubstituida: 'idDocumento', arquivoBusca: '24 - MC_CAD_DOCUMENTO' }
    ],
  },
  MC_CAD_DOCUMENTO_CARTAO_ASSINATURA: {
    nomeTabela: 'MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    nomeArquivo: '27 - MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    nivelDependencia: 5,
    arquivoReferencia: '24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    colunasDependencia: [
      {colunaSubstituida: 'idDocumento', arquivoBusca: '24 - MC_CAD_DOCUMENTO'},
      {colunaSubstituida: 'idCartaoAssinatura', arquivoBusca: '28 - MC_CAD_CARTAO_ASSINATURA'},
    ],
    composicao: ['idDocumento', 'idCartaoAssinatura'],
  },
  MC_CAD_CARTAO_ASSINATURA: {
    nomeTabela: 'MC_CAD_CARTAO_ASSINATURA',
    nomeArquivo: '28 - MC_CAD_CARTAO_ASSINATURA',
    nivelDependencia: 2,
    arquivoReferencia: '27 - MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    colunaReferencia: 'idCartaoAssinatura',
    composicao: ['nome', 'cpf'],
    colunasDependencia: [
      { colunaSubstituida: 'idTituloAssinatura', arquivoBusca: '29 - MC_CAD_TITULO_ASSINATURA' }
    ],
  },
  MC_CAD_TITULO_ASSINATURA: {
    nomeTabela: 'MC_CAD_TITULO_ASSINATURA',
    nomeArquivo: '29 - MC_CAD_TITULO_ASSINATURA',
    nivelDependencia: 1,
    arquivoReferencia: '28 - MC_CAD_CARTAO_ASSINATURA',
    colunaReferencia: 'idTituloAssinatura',
  },
  MC_CAD_DOCUMENTO_PARTE: {
    nomeTabela: 'MC_CAD_DOCUMENTO_PARTE',
    nomeArquivo: '30 - MC_CAD_DOCUMENTO_PARTE',
    nivelDependencia: 5,
    arquivoReferencia: '24 - MC_CAD_DOCUMENTO',
    colunaReferencia: 'id',
    colunaCondicao: 'idDocumento',
    colunasDependencia: [
      {colunaSubstituida: 'idDocumento', arquivoBusca: '24 - MC_CAD_DOCUMENTO'},
      {colunaSubstituida: 'idEntidade', arquivoBusca: '31 - MC_CAD_ENTIDADE'},
    ],
    composicao: ['idDocumento', 'idEntidade'],
  },
  MC_CAD_ENTIDADE: {
    nomeTabela: 'MC_CAD_ENTIDADE',
    nomeArquivo: '31 - MC_CAD_ENTIDADE',
    nivelDependencia: 1,
    arquivoReferencia: '30 - MC_CAD_DOCUMENTO_PARTE',
    colunaReferencia: 'idEntidade',
  },
};

export default MAPEAMENTO_TABELAS;
