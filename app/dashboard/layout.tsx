'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { Loader2 } from 'lucide-react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Separator } from '@/components/ui/separator'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, isPending: sessionLoading } = useSession()
    const { isMentor, mentor, isLoading: mentorLoading } = useMentorStatus()

    const isLoading = sessionLoading || mentorLoading

    // Gate-keeping: redirect non-verified users
    useEffect(() => {
        if (isLoading) return

        if (!session?.user) {
            router.replace(`/auth/login?callbackUrl=${encodeURIComponent('/dashboard')}`)
            return
        }

        if (!isMentor || !mentor) {
            router.replace('/registration')
            return
        }

        if (mentor.verificationStatus !== 'VERIFIED') {
            router.replace('/vip-lounge')
            return
        }
    }, [isLoading, session, isMentor, mentor, router])

    // Show loader while checking auth / mentor status, or while redirecting
    if (isLoading || !session?.user || !isMentor || !mentor || mentor.verificationStatus !== 'VERIFIED') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-amber-300 mx-auto" />
                    <p className="mt-4 text-slate-300 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    // Derive the current section name from the pathname
    const sectionSegment = pathname.replace('/dashboard', '').replace(/^\//, '') || 'overview'
    const sectionTitle = sectionSegment === 'overview'
        ? 'Dashboard'
        : sectionSegment.charAt(0).toUpperCase() + sectionSegment.slice(1).replace(/-/g, ' ')

    return (
        <SidebarProvider>
            <DashboardSidebar mentor={mentor} />
            <SidebarInset>
                {/* Top bar */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-800 bg-slate-950 px-4">
                    <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white hover:bg-slate-800" />
                    <Separator orientation="vertical" className="mr-2 h-4 bg-slate-700" />
                    <h1 className="text-sm font-medium text-slate-200">{sectionTitle}</h1>
                </header>

                {/* Page content */}
                <div className="flex-1 bg-slate-950 min-h-[calc(100vh-3.5rem)]">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
