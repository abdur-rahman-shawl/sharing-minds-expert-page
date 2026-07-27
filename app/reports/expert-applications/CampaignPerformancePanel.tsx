'use client'

import {
  BadgeCheck,
  BarChart3,
  Eye,
  FilePenLine,
  KeyRound,
  Loader2,
  RefreshCw,
  Send,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  CampaignPerformanceData,
  CampaignPerformanceGroupBy,
} from '@/lib/reports/campaign-performance-types'

type CampaignPerformancePanelProps = {
  data: CampaignPerformanceData | null
  error: string | null
  isLoading: boolean
  groupBy: CampaignPerformanceGroupBy
  onGroupByChange: (groupBy: CampaignPerformanceGroupBy) => void
  onRefresh: () => void
}

function MetricCard(props: {
  label: string
  value: number | string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const Icon = props.icon
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600">{props.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {props.value}
          </p>
        </div>
        <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{props.description}</p>
    </div>
  )
}

function Percent({ value }: { value: number }) {
  return (
    <span className="font-semibold tabular-nums text-slate-900">
      {value.toLocaleString('en-IN', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 2,
      })}
      %
    </span>
  )
}

export default function CampaignPerformancePanel({
  data,
  error,
  isLoading,
  groupBy,
  onGroupByChange,
  onRefresh,
}: CampaignPerformancePanelProps) {
  return (
    <section
      aria-labelledby="campaign-performance-title"
      className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur-xl"
    >
      <div className="border-b border-slate-200 px-6 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">
                Acquisition funnel
              </p>
            </div>
            <h2
              id="campaign-performance-title"
              className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-3xl"
            >
              Campaign performance
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Visits are grouped by acquisition date and followed through the
              application&apos;s current status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
              <span className="block">Compare by</span>
              <select
                value={groupBy}
                onChange={event =>
                  onGroupByChange(
                    event.target.value as CampaignPerformanceGroupBy,
                  )
                }
                disabled={isLoading}
                className="h-11 min-w-44 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="source">Source and medium</option>
                <option value="campaign">Campaign</option>
                <option value="content">Creative/content</option>
              </select>
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-11 rounded-xl border-slate-300 px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            {error}
          </div>
        ) : null}

        {!data && !error ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            {isLoading ? (
              <>
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-700" />
                <p className="mt-3 font-semibold text-slate-700">
                  Loading campaign insights…
                </p>
              </>
            ) : (
              <>
                <BarChart3 className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-semibold text-slate-800">
                  Select a date range and load campaign insights.
                </p>
              </>
            )}
          </div>
        ) : null}

        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Visits"
                value={data.summary.visits.toLocaleString('en-IN')}
                description={`${data.summary.uniqueVisitors.toLocaleString(
                  'en-IN',
                )} unique visitors`}
                icon={Users}
              />
              <MetricCard
                label="Application views"
                value={data.summary.applicationPageVisits.toLocaleString('en-IN')}
                description={`${data.summary.otpStarts.toLocaleString(
                  'en-IN',
                )} OTP starts`}
                icon={Eye}
              />
              <MetricCard
                label="Applications"
                value={data.summary.applications.toLocaleString('en-IN')}
                description={`${data.summary.drafts.toLocaleString(
                  'en-IN',
                )} currently in draft`}
                icon={FilePenLine}
              />
              <MetricCard
                label="Submitted"
                value={data.summary.submitted.toLocaleString('en-IN')}
                description={`${data.summary.approved.toLocaleString(
                  'en-IN',
                )} approved experts`}
                icon={Send}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Visit → application"
                value={`${data.summary.visitToApplicationRate}%`}
                description="Applications created from recorded visits"
                icon={KeyRound}
              />
              <MetricCard
                label="Application → submission"
                value={`${data.summary.applicationToSubmissionRate}%`}
                description="Applications submitted at least once"
                icon={Send}
              />
              <MetricCard
                label="Submission → approval"
                value={`${data.summary.submissionToApprovalRate}%`}
                description="Submitted applications currently approved"
                icon={BadgeCheck}
              />
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="px-4 py-3.5 font-semibold">Acquisition</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Visits</th>
                      <th className="px-4 py-3.5 text-right font-semibold">App views</th>
                      <th className="px-4 py-3.5 text-right font-semibold">OTP</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Applications</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Drafts</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Submitted</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Approved</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Visit → app</th>
                      <th className="px-4 py-3.5 text-right font-semibold">App → submit</th>
                      <th className="px-4 py-3.5 text-right font-semibold">Submit → approve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.rows.map(row => (
                      <tr key={row.key} className="transition-colors hover:bg-blue-50/40">
                        <td className="max-w-72 px-4 py-4">
                          <p className="font-semibold text-slate-950">
                            {row.campaign && row.campaign !== '(not set)'
                              ? row.campaign
                              : row.source}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {[row.source, row.medium, row.content]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">{row.visits}</td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.applicationPageVisits}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">{row.otpStarts}</td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums">
                          {row.applications}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">{row.drafts}</td>
                        <td className="px-4 py-4 text-right tabular-nums">{row.submitted}</td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums text-emerald-700">
                          {row.approved}
                        </td>
                        <td className="px-4 py-4 text-right"><Percent value={row.visitToApplicationRate} /></td>
                        <td className="px-4 py-4 text-right"><Percent value={row.applicationToSubmissionRate} /></td>
                        <td className="px-4 py-4 text-right"><Percent value={row.submissionToApprovalRate} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.rows.length === 0 ? (
                <div className="bg-white px-6 py-12 text-center text-sm text-slate-500">
                  No campaign visits were recorded in this period.
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
