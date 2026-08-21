import type React from 'react'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { AppLayout } from '@/app/AppLayout'
import { ErrorBoundary } from '@/components/common/error-boundary'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

function getMetadataBase() {
  const configuredUrl =
    process.env.APP_BASE_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL

  if (configuredUrl) return new URL(configuredUrl)

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercelUrl) return new URL(`https://${vercelUrl}`)

  return new URL('http://localhost:3000')
}

const socialImage = '/social/sharingminds-expert-network.png'

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'Apply for the SharingMinds Verified Expert Network',
  description:
    'Apply for expert verification and connect with professionals seeking guidance on SharingMinds.',
  generator: 'v0.app',
  icons: {
    icon: '/brand/sharingminds-infinity.png',
    shortcut: '/brand/sharingminds-infinity.png',
    apple: '/brand/sharingminds-infinity.png',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SharingMinds',
    title: 'Apply for the SharingMinds Verified Expert Network',
    description:
      'Apply for expert verification and connect with professionals seeking guidance on SharingMinds.',
    images: [
      {
        url: socialImage,
        width: 1897,
        height: 908,
        alt: 'SharingMinds Verified Expert Network application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apply for the SharingMinds Verified Expert Network',
    description:
      'Apply for expert verification and connect with professionals seeking guidance on SharingMinds.',
    images: [socialImage],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <body className="bg-slate-50 text-gray-900">
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <AuthProvider>
                <AppLayout>{children}</AppLayout>
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
