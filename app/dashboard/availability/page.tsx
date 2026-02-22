'use client'

import { useSession } from '@/lib/auth-client'
import { Clock, Loader2 } from 'lucide-react'
import { MentorAvailabilityManager } from '@/components/mentor/availability/mentor-availability-manager'

export default function AvailabilityPage() {
    const { data: session, isPending } = useSession()

    if (isPending || !session?.user?.id) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-400" />
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Set Your Availability</h2>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Define when mentees can book sessions with you</p>
                </div>
            </div>

            <MentorAvailabilityManager mentorId={session.user.id} />
        </div>
    )
}
