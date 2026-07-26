import type { Metadata } from 'next'

import ExpertApplicationReportForm from './ExpertApplicationReportForm'

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

export default function ExpertApplicationReportsPage() {
  return <ExpertApplicationReportForm />
}
