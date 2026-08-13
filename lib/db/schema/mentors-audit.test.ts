import { getTableColumns } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'

import { mentorsProfileAudit } from './mentors-audit'

describe('mentors profile audit schema contract', () => {
  it('matches the shared PostgreSQL audit table used by finalization', () => {
    const columns = getTableColumns(mentorsProfileAudit)

    expect(columns.userId.name).toBe('user_id')
    expect(columns.userId.notNull).toBe(true)
    expect(columns.previousData.notNull).toBe(true)
    expect(columns.updatedData.notNull).toBe(true)
    expect(columns.changedAt.columnType).toBe('PgTimestamp')
    expect(columns.changedAt.getSQLType()).toBe('timestamp with time zone')
    expect('changedBy' in columns).toBe(false)
  })
})
