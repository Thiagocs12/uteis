const { defineConfig } = require('cypress')
require('dotenv').config()
const sql = require('mssql')

function getDbConfig(env) {
  const configs = {
    hml: {
      user: process.env.HOMOLOG_DB_USER,
      password: process.env.HOMOLOG_DB_PASS,
      server: process.env.HOMOLOG_DB_HOST,
      database: process.env.HOMOLOG_DB_NAME,
      port: Number(process.env.HOMOLOG_DB_PORT),
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    prod: {
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASS,
      server: process.env.PROD_DB_HOST,
      database: process.env.PROD_DB_NAME,
      port: Number(process.env.PROD_DB_PORT),
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    }
  }

  if (!configs[env]) {
    throw new Error(`Ambiente inválido: ${env}`)
  }

  return configs[env]
}

async function queryDB({ env, sqlQuery }) {
  const pool = await sql.connect(getDbConfig(env))
  const result = await pool.request().query(sqlQuery)
  await pool.close()
  return result.recordset
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        queryDB({ env, sql }) {
          return queryDB({ env, sqlQuery: sql })
        }
      })
    }
  }
})
