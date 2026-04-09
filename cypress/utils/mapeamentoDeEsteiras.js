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
  SubEtapa: {
    endpointPesquisaPorId: '/mc-multiflow-ms/api/v1/modelosubetapa/pesquisarporid/',
    endpointCriacaoAtulizacao: '/mc-multiflow-ms/api/v1/modelosubetapa',
    endpointPesquisaPorNome: '/mc-multiflow-ms/api/v1/modelosubetapa/pesquisar',
    nomeArquivo: 'Esteiras/4 - SubEtapa',
    arquivoReferencia: 'Esteiras/3 - Etapa',
    colunaReferencia: 'modeloSubEtapaModel.modeloSubEtapa.id',
    nivelDependencia: 2,
  },
  Acao: {
    endpointPesquisaPorId: '/mc-multiflow-ms/api/v1/modeloacao/pesquisarporid/',
    endpointCriacaoAtulizacao: '/mc-multiflow-ms/api/v1/modeloacao',
    endpointPesquisaPorNome: '/mc-multiflow-ms/api/v1/modeloacao/pesquisar',
    nomeArquivo: 'Esteiras/5 - Acao',
    arquivoReferencia: 'Esteiras/4 - SubEtapa',
    colunaReferencia: 'modeloAcao.id',
    nivelDependencia: 1,
  },
};

export default mapeamentoDeEsteiras;