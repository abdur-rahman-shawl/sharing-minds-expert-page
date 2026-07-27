import { describe, expect, it } from 'vitest'

import type { CampaignPerformanceData } from './campaign-performance-types'
import {
  publicCampaignPerformanceRequestSchema,
  toPublicCampaignPerformanceData,
} from './public-campaign-performance'

const performance: CampaignPerformanceData = {
  groupBy: 'content',
  startAt: '2026-07-01T00:00:00.000Z',
  endAt: '2026-07-08T00:00:00.000Z',
  summary: {
    visits: 20,
    uniqueVisitors: 18,
    applicationPageVisits: 12,
    otpStarts: 8,
    applications: 5,
    drafts: 2,
    submitted: 3,
    inReview: 1,
    changesRequested: 0,
    resubmitted: 0,
    approved: 1,
    rejected: 1,
    withdrawn: 0,
    visitToApplicationRate: 25,
    applicationToSubmissionRate: 60,
    submissionToApprovalRate: 33.33,
  },
  rows: [
    {
      key: 'linkedin|paid_social|expert_signup|normal_post',
      label: 'linkedin / paid_social / expert_signup / normal_post',
      source: 'linkedin',
      medium: 'paid_social',
      campaign: 'expert_signup',
      content: 'normal_post',
      visits: 20,
      uniqueVisitors: 18,
      applicationPageVisits: 12,
      otpStarts: 8,
      applications: 5,
      drafts: 2,
      submitted: 3,
      inReview: 1,
      changesRequested: 0,
      resubmitted: 0,
      approved: 1,
      rejected: 1,
      withdrawn: 0,
      visitToApplicationRate: 25,
      applicationToSubmissionRate: 60,
      submissionToApprovalRate: 33.33,
    },
  ],
}

describe('public campaign performance contract', () => {
  it('returns aggregate funnel KPIs without internal lifecycle fields', () => {
    const result = toPublicCampaignPerformanceData(
      performance,
      new Date('2026-07-08T01:00:00.000Z'),
    )

    expect(result.generatedAt).toBe('2026-07-08T01:00:00.000Z')
    expect(result.rows[0]).toMatchObject({
      source: 'linkedin',
      content: 'normal_post',
      visits: 20,
      applications: 5,
      submitted: 3,
      approved: 1,
    })
    expect(result.rows[0]).not.toHaveProperty('rejected')
    expect(result.rows[0]).not.toHaveProperty('inReview')
    expect(JSON.stringify(result)).not.toContain('visitorId')
    expect(JSON.stringify(result)).not.toContain('clickId')
  })

  it('accepts supported groupings and rejects a public range over 90 days', () => {
    expect(
      publicCampaignPerformanceRequestSchema.safeParse({
        startAt: '2026-07-01T00:00',
        endAt: '2026-07-08T00:00',
        groupBy: 'content',
      }).success,
    ).toBe(true)

    expect(
      publicCampaignPerformanceRequestSchema.safeParse({
        startAt: '2026-01-01T00:00',
        endAt: '2026-07-08T00:00',
        groupBy: 'source',
      }).success,
    ).toBe(false)
  })
})
