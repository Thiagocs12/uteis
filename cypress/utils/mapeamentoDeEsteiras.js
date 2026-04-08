// cypress/utils/mapeamentoEsteiras.js

const mapeamentoDeEsteiras = {
  Esteira: {
    endpointPesquisaPorId: '/mc-multiflow-ms/api/v1/modeloesteira/pesquisarporid/',
    endpointCriacaoAtulizacao: '/mc-multiflow-ms/api/v1/modeloesteira',
    endpointPesquisaPorNome: '/mc-multiflow-ms/api/v1/modeloesteira/pesquisar',
    arquivoReferencia: 'Esteiras/1 - MC_MOP_VINCULO_ESTEIRA',
    nomeArquivo: 'Esteiras/2 - Esteira',
    colunaReferencia: 'codigoModeloEsteira',
    nivelDependencia: 4,
  },
  Etapa: {
    endpointPesquisaPorId: '/mc-multiflow-ms/api/v1/modeloetapa/pesquisarporid/',
    endpointCriacaoAtulizacao: '/mc-multiflow-ms/api/v1/modeloetapa',
    endpointPesquisaPorNome: '/mc-multiflow-ms/api/v1/modeloetapa/pesquisar',
    nomeArquivo: 'Esteiras/3 - Etapa',
    arquivoReferencia: 'Esteiras/2 - Esteira',
    colunaReferencia: 'modeloEtapas.modeloEtapa.id',
    nivelDependencia: 3,
  },
};

export default mapeamentoDeEsteiras;