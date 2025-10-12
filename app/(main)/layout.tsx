import type React from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-10">{children}</main>
      <Footer />
    </>
  )
}
