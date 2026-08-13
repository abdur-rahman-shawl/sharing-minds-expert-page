import type { Metadata } from 'next'

import ExpertRegistrationCompleteClient from './registration-complete-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Completing Expert Registration - sharingminds',
  robots: { index: false, follow: false, nocache: true },
}

export default function ExpertRegistrationCompletePage() {
  return <ExpertRegistrationCompleteClient />
}
