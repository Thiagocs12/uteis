const tabelas = require('../utils/produtosMap');
const entityKeys = Object.keys(tabelas);

describe('Copiando todos os produtos e suas respectivas dependências', () => {
    it('Buscar produtos e salvar produtos', () => {
        cy.querySelect(tabelas.MC_CAD_PRODUTO.tableName, [383], 'prod').then((result) => {
            cy.saveQueryResultToJson(`${tabelas.MC_CAD_PRODUTO.archiveName}.json`, result)
        });
    });

    it('Buscar e Salvar dependências', () => {
        cy.wrap(entityKeys).each((key) => {
            const entityKey = tabelas[key];
            if (entityKey.archiveName === '1 - MC_CAD_PRODUTO') {
                return;
            };
            cy.readColumnFromFile(`${entityKey.archiveReference}.json`, entityKey.referenceColumn).then((ids) => {
                if (ids && ids.length > 0) {
                    cy.querySelect(entityKey.tableName, ids, 'prod', entityKey.whereColumn).then((result) => { 
                        cy.saveQueryResultToJson(`${entityKey.archiveName}.json`, result)
                    });
                } else {
                    console.log(`Nenhum ID encontrado para a tabela ${entityKey.tableName}. Pulando consulta.`)
                }
            });
        });
    });
});


