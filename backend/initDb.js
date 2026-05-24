const fs = require('fs');
const path = require('path');
const pool = require('./db');

function shouldInitDatabase() {
  const value = process.env.DATABASE_INIT;
  if (value === undefined || value === null || value === '') return true;
  return String(value).toLowerCase() !== 'false';
}

async function initDatabase() {
  if (!shouldInitDatabase()) {
    console.log('DATABASE_INIT=false. Se omite inicialización automática de la base de datos.');
    await pool.end();
    return;
  }

  const client = await pool.connect();

  try {
    const check = await client.query("SELECT to_regclass('public.roles') AS roles_table");

    if (check.rows[0]?.roles_table) {
      console.log('Base de datos ya inicializada. No se ejecuta el script SQL.');
      return;
    }

    const sqlPath = path.join(__dirname, '..', 'sql', '01_ley_rep_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Inicializando base de datos Impulso REP...');
    await client.query(sql);
    console.log('Base de datos inicializada correctamente.');
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch((error) => {
  console.error('Error inicializando la base de datos:', error);
  process.exit(1);
});
