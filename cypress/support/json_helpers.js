// cypress/support/json_helpers.js

/**
 * Normaliza um nome de arquivo de arquivo para garantir a extensão .json.
 * @param {string} nomeArquivoOuCaminho - O nome ou caminho do arquivo.
 * @returns {string} O nome do arquivo normalizado com .json.
 */
export function normalizarNomeArquivoJson(nomeArquivoOuCaminho) {
  const s = String(nomeArquivoOuCaminho || '').trim();
  if (!s) return '';
  return s.toLowerCase().endsWith('.json') ? s : `${s}.json`;
}

/**
 * Constrói um objeto de mapeamento de IDs a partir de um array de linhas.
 * @param {Array<object>} linhas - Array de objetos (linhas do JSON).
 * @param {string} colunaBusca - Coluna a ser usada como chave no mapa (padrão: 'id').
 * @param {string} colunaValor - Coluna a ser usada como valor no mapa (padrão: 'idHml').
 * @returns {object} O objeto de mapeamento.
 */
export function construirMapaIds(linhas, colunaBusca = 'id', colunaValor = 'idHml') {
  const mapa = Object.create(null);
  if (!Array.isArray(linhas)) return mapa;

  linhas.forEach((linha) => {
    if (!linha) return;
    const chave = linha[colunaBusca];
    if (chave === undefined || chave === null) return;
    mapa[String(chave)] = (linha[colunaValor] ?? null);
  });

  return mapa;
}

/**
 * Substitui o valor de uma coluna em um array de linhas usando um mapa de IDs.
 * @param {Array<object>} linhas - Array de objetos (linhas do JSON) a serem modificadas.
 * @param {string} colunaSubstituida - Nome da coluna cujo valor será substituído.
 * @param {object} mapaIds - Objeto de mapeamento de IDs.
 */
export function substituirColunaPorMapa(linhas, colunaSubstituida, mapaIds) {
  if (!Array.isArray(linhas) || !colunaSubstituida) return;

  linhas.forEach((linha) => {
    if (!linha) return;

    // Se a coluna nem existir no JSON, não quebra: só ignora
    if (!(colunaSubstituida in linha)) return;

    const valorAtual = linha[colunaSubstituida];
    if (valorAtual === null || valorAtual === undefined) {
      linha[colunaSubstituida] = null;
      return;
    }

    const chave = String(valorAtual);
    const valorMapeado = Object.prototype.hasOwnProperty.call(mapaIds, chave) ? mapaIds[chave] : null;
    linha[colunaSubstituida] = valorMapeado ?? null;
  });
};