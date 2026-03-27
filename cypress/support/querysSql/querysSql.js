Cypress.Commands.add('querySelect', (tableName, filterData, env = 'hml', whereColumn = 'id') => {
    let whereClause = '';

    // Condicional para pesquisar toda a tabela se filterData for '*'
    if (filterData === '*') {
        whereClause = ''; // Não adiciona nenhuma cláusula WHERE
        console.log(`Pesquisando toda a tabela '${tableName}'.`);
    } else if (filterData !== undefined && filterData !== null) {
        let processedFilterData = filterData;

        // Se for um array, filtra os valores null/undefined E remove duplicatas antes de mapear
        if (Array.isArray(filterData)) {
            // Primeiro filtra null/undefined, depois usa Set para remover duplicatas
            processedFilterData = [...new Set(filterData.filter(v => v !== null && v !== undefined))];
        }

        // Se após o filtro e remoção de duplicatas, o array estiver vazio ou o valor único for null/undefined,
        // tratamos como IS NULL ou não geramos WHERE se não houver valores válidos.
        if (processedFilterData === null || processedFilterData === undefined || 
            (Array.isArray(processedFilterData) && processedFilterData.length === 0)) {

            // Se o filterData original continha null e não outros valores, podemos querer IS NULL
            if (filterData === null || (Array.isArray(filterData) && filterData.includes(null) && processedFilterData.length === 0)) {
                whereClause = `WHERE ${whereColumn} IS NULL`;
            } else {
                // Se não há valores válidos para filtrar, não geramos WHERE IN
                console.log(`Nenhum valor válido fornecido para a coluna ${whereColumn}. A consulta não será executada.`);
                return;
            }
        } else {
            const values = Array.isArray(processedFilterData)
                ? processedFilterData.map(v => `'${v}'`).join(', ')
                : `'${processedFilterData}'`;

            // Se o valor for a string 'null' (que pode vir de um input), trate-o como NULL de SQL
            if (values.toLowerCase() === "'null'") {
                whereClause = `WHERE ${whereColumn} IS NULL`;
            } else {
                whereClause = `WHERE ${whereColumn} IN (${values})`;
            }
        }
    } else if (filterData === null) { // Se filterData for explicitamente null (JS null)
        whereClause = `WHERE ${whereColumn} IS NULL`;
    }

    const query = `SELECT * FROM ${tableName} ${whereClause}`;
    console.log('Query gerada:', query);

    // Adicione uma verificação para não executar a query se não houver filtro válido
    // (Isso é para casos onde filterData é undefined ou uma string vazia que não é '*' e não resultou em IS NULL)
    if (whereClause === '' && filterData !== undefined && filterData !== '*' && filterData !== null) { 
        console.log(`Nenhum filtro válido fornecido para a coluna ${whereColumn}. A consulta não será executada.`);
        return;
    }

    return cy.sqlServer(query, env);
});