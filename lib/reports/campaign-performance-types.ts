export type CampaignPerformanceGroupBy = 'source' | 'campaign' | 'content'

export type CampaignPerformanceRow = {
  key: string
  label: string
  source: string
  medium: string
  campaign: string | null
  content: string | null
  visits: number
  uniqueVisitors: number
  applicationPageVisits: number
  otpStarts: number
  applications: number
  drafts: number
  submitted: number
  inReview: number
  changesRequested: number
  resubmitted: number
  approved: number
  rejected: number
  withdrawn: number
  visitToApplicationRate: number
  applicationToSubmissionRate: number
  submissionToApprovalRate: number
}
export type CampaignPerformanceSummary = Omit<
  CampaignPerformanceRow,
  'key' | 'label' | 'source' | 'medium' | 'campaign' | 'content'
>

export type CampaignPerformanceData = {
  groupBy: CampaignPerformanceGroupBy
  startAt: string
  endAt: string
  summary: CampaignPerformanceSummary
  rows: CampaignPerformanceRow[]
}
