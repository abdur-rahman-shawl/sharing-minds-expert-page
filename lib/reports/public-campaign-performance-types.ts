import type {
  CampaignPerformanceGroupBy,
  CampaignPerformanceRow,
  CampaignPerformanceSummary,
} from './campaign-performance-types'

type PublicCampaignKpis = Pick<
  CampaignPerformanceSummary,
  | 'visits'
  | 'uniqueVisitors'
  | 'applicationPageVisits'
  | 'otpStarts'
  | 'applications'
  | 'drafts'
  | 'submitted'
  | 'approved'
  | 'visitToApplicationRate'
  | 'applicationToSubmissionRate'
  | 'submissionToApprovalRate'
>

export type PublicCampaignPerformanceRow = PublicCampaignKpis &
  Pick<
    CampaignPerformanceRow,
    'key' | 'label' | 'source' | 'medium' | 'campaign' | 'content'
  >

export type PublicCampaignPerformanceData = {
  groupBy: CampaignPerformanceGroupBy
  startAt: string
  endAt: string
  generatedAt: string
  summary: PublicCampaignKpis
  rows: PublicCampaignPerformanceRow[]
}
