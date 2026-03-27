const tabelas = require('../utils/produtosMap');
const entityKeys = Object.keys(tabelas);

describe('Copiando todos os produtos e suas respectivas dependências', () => {
  it('Buscar produtos e salvar produtos', () => {
    console.log(`[PROD][querySelect] Tabela=${tabelas.MC_CAD_PRODUTO.tableName} | id=383`);

    cy.querySelect(tabelas.MC_CAD_PRODUTO.tableName, 383, 'prod').then((result) => {
      cy.saveQueryResultToJson(`${tabelas.MC_CAD_PRODUTO.archiveName}.json`, result);
    });
  });

  it('Buscar e Salvar dependências', () => {
    cy.wrap(entityKeys).each((key) => {
      const entityKey = tabelas[key];
      if (entityKey.archiveName === '1 - MC_CAD_PRODUTO') return;

      cy.readColumnFromFile(`${entityKey.archiveReference}.json`, entityKey.referenceColumn).then((ids) => {
        if (ids && ids.length > 0) {
          console.log(
            `[PROD][querySelect] Tabela=${entityKey.tableName} | ids=${ids.length} | whereColumn=${
              entityKey.whereColumn || '(default)'
            }`
          );

          cy.querySelect(entityKey.tableName, ids, 'prod', entityKey.whereColumn).then((result) => {
            cy.saveQueryResultToJson(`${entityKey.archiveName}.json`, result);
          });
        } else {
          console.log(`Nenhum ID encontrado para a tabela ${entityKey.tableName}. Pulando consulta.`);
        }
      });
    });
  });

  it('Pesquisar no HML e adicionar idHml nos JSONs (dependencyLevel < 5)', () => {
    const entities = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) < 5)
      .sort((a, b) => Number(a.dependencyLevel ?? 999) - Number(b.dependencyLevel ?? 999));

    cy.wrap(entities).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      const cols =
        Array.isArray(entity.composition) && entity.composition.length > 0 ? entity.composition : ['descricao'];

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando): ${filePath}`);
          return;
        }

        console.log(`[HML][MATCH] ${entity.tableName} | registros no JSON: ${rows.length} | chave: ${cols.join(',')}`);

        return cy
          .wrap(rows, { log: false })
          .each((row) => {
            return cy.sqlWhereFromRow(cols, row).then((where) => {
              const query = `SELECT TOP 1 id FROM [${entity.tableName}] WHERE ${where}`;
              cy.sqlLog('hml', 'SELECT', entity.tableName, query);

              return cy.sqlServer(query, 'hml').then((res) => {
                row.idHml = Array.isArray(res) && res.length > 0 ? res[0].id : null;
              });
            });
          })
          .then(() => {
            cy.saveQueryResultToJson(filename, rows);
          });
      });
    });
  });

  it('Criar/Atualizar no HML as tabelas de nível 1 (cria se não existir, atualiza todas as colunas)', () => {
    const level1 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 1)
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[HML][UPSERT][LEVEL1] Tabelas nível 1 encontradas: ${level1.length}`);

    cy.wrap(level1).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      const keyCols =
        Array.isArray(entity.composition) && entity.composition.length > 0 ? entity.composition : ['descricao'];

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando nível 1): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando nível 1): ${filePath}`);
          return;
        }

        console.log(`[HML][UPSERT][${entity.tableName}] registros no JSON: ${rows.length} | chave: ${keyCols.join(',')}`);

        return cy
          .wrap(rows, { log: false })
          .each((row) => {
            return cy.sqlWhereFromRow(keyCols, row).then((where) => {
              const findQuery = `SELECT TOP 1 id FROM [${entity.tableName}] WHERE ${where}`;
              cy.sqlLog('hml', 'SELECT', entity.tableName, findQuery);

              return cy.sqlServer(findQuery, 'hml').then((found) => {
                if (Array.isArray(found) && found.length > 0) {
                  const idHml = found[0].id;
                  row.idHml = idHml;

                  return cy.sqlBuildUpdateQuery(entity.tableName, row, idHml).then((updateQuery) => {
                    if (!updateQuery) return;
                    cy.sqlLog('hml', 'UPDATE', entity.tableName, updateQuery);
                    return cy.sqlExec(updateQuery, 'hml');
                  });
                }

                return cy.sqlBuildInsertQuery(entity.tableName, row).then((insertQuery) => {
                  if (!insertQuery) {
                    row.idHml = null;
                    return;
                  }

                  cy.sqlLog('hml', 'INSERT', entity.tableName, insertQuery);

                  return cy.sqlExec(insertQuery, 'hml').then((execResult) => {
                    const rs = execResult && execResult.recordset ? execResult.recordset : [];
                    row.idHml = Array.isArray(rs) && rs.length > 0 ? rs[0].id : null;
                  });
                });
              });
            });
          })
          .then(() => {
            cy.saveQueryResultToJson(filename, rows);
          });
      });
    });
  });

  it('Relacionar nível 2 pelo nível 1 (substituir FKs via dependencyColumn)', () => {
    const level2 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 2)
      .filter((e) => (Array.isArray(e.dependencyColumn) ? e.dependencyColumn.length > 0 : !!e.dependencyColumn))
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[JSON][RELATE][LEVEL2] Tabelas nível 2 com dependencyColumn: ${level2.length}`);

    cy.wrap(level2).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando relacionamento nível 2): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando relacionamento nível 2): ${filePath}`);
          return;
        }

        const depsCount = Array.isArray(entity.dependencyColumn) ? entity.dependencyColumn.length : 1;
        console.log(`[JSON][RELATE][${entity.tableName}] registros=${rows.length} | deps=${depsCount}`);

        return cy.jsonApplyDependenciesFromOutput(rows, entity.dependencyColumn).then((updatedRows) => {
          cy.saveQueryResultToJson(filename, updatedRows);
        });
      });
    });
  });

  it('Criar/Atualizar no HML as tabelas de nível 2 (após relacionamento das FKs)', () => {
    const level2 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 2)
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[HML][UPSERT][LEVEL2] Tabelas nível 2 encontradas: ${level2.length}`);

    cy.wrap(level2).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      const keyCols =
        Array.isArray(entity.composition) && entity.composition.length > 0 ? entity.composition : ['descricao'];

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando nível 2): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando nível 2): ${filePath}`);
          return;
        }

        console.log(`[HML][UPSERT][${entity.tableName}] registros no JSON: ${rows.length} | chave: ${keyCols.join(',')}`);

        return cy
          .wrap(rows, { log: false })
          .each((row) => {
            return cy.sqlWhereFromRow(keyCols, row).then((where) => {
              const findQuery = `SELECT TOP 1 id FROM [${entity.tableName}] WHERE ${where}`;
              cy.sqlLog('hml', 'SELECT', entity.tableName, findQuery);

              return cy.sqlServer(findQuery, 'hml').then((found) => {
                if (Array.isArray(found) && found.length > 0) {
                  const idHml = found[0].id;
                  row.idHml = idHml;

                  return cy.sqlBuildUpdateQuery(entity.tableName, row, idHml).then((updateQuery) => {
                    if (!updateQuery) return;
                    cy.sqlLog('hml', 'UPDATE', entity.tableName, updateQuery);
                    return cy.sqlExec(updateQuery, 'hml');
                  });
                }

                return cy.sqlBuildInsertQuery(entity.tableName, row).then((insertQuery) => {
                  if (!insertQuery) {
                    row.idHml = null;
                    return;
                  }

                  cy.sqlLog('hml', 'INSERT', entity.tableName, insertQuery);

                  return cy.sqlExec(insertQuery, 'hml').then((execResult) => {
                    const rs = execResult && execResult.recordset ? execResult.recordset : [];
                    row.idHml = Array.isArray(rs) && rs.length > 0 ? rs[0].id : null;
                  });
                });
              });
            });
          })
          .then(() => {
            cy.saveQueryResultToJson(filename, rows);
          });
      });
    });
  });

  it('Relacionar nível 3 pelo nível 2 (substituir FKs via dependencyColumn)', () => {
    const level3 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 3)
      .filter((e) => (Array.isArray(e.dependencyColumn) ? e.dependencyColumn.length > 0 : !!e.dependencyColumn))
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[JSON][RELATE][LEVEL3] Tabelas nível 3 com dependencyColumn: ${level3.length}`);

    cy.wrap(level3).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando relacionamento nível 3): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando relacionamento nível 3): ${filePath}`);
          return;
        }

        const depsCount = Array.isArray(entity.dependencyColumn) ? entity.dependencyColumn.length : 1;
        console.log(`[JSON][RELATE][${entity.tableName}] registros=${rows.length} | deps=${depsCount}`);

        return cy.jsonApplyDependenciesFromOutput(rows, entity.dependencyColumn).then((updatedRows) => {
          cy.saveQueryResultToJson(filename, updatedRows);
        });
      });
    });
  });

  it('Criar/Atualizar no HML as tabelas de nível 3 (após relacionamento das FKs)', () => {
    const level3 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 3)
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[HML][UPSERT][LEVEL3] Tabelas nível 3 encontradas: ${level3.length}`);

    cy.wrap(level3).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      const keyCols =
        Array.isArray(entity.composition) && entity.composition.length > 0 ? entity.composition : ['descricao'];

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando nível 3): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando nível 3): ${filePath}`);
          return;
        }

        console.log(`[HML][UPSERT][${entity.tableName}] registros no JSON: ${rows.length} | chave: ${keyCols.join(',')}`);

        return cy
          .wrap(rows, { log: false })
          .each((row) => {
            return cy.sqlWhereFromRow(keyCols, row).then((where) => {
              const findQuery = `SELECT TOP 1 id FROM [${entity.tableName}] WHERE ${where}`;
              cy.sqlLog('hml', 'SELECT', entity.tableName, findQuery);

              return cy.sqlServer(findQuery, 'hml').then((found) => {
                if (Array.isArray(found) && found.length > 0) {
                  const idHml = found[0].id;
                  row.idHml = idHml;

                  return cy.sqlBuildUpdateQuery(entity.tableName, row, idHml).then((updateQuery) => {
                    if (!updateQuery) return;
                    cy.sqlLog('hml', 'UPDATE', entity.tableName, updateQuery);
                    return cy.sqlExec(updateQuery, 'hml');
                  });
                }

                return cy.sqlBuildInsertQuery(entity.tableName, row).then((insertQuery) => {
                  if (!insertQuery) {
                    row.idHml = null;
                    return;
                  }

                  cy.sqlLog('hml', 'INSERT', entity.tableName, insertQuery);

                  return cy.sqlExec(insertQuery, 'hml').then((execResult) => {
                    const rs = execResult && execResult.recordset ? execResult.recordset : [];
                    row.idHml = Array.isArray(rs) && rs.length > 0 ? rs[0].id : null;
                  });
                });
              });
            });
          })
          .then(() => {
            cy.saveQueryResultToJson(filename, rows);
          });
      });
    });
  });

  it('Relacionar nível 4 pelo nível 3 (substituir FKs via dependencyColumn)', () => {
    const level4 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 4)
      .filter((e) => (Array.isArray(e.dependencyColumn) ? e.dependencyColumn.length > 0 : !!e.dependencyColumn))
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[JSON][RELATE][LEVEL4] Tabelas nível 4 com dependencyColumn: ${level4.length}`);

    cy.wrap(level4).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando relacionamento nível 4): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando relacionamento nível 4): ${filePath}`);
          return;
        }

        const depsCount = Array.isArray(entity.dependencyColumn) ? entity.dependencyColumn.length : 1;
        console.log(`[JSON][RELATE][${entity.tableName}] registros=${rows.length} | deps=${depsCount}`);

        return cy.jsonApplyDependenciesFromOutput(rows, entity.dependencyColumn).then((updatedRows) => {
          cy.saveQueryResultToJson(filename, updatedRows);
        });
      });
    });
  });

  it('Criar/Atualizar no HML as tabelas de nível 4 (após relacionamento das FKs)', () => {
    const level4 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 4)
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[HML][UPSERT][LEVEL4] Tabelas nível 4 encontradas: ${level4.length}`);

    cy.wrap(level4).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      const keyCols =
        Array.isArray(entity.composition) && entity.composition.length > 0 ? entity.composition : ['descricao'];

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando nível 4): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando nível 4): ${filePath}`);
          return;
        }

        console.log(`[HML][UPSERT][${entity.tableName}] registros no JSON: ${rows.length} | chave: ${keyCols.join(',')}`);

        return cy
          .wrap(rows, { log: false })
          .each((row) => {
            return cy.sqlWhereFromRow(keyCols, row).then((where) => {
              const findQuery = `SELECT TOP 1 id FROM [${entity.tableName}] WHERE ${where}`;
              cy.sqlLog('hml', 'SELECT', entity.tableName, findQuery);

              return cy.sqlServer(findQuery, 'hml').then((found) => {
                if (Array.isArray(found) && found.length > 0) {
                  const idHml = found[0].id;
                  row.idHml = idHml;

                  return cy.sqlBuildUpdateQuery(entity.tableName, row, idHml).then((updateQuery) => {
                    if (!updateQuery) return;
                    cy.sqlLog('hml', 'UPDATE', entity.tableName, updateQuery);
                    return cy.sqlExec(updateQuery, 'hml');
                  });
                }

                return cy.sqlBuildInsertQuery(entity.tableName, row).then((insertQuery) => {
                  if (!insertQuery) {
                    row.idHml = null;
                    return;
                  }

                  cy.sqlLog('hml', 'INSERT', entity.tableName, insertQuery);

                  return cy.sqlExec(insertQuery, 'hml').then((execResult) => {
                    const rs = execResult && execResult.recordset ? execResult.recordset : [];
                    row.idHml = Array.isArray(rs) && rs.length > 0 ? rs[0].id : null;
                  });
                });
              });
            });
          })
          .then(() => {
            cy.saveQueryResultToJson(filename, rows);
          });
      });
    });
  });

  it('Relacionar nível 5 pelo nível 4 (substituir FKs via dependencyColumn)', () => {
    const level5 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 5)
      .filter((e) => (Array.isArray(e.dependencyColumn) ? e.dependencyColumn.length > 0 : !!e.dependencyColumn))
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[JSON][RELATE][LEVEL5] Tabelas nível 5 com dependencyColumn: ${level5.length}`);

    cy.wrap(level5).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando relacionamento nível 5): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando relacionamento nível 5): ${filePath}`);
          return;
        }

        const depsCount = Array.isArray(entity.dependencyColumn) ? entity.dependencyColumn.length : 1;
        console.log(`[JSON][RELATE][${entity.tableName}] registros=${rows.length} | deps=${depsCount}`);

        return cy.jsonApplyDependenciesFromOutput(rows, entity.dependencyColumn).then((updatedRows) => {
          cy.saveQueryResultToJson(filename, updatedRows);
        });
      });
    });
  });

  it('Criar/Atualizar no HML as tabelas de nível 5 (por composition: atualiza se existe, cria se não existe)', () => {
    const level5 = Object.values(tabelas)
      .filter((e) => Number(e.dependencyLevel ?? 999) === 5)
      .sort((a, b) => String(a.archiveName).localeCompare(String(b.archiveName)));

    console.log(`[HML][UPSERT][LEVEL5] Tabelas nível 5 encontradas: ${level5.length}`);

    cy.wrap(level5).each((entity) => {
      const filename = `${entity.archiveName}.json`;
      const filePath = `cypress/output/${filename}`;

      const keyCols =
        Array.isArray(entity.composition) && entity.composition.length > 0 ? entity.composition : null;

      if (!keyCols) {
        console.log(`[HML][UPSERT][LEVEL5] Sem composition (pulando): ${entity.tableName}`);
        return;
      }

      cy.readJsonIfExists(filePath).then((rows) => {
        if (rows === null) {
          console.log(`Arquivo inexistente (pulando nível 5): ${filePath}`);
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.log(`JSON vazio (pulando nível 5): ${filePath}`);
          return;
        }

        console.log(
          `[HML][UPSERT][${entity.tableName}] registros no JSON: ${rows.length} | composition: ${keyCols.join(',')}`
        );

        return cy
          .wrap(rows, { log: false })
          .each((row) => {
            // garante que as colunas da composition existem no JSON
            const missing = keyCols.filter((c) => !(c in row));
            if (missing.length > 0) {
              console.log(
                `[HML][UPSERT][LEVEL5] Colunas ausentes (setando idHml=null): ${entity.tableName} | missing=${missing.join(
                  ','
                )}`
              );
              row.idHml = null;
              return;
            }

            return cy.sqlWhereFromRow(keyCols, row).then((where) => {
              const findQuery = `SELECT TOP 1 id FROM [${entity.tableName}] WHERE ${where}`;
              cy.sqlLog('hml', 'SELECT', entity.tableName, findQuery);

              return cy.sqlServer(findQuery, 'hml').then((found) => {
                // existe => UPDATE
                if (Array.isArray(found) && found.length > 0) {
                  const idHml = found[0].id;
                  row.idHml = idHml;

                  return cy.sqlBuildUpdateQuery(entity.tableName, row, idHml).then((updateQuery) => {
                    if (!updateQuery) return;
                    cy.sqlLog('hml', 'UPDATE', entity.tableName, updateQuery);
                    return cy.sqlExec(updateQuery, 'hml');
                  });
                }

                // não existe => INSERT
                return cy.sqlBuildInsertQuery(entity.tableName, row).then((insertQuery) => {
                  if (!insertQuery) {
                    row.idHml = null;
                    return;
                  }

                  cy.sqlLog('hml', 'INSERT', entity.tableName, insertQuery);

                  return cy.sqlExec(insertQuery, 'hml').then((execResult) => {
                    const rs = execResult && execResult.recordset ? execResult.recordset : [];
                    row.idHml = Array.isArray(rs) && rs.length > 0 ? rs[0].id : null;
                  });
                });
              });
            });
          })
          .then(() => {
            cy.saveQueryResultToJson(filename, rows);
          });
      });
    });
  });
});