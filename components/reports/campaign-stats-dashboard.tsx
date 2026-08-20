'use client'

import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FilePenLine,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'

import { ReportDateTimePicker } from '@/components/reports/report-date-time-picker'
import { Button } from '@/components/ui/button'
import type { CampaignPerformanceGroupBy } from '@/lib/reports/campaign-performance-types'
import type {
  PublicCampaignPerformanceData,
  PublicCampaignPerformanceRow,
} from '@/lib/reports/public-campaign-performance-types'
import { toIndiaDateTimeValue } from '@/lib/reports/report-date-time'

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000
const AUTO_REFRESH_MILLISECONDS = 60 * 1000

const GROUP_LABELS: Record<CampaignPerformanceGroupBy, string> = {
  source: 'Source and medium',
  campaign: 'Campaign',
  content: 'Ad variation',
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

function Percentage({ value }: { value: number }) {
  return (
    <span className="font-semibold tabular-nums text-slate-950">
      {value.toLocaleString('en-IN', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 2,
      })}
      %
    </span>
  )
}

function formatGeneratedAt(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

function acquisitionTitle(
  row: PublicCampaignPerformanceRow,
  groupBy: CampaignPerformanceGroupBy,
): string {
  if (groupBy === 'content') return row.content || '(not set)'
  if (groupBy === 'campaign') return row.campaign || '(not set)'
  return row.source
}

function acquisitionSubtitle(
  row: PublicCampaignPerformanceRow,
  groupBy: CampaignPerformanceGroupBy,
): string {
  if (groupBy === 'content') {
    return `${row.source} · ${row.campaign || '(not set)'}`
  }
  if (groupBy === 'campaign') return `${row.source} · ${row.medium}`
  return row.medium
}

export default function CampaignStatsDashboard() {
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [groupBy, setGroupBy] =
    useState<CampaignPerformanceGroupBy>('content')
  const [data, setData] = useState<PublicCampaignPerformanceData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const requestSequence = useRef(0)

  const validationError = useCallback((): string | null => {
    if (!startAt || !endAt) return 'Select both the start and end date and time.'

    const start = new Date(`${startAt}:00+05:30`)
    const end = new Date(`${endAt}:00+05:30`)
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return 'The end date and time must be later than the start.'
    }
    if (end.getTime() - start.getTime() > 90 * DAY_MILLISECONDS) {
      return 'Select a range of 90 days or less.'
    }
    return null
  }, [endAt, startAt])

  const loadStats = useCallback(
    async (nextGroupBy: CampaignPerformanceGroupBy = groupBy) => {
      const rangeError = validationError()
      if (rangeError) {
        setError(rangeError)
        return
      }

      const sequence = requestSequence.current + 1
      requestSequence.current = sequence
      setIsLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams({
          startAt,
          endAt,
          groupBy: nextGroupBy,
        })
        const response = await fetch(
          `/api/public/campaign-performance?${query.toString()}`,
        )
        const payload = (await response.json().catch(() => null)) as {
          success?: boolean
          error?: string
          data?: PublicCampaignPerformanceData
        } | null

        if (!response.ok || payload?.success !== true || !payload.data) {
          throw new Error(payload?.error || 'Campaign stats could not be loaded.')
        }
        if (requestSequence.current === sequence) setData(payload.data)
      } catch (requestError) {
        if (requestSequence.current !== sequence) return
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Campaign stats could not be loaded.',
        )
      } finally {
        if (requestSequence.current === sequence) setIsLoading(false)
      }
    },
    [endAt, groupBy, startAt, validationError],
  )

  useEffect(() => {
    const end = new Date()
    end.setSeconds(0, 0)
    setEndAt(toIndiaDateTimeValue(end))
    setStartAt(toIndiaDateTimeValue(new Date(end.getTime() - 7 * DAY_MILLISECONDS)))
  }, [])

  useEffect(() => {
    if (!startAt || !endAt || data) return
    void loadStats()
  }, [data, endAt, loadStats, startAt])

  useEffect(() => {
    if (!startAt || !endAt) return
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadStats()
    }, AUTO_REFRESH_MILLISECONDS)
    return () => window.clearInterval(interval)
  }, [endAt, loadStats, startAt])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void loadStats()
  }

  function setPreset(days: number) {
    const end = new Date()
    end.setSeconds(0, 0)
    setEndAt(toIndiaDateTimeValue(end))
    setStartAt(toIndiaDateTimeValue(new Date(end.getTime() - days * DAY_MILLISECONDS)))
    setData(null)
  }

  function changeGroupBy(nextGroupBy: CampaignPerformanceGroupBy) {
    setGroupBy(nextGroupBy)
    void loadStats(nextGroupBy)
  }

  const leadingRows = data?.rows.slice(0, 6) || []
  const maximumApplications = Math.max(
    1,
    ...leadingRows.map(row => row.applications),
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-100/70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-300/60 sm:px-9 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-cyan-300">
                <Activity className="h-5 w-5" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-[0.22em]">
                  Live acquisition dashboard
                </p>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Campaign performance, without the spreadsheet.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Compare traffic, expert applications, submissions, and approvals
                across UTM sources, campaigns, or individual ad variations.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Live data</p>
                  <p className="text-xs text-slate-400">
                    Refreshes every 60 seconds
                  </p>
                </div>
              </div>
              <Link
                href="/reports/expert-applications/download"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download applications
              </Link>
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="relative -mt-3 rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-7"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.75fr_auto] lg:items-end">
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              <span className="block">From</span>
              <ReportDateTimePicker
                id="campaign-stats-start"
                value={startAt}
                onChange={value => {
                  setStartAt(value)
                  setData(null)
                }}
                disabled={isLoading}
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              <span className="block">To</span>
              <ReportDateTimePicker
                id="campaign-stats-end"
                value={endAt}
                onChange={value => {
                  setEndAt(value)
                  setData(null)
                }}
                disabled={isLoading}
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              <span className="block">Compare by</span>
              <select
                value={groupBy}
                onChange={event =>
                  changeGroupBy(
                    event.target.value as CampaignPerformanceGroupBy,
                  )
                }
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="source">Source and medium</option>
                <option value="campaign">Campaign</option>
                <option value="content">Ad variation</option>
              </select>
            </label>
            <Button
              type="submit"
              disabled={isLoading || !startAt || !endAt}
              className="h-12 rounded-xl bg-blue-700 px-6 font-bold text-white hover:bg-blue-800"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Update
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quick range
            </span>
            {[
              { label: '24 hours', days: 1 },
              { label: '7 days', days: 7 },
              { label: '30 days', days: 30 },
              { label: '90 days', days: 90 },
            ].map(preset => (
              <button
                key={preset.days}
                type="button"
                disabled={isLoading}
                onClick={() => setPreset(preset.days)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
            <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              Times shown in IST
            </span>
          </div>
        </form>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-900"
          >
            {error}
          </div>
        ) : null}

        {!data && isLoading ? (
          <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-700" />
            <p className="mt-4 font-semibold text-slate-700">
              Loading live campaign stats…
            </p>
          </div>
        ) : null}

        {data ? (
          <main className="mt-6 space-y-6">
            <section aria-labelledby="kpi-summary-title">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                    Selected period
                  </p>
                  <h2
                    id="kpi-summary-title"
                    className="mt-1 text-2xl font-semibold tracking-tight text-slate-950"
                  >
                    Funnel overview
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Last updated {formatGeneratedAt(data.generatedAt)} IST
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Visits"
                  value={data.summary.visits.toLocaleString('en-IN')}
                  detail={`${data.summary.uniqueVisitors.toLocaleString(
                    'en-IN',
                  )} unique visitors`}
                  icon={Users}
                />
                <MetricCard
                  label="Application views"
                  value={data.summary.applicationPageVisits.toLocaleString('en-IN')}
                  detail={`${data.summary.otpStarts.toLocaleString(
                    'en-IN',
                  )} started email verification`}
                  icon={Eye}
                />
                <MetricCard
                  label="Applications"
                  value={data.summary.applications.toLocaleString('en-IN')}
                  detail={`${data.summary.drafts.toLocaleString(
                    'en-IN',
                  )} currently in draft`}
                  icon={FilePenLine}
                />
                <MetricCard
                  label="Submitted"
                  value={data.summary.submitted.toLocaleString('en-IN')}
                  detail={`${data.summary.approved.toLocaleString(
                    'en-IN',
                  )} approved experts`}
                  icon={Send}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <MetricCard
                  label="Visit → application"
                  value={`${data.summary.visitToApplicationRate}%`}
                  detail="Recorded visits that became applications"
                  icon={ArrowRight}
                />
                <MetricCard
                  label="Application → submission"
                  value={`${data.summary.applicationToSubmissionRate}%`}
                  detail="Applications submitted at least once"
                  icon={Sparkles}
                />
                <MetricCard
                  label="Submission → approval"
                  value={`${data.summary.submissionToApprovalRate}%`}
                  detail="Submitted applications currently approved"
                  icon={CheckCircle2}
                />
              </div>
            </section>

            <section
              aria-labelledby="performance-ranking-title"
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="performance-ranking-title"
                    className="text-xl font-semibold text-slate-950"
                  >
                    Top performance by {GROUP_LABELS[groupBy].toLowerCase()}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ranked by applications created from each acquisition group.
                  </p>
                </div>
              </div>

              {leadingRows.length > 0 ? (
                <div className="mt-7 space-y-5">
                  {leadingRows.map((row, index) => (
                    <div
                      key={row.key}
                      className="grid gap-2 sm:grid-cols-[2rem_minmax(10rem,0.7fr)_1fr_auto] sm:items-center sm:gap-4"
                    >
                      <span className="text-sm font-bold tabular-nums text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {acquisitionTitle(row, groupBy)}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {acquisitionSubtitle(row, groupBy)}
                        </p>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400"
                          style={{
                            width: `${Math.max(
                              row.applications > 0 ? 4 : 0,
                              (row.applications / maximumApplications) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="min-w-24 text-right text-sm font-semibold tabular-nums text-slate-700">
                        {row.applications.toLocaleString('en-IN')} applications
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <BarChart3 className="mx-auto h-7 w-7 text-slate-400" />
                  <p className="mt-3 font-semibold text-slate-700">
                    No campaign activity was recorded in this period.
                  </p>
                </div>
              )}
            </section>

            <section
              aria-labelledby="comparison-table-title"
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <h2
                  id="comparison-table-title"
                  className="text-xl font-semibold text-slate-950"
                >
                  Full comparison
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Every KPI is aggregated; no applicant details are shown.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        {GROUP_LABELS[groupBy]}
                      </th>
                      <th className="px-4 py-4 text-right font-semibold">Visits</th>
                      <th className="px-4 py-4 text-right font-semibold">Unique</th>
                      <th className="px-4 py-4 text-right font-semibold">
                        Application views
                      </th>
                      <th className="px-4 py-4 text-right font-semibold">
                        OTP starts
                      </th>
                      <th className="px-4 py-4 text-right font-semibold">
                        Applications
                      </th>
                      <th className="px-4 py-4 text-right font-semibold">Drafts</th>
                      <th className="px-4 py-4 text-right font-semibold">
                        Submitted
                      </th>
                      <th className="px-4 py-4 text-right font-semibold">
                        Approved
                      </th>
                      <th className="px-4 py-4 text-right font-semibold">
                        Visit → app
                      </th>
                      <th className="px-5 py-4 text-right font-semibold">
                        App → submit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.rows.map(row => (
                      <tr key={row.key} className="transition hover:bg-blue-50/40">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">
                            {acquisitionTitle(row, groupBy)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {acquisitionSubtitle(row, groupBy)}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.visits.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.uniqueVisitors.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.applicationPageVisits.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.otpStarts.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums">
                          {row.applications.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.drafts.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.submitted.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right tabular-nums">
                          {row.approved.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Percentage value={row.visitToApplicationRate} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Percentage value={row.applicationToSubmissionRate} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        ) : null}
      </div>
    </div>
  )
}
