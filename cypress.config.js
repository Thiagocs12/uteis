// cypress.config.js
const { defineConfig } = require('cypress');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Para carregar as variáveis do .env

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configurações do banco de dados para Homologação
      const dbConfigHomolog = {
        user: process.env.HOMOLOG_DB_USER,
        password: process.env.HOMOLOG_DB_PASS,
        server: process.env.HOMOLOG_DB_HOST,
        database: process.env.HOMOLOG_DB_NAME,
        options: {
          encrypt: false,
          trustServerCertificate: true
        },
        port: parseInt(process.env.HOMOLOG_DB_PORT || '1433', 10)
      };

      // Configurações do banco de dados para Produção
      const dbConfigProd = {
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        server: process.env.PROD_DB_HOST,
        database: process.env.PROD_DB_NAME,
        options: {
          encrypt: false,
          trustServerCertificate: true
        },
        port: parseInt(process.env.PROD_DB_PORT || '1433', 10)
      };

      async function runSql(query, env) {
        let pool;
        try {
          const currentDbConfig = env === 'prod' ? dbConfigProd : dbConfigHomolog;

          if (
            !currentDbConfig.server ||
            !currentDbConfig.user ||
            !currentDbConfig.password ||
            !currentDbConfig.database
          ) {
            throw new Error(
              `Credenciais de banco de dados incompletas para o ambiente ${env}. Verifique seu arquivo .env.`
            );
          }

          pool = new sql.ConnectionPool(currentDbConfig);
          await pool.connect();

          const result = await pool.request().query(query);

          return {
            recordset: result.recordset || [],
            rowsAffected: result.rowsAffected || [],
          };
        } finally {
          if (pool) await pool.close();
        }
      }

      on('task', {
        // Mantém compatibilidade com seu código atual (SELECT)
        async sqlQuery(args) {
          const { query, env } = args;
          const result = await runSql(query, env);
          return result.recordset;
        },

        // ✅ Novo: escrita (INSERT/UPDATE/MERGE). Retorna { recordset, rowsAffected }
        async sqlExec(args) {
          const { query, env } = args;
          return runSql(query, env);
        },

        // Lê um JSON local: se não existir, retorna null (para você "pular" no spec)
        readJsonIfExists(args) {
          const { filePath } = args || {};
          if (!filePath) return null;

          const fullPath = path.isAbsolute(filePath)
            ? filePath
            : path.join(process.cwd(), filePath);

          if (!fs.existsSync(fullPath)) return null;

          const raw = fs.readFileSync(fullPath, 'utf8');
          if (!raw || !raw.trim()) return [];

          return JSON.parse(raw);
        },
      });

      return config;
    },
  },
});