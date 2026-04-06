// cypress/support/object_helpers.js

/**
 * Compara dois objetos para determinar se são "iguais" para fins de atualização,
 * ignorando certas chaves e considerando valores nulos/indefinidos como equivalentes.
 *
 * @param {object} obj1 - O primeiro objeto (ex: linha do JSON de Produção).
 * @param {object} obj2 - O segundo objeto (ex: registro consultado em HML).
 * @param {Array<string>} [chavesAdicionaisIgnoradas=[]] - Lista de chaves adicionais a serem ignoradas na comparação, além das padrão.
 * @returns {boolean} True se os objetos são considerados iguais, False caso contrário.
 */
export function compararObjetosParaUpdate(obj1, obj2, chavesAdicionaisIgnoradas = []) {
  if (!obj1 || !obj2) {
    return obj1 === obj2; // Se um é nulo/indefinido e o outro não, são diferentes. Se ambos, são iguais.
  }

  // Chaves padrão a serem ignoradas em qualquer comparação de update
  const chavesPadraoIgnoradas = [
    'id', 'idHml',
    'usuarioCadastro', 'usuarioUltimaAlteracao',
    'dataCadastro', 'dataUltimaAlteracao'
  ];
  // Combina as chaves padrão com quaisquer chaves adicionais passadas
  const todasChavesIgnoradas = new Set([...chavesPadraoIgnoradas, ...chavesAdicionaisIgnoradas]);

  const chaves1 = Object.keys(obj1).filter(key => !todasChavesIgnoradas.has(key));
  const chaves2 = Object.keys(obj2).filter(key => !todasChavesIgnoradas.has(key));

  if (chaves1.length !== chaves2.length) {
    return false;
  }

  for (const key of chaves1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // Trata null e undefined como equivalentes para comparação
    const isVal1Nullish = val1 === null || val1 === undefined;
    const isVal2Nullish = val2 === null || val2 === undefined;

    if (isVal1Nullish && isVal2Nullish) {
      continue; // Ambos são nulos/indefinidos, considerados iguais
    }
    if (isVal1Nullish !== isVal2Nullish) {
      return false; // Um é nulo/indefinido e o outro não
    }

    // Para strings, compara de forma case-insensitive após trim, para evitar diferenças por espaços ou caixa
    if (typeof val1 === 'string' && typeof val2 === 'string') {
      if (val1.trim().toLowerCase() !== val2.trim().toLowerCase()) {
        return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}