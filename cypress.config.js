const { defineConfig } = require('cypress')
require('dotenv').config()
const sql = require('mssql')
const fs = require('fs')
const path = require('path')

/**
 * Recupera variável por ambiente
 * Ex: get('DB_HOST', 'DEV') → DB_HOST_DEV
 */
const get = (key, env) => process.env[`${key}_${env}`]

/**
 * Monta config de banco por ambiente
 */
const buildDbConfig = (env) => ({
  server: get('DB_HOST', env),
  port: Number(get('DB_PORT', env)),
  user: get('DB_USER', env),
  password: get('DB_PASS', env),
  database: get('DB_NAME', env),
  options: {
    encrypt: get('DB_ENCRYPT', env) === 'true',
    trustServerCertificate: get('DB_TRUST_SERVER_CERT', env) === 'true'
  }
})

module.exports = defineConfig({
  e2e: {
    /**
     * Variáveis acessíveis via Cypress.env()
     */
    env: {
      ENV_EXEC: process.env.ENV_EXEC || 'DEV',

      PROD: {
        BASE_URL: get('BASE_URL', 'PROD'),
        KEYCLOAK_URL: get('KEYCLOAK_URL', 'PROD')
      },

      DEV: {
        BASE_URL: get('BASE_URL', 'DEV'),
        KEYCLOAK_URL: get('KEYCLOAK_URL', 'DEV')
      },

      APP_USER: process.env.APP_USER,
      APP_PASS: process.env.APP_PASS
    },

    /**
     * Tasks Node (infra)
     */
    setupNodeEvents(on) {
      on('task', {

        /**
         * Executa query em qualquer ambiente (DEV | PROD)
         */
        'db:exec': async ({ sql: query, params, env }) => {
          if (!env) {
            throw new Error('Ambiente não informado (DEV ou PROD)')
          }

          const pool = await sql.connect(buildDbConfig(env))
          const request = pool.request()

          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              request.input(key, value)
            })
          }

          const result = await request.query(query)
          await pool.close()

          return result
        },

        /**
         * Salva qualquer payload em arquivo (responsabilidade única)
         */
        'file:save': ({ filename, data }) => {
          const dir = path.join(__dirname, 'cypress', 'exports')

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }

          const filePath = path.join(dir, filename)
          fs.writeFileSync(
            filePath,
            JSON.stringify(data, null, 2),
            'utf-8'
          )

          return filePath
        }

      })
    }
  }
})
