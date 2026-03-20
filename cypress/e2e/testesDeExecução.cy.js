const tabelas = require('../utils/produtosMap');

describe('Testes de integração com banco de dados', () => {
  it('Deve buscar um usuário no banco de dados de produção', () => {
    const entityKeys = Object.keys(tabelas);
    const results = {};

    console.log('Entidades disponíveis:', entityKeys);

    cy.wrap(entityKeys).each((entityKey) => {
      entityKey = tabelas[entityKey];
      console.log(`Processando entidade: ${entityKey}`);
      console.log(`Nome da tabela: ${entityKey.tableName}`)
    })
    //const tabela = tabelas.CADASTRO_DE_PRODUTO.tableName;
    //cy.querySelect(tabela, [383,384], 'prod').then((result) => {
    //  console.log('Resultado da query:', result);    
    //});
  });
});