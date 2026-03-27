/**
 * EXAMPLAR DE MAPEAMENTO DE TABELAS PARA PRODUTOS
 * 
 *MC_CAD_DOCUMENTO_SECAO: {
    tableName: 'MC_CAD_DOCUMENTO_SECAO',
    archiveName: '26 - MC_CAD_DOCUMENTO_SECAO',
    dependencyLevel: 2,
    archiveReference: '24 - MC_CAD_DOCUMENTO',
    referenceColumn: 'id',
    whereColumn: 'idDocumento',
    composition: ['idDocumento', 'descricao'],
    dependencyColumn: [
      { replacedColumn: 'idDocumento', archiveSearch: '24 - MC_CAD_DOCUMENTO'},
    ]
  },
 */

const TABELAS = {
  MC_CAD_PRODUTO: {
    tableName: 'MC_CAD_PRODUTO',
    archiveName: '1 - MC_CAD_PRODUTO',
    dependencyLevel: 3,
    dependencyColumn: [
        { replacedColumn: 'idGrupoProduto', archiveSearch: '4 - MC_CAD_GRUPO_PRODUTO'},
        { replacedColumn: 'idClassificacaoProduto', archiveSearch: '6 - MC_CAD_CLASSIFICACAO_PRODUTO'},
        { replacedColumn: 'idTipoProduto', archiveSearch: '32 - MC_CAD_TIPO_PRODUTO'},
        { replacedColumn: 'idSubProduto', archiveSearch: '7 - MC_CAD_SUBPRODUTO'},
        { replacedColumn: 'idIndexador', archiveSearch: '8 - MC_CAD_PRODUTO_INDEXADOR'},
        { replacedColumn: 'idTipoRecebimento', archiveSearch: '9 - MC_CAD_PRODUTO_TP_RECEBIMENTO'},
        { replacedColumn: 'idFocoNegocio', archiveSearch: '2 - MC_CAD_FOCO_NEGOCIO'}
    ]
  },
  MC_CAD_FOCO_NEGOCIO: {
    tableName: 'MC_CAD_FOCO_NEGOCIO',
    archiveName: '2 - MC_CAD_FOCO_NEGOCIO',
    dependencyLevel: 2,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idFocoNegocio',
    // dependencyColumn (array):
    // - replacedColumn: coluna no JSON atual que será substituída
    // - archiveSearch: arquivo onde vamos buscar (padrão: match id -> idHml)
    dependencyColumn: [
      { replacedColumn: 'idSegmentoTarifador', archiveSearch: '3 - MC_CAD_SEGMENTO_TARIFADOR' },
    ],
  },
  MC_CAD_SEGMENTO_TARIFADOR: {
    tableName: 'MC_CAD_SEGMENTO_TARIFADOR',
    archiveName: '3 - MC_CAD_SEGMENTO_TARIFADOR',
    dependencyLevel: 1,
    archiveReference: '2 - MC_CAD_FOCO_NEGOCIO',
    referenceColumn: 'idSegmentoTarifador',
  },
  MC_CAD_GRUPO_PRODUTO: {
    tableName: 'MC_CAD_GRUPO_PRODUTO',
    archiveName: '4 - MC_CAD_GRUPO_PRODUTO',
    dependencyLevel: 2,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idGrupoProduto',
    dependencyColumn: [
      { replacedColumn: 'idGrupoProdutoRisco', archiveSearch: '5 - MC_CAD_GRUPO_PRODUTO_RISCO' },
    ],
  },
  MC_CAD_GRUPO_PRODUTO_RISCO: {
    tableName: 'MC_CAD_GRUPO_PRODUTO_RISCO',
    archiveName: '5 - MC_CAD_GRUPO_PRODUTO_RISCO',
    dependencyLevel: 1,
    archiveReference: '4 - MC_CAD_GRUPO_PRODUTO',
    referenceColumn: 'idGrupoProdutoRisco',
  },
  MC_CAD_CLASSIFICACAO_PRODUTO: {
    tableName: 'MC_CAD_CLASSIFICACAO_PRODUTO',
    archiveName: '6 - MC_CAD_CLASSIFICACAO_PRODUTO',
    dependencyLevel: 1,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idClassificacaoProduto',
  },
  MC_CAD_TIPO_PRODUTO: {
    tableName: 'MC_CAD_TIPO_PRODUTO',
    archiveName: '32 - MC_CAD_TIPO_PRODUTO',
    dependencyLevel: 1,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idTipoProduto',
  },
  MC_CAD_SUBPRODUTO: {
    tableName: 'MC_CAD_SUBPRODUTO',
    archiveName: '7 - MC_CAD_SUBPRODUTO',
    dependencyLevel: 1,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idSubProduto',
  },
  MC_CAD_PRODUTO_INDEXADOR: {
    tableName: 'MC_CAD_PRODUTO_INDEXADOR',
    archiveName: '8 - MC_CAD_PRODUTO_INDEXADOR',
    dependencyLevel: 1,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idIndexador',
  },
  MC_CAD_PRODUTO_TP_RECEBIMENTO: {
    tableName: 'MC_CAD_PRODUTO_TP_RECEBIMENTO',
    archiveName: '9 - MC_CAD_PRODUTO_TP_RECEBIMENTO',
    dependencyLevel: 1,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'idTipoRecebimento',
  },
  MC_CAD_PRODUTO_KIT: {
    tableName: 'MC_CAD_PRODUTO_KIT',
    archiveName: '10 - MC_CAD_PRODUTO_KIT',
    dependencyLevel: 5,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'id',
    whereColumn: 'idProduto',
    dependencyColumn: [
      {replacedColumn: 'idProduto', archiveSearch: '1 - MC_CAD_PRODUTO'},
      {replacedColumn: 'idKitDocumento', archiveSearch: '22 - MC_CAD_KIT_DOCUMENTO'},
    ],
    composition: ['idProduto', 'idKitDocumento'],
  },
  MC_CAD_PRODUTO_GARANTIA: {
    tableName: 'MC_CAD_PRODUTO_GARANTIA',
    archiveName: '11 - MC_CAD_PRODUTO_GARANTIA',
    dependencyLevel: 5,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'id',
    whereColumn: 'idProduto',
    dependencyColumn: [
      {replacedColumn: 'idProduto', archiveSearch: '1 - MC_CAD_PRODUTO'},
      {replacedColumn: 'idGarantiaCategoria', archiveSearch: '13 - MC_CAD_GARANTIA_CATEGORIA'},
    ],
    composition: ['idProduto', 'idGarantiaCategoria'],
  },
  MC_CAD_PRODUTO_TARIFA: {
    tableName: 'MC_CAD_PRODUTO_TARIFA',
    archiveName: '12 - MC_CAD_PRODUTO_TARIFA',
    dependencyLevel: 5,
    archiveReference: '1 - MC_CAD_PRODUTO',
    referenceColumn: 'id',
    whereColumn: 'idProduto',
    dependencyColumn: [
      {replacedColumn: 'idProduto', archiveSearch: '1 - MC_CAD_PRODUTO'},
      {replacedColumn: 'idTarifa', archiveSearch: '17 - MC_CAD_TARIFA'},
    ],
    composition: ['idProduto', 'idTarifa'],
  },
  MC_CAD_GARANTIA_CATEGORIA: {
    tableName: 'MC_CAD_GARANTIA_CATEGORIA',
    archiveName: '13 - MC_CAD_GARANTIA_CATEGORIA',
    dependencyLevel: 2,
    archiveReference: '11 - MC_CAD_PRODUTO_GARANTIA',
    referenceColumn: 'idGarantiaCategoria',
    dependencyColumn: [
      { replacedColumn: 'idGarantiaNivel', archiveSearch: '16 - MC_CAD_GARANTIA_NIVEL' },
      { replacedColumn: 'idGarantiaClassificacao', archiveSearch: '15 - MC_CAD_GARANTIA_CLASSIFICACAO' },
      { replacedColumn: 'idTipoGarantia', archiveSearch: '14 - MC_CAD_TIPO_GARANTIA' },
      { replacedColumn: 'idGrupoGarantia', archiveSearch: '33 - MC_CAD_GRUPO_GARANTIA' },
    ],
  },
  MC_CAD_TIPO_GARANTIA: {
    tableName: 'MC_CAD_TIPO_GARANTIA',
    archiveName: '14 - MC_CAD_TIPO_GARANTIA',
    dependencyLevel: 1,
    archiveReference: '13 - MC_CAD_GARANTIA_CATEGORIA',
    referenceColumn: 'idTipoGarantia',
  },
  MC_CAD_GARANTIA_CLASSIFICACAO: {
    tableName: 'MC_CAD_GARANTIA_CLASSIFICACAO',
    archiveName: '15 - MC_CAD_GARANTIA_CLASSIFICACAO',
    dependencyLevel: 1,
    archiveReference: '13 - MC_CAD_GARANTIA_CATEGORIA',
    referenceColumn: 'idGarantiaClassificacao',
  },
  MC_CAD_GARANTIA_NIVEL: {
    tableName: 'MC_CAD_GARANTIA_NIVEL',
    archiveName: '16 - MC_CAD_GARANTIA_NIVEL',
    dependencyLevel: 1,
    archiveReference: '13 - MC_CAD_GARANTIA_CATEGORIA',
    referenceColumn: 'idGarantiaNivel',
  },
  MC_CAD_GRUPO_GARANTIA: {
    tableName: 'MC_CAD_GRUPO_GARANTIA',
    archiveName: '33 - MC_CAD_GRUPO_GARANTIA',
    dependencyLevel: 1,
    archiveReference: '13 - MC_CAD_GARANTIA_CATEGORIA',
    referenceColumn: 'idGrupoGarantia',
  },
  MC_CAD_TARIFA: {
    tableName: 'MC_CAD_TARIFA',
    archiveName: '17 - MC_CAD_TARIFA',
    dependencyLevel: 4,
    archiveReference: '12 - MC_CAD_PRODUTO_TARIFA',
    referenceColumn: 'idTarifa',
    composition: ['codigoSubcategoria', 'nomeTarifa'],
    dependencyColumn: [
      { replacedColumn: 'idEventoTarifador', archiveSearch: '18 - MC_CAD_EVENTO'},
    ]
  },
  MC_CAD_EVENTO: {
    tableName: 'MC_CAD_EVENTO',
    archiveName: '18 - MC_CAD_EVENTO',
    dependencyLevel: 3,
    archiveReference: '17 - MC_CAD_TARIFA',
    referenceColumn: 'idEventoTarifador',
    dependencyColumn: [
      { replacedColumn: 'idTipoEvento', archiveSearch: '19 - MC_CAD_TIPO_EVENTO'},
      { replacedColumn: 'idSituacao', archiveSearch: '20 - MC_CAD_SITUACAO'}
    ]
  },
  MC_CAD_TIPO_EVENTO: {
    tableName: 'MC_CAD_TIPO_EVENTO',
    archiveName: '19 - MC_CAD_TIPO_EVENTO',
    dependencyLevel: 1,
    archiveReference: '18 - MC_CAD_EVENTO',
    referenceColumn: 'idTipoEvento',
  },
  MC_CAD_SITUACAO: {
    tableName: 'MC_CAD_SITUACAO',
    archiveName: '20 - MC_CAD_SITUACAO',
    dependencyLevel: 2,
    archiveReference: '18 - MC_CAD_EVENTO',
    referenceColumn: 'idSituacao',
    composition: ['idTipoSituacao', 'descricao'],
  },
  MC_CAD_TIPO_SITUACAO: {
    tableName: 'MC_CAD_TIPO_SITUACAO',
    archiveName: '21 - MC_CAD_TIPO_SITUACAO',
    dependencyLevel: 1,
    archiveReference: '20 - MC_CAD_SITUACAO',
    referenceColumn: 'idTipoSituacao',
    dependencyColumn: [{ replacedColumn: 'idTipoSituacao', archiveSearch: '21 - MC_CAD_TIPO_SITUACAO' }],
  },
  MC_CAD_KIT_DOCUMENTO: {
    tableName: 'MC_CAD_KIT_DOCUMENTO',
    archiveName: '22 - MC_CAD_KIT_DOCUMENTO',
    dependencyLevel: 1,
    archiveReference: '10 - MC_CAD_PRODUTO_KIT',
    referenceColumn: 'idKitDocumento',
  },
  MC_CAD_DOCUMENTO_KIT: {
    tableName: 'MC_CAD_DOCUMENTO_KIT',
    archiveName: '23 - MC_CAD_DOCUMENTO_KIT',
    dependencyLevel: 5,
    archiveReference: '22 - MC_CAD_KIT_DOCUMENTO',
    referenceColumn: 'id',
    whereColumn: 'idKitDocumento',
    dependencyColumn: [
      {replacedColumn: 'idDocumento', archiveSearch: '24 - MC_CAD_DOCUMENTO'},
      {replacedColumn: 'idKitDocumento', archiveSearch: '22 - MC_CAD_KIT_DOCUMENTO'},
    ],
    composition: ['idDocumento', 'idKitDocumento'],
  },
  MC_CAD_DOCUMENTO: {
    tableName: 'MC_CAD_DOCUMENTO',
    archiveName: '24 - MC_CAD_DOCUMENTO',
    dependencyLevel: 1,
    archiveReference: '23 - MC_CAD_DOCUMENTO_KIT',
    referenceColumn: 'idDocumento',
  },
  MC_CAD_DOCUMENTO_CONSULTA: {
    tableName: 'MC_CAD_DOCUMENTO_CONSULTA',
    archiveName: '25 - MC_CAD_DOCUMENTO_CONSULTA',
    dependencyLevel: 2,
    archiveReference: '24 - MC_CAD_DOCUMENTO',
    referenceColumn: 'id',
    whereColumn: 'idDocumento',
    composition: ['idDocumento', 'descricao'],
    dependencyColumn: [{ replacedColumn: 'idDocumento', archiveSearch: '24 - MC_CAD_DOCUMENTO' }],
  },
  MC_CAD_DOCUMENTO_SECAO: {
    tableName: 'MC_CAD_DOCUMENTO_SECAO',
    archiveName: '26 - MC_CAD_DOCUMENTO_SECAO',
    dependencyLevel: 2,
    archiveReference: '24 - MC_CAD_DOCUMENTO',
    referenceColumn: 'id',
    whereColumn: 'idDocumento',
    composition: ['idDocumento', 'descricao'],
    dependencyColumn: [
      { replacedColumn: 'idDocumento', archiveSearch: '24 - MC_CAD_DOCUMENTO' }
    ],
  },
  MC_CAD_DOCUMENTO_CARTAO_ASSINATURA: {
    tableName: 'MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    archiveName: '27 - MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    dependencyLevel: 5,
    archiveReference: '24 - MC_CAD_DOCUMENTO',
    referenceColumn: 'id',
    whereColumn: 'idDocumento',
    dependencyColumn: [
      {replacedColumn: 'idDocumento', archiveSearch: '24 - MC_CAD_DOCUMENTO'},
      {replacedColumn: 'idCartaoAssinatura', archiveSearch: '28 - MC_CAD_CARTAO_ASSINATURA'},
    ],
    composition: ['idDocumento', 'idCartaoAssinatura'],
  },
  MC_CAD_CARTAO_ASSINATURA: {
    tableName: 'MC_CAD_CARTAO_ASSINATURA',
    archiveName: '28 - MC_CAD_CARTAO_ASSINATURA',
    dependencyLevel: 2,
    archiveReference: '27 - MC_CAD_DOCUMENTO_CARTAO_ASSINATURA',
    referenceColumn: 'idCartaoAssinatura',
    composition: ['nome', 'cpf'],
    dependencyColumn: [
      { replacedColumn: 'idTituloAssinatura', archiveSearch: '29 - MC_CAD_TITULO_ASSINATURA' }
    ],
  },
  MC_CAD_TITULO_ASSINATURA: {
    tableName: 'MC_CAD_TITULO_ASSINATURA',
    archiveName: '29 - MC_CAD_TITULO_ASSINATURA',
    dependencyLevel: 1,
    archiveReference: '28 - MC_CAD_CARTAO_ASSINATURA',
    referenceColumn: 'idTituloAssinatura',
  },
  MC_CAD_DOCUMENTO_PARTE: {
    tableName: 'MC_CAD_DOCUMENTO_PARTE',
    archiveName: '30 - MC_CAD_DOCUMENTO_PARTE',
    dependencyLevel: 5,
    archiveReference: '24 - MC_CAD_DOCUMENTO',
    referenceColumn: 'id',
    whereColumn: 'idDocumento',
    dependencyColumn: [
      {replacedColumn: 'idDocumento', archiveSearch: '24 - MC_CAD_DOCUMENTO'},
      {replacedColumn: 'idEntidade', archiveSearch: '31 - MC_CAD_ENTIDADE'},
    ],
    composition: ['idDocumento', 'idEntidade'],
  },
  MC_CAD_ENTIDADE: {
    tableName: 'MC_CAD_ENTIDADE',
    archiveName: '31 - MC_CAD_ENTIDADE',
    dependencyLevel: 1,
    archiveReference: '30 - MC_CAD_DOCUMENTO_PARTE',
    referenceColumn: 'idEntidade',
  },
};

module.exports = TABELAS;