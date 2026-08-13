import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

import { getApplicationAdminFromHeaders } from '@/lib/mentor-applications/auth'
import ExpertApplicationReportForm from './ExpertApplicationReportForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Expert Application Reports - sharingminds',
  description:
    'Generate date-range Excel reports for sharingminds expert applications.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function ExpertApplicationReportsPage() {
  const admin = await getApplicationAdminFromHeaders(await headers())
  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <ShieldAlert className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Protected reporting
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Administrator access required
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Campaign insights and expert application exports are available only
            to verified SharingMinds administrators.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Return home
          </Link>
        </section>
      </main>
    )
  }

  return <ExpertApplicationReportForm />
}
