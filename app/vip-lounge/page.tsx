'use client'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { VipInvitation } from '@/components/vip/vip-invitation'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { Button } from '@/components/ui/button'

export default function VipLoungePage() {
  const router = useRouter()
  const { isMentor, mentor, isLoading } = useMentorStatus()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-amber-300" />
          <p className="mt-4 text-sm text-slate-200">Preparing your VIP experience...</p>
        </div>
      </div>
    )
  }

  if (!mentor || !isMentor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl font-semibold">VIP access is reserved</h1>
          <p className="text-base text-slate-200">
            This section is curated exclusively for mentors who have already completed the SharingMinds registration
            process. Please log in with your mentor account or finish your registration to unlock the experience.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => router.push('/registration')} className="bg-amber-400/90 text-black hover:bg-amber-300">
              Apply as Mentor
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="border-white/30 text-white hover:bg-white/10">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const canAccessDashboard = mentor.verificationStatus === 'VERIFIED'

  return (
    <VipInvitation
      mentor={mentor}
      onNavigateHome={() => router.push('/')}
      canAccessDashboard={canAccessDashboard}
      onNavigateDashboard={canAccessDashboard ? () => router.push('/dashboard') : undefined}
    />
  )
}
