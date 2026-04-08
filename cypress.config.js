// cypress.config.js
import { defineConfig } from 'cypress';
import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Importações para @badeball/cypress-cucumber-preprocessor
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
// Importação CORRETA do createEsbuildPlugin
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

dotenv.config();

// --- INÍCIO DA DEPURAÇÃO DE VARIÁVEIS DE AMBIENTE (REMOVIDAS CREDENCIAIS) ---
console.log('--- Verificando variáveis de ambiente no cypress.config.js (process.env) ---');
console.log('HML_API_BASE_URL (process.env):', process.env.HML_API_BASE_URL);
console.log('PROD_API_BASE_URL (process.env):', process.env.PROD_API_BASE_URL);
console.log('HML_API_LOGIN_URL (process.env):', process.env.HML_API_LOGIN_URL);
console.log('PROD_API_LOGIN_URL (process.env):', process.env.PROD_API_LOGIN_URL);
// Credenciais de API e Banco de Dados foram removidas dos logs por segurança.
// console.log('HML_API_USERNAME (process.env):', process.env.HML_API_USERNAME); // Removido
// console.log('HOMOLOG_DB_USER (process.env):', process.env.HOMOLOG_DB_USER); // Removido
console.log('--- FIM DA VERIFICAÇÃO (process.env) ---');
// --- FIM DA DEPURAÇÃO DE VARIÁVEIS DE AMBIENTE ---


export default defineConfig({
  e2e: {
    specPattern: "**/*.feature", // Define que os arquivos de feature serão os specs
    async setupNodeEvents(on, config) {
      // Configuração do @badeball/cypress-cucumber-preprocessor
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [
            createEsbuildPlugin(config, {
              // Adiciona explicitamente o loader para arquivos .js
              // Isso garante que o esbuild não tente interpretar JSX em arquivos .js
              loader: { '.js': 'js' },
            }),
          ],
        })
      );

      // --- Configurações de Ambiente ---
      // Define o ambiente padrão como 'homolog' se não for especificado via Cypress.env.ambiente
      const ambienteAtual = config.env.ambiente || 'homolog';

      // Configurações de API
      const apiBaseUrlHomolog = process.env.HML_API_BASE_URL;
      const apiBaseUrlProd = process.env.PROD_API_BASE_URL;

      // Define o baseUrl do Cypress com base no ambiente atual
      config.baseUrl = ambienteAtual === 'prod' ? apiBaseUrlProd : apiBaseUrlHomolog;

      // Expõe variáveis de ambiente para acesso via Cypress.env() nos testes
      config.env.HML_API_USERNAME = process.env.HML_API_USERNAME;
      config.env.HML_API_PASSWORD = process.env.HML_API_PASSWORD;
      config.env.PROD_API_USERNAME = process.env.PROD_API_USERNAME;
      config.env.PROD_API_PASSWORD = process.env.PROD_API_PASSWORD;
      config.env.ambiente = ambienteAtual; // Garante que o ambiente atual esteja disponível nos testes

      // NOVAS VARIÁVEIS DE AMBIENTE PARA LOGIN UI
      config.env.HML_API_LOGIN_URL = process.env.HML_API_LOGIN_URL;
      config.env.PROD_API_LOGIN_URL = process.env.PROD_API_LOGIN_URL;

      // --- ADIÇÃO CRÍTICA: EXPOR AS BASE_URLS PARA Cypress.env() ---
      config.env.HML_API_BASE_URL = process.env.HML_API_BASE_URL;
      config.env.PROD_API_BASE_URL = process.env.PROD_API_BASE_URL;
      // --- FIM DA ADIÇÃO CRÍTICA ---


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
            // Mantido console.error pois é uma falha crítica na configuração do ambiente Node.js
            console.error(
              `Credenciais de banco de dados incompletas para o ambiente ${env}. Verifique seu arquivo .env.`
            );
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
        async consultarSql(args) {
          const { query, ambiente } = args;
          const result = await runSql(query, ambiente);
          return result.recordset;
        },

        async executarSql(args) {
          const { query, ambiente } = args;
          return runSql(query, ambiente);
        },

        lerJsonSeExistir(args) {
          const { caminhoArquivo } = args || {};
          if (!caminhoArquivo) return null;

          const caminhoCompleto = path.isAbsolute(caminhoArquivo)
            ? caminhoArquivo
            : path.join(process.cwd(), caminhoArquivo);

          if (!fs.existsSync(caminhoCompleto)) return null;

          const conteudoBruto = fs.readFileSync(caminhoCompleto, 'utf8');
          if (!conteudoBruto || !conteudoBruto.trim()) return [];

          return JSON.parse(conteudoBruto);
        },

        escreverJson(args) {
          const { caminhoArquivo, dados } = args || {};
          if (!caminhoArquivo) {
            console.error('Caminho do arquivo não fornecido para escreverJson.');
            return false;
          }
          const caminhoCompleto = path.isAbsolute(caminhoArquivo)
            ? caminhoArquivo
            : path.join(process.cwd(), caminhoArquivo);

          try {
            // --- NOVO LOG DE DEPURAÇÃO ---
            console.log(`[Task escreverJson] Tentando escrever no arquivo: ${caminhoCompleto}`);
            console.log(`[Task escreverJson] Dados a serem escritos:`, JSON.stringify(dados, null, 2));
            // --- FIM DO LOG DE DEPURAÇÃO ---

            const dir = path.dirname(caminhoCompleto);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(caminhoCompleto, JSON.stringify(dados, null, 2), 'utf8');
            return true;
          } catch (error) {
            console.error(`Erro ao escrever JSON no arquivo ${caminhoCompleto}:`, error);
            return false;
          }
        },

        removerPasta(args) {
          const { path: dirPath } = args;
          if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            return true;
          }
          return false;
        },
      });

      return config;
    },
  },
});