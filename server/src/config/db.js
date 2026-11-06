import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (error) => console.error('Unexpected PostgreSQL client error', error));
