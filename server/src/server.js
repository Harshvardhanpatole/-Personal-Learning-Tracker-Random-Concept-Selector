import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

async function start() {
  await pool.query('SELECT 1');
  app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}`));
}

start().catch((error) => { console.error('Unable to start server:', error.message); process.exit(1); });
