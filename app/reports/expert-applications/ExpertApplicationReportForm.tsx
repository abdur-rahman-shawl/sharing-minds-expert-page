'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

import { ReportDateTimePicker } from '@/components/reports/report-date-time-picker'
import { Button } from '@/components/ui/button'
import type {
  CampaignPerformanceData,
  CampaignPerformanceGroupBy,
} from '@/lib/reports/campaign-performance-types'
import { toIndiaDateTimeValue } from '@/lib/reports/report-date-time'
import CampaignPerformancePanel from './CampaignPerformancePanel'

type Feedback =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

const SEVEN_DAYS_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

function downloadFilename(contentDisposition: string | null): string {
  if (!contentDisposition) return 'sharingminds-expert-applications.xlsx'
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)?.[1]
  if (encoded) return decodeURIComponent(encoded)
  return (
    /filename="([^"]+)"/i.exec(contentDisposition)?.[1] ||
    'sharingminds-expert-applications.xlsx'
  )
}

export default function ExpertApplicationReportForm() {
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [campaignData, setCampaignData] =
    useState<CampaignPerformanceData | null>(null)
  const [campaignError, setCampaignError] = useState<string | null>(null)
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)
  const [groupBy, setGroupBy] =
    useState<CampaignPerformanceGroupBy>('campaign')

  useEffect(() => {
    const end = new Date()
    end.setSeconds(0, 0)
    setEndAt(toIndiaDateTimeValue(end))
    setStartAt(
      toIndiaDateTimeValue(new Date(end.getTime() - SEVEN_DAYS_MILLISECONDS)),
    )
  }, [])

  function rangeValidationError(): string | null {
    if (!startAt || !endAt) return 'Select both the start and end date and time.'

    const start = new Date(`${startAt}:00+05:30`)
    const end = new Date(`${endAt}:00+05:30`)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return 'The end date and time must be later than the start.'
    }
    return null
  }

  async function loadCampaignInsights(
    nextGroupBy: CampaignPerformanceGroupBy = groupBy,
  ) {
    const validationError = rangeValidationError()
    if (validationError) {
      setCampaignError(validationError)
      return
    }

    setIsLoadingCampaigns(true)
    setCampaignError(null)
    try {
      const response = await fetch('/api/reports/expert-applications/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt, endAt, groupBy: nextGroupBy }),
      })
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean
        error?: string
        data?: CampaignPerformanceData
      } | null
      if (!response.ok || payload?.success !== true || !payload.data) {
        throw new Error(
          payload?.error || 'Campaign insights could not be generated.',
        )
      }
      setCampaignData(payload.data)
    } catch (error) {
      setCampaignData(null)
      setCampaignError(
        error instanceof Error
          ? error.message
          : 'Campaign insights could not be generated.',
      )
    } finally {
      setIsLoadingCampaigns(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    const validationError = rangeValidationError()
    if (validationError) {
      setFeedback({
        type: 'error',
        message: validationError,
      })
      return
    }

    setIsDownloading(true)

    try {
      const response = await fetch('/api/reports/expert-applications/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startAt, endAt }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(
          payload?.error || 'The report could not be generated. Please try again.',
        )
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = downloadFilename(response.headers.get('content-disposition'))
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)

      const rowCount = Number(response.headers.get('x-report-row-count') || '0')
      setFeedback({
        type: 'success',
        message:
          rowCount === 1
            ? 'Report downloaded with 1 expert registration.'
            : `Report downloaded with ${rowCount.toLocaleString(
                'en-IN',
              )} expert registrations.`,
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The report could not be generated. Please try again.',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb] text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-[30rem] w-[30rem] rounded-full bg-cyan-100/60 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          aria-label="sharingminds home"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
        >
          <Image
            src="/sharing-minds-logo.png"
            alt="sharingminds — a human intelligence network"
            width={285}
            height={132}
            priority
            className="h-auto w-[135px] object-contain sm:w-[150px]"
          />
        </Link>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Return home</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-12 pt-4 sm:px-8 sm:pb-16 lg:px-10 lg:py-12">
        <div className="space-y-8">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative overflow-hidden bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.42),transparent_36%),radial-gradient(circle_at_90%_85%,rgba(34,211,238,0.2),transparent_35%)]"
            />
            <div className="relative flex h-full flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
                Reporting utility
              </span>

              <div className="my-auto py-10 lg:py-14">
                <p className="text-sm font-semibold text-blue-200">
                  Expert application intelligence
                </p>
                <h1 className="mt-4 max-w-[11ch] text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
                  Compare acquisition and applications.
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                  Compare campaign conversion through approval, then export every
                  application and its acquisition source for deeper analysis.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    aria-hidden="true"
                    className="h-4 w-4 text-blue-300"
                  />
                  Formula-safe Excel
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarClock
                    aria-hidden="true"
                    className="h-4 w-4 text-blue-300"
                  />
                  India Standard Time
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                  Registration window
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-3xl">
                  Select the reporting period
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  Registrations are selected by the date and time their email was
                  verified and their application record was created.
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 sm:inline-flex">
                IST · XLSX
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="report-start-at"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Start date and time
                  </label>
                  <ReportDateTimePicker
                    id="report-start-at"
                    value={startAt}
                    onChange={setStartAt}
                    disabled={isDownloading}
                    describedBy="report-timezone-help"
                  />
                  <p className="text-xs text-slate-500">Included in the report</p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="report-end-at"
                    className="text-sm font-semibold text-slate-800"
                  >
                    End date and time
                  </label>
                  <ReportDateTimePicker
                    id="report-end-at"
                    value={endAt}
                    onChange={setEndAt}
                    disabled={isDownloading}
                    describedBy="report-timezone-help"
                  />
                  <p className="text-xs text-slate-500">Excluded from the report</p>
                </div>
              </div>

              <div
                id="report-timezone-help"
                className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm leading-6 text-blue-950"
              >
                All inputs and readable spreadsheet timestamps use{' '}
                <strong>India Standard Time (Asia/Kolkata)</strong>. The workbook
                also includes the original UTC registration timestamp. Each
                download can cover up to 366 days.
              </div>

              {feedback ? (
                <div
                  role={feedback.type === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${
                    feedback.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0"
                    />
                  ) : null}
                  <span>{feedback.message}</span>
                </div>
              ) : null}

              <Button
                type="button"
                variant="outline"
                disabled={isLoadingCampaigns || !startAt || !endAt}
                onClick={() => void loadCampaignInsights()}
                className="h-12 w-full rounded-full border-slate-300 bg-white px-6 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
              >
                {isLoadingCampaigns ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 aria-hidden="true" className="h-4 w-4" />
                )}
                View campaign insights
              </Button>

              <Button
                type="submit"
                disabled={isDownloading || !startAt || !endAt}
                className="h-12 w-full rounded-full bg-slate-950 px-6 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:ring-blue-600"
              >
                {isDownloading ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Preparing Excel report…
                  </>
                ) : (
                  <>
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Download Excel report
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              Administrator access is required. Downloaded files contain personal
              application information and must be handled responsibly.
            </p>
          </div>
        </section>
        <CampaignPerformancePanel
          data={campaignData}
          error={campaignError}
          isLoading={isLoadingCampaigns}
          groupBy={groupBy}
          onGroupByChange={nextGroupBy => {
            setGroupBy(nextGroupBy)
            void loadCampaignInsights(nextGroupBy)
          }}
          onRefresh={() => void loadCampaignInsights()}
        />
        </div>
      </main>
    </div>
  )
}
