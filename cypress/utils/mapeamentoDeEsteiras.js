// cypress/utils/mapeamentoEsteiras.js

const mapeamentoDeEntidades = {
  Esteira: {
    endpointProdPesquisaPorId: '/mc-multiflow-ms/api/v1/modeloesteira/pesquisarporid/',
    endpointHmlCriacao: '/mc-multiflow-ms/api/v1/modeloesteira',
    endpointHmlAtualizacao: '/mc-multiflow-ms/api/v1/modeloesteira',
    endpointHmlPesquisaPorNome: '/mc-multiflow-ms/api/v1/modeloesteira/pesquisar',
    nomeArquivo: 'Esteiras/1 - Esteira',
    colunasComposicao: ['nome'],
    nivelDependencia: 4,
  },
  Etapa: {
    endpointProdPesquisaPorId: '/mc-multiflow-ms/api/v1/modeloetapa/pesquisarporid/',
    endpointHmlCriacao: '/mc-multiflow-ms/api/v1/modeloetapa',
    endpointHmlAtualizacao: '/mc-multiflow-ms/api/v1/modeloetapa',
    endpointHmlPesquisaPorNome: '/mc-multiflow-ms/api/v1/modeloetapa/pesquisar',
    nomeArquivo: 'Esteiras/2 - Etapa',
    arquivoReferencia: 'Esteiras/1 - Esteira',
    colunasComposicao: ['nome'],
    nivelDependencia: 3,
  },
};

export default mapeamentoDeEntidades;