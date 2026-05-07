const MAPEAMENTOS_ETAPAS = {
    DISTRIBUICAO: {
        tipoEsteira: 'poc',
        caminhoTela: ['Beyond BackOffice', 'Crédito', 'Home', 'Prospect', 'Distribuição'],
        baseUrl: 'mc-poc-ms/api/v1/distribuicaoProposta',
        method: 'POST',
        etapasParaAvanco: ['salvaComitePropostas', 'avancarEsteiraComitePropostas']
    },
    COMITE: {
        criar: 'mc-poc-ms/api/v1/pocVotacao/criarPocComite',
        modeloEtapa: '621024e72eb7d56d6ac917f5',
        criarVotacao: 'mc-poc-ms/api/v1/pocVotacao/criarVotacaoModeloEtapa?',
        method: 'POST',
    }
};

export default MAPEAMENTOS_ETAPAS;
