'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useMentorStatus } from '@/hooks/use-mentor-status'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMentor, isLoading } = useMentorStatus()

  const isAuthPage = pathname.startsWith('/auth')
  const isVipPage = pathname.startsWith('/vip-lounge')
  const hideChrome = isAuthPage || isVipPage

  useEffect(() => {
    if (!isLoading && isMentor && !isVipPage) {
      router.replace('/vip-lounge')
    }
  }, [isLoading, isMentor, isVipPage, router])

  if (!isVipPage && isMentor) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!hideChrome && <Header />}
      <main className={`flex-1 ${!hideChrome ? 'pt-20 sm:pt-24' : ''}`}>{children}</main>
      {!hideChrome && <Footer />}
    </div>
  )
}
