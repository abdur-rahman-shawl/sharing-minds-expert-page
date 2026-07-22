import type { Metadata } from 'next'
import LoginPageClient from './LoginPageClient'

export const metadata: Metadata = {
  title: 'Verified Expert Access - sharingminds',
  description:
    'Sign-in and dashboard access are activated after expert verification and approval.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginPageClient />
}
