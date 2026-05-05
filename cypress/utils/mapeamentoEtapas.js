const MAPEAMENTOS_ETAPAS = {
    DISTRIBUICAO: {
        tipoEsteira: 'poc',
        caminhoTela: ['Beyond BackOffice', 'Crédito', 'Home', 'Prospect', 'Distribuição'],
        baseUrl: 'mc-poc-ms/api/v1/distribuicaoProposta',
        etapasParaAvanco: ['salvaComitePropostas', 'avancarEsteiraComitePropostas']
    }
};

export default MAPEAMENTOS_ETAPAS;
