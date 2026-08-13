import { describe, expect, it } from 'vitest'
import { PgDialect } from 'drizzle-orm/pg-core'

import { campaignVisits } from '@/lib/db/schema/campaign-visits'
import { preserveFirstRecordedTimestamp } from './sql'

describe('campaign attribution SQL helpers', () => {
  it('uses the database clock without an unencoded JavaScript Date parameter', () => {
    const query = new PgDialect().sqlToQuery(
      preserveFirstRecordedTimestamp(campaignVisits.applicationViewedAt),
    )

    expect(query.sql).toBe(
      'coalesce("campaign_visits"."application_viewed_at", current_timestamp)',
    )
    expect(query.params).toEqual([])
  })
})
