require('dotenv').config(); // Carrega as variáveis do .env
const { defineConfig } = require('cypress');
const { Pool } = require('mssql'); // Ou o driver do seu banco de dados (ex: mysql2, mssql)

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // --- Configuração de Banco de Dados ---

      // Configuração para o ambiente de Homologação
      const hmlDbConfig = {
        user: process.env.HOMOLOG_DB_USER,
        host: process.env.HOMOLOG_DB_HOST,
        database: process.env.HOMOLOG_DB_NAME,
        password: process.env.HOMOLOG_DB_PASS,
        port: process.env.HOMOLOG_DB_PORT ? parseInt(process.env.HOMOLOG_DB_PORT) : 5432,
      };

      // Configuração para o ambiente de Produção
      const prodDbConfig = {
        user: process.env.PROD_DB_USER,
        host: process.env.PROD_DB_HOST,
        database: process.env.PROD_DB_NAME,
        password: process.env.PROD_DB_PASS,
        port: process.env.PROD_DB_PORT ? parseInt(process.env.PROD_DB_PORT) : 5432,
      };

      // Cria os pools de conexão
      const hmlDbPool = new Pool(hmlDbConfig);
      const prodDbPool = new Pool(prodDbConfig);

      on('task', {
        async queryDb(args) {
          const { environment, query, values } = args;
          let pool;

          if (environment === 'prod') {
            pool = prodDbPool;
          } else if (environment === 'hml') {
            pool = hmlDbPool;
          } else {
            throw new Error('Ambiente de banco de dados inválido. Use "prod" ou "hml".');
          }

          try {
            const client = await pool.connect();
            const result = await client.query(query, values);
            client.release();
            return result.rows; // Retorna as linhas do resultado
          } catch (err) {
            console.error(`Erro ao executar query no DB (${environment}):`, err.message);
            throw err; // Rejeita a promise para que o Cypress saiba que houve um erro
          }
        },
      });

      // Retorna o objeto de configuração atualizado
      return config;
    },
    // Se você não vai usar APIs, pode remover ou deixar o baseUrl como um valor genérico
    // Se for usar APIs, você precisará de variáveis de ambiente para as URLs das APIs também
    baseUrl: 'http://localhost:8080', // Exemplo, pode ser ajustado ou removido se não usar APIs
  },
});
