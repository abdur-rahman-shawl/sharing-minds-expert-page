import 'server-only'

import { z } from 'zod'

import type { CampaignPerformanceData } from './campaign-performance-types'
import {
  expertApplicationReportRequestSchema,
  parseIndiaDateTime,
} from './expert-application-report'
import type {
  PublicCampaignPerformanceData,
  PublicCampaignPerformanceRow,
} from './public-campaign-performance-types'

export const PUBLIC_CAMPAIGN_STATS_MAX_RANGE_DAYS = 90

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export const publicCampaignPerformanceRequestSchema =
  expertApplicationReportRequestSchema
    .and(
      z.object({
        groupBy: z.enum(['source', 'campaign', 'content']).default('source'),
      }),
    )
    .superRefine((value, context) => {
      const startAt = parseIndiaDateTime(value.startAt)
      const endAt = parseIndiaDateTime(value.endAt)
      if (!startAt || !endAt) return

      if (
        endAt.getTime() - startAt.getTime() >
        PUBLIC_CAMPAIGN_STATS_MAX_RANGE_DAYS * MILLISECONDS_PER_DAY
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endAt'],
          message: `Select a range of ${PUBLIC_CAMPAIGN_STATS_MAX_RANGE_DAYS} days or less`,
        })
      }
    })

function publicKpis(
  input: CampaignPerformanceData['summary'],
): PublicCampaignPerformanceData['summary'] {
  return {
    visits: input.visits,
    uniqueVisitors: input.uniqueVisitors,
    applicationPageVisits: input.applicationPageVisits,
    otpStarts: input.otpStarts,
    applications: input.applications,
    drafts: input.drafts,
    submitted: input.submitted,
    approved: input.approved,
    visitToApplicationRate: input.visitToApplicationRate,
    applicationToSubmissionRate: input.applicationToSubmissionRate,
    submissionToApprovalRate: input.submissionToApprovalRate,
  }
}

function publicRow(
  input: CampaignPerformanceData['rows'][number],
): PublicCampaignPerformanceRow {
  return {
    key: input.key,
    label: input.label,
    source: input.source,
    medium: input.medium,
    campaign: input.campaign,
    content: input.content,
    ...publicKpis(input),
  }
}

export function toPublicCampaignPerformanceData(
  input: CampaignPerformanceData,
  generatedAt = new Date(),
): PublicCampaignPerformanceData {
  return {
    groupBy: input.groupBy,
    startAt: input.startAt,
    endAt: input.endAt,
    generatedAt: generatedAt.toISOString(),
    summary: publicKpis(input.summary),
    rows: input.rows.map(publicRow),
  }
}
