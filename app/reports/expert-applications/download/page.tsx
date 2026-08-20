import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import {
  EXPERT_REPORT_SESSION_COOKIE,
  verifyExpertReportSessionToken,
} from '@/lib/reports/expert-report-access'
import ExpertApplicationReportForm from '../ExpertApplicationReportForm'
import ExpertReportLoginForm from './expert-report-login-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Download Expert Applications - sharingminds',
  description: 'Generate protected expert-application Excel reports.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function ExpertApplicationDownloadPage() {
  const cookieStore = await cookies()
  const hasAccess = verifyExpertReportSessionToken(
    cookieStore.get(EXPERT_REPORT_SESSION_COOKIE)?.value,
  )

  return hasAccess ? (
    <ExpertApplicationReportForm showLogout />
  ) : (
    <ExpertReportLoginForm />
  )
}
