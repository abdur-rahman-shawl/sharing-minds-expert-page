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

export const metadata: Metadata = {
  title: 'SharingMinds - Apply for Expert Verification',
  description:
    'Apply for expert verification and connect with professionals seeking guidance on SharingMinds.',
  generator: 'v0.app',
  icons: {
    icon: '/brand/sharingminds-infinity.png',
    shortcut: '/brand/sharingminds-infinity.png',
    apple: '/brand/sharingminds-infinity.png',
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
