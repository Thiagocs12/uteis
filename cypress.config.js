// cypress.config.js
const { defineConfig } = require('cypress');
const sql = require('mssql');
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
          encrypt: false, // Use true para Azure SQL Database, ou se o servidor exigir SSL/TLS
          trustServerCertificate: true // Mude para false em produção, se tiver um certificado válido
        },
        port: parseInt(process.env.HOMOLOG_DB_PORT || '1433', 10) // Garante que a porta seja um número
      };

      // Configurações do banco de dados para Produção
      const dbConfigProd = {
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        server: process.env.PROD_DB_HOST,
        database: process.env.PROD_DB_NAME,
        options: {
          encrypt: false, // Use true para Azure SQL Database, ou se o servidor exigir SSL/TLS
          trustServerCertificate: true // Mude para false em produção, se tiver um certificado válido
        },
        port: parseInt(process.env.PROD_DB_PORT || '1433', 10) // Garante que a porta seja um número
      };

      // Função para executar query no banco de dados
      async function executeQuery(query, env) {
        let pool;
        try {
          const currentDbConfig = env === 'prod' ? dbConfigProd : dbConfigHomolog;

          // Verifica se todas as credenciais necessárias estão presentes
          if (!currentDbConfig.server || !currentDbConfig.user || !currentDbConfig.password || !currentDbConfig.database) {
            throw new Error(`Credenciais de banco de dados incompletas para o ambiente ${env}. Verifique seu arquivo .env.`);
          }

          pool = new sql.ConnectionPool(currentDbConfig);
          await pool.connect();
          const result = await pool.request().query(query);
          return result.recordset;
        } catch (err) {
          // console.error(`Erro ao executar query no SQL Server (${env}):`, err); // Removido
          throw err; // Re-lança o erro para que o Cypress possa capturá-lo
        } finally {
          if (pool) {
            await pool.close();
          }
        }
      }

      // Registra APENAS a tarefa para executar query SQL
      on('task', {
        sqlQuery(args) {
          const { query, env } = args;
          return executeQuery(query, env);
        },
      });

      return config;
    },
  },
});