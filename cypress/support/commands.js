import MAPEAMENTOS_APIS from '../utils/mapeamentoApis';
import MAPEAMENTOS_ETAPAS from '../utils/mapeamentoEtapas';
import { obterValor } from './utils';
import tokens from '../temp/tokens.json';

const multiflow = MAPEAMENTOS_APIS.MULTIFLOW;
const etapas = MAPEAMENTOS_ETAPAS;

/**
 * @description Define e retorna os dados base para um ambiente específico.
 * @param {string} ambiente - O nome do ambiente ('prod', 'hml', 'keycloak', 'bhml').
 * @returns {Cypress.Chainable<object>} Um objeto contendo baseUrl, loginUrl, loginUsername e loginPassword.
 */
Cypress.Commands.add('definirAmbiente', (ambiente) => {
  const prod = {
    baseUrl: Cypress.env('PROD_API_BASE_URL'),
    loginUrl: Cypress.env('PROD_API_LOGIN_URL'),
    loginUsername: Cypress.env('PROD_API_USERNAME'),
    loginPassword: Cypress.env('PROD_API_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('PROD_API_LOGIN_URL')}/auth/realms/multiplicacapital/protocol/openid-connect/token`,
    token: tokens?.prod?.token ?? ''
  };
  const hml = {
    baseUrl: Cypress.env('HML_API_BASE_URL'),
    loginUrl: Cypress.env('HML_API_LOGIN_URL'),
    loginUsername: Cypress.env('HML_API_USERNAME'),
    loginPassword: Cypress.env('HML_API_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('HML_API_LOGIN_URL')}/auth/realms/multiplicacapital/protocol/openid-connect/token`,
    token: tokens?.hml?.token ?? ''
  };
  const keycloak = {
    baseUrl: Cypress.env('HML_KEYCLOAK_BASE_URL'),
    loginUrl: Cypress.env('HML_KEYCLOAK_LOGIN_URL'),
    loginUsername: Cypress.env('HML_KEYCLOAK_USERNAME'),
    loginPassword: Cypress.env('HML_KEYCLOAK_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('HML_KEYCLOAK_LOGIN_URL')}/auth/realms/master/protocol/openid-connect/token`,
    token: tokens?.keycloak?.token ?? ''
  };
  const bhml = {
    baseUrl: Cypress.env('BHML_API_BASE_URL'),
    loginUrl: Cypress.env('BHML_API_LOGIN_URL'),
    loginUsername: Cypress.env('BHML_API_USERNAME'),
    loginPassword: Cypress.env('BHML_API_PASSWORD'),
    urlTokenApiIntercept: `${Cypress.env('BHML_API_LOGIN_URL')}/auth/realms/beyondbanking-hml/protocol/openid-connect/token`,
    token: tokens?.bhml?.token ?? ''
  };

  if (ambiente === 'prod') {
    return cy.wrap(prod);
  } else if (ambiente === 'hml') {
    return cy.wrap(hml);
  } else if (ambiente === 'keycloak') {
    return cy.wrap(keycloak);
  } else if (ambiente === 'bhml') {
    return cy.wrap(bhml);
  } else {
    throw new Error(`Ambiente desconhecido: ${ambiente}`);
  }
});

/**
 * @description Lê um arquivo JSON do diretório 'cypress/output'.
 * Retorna null se o arquivo não existir ou estiver vazio.
 * @param {string} nomeArquivo - Nome do arquivo JSON (ex: 'meuArquivo.json').
 * @returns {Cypress.Chainable<Array<object>|null>} Conteúdo do JSON ou null.
 */
Cypress.Commands.add('lerJsonDeOutput', (nomeArquivo) => {
  const caminhoArquivo = `cypress/output/${nomeArquivo}`;
  return cy.task('lerJsonSeExistir', { caminhoArquivo }, { log: false });
});

/**
 * @description Lê uma coluna específica de um arquivo JSON de output,
 * extraindo valores únicos de acordo com o modo de leitura informado.
 * @param {string} nomeArquivo - Nome do arquivo JSON localizado em 'cypress/output/'.
 * @param {string} nomeColuna - Nome da propriedade a ser extraída dos itens.
 * @param {'content'|'ligacao'|'lista'|'listaId'|'falseId'|'contentId'|true} [content=true] - Modo de leitura do arquivo.
 * @returns {Cypress.Chainable<Array<any>>} Array com os valores únicos da coluna.
 */
Cypress.Commands.add('lerColunaDeArquivo', (nomeArquivo, nomeColuna, content = true) => {
  return cy.lerJsonDeOutput(nomeArquivo).then((conteudoArquivo) => {
    const valoresUnicos = new Set();

    if (content === 'content') {
      if (conteudoArquivo && conteudoArquivo['content']) {
        for (let i = 0; i < conteudoArquivo['content'].length; i++) {
          const item = conteudoArquivo['content'][i];
          if (item && item[nomeColuna] && item[nomeColuna]['id'] !== undefined) {
            valoresUnicos.add(item[nomeColuna]['id']);
          }
        }
      }
    } else if (content === 'ligacao') {
      if (conteudoArquivo && conteudoArquivo['content']) {
        for (let i = 0; i < conteudoArquivo['content'].length; i++) {
          const item = conteudoArquivo['content'][i];
          valoresUnicos.add(item['id']);
        }
      }
    } else if (content === 'lista') {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        for (let j = 0; j < conteudoArquivo[i].length; j++) {
          const item = conteudoArquivo[i][j];
          if (item && item[nomeColuna] && item[nomeColuna]['id'] !== undefined) {
            valoresUnicos.add(item[nomeColuna]['id']);
          }
        }
      }
    } else if (content === 'listaId') {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        for (let j = 0; j < conteudoArquivo[i].length; j++) {
          const item = conteudoArquivo[i][j];
          if (item && item[nomeColuna] && item[nomeColuna] !== undefined) {
            valoresUnicos.add(item[nomeColuna]);
          }
        }
      }
    } else if (content === 'falseId') {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        const item = conteudoArquivo[i];
        if (item && item[nomeColuna] && item[nomeColuna] !== undefined) {
          valoresUnicos.add(item[nomeColuna]);
        }
      }
    } else if (content === 'contentId') {
      if (conteudoArquivo && conteudoArquivo['content']) {
        for (let i = 0; i < conteudoArquivo['content'].length; i++) {
          const item = conteudoArquivo['content'][i];
          if (item && item[nomeColuna] !== undefined) {
            valoresUnicos.add(item[nomeColuna]);
          }
        }
      }
    } else {
      for (let i = 0; i < conteudoArquivo.length; i++) {
        const item = conteudoArquivo[i];
        if (item && item[nomeColuna] && item[nomeColuna]['id'] !== undefined) {
          valoresUnicos.add(item[nomeColuna]['id']);
        }
      }
    }

    return cy.wrap(Array.from(valoresUnicos));
  });
});

