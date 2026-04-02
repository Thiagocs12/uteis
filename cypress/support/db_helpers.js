// cypress/support/db_helpers.js

/**
 * Escapa aspas simples em uma string para uso em SQL.
 * @param {string} valor - O valor a ser escapado.
 * @returns {string} O valor com aspas escapadas.
 */
export function escaparAspasSql(valor) {
  return String(valor).replace(/'/g, "''");
}

/**
 * Converte um valor JavaScript para um literal SQL apropriado.
 * @param {*} valor - O valor a ser convertido.
 * @returns {string} O literal SQL.
 */
export function paraLiteralSql(valor) {
  if (valor === null || valor === undefined) return 'NULL';
  if (typeof valor === 'number') return String(valor);
  if (typeof valor === 'boolean') return valor ? '1' : '0';
  return `'${escaparAspasSql(valor)}'`;
}

/**
 * Constrói a cláusula WHERE a partir de colunas e um objeto de linha.
 * @param {Array<string>} colunas - Nomes das colunas para a cláusula WHERE.
 * @param {object} linha - Objeto contendo os dados da linha.
 * @returns {string} A cláusula WHERE.
 * @throws {Error} Se uma coluna não existir na linha.
 */
export function construirClausulaWhere(colunas, linha) {
  return colunas
    .map((coluna) => {
      if (!(coluna in linha)) {
        // Este é um erro de lógica/dados, deve ser lançado para interromper o fluxo
        throw new Error(`Coluna '${coluna}' não existe no JSON (composicao/descricao).`);
      }
      if (linha[coluna] === null || linha[coluna] === undefined) return `[${coluna}] IS NULL`;
      return `[${coluna}] = ${paraLiteralSql(linha[coluna])}`;
    })
    .join(' AND ');
}

/**
 * Constrói uma query SQL de INSERT.
 * @param {string} nomeTabela - Nome da tabela.
 * @param {object} linha - Objeto com os dados a serem inseridos.
 * @returns {string|null} A query INSERT ou null se não houver colunas válidas.
 */
export function construirQueryInsert(nomeTabela, linha) {
  const colunas = Object.keys(linha).filter((chave) => chave !== 'id' && chave !== 'idHml');
  if (colunas.length === 0) return null;

  const listaColunas = colunas.map((coluna) => `[${coluna}]`).join(', ');
  const listaValores = colunas.map((coluna) => paraLiteralSql(linha[coluna])).join(', ');

  return `
INSERT INTO [${nomeTabela}] (${listaColunas})
OUTPUT INSERTED.id
VALUES (${listaValores});
  `.trim();
}

/**
 * Constrói uma query SQL de UPDATE.
 * @param {string} nomeTabela - Nome da tabela.
 * @param {object} linha - Objeto com os dados a serem atualizados.
 * @param {number|string} idHml - O ID do registro a ser atualizado.
 * @returns {string|null} A query UPDATE ou null se não houver colunas válidas.
 */
export function construirQueryUpdate(nomeTabela, linha, idHml) {
  const colunas = Object.keys(linha).filter((chave) => chave !== 'id' && chave !== 'idHml');
  if (colunas.length === 0) return null;

  const listaSet = colunas.map((coluna) => `[${coluna}] = ${paraLiteralSql(linha[coluna])}`).join(', ');

  return `
UPDATE [${nomeTabela}]
   SET ${listaSet}
 WHERE [id] = ${paraLiteralSql(idHml)};
  `.trim();
}

/**
 * Registra uma query SQL no console do Cypress.
 * @param {string} ambiente - Ambiente (ex: 'hml', 'prod').
 * @param {string} tipo - Tipo da operação (ex: 'SELECT', 'INSERT', 'UPDATE').
 * @param {string} nomeTabela - Nome da tabela.
 * @param {string} query - A query SQL.
 */
export function registrarLogSql(ambiente, tipo, nomeTabela, query) {
  // Usamos Cypress.log para que apareça no Command Log do Cypress
  Cypress.log({
    name: `SQL ${tipo}`,
    displayName: `SQL ${tipo}`,
    message: `[${ambiente.toUpperCase()}][${nomeTabela}]\n${query}`,
    consoleProps: () => ({
      ambiente: ambiente.toUpperCase(),
      tipo: tipo,
      tabela: nomeTabela,
      query: query,
    }),
  });
}