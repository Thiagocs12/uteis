Cypress.Commands.add('querySelect', (tableName, filterData, env = 'hml', whereColumn = 'id') => {
    let whereClause = '';

    if (whereColumn && filterData) {
        const values = Array.isArray(filterData)
            ? filterData.map(v => `'${v}'`).join(', ')
            : `'${filterData}'`;

        whereClause = `WHERE ${whereColumn} IN (${values})`;
    }

    const query = `SELECT * FROM ${tableName} ${whereClause}`;
    console.log('Query gerada:', query);
    return cy.sqlServer(query, env);
});