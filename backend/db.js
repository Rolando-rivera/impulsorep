const { Pool } = require('pg');
require('dotenv').config();

function parseBool(value) {
  if (value === undefined || value === null || value === '') return undefined;
  return String(value).toLowerCase() === 'true';
}

function buildSsl() {
  const explicit = parseBool(process.env.DATABASE_SSL);

  if (explicit === false) return false;
  if (process.env.DATABASE_URL) return { rejectUnauthorized: false };
  return explicit ? { rejectUnauthorized: false } : false;
}

function buildConfig() {
  const baseConfig = {
    ssl: buildSsl(),
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 10000),
  };

  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig,
      connectionString: process.env.DATABASE_URL,
    };
  }

  return {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ley_rep',
  };
}

const pool = new Pool(buildConfig());

pool.on('error', (error) => {
  console.error('Error inesperado del pool PostgreSQL:', error);
});

module.exports = pool;
