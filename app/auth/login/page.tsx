import type { Metadata } from 'next'
import LoginPageClient from './LoginPageClient'

export const metadata: Metadata = {
  title: 'Private Client Access - SharingMinds',
  description:
    'Private access to the SharingMinds network is being prepared for business leaders and verified experts.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginPageClient />
}
