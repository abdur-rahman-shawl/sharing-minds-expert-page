import { describe, expect, it } from 'vitest'

import type { CampaignVisit } from '@/lib/db/schema'
import {
  buildCampaignPerformanceData,
  type CampaignPerformanceApplication,
} from './campaign-performance'

const startAt = new Date('2026-07-01T00:00:00.000Z')
const endAt = new Date('2026-08-01T00:00:00.000Z')

function visit(
  id: string,
  input: Partial<CampaignVisit> & Pick<CampaignVisit, 'visitorId' | 'source'>,
): CampaignVisit {
  return {
    id,
    visitorId: input.visitorId,
    channel: input.channel || 'PAID',
    source: input.source,
    medium: input.medium || 'paid_social',
    campaign: input.campaign || 'founding_experts',
    content: input.content || null,
    term: input.term || null,
    landingPath: input.landingPath || '/verified-experts',
    referrerHost: input.referrerHost || null,
    clickIdType: input.clickIdType || null,
    clickId: input.clickId || null,
    pageViewCount: input.pageViewCount || 1,
    applicationViewedAt:
      input.applicationViewedAt === undefined ? startAt : input.applicationViewedAt,
    otpRequestedAt:
      input.otpRequestedAt === undefined ? startAt : input.otpRequestedAt,
    startedAt: input.startedAt || startAt,
    lastSeenAt: input.lastSeenAt || startAt,
    createdAt: input.createdAt || startAt,
    updatedAt: input.updatedAt || startAt,
  }
}

describe('campaign performance aggregation', () => {
  it('counts visits once while following every attributed application to its current status', () => {
    const visits = [
      visit('11111111-1111-4111-8111-111111111111', {
        visitorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        source: 'linkedin',
        content: 'video_a',
      }),
      visit('22222222-2222-4222-8222-222222222222', {
        visitorId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        source: 'linkedin',
        content: 'video_b',
        otpRequestedAt: null,
      }),
      visit('33333333-3333-4333-8333-333333333333', {
        visitorId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        source: 'google',
        medium: 'cpc',
        campaign: 'expert_search',
      }),
    ]
    const applications: CampaignPerformanceApplication[] = [
      {
        id: 'application-1',
        attributionVisitId: visits[0].id,
        status: 'DRAFT',
        submittedAt: null,
      },
      {
        id: 'application-2',
        attributionVisitId: visits[0].id,
        status: 'APPROVED',
        submittedAt: new Date('2026-07-05T00:00:00.000Z'),
      },
      {
        id: 'application-3',
        attributionVisitId: visits[2].id,
        status: 'SUBMITTED',
        submittedAt: new Date('2026-07-06T00:00:00.000Z'),
      },
    ]

    const result = buildCampaignPerformanceData({
      visits,
      applications,
      groupBy: 'campaign',
      startAt,
      endAt,
    })

    expect(result.summary).toMatchObject({
      visits: 3,
      uniqueVisitors: 3,
      otpStarts: 2,
      applications: 3,
      drafts: 1,
      submitted: 2,
      approved: 1,
      visitToApplicationRate: 100,
      applicationToSubmissionRate: 66.67,
      submissionToApprovalRate: 50,
    })

    const linkedin = result.rows.find(row => row.source === 'linkedin')
    expect(linkedin).toMatchObject({
      visits: 2,
      applications: 2,
      drafts: 1,
      submitted: 1,
      approved: 1,
      visitToApplicationRate: 100,
      applicationToSubmissionRate: 50,
      submissionToApprovalRate: 100,
    })
  })

  it('can split one campaign into separate creative rows', () => {
    const visits = [
      visit('11111111-1111-4111-8111-111111111111', {
        visitorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        source: 'linkedin',
        content: 'video_a',
      }),
      visit('22222222-2222-4222-8222-222222222222', {
        visitorId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        source: 'linkedin',
        content: 'video_b',
      }),
    ]

    const result = buildCampaignPerformanceData({
      visits,
      applications: [],
      groupBy: 'content',
      startAt,
      endAt,
    })

    expect(result.rows.map(row => row.content)).toEqual(['video_a', 'video_b'])
  })
})
