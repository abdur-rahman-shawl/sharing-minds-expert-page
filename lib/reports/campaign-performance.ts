import 'server-only'

import { and, eq, gte, inArray, lt } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  campaignVisits,
  mentorApplications,
  mentors,
  type CampaignVisit,
} from '@/lib/db/schema'
import type {
  CampaignPerformanceData,
  CampaignPerformanceGroupBy,
  CampaignPerformanceRow,
  CampaignPerformanceSummary,
} from './campaign-performance-types'

export const CAMPAIGN_PERFORMANCE_MAX_VISITS = 100_000

export type CampaignPerformanceApplication = {
  id: string
  attributionVisitId: string | null
  status: string
  submittedAt: Date | null
}

export type {
  CampaignPerformanceData,
  CampaignPerformanceGroupBy,
  CampaignPerformanceRow,
  CampaignPerformanceSummary,
} from './campaign-performance-types'

export class CampaignPerformanceTooLargeError extends Error {
  constructor(public readonly maximumVisits: number) {
    super(
      `The selected range contains more than ${maximumVisits.toLocaleString(
        'en-IN',
      )} visits`,
    )
    this.name = 'CampaignPerformanceTooLargeError'
  }
}

type MutableCampaignPerformanceRow = Omit<
  CampaignPerformanceRow,
  | 'uniqueVisitors'
  | 'visitToApplicationRate'
  | 'applicationToSubmissionRate'
  | 'submissionToApprovalRate'
> & {
  visitorIds: Set<string>
}

function percentage(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return Math.round((numerator / denominator) * 10_000) / 100
}

function dimensionsForVisit(
  visit: CampaignVisit,
  groupBy: CampaignPerformanceGroupBy,
): Pick<
  CampaignPerformanceRow,
  'key' | 'label' | 'source' | 'medium' | 'campaign' | 'content'
> {
  const source = visit.source || 'direct'
  const medium = visit.medium || 'none'
  const campaign = groupBy === 'source' ? null : visit.campaign || '(not set)'
  const content = groupBy === 'content' ? visit.content || '(not set)' : null
  const parts = [source, medium]
  if (campaign) parts.push(campaign)
  if (content) parts.push(content)

  return {
    key: parts.join('|'),
    label: parts.join(' / '),
    source,
    medium,
    campaign,
    content,
  }
}

function createMutableRow(
  dimensions: ReturnType<typeof dimensionsForVisit>,
): MutableCampaignPerformanceRow {
  return {
    ...dimensions,
    visitorIds: new Set<string>(),
    visits: 0,
    applicationPageVisits: 0,
    otpStarts: 0,
    applications: 0,
    drafts: 0,
    submitted: 0,
    inReview: 0,
    changesRequested: 0,
    resubmitted: 0,
    approved: 0,
    rejected: 0,
    withdrawn: 0,
  }
}

function addApplication(
  row: MutableCampaignPerformanceRow,
  application: CampaignPerformanceApplication,
): void {
  row.applications += 1
  if (application.submittedAt) row.submitted += 1

  switch (application.status) {
    case 'DRAFT':
      row.drafts += 1
      break
    case 'IN_REVIEW':
      row.inReview += 1
      break
    case 'CHANGES_REQUESTED':
      row.changesRequested += 1
      break
    case 'RESUBMITTED':
      row.resubmitted += 1
      break
    case 'APPROVED':
      row.approved += 1
      break
    case 'REJECTED':
      row.rejected += 1
      break
    case 'WITHDRAWN':
      row.withdrawn += 1
      break
    default:
      break
  }
}

function finalizeRow(row: MutableCampaignPerformanceRow): CampaignPerformanceRow {
  return {
    key: row.key,
    label: row.label,
    source: row.source,
    medium: row.medium,
    campaign: row.campaign,
    content: row.content,
    visits: row.visits,
    uniqueVisitors: row.visitorIds.size,
    applicationPageVisits: row.applicationPageVisits,
    otpStarts: row.otpStarts,
    applications: row.applications,
    drafts: row.drafts,
    submitted: row.submitted,
    inReview: row.inReview,
    changesRequested: row.changesRequested,
    resubmitted: row.resubmitted,
    approved: row.approved,
    rejected: row.rejected,
    withdrawn: row.withdrawn,
    visitToApplicationRate: percentage(row.applications, row.visits),
    applicationToSubmissionRate: percentage(row.submitted, row.applications),
    submissionToApprovalRate: percentage(row.approved, row.submitted),
  }
}

