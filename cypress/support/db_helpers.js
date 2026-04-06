// cypress/support/db_helpers.js

/**
 * Converte um valor JavaScript para um literal SQL adequado.
 * Trata strings, números, booleanos, null e undefined.
 * @param {any} valor - O valor a ser convertido.
 * @returns {string} O literal SQL.
 */
export function paraLiteralSql(valor) {
  // Removendo logs de depuração para focar em construirQueryUpdate
  // console.log(`[DEBUG][paraLiteralSql] Valor:`, valor, `| Tipo:`, typeof valor);

  if (valor === null || valor === undefined) {
    return 'NULL';
  }
  if (typeof valor === 'string') {
    return `'${valor.replace(/'/g, "''")}'`;
  }
  if (typeof valor === 'number') {
    return valor.toString();
  }
  if (typeof valor === 'boolean') {
    return valor ? '1' : '0';
  }
  // Se chegar aqui, é um tipo não tratado que não é null/undefined, string, number ou boolean.
  // Isso pode ser um objeto, array, etc. Por padrão, retornamos NULL para evitar erros SQL.
  // console.warn(`[DEBUG][paraLiteralSql] Tipo não tratado, retornando NULL:`, valor); // Removendo para focar
  return 'NULL';
}

/**
 * Escapa aspas simples em uma string para uso em SQL.
 * @param {string} str - A string a ser escapada.
 * @returns {string} A string com aspas escapadas.
 */
export function escaparAspasSql(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/'/g, "''");
}

/**
 * Constrói uma cláusula WHERE a partir de colunas de composição e uma linha de dados.
 * @param {Array<string>} colunasComposicao - Nomes das colunas para a composição.
 * @param {object} linha - Objeto da linha contendo os valores.
 * @returns {string} A cláusula WHERE.
 */
export function construirClausulaWhere(colunasComposicao, linha) {
  const condicoes = colunasComposicao.map(coluna => {
    const valor = linha[coluna];
    if (valor === null || valor === undefined) {
      return `[${coluna}] IS NULL`;
    }
    return `[${coluna}] = ${paraLiteralSql(valor)}`;
  });
  return condicoes.join(' AND ');
}

/**
 * Constrói uma query SQL de INSERT.
 * @param {string} nomeTabela - Nome da tabela.
 * @param {object} dados - Objeto com os dados a serem inseridos.
 * @returns {string|null} A query SQL de INSERT ou null se não houver dados.
 */
export function construirQueryInsert(nomeTabela, dados) {
  const colunas = [];
  const valores = [];

  for (const chave in dados) {
    if (dados.hasOwnProperty(chave)) {
      // Ignora colunas de controle que são auto-geradas ou específicas de HML
      if (['id', 'idHml'].includes(chave)) {
        continue;
      }
      colunas.push(`[${chave}]`);
      valores.push(paraLiteralSql(dados[chave]));
    }
  }

  if (colunas.length === 0) {
    return null;
  }

  // Adiciona OUTPUT INSERTED.ID para retornar o ID do novo registro
  return `INSERT INTO [${nomeTabela}] (${colunas.join(', ')}) OUTPUT INSERTED.ID VALUES (${valores.join(', ')})`;
}

/**
 * Constrói uma query SQL de UPDATE.
 * @param {string} nomeTabela - Nome da tabela.
 * @param {object} dados - Objeto com os dados a serem atualizados.
 * @param {number|string} idRegistro - O ID do registro a ser atualizado.
 * @returns {string|null} A query SQL de UPDATE ou null se não houver dados para atualizar.
 */
export function construirQueryUpdate(nomeTabela, dados, idRegistro) {
  const colunasParaAtualizar = [];

  // Removendo logs de depuração de alto nível para focar no loop
  // console.log(`[DEBUG][construirQueryUpdate] Dados recebidos para ${nomeTabela} (ID: ${idRegistro}):`, dados);

  for (const chave in dados) {
    if (dados.hasOwnProperty(chave)) {
      if (['id', 'idHml', 'dataCadastro', 'usuarioCadastro'].includes(chave)) {
        continue;
      }

      const valor = dados[chave];
      // NOVO LOG: Inspecionar cada chave e valor antes de chamar paraLiteralSql
      console.log(`[DEBUG][construirQueryUpdate][${nomeTabela}] Chave: ${chave} | Valor:`, valor, `| Tipo:`, typeof valor);

      colunasParaAtualizar.push(`[${chave}] = ${paraLiteralSql(valor)}`);
    }
  }

  if (colunasParaAtualizar.length === 0) {
    return null;
  }

  const query = `UPDATE [${nomeTabela}] SET ${colunasParaAtualizar.join(', ')} WHERE [id] = ${paraLiteralSql(idRegistro)}`;
  // Removendo logs de depuração de alto nível
  // console.log(`[DEBUG][construirQueryUpdate] Query UPDATE gerada para ${nomeTabela}:`, query);
  return query;
}

/**
 * Registra um log SQL no console do Cypress.
 * @param {'hml'|'prod'} ambiente - Ambiente do banco de dados.
 * @param {'SELECT'|'INSERT'|'UPDATE'|'DELETE'} tipo - Tipo da operação SQL.
 * @param {string} nomeTabela - Nome da tabela envolvida.
 * @param {string} query - A query SQL completa.
 */
export function registrarLogSql(ambiente, tipo, nomeTabela, query) {
  cy.log(`SQL ${tipo}[${ambiente.toUpperCase()}][${nomeTabela}] ${query}`);
}