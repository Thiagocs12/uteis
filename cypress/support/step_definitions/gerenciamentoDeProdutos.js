import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import APIS from '../../utils/mapeamentoApis';

Given('que possuo acesso aos ambientes necessarios', () => {
  cy.verificarTokens('prod')
  cy.verificarTokens('hml')
  cy.verificarTokens('keycloak')
});

Given('uma consulta aos produtos de produção é realizada para obter os dados atuais', () => {
  cy.executarRequest('prod', `${APIS.PRODUTO.urlListAll}`).then((resposta) => {
    cy.writeFile(`cypress/output/${APIS.PRODUTO.nomeArquivo}`, resposta.body);
  });
});

Given('a pesquisa retornou dados de produtos para serem copiados de produção para homologação', () => {
  return cy.lerJsonDeOutput(APIS.PRODUTO.nomeArquivo).then((dadosDoArquivo) => {
    expect(dadosDoArquivo[0]['id']).to.be.a('number');
  });
});

When('pesquiso as dependências desses produtos', () => {
  cy.pesquisarDependenciasLigacao()
});

When('pesquiso quais dependências desses produtos já existem em homologação', () => {
  cy.pesquisarEntidadesEmHml();
});

When('crio ou atualizo as dependências do nivel {int}', (nivel) => {
});

Then('os dados dos produtos e suas dependências estão copiados de produção para homologação', () => {
});