export function buildCampaignPerformanceData(input: {
  visits: CampaignVisit[]
  applications: CampaignPerformanceApplication[]
  groupBy: CampaignPerformanceGroupBy
  startAt: Date
  endAt: Date
}): CampaignPerformanceData {
  const rows = new Map<string, MutableCampaignPerformanceRow>()
  const visitGroupKeys = new Map<string, string>()

  for (const visit of input.visits) {
    const dimensions = dimensionsForVisit(visit, input.groupBy)
    const row = rows.get(dimensions.key) || createMutableRow(dimensions)
    row.visits += 1
    row.visitorIds.add(visit.visitorId)
    if (visit.applicationViewedAt) row.applicationPageVisits += 1
    if (visit.otpRequestedAt) row.otpStarts += 1
    rows.set(dimensions.key, row)
    visitGroupKeys.set(visit.id, dimensions.key)
  }

  for (const application of input.applications) {
    if (!application.attributionVisitId) continue
    const groupKey = visitGroupKeys.get(application.attributionVisitId)
    const row = groupKey ? rows.get(groupKey) : null
    if (row) addApplication(row, application)
  }

  const finalizedRows = Array.from(rows.values())
    .map(finalizeRow)
    .sort(
      (left, right) =>
        right.applications - left.applications ||
        right.submitted - left.submitted ||
        right.visits - left.visits ||
        left.label.localeCompare(right.label),
    )

  const totalVisitorIds = new Set(input.visits.map(visit => visit.visitorId))
  const summaryMutable = createMutableRow({
    key: 'all',
    label: 'All traffic',
    source: 'all',
    medium: 'all',
    campaign: null,
    content: null,
  })
  summaryMutable.visits = input.visits.length
  summaryMutable.visitorIds = totalVisitorIds
  summaryMutable.applicationPageVisits = input.visits.filter(
    visit => visit.applicationViewedAt,
  ).length
  summaryMutable.otpStarts = input.visits.filter(visit => visit.otpRequestedAt).length
  for (const application of input.applications) {
    addApplication(summaryMutable, application)
  }
  const { key, label, source, medium, campaign, content, ...summary } =
    finalizeRow(summaryMutable)

  return {
    groupBy: input.groupBy,
    startAt: input.startAt.toISOString(),
    endAt: input.endAt.toISOString(),
    summary,
    rows: finalizedRows,
  }
}

export async function getCampaignPerformanceData(input: {
  startAt: Date
  endAt: Date
  groupBy: CampaignPerformanceGroupBy
}): Promise<CampaignPerformanceData> {
  const visits = await db
    .select()
    .from(campaignVisits)
    .where(
      and(
        gte(campaignVisits.startedAt, input.startAt),
        lt(campaignVisits.startedAt, input.endAt),
      ),
    )
    .limit(CAMPAIGN_PERFORMANCE_MAX_VISITS + 1)

  if (visits.length > CAMPAIGN_PERFORMANCE_MAX_VISITS) {
    throw new CampaignPerformanceTooLargeError(CAMPAIGN_PERFORMANCE_MAX_VISITS)
  }

  const applications: CampaignPerformanceApplication[] = []
  const visitIds = visits.map(visit => visit.id)
  const chunkSize = 5_000
  for (let index = 0; index < visitIds.length; index += chunkSize) {
    const chunk = visitIds.slice(index, index + chunkSize)
    const rows = await db
      .select({
        id: mentorApplications.id,
        attributionVisitId: mentorApplications.attributionVisitId,
        status: mentorApplications.status,
        submittedAt: mentorApplications.submittedAt,
      })
      .from(mentorApplications)
      .where(inArray(mentorApplications.attributionVisitId, chunk))
    applications.push(...rows)

    const liveMentors = await db
      .select({
        id: mentors.id,
        attributionVisitId: mentors.attributionVisitId,
        verificationStatus: mentors.verificationStatus,
        submittedAt: mentors.registrationSubmittedAt,
      })
      .from(mentors)
      .where(
        and(
          inArray(mentors.attributionVisitId, chunk),
          eq(mentors.registrationSource, 'LIVE_EXPERT_REGISTRATION'),
        ),
      )
    applications.push(
      ...liveMentors.map(mentor => ({
        id: mentor.id,
        attributionVisitId: mentor.attributionVisitId,
        submittedAt: mentor.submittedAt,
        status:
          mentor.verificationStatus === 'VERIFIED'
            ? 'APPROVED'
            : mentor.verificationStatus === 'REJECTED'
              ? 'REJECTED'
              : mentor.verificationStatus === 'RESUBMITTED'
                ? 'RESUBMITTED'
                : 'IN_REVIEW',
      })),
    )
  }

  return buildCampaignPerformanceData({
    visits,
    applications,
    groupBy: input.groupBy,
    startAt: input.startAt,
    endAt: input.endAt,
  })
}
