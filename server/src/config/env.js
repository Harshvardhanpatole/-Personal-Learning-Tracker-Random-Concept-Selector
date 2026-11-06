import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env') });

const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key] && process.env.NODE_ENV === 'production') {
    throw new Error(`${key} must be configured.`);
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/personal_learning_tracker',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me-before-production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieName: process.env.COOKIE_NAME || 'learning_tracker_token',
  seedProjects: process.env.CREATE_SAMPLE_PROJECTS !== 'false',
};
