'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { Loader2, LogOut, Home } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import Link from 'next/link'

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

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    const userInitial = session.user.name?.charAt(0)?.toUpperCase() || '?'

    return (
        <>
            {/* Standalone Dashboard Header — full width, sticky on top */}
            <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-5">
                {/* Left: logo + section title */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
                        <Image
                            src="/sharing-minds-logo.png"
                            alt="SharingMinds"
                            width={320}
                            height={100}
                            className="h-10 w-auto brightness-0 invert"
                        />
                    </Link>
                    <Separator orientation="vertical" className="h-6 bg-slate-700" />
                    <h1 className="text-sm font-medium text-slate-300">{sectionTitle}</h1>
                </div>

                {/* Right: user info + actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <Home className="h-3.5 w-3.5" />
                        <span>Home</span>
                    </Link>
                    <Separator orientation="vertical" className="hidden sm:block h-4 bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 hidden md:inline-block truncate max-w-[120px]">
                            {session.user.name}
                        </span>
                        <Avatar className="h-7 w-7 border border-slate-700">
                            <AvatarImage src={session.user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-bold">
                                {userInitial}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </div>
            </header>

            {/* Sidebar + Content — below header */}
            <SidebarProvider
                style={{ '--header-height': '3.5rem' } as React.CSSProperties}
                className="flex-1"
            >
                <DashboardSidebar mentor={mentor} />
                <SidebarInset>
                    <div className="flex-1 bg-slate-950">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
