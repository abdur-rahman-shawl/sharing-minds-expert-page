'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex-1 pt-10">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  )
}
