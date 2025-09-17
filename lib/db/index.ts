import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
  ssl: 'require',
  prepare: false
});

export const db = drizzle(sql);
export * from './schema';
export * from './schema/email-verifications';