/**
 * @description Busca os dados de uma entidade dependente na API de produção
 * com base nos IDs extraídos de um arquivo de referência, salvando o resultado em um novo arquivo de output.
 * @param {object} entidade - Configuração da entidade a ser pesquisada.
 * @param {string} entidade.nomeArquivoReferencia - Nome do arquivo JSON de referência para leitura dos IDs.
 * @param {string} entidade.campoBusca - Nome da coluna/propriedade usada para extração dos IDs.
 * @param {string} entidade.nomeArquivo - Nome do arquivo de saída onde os dados serão salvos.
 * @param {string} entidade.urlBuscaId - URL base da API para busca por ID (o ID será concatenado ao final).
 * @param {string} [entidade.content] - Modo de leitura do arquivo de referência (repassado para lerColunaDeArquivo).
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('pesquisarDependencias', (entidade) => {
  if (!entidade || !entidade.nomeArquivoReferencia || !entidade.campoBusca || !entidade.nomeArquivo || !entidade.urlBuscaId) {
    throw new Error(`Configuração de entidade inválida para pesquisarDependencias. Verifique as propriedades: {nomeArquivoReferencia}, {campoBusca}, {nomeArquivo}, {urlBuscaId}.`);
  }

  const nomeArquivoReferencia = entidade.nomeArquivoReferencia;
  const campoBusca = entidade.campoBusca;
  const nomeArquivo = entidade.nomeArquivo;
  const urlBuscaId = entidade.urlBuscaId;
  const content = entidade.content;
  const valores = [];

  return cy.lerColunaDeArquivo(nomeArquivoReferencia, campoBusca, content).then((dadosDoArquivo) => {
    const idsUnicos = [...new Set(dadosDoArquivo)];

    for (const id of idsUnicos) {
      cy.executarRequest('prod', `${urlBuscaId}${id}`).then((resposta) => {
        valores.push(resposta.body);
      });
    }

    cy.writeFile(`cypress/output/${nomeArquivo}`, valores);
  });
});

/**
 * @description Itera sobre todos os mapeamentos de APIs e executa a pesquisa de dependências
 * para cada entidade, ignorando as entidades 'PRODUTO', 'GRUPOS_KEYCLOAK', 'MULTIFLOW' e 'SELECIONAR_CEDENTE'.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('pesquisarDependenciasLigacao', () => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) {
      const entidade = MAPEAMENTOS_APIS[chaveEntidade];

      if (['PRODUTO', 'GRUPOS_KEYCLOAK', 'MULTIFLOW', 'SELECIONAR_CEDENTE'].includes(chaveEntidade)) {
        continue;
      }

      cy.pesquisarDependencias(entidade);
    }
  }
});

/**
 * @description Cria no ambiente HML os itens de um determinado nível de dependência
 * que ainda não possuem 'idHml' (ou seja, idHml === null), ignorando a entidade 'GRUPOS_KEYCLOAK'.
 * @param {number} nivel - Nível de dependência das entidades a serem processadas.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('criarItensInexistentesPorNivel', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];

    if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia !== nivel) continue;

    const method = entidade.method || 'POST';
    const caminhoArquivo = `cypress/output/${entidade.nomeArquivo}`;
    const campoDescricao = entidade.campoDescricao || 'descricao';
    const chavesIgnoradas = [
      'idHml',
      'id',
      'dataCadastro',
      'dataUltimaAlteracao',
      'usuarioCadastro',
      'usuarioUltimaAlteracao',
      ...(entidade.chavesIgnoradas || [])
    ];

    cy.readFile(caminhoArquivo).then((itens) => {
      const itensValidos = itens.filter((item) => item.idHml === null);

      itensValidos.forEach((item) => {
        const body = Object.fromEntries(
          Object.entries(item).filter(([chave]) => !chavesIgnoradas.includes(chave))
        );

        cy.executarRequest('hml', entidade.url, body, method).then((resultado) => {
          cy.setIdHmlPorDescricao(resultado.body['id'], item[campoDescricao], entidade.nomeArquivo, campoDescricao);
        });
      });
    });
  }
});

/**
 * @description Atualiza no ambiente HML os itens de um determinado nível de dependência
 * que já possuem 'idHml' (ou seja, idHml !== null), ignorando a entidade 'GRUPOS_KEYCLOAK'.
 * @param {number} nivel - Nível de dependência das entidades a serem processadas.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('atualizarItensExistentesPorNivel', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];

    if (chaveEntidade === 'GRUPOS_KEYCLOAK' || entidade.nivelDependencia !== nivel) continue;

    const method = entidade.method || 'POST';
    const chavesIgnoradas = [
      'idHml',
      'id',
      'dataCadastro',
      'dataUltimaAlteracao',
      'usuarioCadastro',
      'usuarioUltimaAlteracao',
      ...(entidade.chavesIgnoradas || [])
    ];

    cy.readFile(`cypress/output/${entidade.nomeArquivo}`).then((itens) => {
      const itensValidos = itens.filter((item) => item.idHml !== null);

      itensValidos.forEach((item) => {
        const camposDoItem = Object.fromEntries(
          Object.entries(item).filter(([chave]) => !chavesIgnoradas.includes(chave))
        );

        const body = {
          ...camposDoItem,
          id: String(item.idHml),
        };

        cy.executarRequest('hml', entidade.url, body, method);
      });
    });
  }
});

Cypress.Commands.add('pesquisarItensPorNivel', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];
    const nomeArquivo = entidade.nomeArquivo;
    const campoDescricao = entidade.campoDescricao || 'descricao';
    const contentBusca = entidade.contentBusca || 'falseId';

    if (
      chaveEntidade === 'GRUPOS_KEYCLOAK' ||
      entidade.nivelDependencia !== nivel
    ) continue;

    const salvarId = (id, dado) => {
      if (id === null) {
        cy.log(
          `[LOG] - Registro "${JSON.stringify(dado)}" não encontrado exatamente no ambiente, setando null`
        );
      }

      cy.setIdHmlPorDescricao(
        id,
        dado,
        nomeArquivo,
        Array.isArray(contentBusca)
          ? contentBusca
          : campoDescricao
      );
    };

    if (Array.isArray(contentBusca)) {
      cy.lerJsonDeOutput(nomeArquivo).then((dadosDoArquivo) => {
        
        for (const dado of dadosDoArquivo) {

          const valorBusca = obterValor(dado, contentBusca[0]);

          cy.executarRequest2(
            'hml',
            `${entidade.urlBusca}${encodeURIComponent(valorBusca)}`
          ).then((resposta) => {

            const content = resposta.body?.content || [];

            if (!content.length) {
              salvarId(null, {
                [contentBusca[0]]: obterValor(dado, contentBusca[0]),
                [contentBusca[1]]: obterValor(dado, contentBusca[1])
              });

              return;
            }

            let encontrou = false;

            cy.wrap(content).each((item) => {

              if (encontrou) return;

              cy.executarRequest(
                'hml',
                `${entidade.urlBuscaId}${item.id}`
              ).then((resposta2) => {

                if (encontrou) return;

                const itens = Array.isArray(resposta2.body)
                  ? resposta2.body
                  : [resposta2.body];

                const id = itens.find((item2) => {

                  const valorItem1 = obterValor(item2, contentBusca[0]);
                  const valorDado1 = obterValor(dado, contentBusca[0]);

                  const valorItem2 = obterValor(item2, contentBusca[1]);
                  const valorDado2 = obterValor(dado, contentBusca[1]);

                  return (
                    String(valorItem1)?.trim()?.toLowerCase() ===
                    String(valorDado1)?.trim()?.toLowerCase() &&
                    String(valorItem2)?.trim()?.toLowerCase() ===
                    String(valorDado2)?.trim()?.toLowerCase()
                  );

                })?.id ?? null;

                if (id !== null) {
                  encontrou = true;

                  salvarId(id, {
                    [contentBusca[0]]: obterValor(dado, contentBusca[0]),
                    [contentBusca[1]]: obterValor(dado, contentBusca[1])
                  });
                }

              });

            }).then(() => {

              if (!encontrou) {

                salvarId(null, {
                  [contentBusca[0]]: obterValor(dado, contentBusca[0]),
                  [contentBusca[1]]: obterValor(dado, contentBusca[1])
                });

              }

            });

          });

        }

      });

    } else {

      cy.lerColunaDeArquivo(
        nomeArquivo,
        campoDescricao,
        contentBusca
      ).then((dadosDoArquivo) => {

        for (const dado of dadosDoArquivo) {

          cy.executarRequest(
            'hml',
            `${entidade.urlBusca}${encodeURIComponent(dado)}`
          ).then((resposta) => {

            const itens = resposta.body?.content || [];

            const id = itens.find((item) =>
              String(item?.[campoDescricao])
                ?.trim()
                ?.toLowerCase() ===
              String(dado)
                ?.trim()
                ?.toLowerCase()
            )?.id ?? null;

            salvarId(id, dado);

          });

        }

      });

    }

  }
});

/**
 * @description Localiza um item no arquivo JSON pelo valor do campo descrição
 * e atualiza sua propriedade 'idHml' com o ID fornecido.
 * Suporta busca simples (string) e busca composta (objeto).
 * 
 * @param {string|number|null} id - ID do ambiente HML a ser salvo no item.
 * @param {string|object} descricao - Valor usado para localizar o item.
 * @param {string} nomeArquivo - Nome do arquivo JSON localizado em 'cypress/output/'.
 * @param {string|string[]} campoDescricao - Campo(s) usados para localizar o item.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('setIdHmlPorDescricao', (id, descricao, nomeArquivo, campoDescricao) => {
  const filePath = `cypress/output/${nomeArquivo}`;

  cy.readFile(filePath, { log: false }).then((conteudo) => {

    const item = conteudo.find((entry) => {

      // Busca composta
      if (Array.isArray(campoDescricao)) {
        return campoDescricao.every((campo) => {
          return obterValor(entry, campo) === descricao[campo];
        });
      }

      // Busca simples
      return entry[campoDescricao] === descricao;
    });

    if (!item) {
      throw new Error(
        `[setIdHmlPorDescricao] Nenhum item encontrado em "${nomeArquivo}".`
      );
    }

    item.idHml = id;

    cy.log(
      `[LOG] Setando idHml: ${id} em "${nomeArquivo}"`
    );

    cy.writeFile(filePath, conteudo, { log: false });
  });
});

/**
 * @description Itera sobre todas as entidades de um determinado nível de dependência
 * e substitui os IDs de produção pelos IDs equivalentes no ambiente HML,
 * com base nas configurações de dependência de cada entidade.
 * Ignora a entidade 'GRUPOS_KEYCLOAK' e entidades sem dependências definidas.
 * @param {number} nivel - Nível de dependência das entidades a serem processadas.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('atualizarIdsDeDependencias', (nivel) => {
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];

    if (
      chaveEntidade === 'GRUPOS_KEYCLOAK' ||
      entidade.nivelDependencia !== nivel ||
      !entidade.dependencia ||
      entidade.dependencia.length === 0
    ) {
      continue;
    }

    cy.readFile(`cypress/output/${entidade.nomeArquivo}`).then((itens) => {

      // garante que as dependências processam de forma encadeada
      cy.wrap(entidade.dependencia).each((dependencia) => {
        const {
          arquivoDependencia,
          idSubstituido,  // ex: 'grupoProduto.id'
        } = dependencia;

        const idDependecia = dependencia.idDependecia || 'id';

        return cy
          .readFile(`cypress/output/${arquivoDependencia}`)
          .then((dependencias) => {
            const listaDependencias = Array.isArray(dependencias[0])
              ? dependencias.flat()
              : dependencias;

            itens.forEach((item, index) => {
              const idOriginal = Cypress._.get(item, idSubstituido);

              // sem ID pra traduzir, pula
              if (!idOriginal) {
                return;
              }

              // 🔒 NOVA REGRA:
              // se o item já tem idHml preenchido, não faz pesquisa nem substitui nada
              if (item.idHml != null) {
                // opcional: log pra debug
                // cy.log(`Item[${index}] já possui idHml=${item.idHml}, pulando tradução para ${idSubstituido}`);
                return;
              }

              const equivalente = listaDependencias.find(
                (depItem) => depItem[idDependecia] === idOriginal
              );

              if (!equivalente) {
                // opcional: logar para investigar falhas de correspondência
                // cy.log(`Equivalente não encontrado para ${idSubstituido} (${idOriginal}) em ${arquivoDependencia}`);
                return;
              }

              // substituição de fato
              Cypress._.set(item, idSubstituido, equivalente.idHml);
            });
          });
      }).then(() => {
        // aqui você grava o arquivo se for o comportamento desejado:
        // cy.writeFile(`cypress/output/${entidade.nomeArquivo}`, itens);
      });
    });
  }
});

/**
 * @description Orquestra o processamento completo de entidades para um determinado nível de dependência,
 * executando em sequência: atualização de IDs de dependências e pesquisa de itens no ambiente HML.
 * Os steps de atualização e criação estão comentados e podem ser habilitados conforme necessidade.
 * @param {number} nivel - Nível de dependência das entidades a serem processadas.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('processarEntidadesPorNivel', (nivel) => {
  cy.normalizarArquivosNivel5()
  cy.log(`iniciando o command atualizarIdsDeDependencias para o nível ${nivel}`);
  cy.atualizarIdsDeDependencias(nivel);
  cy.log(`iniciando o command pesquisarItensPorNivel para o nível ${nivel}`);
  cy.pesquisarItensPorNivel(nivel);
  cy.log(`iniciando o command atualizarItensExistentesPorNivel para o nível ${nivel}`)
  cy.atualizarItensExistentesPorNivel(nivel)
  cy.log(`iniciando o command criarItensInexistentesPorNivel para o nível ${nivel}`)
  cy.criarItensInexistentesPorNivel(nivel)
});

/**
 * @description Verifica se um diretório possui ao menos um arquivo,
 * falhando o teste caso o diretório esteja vazio.
 * @param {string} caminho - Caminho do diretório a ser verificado.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('verificarDiretorioNaoVazio', (caminho) => {
  cy.task('listarArquivos', caminho).then((arquivos) => {
    expect(arquivos.length, `Diretório "${caminho}" está vazio`).to.be.greaterThan(0);
  });
});

// cypress/support/commands.js

/**
 * @description
 * Lê um arquivo JSON. Se for um array simples de objetos (ex: [ {...}, {...} ]),
 * não faz nada. Se for um array contendo sub‑arrays (ex: [ [], [ {...} ], [] ]),
 * normaliza para um array simples:
 *   - achata (flat)
 *   - remove duplicados (objetos exatamente iguais)
 *   - sobrescreve o próprio arquivo.
 *
 * @param {string} arquivo - Caminho do arquivo a ser normalizado.
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('normalizarArquivo', (arquivo) => {
  cy.readFile(arquivo).then((dadosBrutos) => {
    // Se não é array, nem tenta normalizar
    if (!Array.isArray(dadosBrutos)) {
      cy.log(`📄 ${arquivo} não é um array, não será alterado.`);
      return;
    }

    const temSubArray = dadosBrutos.some(Array.isArray);

    // Caso 1: já é um array "reto", sem sub‑arrays -> não mexe
    if (!temSubArray) {
      cy.log(`✅ ${arquivo} já está normalizado (array simples). Nada a fazer.`);
      return;
    }

    cy.log(`🔄 ${arquivo} contém sub‑arrays. Normalizando...`);

    // 1) pega só os sub‑arrays e achata tudo
    const todosItens = dadosBrutos
      .filter(Array.isArray)  // remove [], null, etc.
      .flat();                // junta todos os itens num único array

    // 2) remove duplicações comparando o objeto inteiro
    const vistos = new Set();
    const itensUnicos = [];

    todosItens.forEach((item) => {
      const assinatura = JSON.stringify(item);
      if (vistos.has(assinatura)) return;

      vistos.add(assinatura);
      itensUnicos.push(item);
    });

    cy.log(`Total bruto: ${todosItens.length} | Sem duplicações: ${itensUnicos.length}`);

    // 3) sobrescreve o mesmo arquivo com os itens únicos
    return cy.writeFile(arquivo, itensUnicos);
  });
});

/**
 * @description
 * Para todas as entidades definidas em MAPEAMENTOS_APIS com nivelDependencia === 5,
 * normaliza o arquivo correspondente (nomeArquivo) em cypress/output,
 * removendo duplicados e sobrescrevendo o próprio arquivo.
 *
 * @returns {Cypress.Chainable<void>}
 */
Cypress.Commands.add('normalizarArquivosNivel5', () => {
  // percorre o mapa normalmente com for...in,
  // mas SEM usar forEach pra não bagunçar o encadeamento do Cypress
  for (const chaveEntidade in MAPEAMENTOS_APIS) {
    if (!Object.prototype.hasOwnProperty.call(MAPEAMENTOS_APIS, chaveEntidade)) continue;

    const entidade = MAPEAMENTOS_APIS[chaveEntidade];

    if (entidade.nivelDependencia !== 5) {
      continue;
    }

    const caminhoArquivo = `cypress/output/${entidade.nomeArquivo}`;

    cy.normalizarArquivo(caminhoArquivo);
  }
});