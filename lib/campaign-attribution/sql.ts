import { sql, type SQL, type SQLWrapper } from 'drizzle-orm'

/**
 * Sets a milestone timestamp once using the database clock.
 *
 * JavaScript Date values embedded directly in a raw `sql` template do not pass
 * through Drizzle's timestamp column encoder. Using CURRENT_TIMESTAMP keeps the
 * expression parameter-free and preserves the first recorded milestone.
 */
export function preserveFirstRecordedTimestamp(column: SQLWrapper): SQL {
  return sql`coalesce(${column}, current_timestamp)`
}
