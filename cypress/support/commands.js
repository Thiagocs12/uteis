// cypress/support/commands.js

// -------------------------------
// SQL helpers (sem ficar no spec)
// -------------------------------
function esc(v) {
  return String(v).replace(/'/g, "''");
}

function toSqlLiteral(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  return `'${esc(v)}'`;
}

function whereFromRow(cols, row) {
  return cols
    .map((c) => {
      if (row[c] === undefined) {
        throw new Error(`Coluna '${c}' não existe no JSON (composition/descricao).`);
      }
      if (row[c] === null) return `[${c}] IS NULL`;
      return `[${c}] = ${toSqlLiteral(row[c])}`;
    })
    .join(' AND ');
}

function buildInsertQuery(tableName, row) {
  const cols = Object.keys(row).filter((k) => k !== 'id' && k !== 'idHml');
  if (cols.length === 0) return null;

  const colList = cols.map((c) => `[${c}]`).join(', ');
  const valList = cols.map((c) => toSqlLiteral(row[c])).join(', ');

  return `
INSERT INTO [${tableName}] (${colList})
OUTPUT INSERTED.id
VALUES (${valList});
  `.trim();
}

function buildUpdateQuery(tableName, row, idHml) {
  const cols = Object.keys(row).filter((k) => k !== 'id' && k !== 'idHml');
  if (cols.length === 0) return null;

  const setList = cols.map((c) => `[${c}] = ${toSqlLiteral(row[c])}`).join(', ');

  return `
UPDATE [${tableName}]
   SET ${setList}
 WHERE [id] = ${toSqlLiteral(idHml)};
  `.trim();
}

function normalizeArchiveNameToFilename(archiveNameOrFilename) {
  const s = String(archiveNameOrFilename || '').trim();
  if (!s) return '';
  return s.toLowerCase().endsWith('.json') ? s : `${s}.json`;
}

function normalizeDependencyColumns(entity) {
  if (!entity || !entity.dependencyColumn) return [];
  return Array.isArray(entity.dependencyColumn)
    ? entity.dependencyColumn
    : [entity.dependencyColumn];
}

function buildIdMapObject(rows, matchColumn = 'id', valueColumn = 'idHml') {
  const map = Object.create(null);
  if (!Array.isArray(rows)) return map;

  rows.forEach((r) => {
    if (!r) return;
    const k = r[matchColumn];
    if (k === undefined || k === null) return;
    map[String(k)] = (r[valueColumn] ?? null);
  });

  return map;
}

function replaceColumnByMap(rows, replacedColumn, mapObj) {
  if (!Array.isArray(rows) || !replacedColumn) return;

  rows.forEach((row) => {
    if (!row) return;

    // se a coluna nem existir no JSON, não quebra: só ignora
    if (!(replacedColumn in row)) return;

    const currentVal = row[replacedColumn];
    if (currentVal === null || currentVal === undefined) {
      row[replacedColumn] = null;
      return;
    }

    const key = String(currentVal);
    const mapped = Object.prototype.hasOwnProperty.call(mapObj, key) ? mapObj[key] : null;
    row[replacedColumn] = mapped ?? null;
  });
}

function logSql(env, kind, tableName, query) {
  console.log(`\n[SQL][${env}][${kind}][${tableName}]\n${query}\n`);
}

// -------------------------------------
// Tasks wrappers (Node) e IO de JSON
// -------------------------------------
Cypress.Commands.add('readJsonIfExists', (filePath) => {
  return cy.task('readJsonIfExists', { filePath }, { log: false });
});

Cypress.Commands.add('readOutputJsonIfExists', (filename) => {
  const filePath = `cypress/output/${filename}`;
  return cy.readJsonIfExists(filePath);
});

// -------------------------------------
// Banco: SELECT e EXEC (INSERT/UPDATE)
// -------------------------------------
Cypress.Commands.add('sqlServer', (query, env = 'hml') => {
  return cy.task('sqlQuery', { query, env }, { log: false }).then((result) => {
    console.log(`Query executada no ambiente ${env}: ${query}`);
    return result;
  });
});

Cypress.Commands.add('sqlExec', (query, env = 'hml') => {
  return cy.task('sqlExec', { query, env }, { log: false });
});

// -------------------------------------
// Utilitários SQL expostos como comandos
// -------------------------------------
Cypress.Commands.add('sqlToLiteral', (v) => toSqlLiteral(v));
Cypress.Commands.add('sqlWhereFromRow', (cols, row) => whereFromRow(cols, row));
Cypress.Commands.add('sqlBuildInsertQuery', (tableName, row) => buildInsertQuery(tableName, row));
Cypress.Commands.add('sqlBuildUpdateQuery', (tableName, row, idHml) => buildUpdateQuery(tableName, row, idHml));
Cypress.Commands.add('sqlLog', (env, kind, tableName, query) => logSql(env, kind, tableName, query));

// -------------------------------------
// JSON helpers para dependências (FK)
// -------------------------------------
Cypress.Commands.add('jsonNormalizeArchiveNameToFilename', (name) => normalizeArchiveNameToFilename(name));
Cypress.Commands.add('jsonNormalizeDependencyColumns', (entity) => normalizeDependencyColumns(entity));
Cypress.Commands.add('jsonBuildIdMap', (rows, matchColumn = 'id', valueColumn = 'idHml') => {
  return buildIdMapObject(rows, matchColumn, valueColumn);
});
Cypress.Commands.add('jsonReplaceColumnByMap', (rows, replacedColumn, mapObj) => {
  replaceColumnByMap(rows, replacedColumn, mapObj);
  return rows;
});

/**
 * Aplica N dependências em um array de rows (alterando em memória).
 * - Se o arquivo de referência não existir/[] => map vazio => tudo vira null
 * - matchColumn/valueColumn default: id -> idHml
 *
 * @param {Array} rows - JSON do entity atual (ex: FOCO_NEGOCIO)
 * @param {Array} dependencyColumns - array do map (dependencyColumn)
 * @returns Cypress.Chainable<Array> rows alterado
 */
Cypress.Commands.add('jsonApplyDependenciesFromOutput', (rows, dependencyColumns) => {
  if (!Array.isArray(rows) || rows.length === 0) return cy.wrap(rows, { log: false });

  const deps = Array.isArray(dependencyColumns)
    ? dependencyColumns
    : (dependencyColumns ? [dependencyColumns] : []);

  let chain = cy.wrap(null, { log: false });

  deps.forEach((dep) => {
    chain = chain.then(() => {
      const replacedColumn = dep && dep.replacedColumn;
      const archiveSearch = dep && dep.archiveSearch;

      if (!replacedColumn || !archiveSearch) return;

      const matchColumn = dep.matchColumn || 'id';
      const valueColumn = dep.valueColumn || 'idHml';

      const depFilename = normalizeArchiveNameToFilename(archiveSearch);

      return cy.readOutputJsonIfExists(depFilename).then((depRows) => {
        const mapObj = buildIdMapObject(depRows || [], matchColumn, valueColumn);
        replaceColumnByMap(rows, replacedColumn, mapObj);
      });
    });
  });

  return chain.then(() => rows);
});

// -------------------------------------
// Seus comandos existentes (corrigidos)
// -------------------------------------
Cypress.Commands.add('saveQueryResultToJson', (filename, data, options = {}) => {
  const { overwrite = true, uniqueKey = null } = options;
  const filePath = `cypress/output/${filename}`;

  if (overwrite) {
    return cy.writeFile(filePath, data, { log: false }).then(() => {
      return { success: true, path: filePath, recordsAdded: Array.isArray(data) ? data.length : 1 };
    });
  }

  // overwrite=false => append com dedupe opcional (sem quebrar se arquivo não existir)
  return cy.readJsonIfExists(filePath).then((existingData) => {
    const existing = Array.isArray(existingData) ? existingData : [];

    let dataToSave = Array.isArray(data) ? data : [data];
    let recordsAddedCount = 0;

    if (uniqueKey && existing.length > 0) {
      const existingKeys = new Set(existing.map((item) => item && item[uniqueKey]));
      const newRecords = dataToSave.filter((newItem) => !existingKeys.has(newItem && newItem[uniqueKey]));
      recordsAddedCount = newRecords.length;
      dataToSave = newRecords;
    } else {
      recordsAddedCount = dataToSave.length;
    }

    const finalData = [...existing, ...dataToSave];

    return cy.writeFile(filePath, finalData, { log: false }).then(() => {
      return { success: true, path: filePath, recordsAdded: recordsAddedCount };
    });
  });
});

// Comando para ler uma coluna de um arquivo JSON (sem quebrar se não existir)
Cypress.Commands.add('readColumnFromFile', (filename, columnName) => {
  const filePath = `cypress/output/${filename}`;

  return cy.readJsonIfExists(filePath).then((fileContent) => {
    if (!Array.isArray(fileContent) || fileContent.length === 0) return [];
    return fileContent
      .map((item) => item && item[columnName])
      .filter((value) => value !== undefined);
  });
});