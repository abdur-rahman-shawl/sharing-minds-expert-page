"use client"

import { useEffect } from "react"
import { MentorSidebar } from "@/components/mentor/sidebars/mentor-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useMentorStatus } from "@/hooks/use-mentor-status"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function MentorDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isMentor, mentor, isLoading } = useMentorStatus()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return

        // If not authenticated or not a verified mentor, redirect to main dashboard page
        if (!isMentor || !mentor || mentor.verificationStatus !== 'VERIFIED') {
            router.replace('/dashboard')
        }
    }, [isMentor, mentor, isLoading, router])

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Don't render dashboard content if not authorized (prevents flash of content before redirect)
    if (!isMentor || !mentor || mentor.verificationStatus !== 'VERIFIED') {
        return null
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
                <MentorSidebar
                    activeSection="" // Will be handled by sidebar internally using usePathname
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 mt-16 lg:mt-0 w-full max-w-7xl mx-auto">
                        <SidebarTrigger className="lg:hidden mb-4" />
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
