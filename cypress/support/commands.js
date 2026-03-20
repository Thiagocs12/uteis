// cypress/support/commands.js

Cypress.Commands.add('sqlServer', (query, env = 'hml') => {
  return cy.task('sqlQuery', { query, env }).then((result) => {
    console.log(`Query executada no ambiente ${env}: ${query}`);
    return result;
  });
});

Cypress.Commands.add('saveQueryResultToJson', (filename, data, options = {}) => {
  const { overwrite = true, uniqueKey = null } = options;
  const filePath = `cypress/output/${filename}`;

  if (overwrite) {
    return cy.writeFile(filePath, data, { log: false }).then(() => {
      return { success: true, path: filePath, recordsAdded: Array.isArray(data) ? data.length : 1 };
    });
  } else {
    return cy.readFile(filePath, { log: false, failOnNonExistence: false })
      .then((existingContent) => {
        let existingData = [];
        if (existingContent) {
          try {
            existingData = JSON.parse(existingContent);
            if (!Array.isArray(existingData)) {
              existingData = [];
            }
          } catch (error) {
            existingData = [];
          }
        }

        let dataToSave = Array.isArray(data) ? data : [data];
        let recordsAddedCount = 0;

        if (uniqueKey && existingData.length > 0) {
          const existingKeys = new Set(existingData.map(item => item[uniqueKey]));
          const newRecords = dataToSave.filter(newItem => !existingKeys.has(newItem[uniqueKey]));
          recordsAddedCount = newRecords.length;
          dataToSave = newRecords; // Apenas os novos registros que não existem
        } else {
          recordsAddedCount = dataToSave.length;
        }

        const finalData = [...existingData, ...dataToSave];

        return cy.writeFile(filePath, finalData, { log: false }).then(() => {
          return { success: true, path: filePath, recordsAdded: recordsAddedCount };
        });
      });
  }
});

// Comando para ler uma coluna de um arquivo JSON
Cypress.Commands.add('readColumnFromFile', (filename, columnName) => {
  const filePath = `cypress/output/${filename}`;

  return cy.readFile(filePath, { log: false, failOnNonExistence: false })
    .then((fileContent) => {
      if (!fileContent) {
        return [];
      }

      try {
        const data = fileContent;

        if (!Array.isArray(data)) {
          return [];
        }

        const columnValues = data.map(item => item[columnName]).filter(value => value !== undefined);
        return columnValues;
      } catch (error) {
        throw error; // Re-lança o erro para que o Cypress possa capturá-lo
      }
    });
});
