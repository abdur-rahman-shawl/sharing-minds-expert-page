import { sql } from 'drizzle-orm'
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const campaignVisits = pgTable(
  'campaign_visits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    visitorId: uuid('visitor_id').notNull(),
    channel: text('channel').default('DIRECT').notNull(),
    source: text('source').default('direct').notNull(),
    medium: text('medium').default('none').notNull(),
    campaign: text('campaign'),
    content: text('content'),
    term: text('term'),
    landingPath: text('landing_path').notNull(),
    referrerHost: text('referrer_host'),
    clickIdType: text('click_id_type'),
    clickId: text('click_id'),
    pageViewCount: integer('page_view_count').default(1).notNull(),
    applicationViewedAt: timestamp('application_viewed_at', { withTimezone: true }),
    otpRequestedAt: timestamp('otp_requested_at', { withTimezone: true }),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    startedAtIdx: index('campaign_visits_started_at_idx').on(table.startedAt),
    visitorStartedIdx: index('campaign_visits_visitor_started_idx').on(
      table.visitorId,
      table.startedAt,
    ),
    campaignStartedIdx: index('campaign_visits_campaign_started_idx').on(
      table.source,
      table.medium,
      table.campaign,
      table.startedAt,
    ),
    pageViewCountCheck: check(
      'campaign_visits_page_view_count_check',
      sql`${table.pageViewCount} > 0`,
    ),
    channelCheck: check(
      'campaign_visits_channel_check',
      sql`${table.channel} in (
        'DIRECT',
        'PAID',
        'EMAIL',
        'SOCIAL',
        'ORGANIC',
        'REFERRAL',
        'OTHER'
      )`,
    ),
    activityTimestampCheck: check(
      'campaign_visits_activity_timestamp_check',
      sql`${table.lastSeenAt} >= ${table.startedAt}`,
    ),
    sourceLengthCheck: check(
      'campaign_visits_source_length_check',
      sql`length(${table.source}) between 1 and 200`,
    ),
    mediumLengthCheck: check(
      'campaign_visits_medium_length_check',
      sql`length(${table.medium}) between 1 and 200`,
    ),
    landingPathCheck: check(
      'campaign_visits_landing_path_check',
      sql`left(${table.landingPath}, 1) = '/'
        and length(${table.landingPath}) between 1 and 500`,
    ),
  }),
)

export type CampaignVisit = typeof campaignVisits.$inferSelect
export type NewCampaignVisit = typeof campaignVisits.$inferInsert
