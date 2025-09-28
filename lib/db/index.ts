import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

let dbInstance: PostgresJsDatabase | null = null;
let clientInstance: Sql | null = null;

function initializeDatabase() {
  if (typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>).window) {
    throw new Error('Database connection cannot be used on client-side');
  }

  if (dbInstance && clientInstance) {
    return { db: dbInstance, client: clientInstance };
  }

  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (error) {
    // Environment variables should already be provided in production
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const connectionString = process.env.DATABASE_URL;
  clientInstance = postgres(connectionString, { prepare: false });
  dbInstance = drizzle(clientInstance);

  return { db: dbInstance, client: clientInstance };
}

const { db: database, client } = initializeDatabase();

export const db = database;
export { client };

export * from './schema';
