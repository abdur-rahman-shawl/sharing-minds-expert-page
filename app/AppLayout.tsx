'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useMentorStatus } from '@/hooks/use-mentor-status'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMentor, mentor, isLoading } = useMentorStatus()
  const hasRedirectedRef = useRef(false)

  const isAuthPage = pathname.startsWith('/auth')
  const isVipPage = pathname.startsWith('/vip-lounge')
  const isDashboardPage = pathname.startsWith('/dashboard')
  const hideChrome = isAuthPage || isVipPage || isDashboardPage

  useEffect(() => {
    if (isLoading) return

    if (isMentor && !hasRedirectedRef.current) {
      const isVerified = mentor?.verificationStatus === 'VERIFIED'

      // Verified mentors can access the dashboard; all others go to VIP lounge
      if (!isVipPage && !(isDashboardPage && isVerified)) {
        hasRedirectedRef.current = true
        router.replace('/vip-lounge')
      }
    }

    if (!isMentor) {
      hasRedirectedRef.current = false
    }
  }, [isLoading, isMentor, mentor, isVipPage, isDashboardPage, router])

  return (
    <div className="flex min-h-screen flex-col">
      {!hideChrome && <Header />}
      <main className={`flex-1 ${!hideChrome ? 'pt-20 sm:pt-24' : ''}`}>{children}</main>
      {!hideChrome && <Footer />}
    </div>
  )
}
