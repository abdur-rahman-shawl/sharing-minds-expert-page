'use client'

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getMentorAccess,
  type MentorStatusData,
  type MentorVerificationStatus,
} from '@/lib/mentor-onboarding'

interface StatusPresentation {
  eyebrow: string
  title: string
  description: string
  icon: typeof Clock3
  iconClassName: string
}

const STATUS_PRESENTATIONS: Record<MentorVerificationStatus, StatusPresentation> = {
  YET_TO_APPLY: {
    eyebrow: 'Application not started',
    title: 'Your expert application is not yet under review',
    description: 'Contact support if this status appears after you submitted an application.',
    icon: Clock3,
    iconClassName: 'bg-slate-100 text-slate-600',
  },
  IN_PROGRESS: {
    eyebrow: 'Application under review',
    title: 'We are reviewing your professional background',
    description: 'Your application was received successfully. We will contact you after review.',
    icon: Clock3,
    iconClassName: 'bg-amber-100 text-amber-700',
  },
  VERIFIED: {
    eyebrow: 'Verification complete',
    title: 'Your SharingMinds profile has been verified',
    description: 'Your verified mentor tools are ready based on your current access level.',
    icon: CheckCircle2,
    iconClassName: 'bg-emerald-100 text-emerald-700',
  },
  REJECTED: {
    eyebrow: 'Application requires attention',
    title: 'Your application was not approved',
    description: 'Review the verification notes below before contacting the SharingMinds team.',
    icon: AlertCircle,
    iconClassName: 'bg-red-100 text-red-700',
  },
  REVERIFICATION: {
    eyebrow: 'Reverification required',
    title: 'We need additional verification information',
    description: 'Review the notes below and follow the instructions from the SharingMinds team.',
    icon: RefreshCw,
    iconClassName: 'bg-orange-100 text-orange-700',
  },
  RESUBMITTED: {
    eyebrow: 'Resubmission received',
    title: 'Your updated application is under review',
    description: 'No further action is needed unless our verification team contacts you.',
    icon: Clock3,
    iconClassName: 'bg-indigo-100 text-indigo-700',
  },
  UPDATED_PROFILE: {
    eyebrow: 'Profile update under review',
    title: 'We are reviewing your latest profile changes',
    description: 'Your previous access remains subject to the verification team’s review.',
    icon: ShieldCheck,
    iconClassName: 'bg-violet-100 text-violet-700',
  },
}

interface MentorApplicationStatusProps {
  mentor: MentorStatusData
  onNavigateHome: () => void
  onNavigateDashboard: () => void
  onNavigateVipLounge: () => void
}

export function MentorApplicationStatus({
  mentor,
  onNavigateHome,
  onNavigateDashboard,
  onNavigateVipLounge,
}: MentorApplicationStatusProps) {
  const presentation = STATUS_PRESENTATIONS[mentor.verificationStatus]
  const access = getMentorAccess(mentor)
  const Icon = presentation.icon
  const hasInconsistentVerification =
    mentor.verificationStatus === 'VERIFIED' && mentor.isVerified !== true

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${presentation.iconClassName}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {presentation.eyebrow}
              </p>
              <Badge variant="outline">
                {mentor.verificationStatus.replace(/_/g, ' ')}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {presentation.title}
            </h1>
            <p className="leading-relaxed text-slate-600">{presentation.description}</p>
          </div>
        </div>

        {hasInconsistentVerification && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Your approval is being finalized. Access will activate after the verification record is synchronized.
          </div>
        )}

        {mentor.verificationNotes && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Verification notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {mentor.verificationNotes}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <Badge variant="secondary">Payment: {mentor.paymentStatus.replace(/_/g, ' ')}</Badge>
          <Badge variant="secondary">
            Submitted {new Date(mentor.registeredAt).toLocaleDateString()}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          {access.canAccessVipLounge && (
            <Button
              className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
              onClick={onNavigateVipLounge}
            >
              Open VIP Lounge
            </Button>
          )}
          {access.canAccessDashboard && (
            <Button className="flex-1" variant="outline" onClick={onNavigateDashboard}>
              Open Dashboard
            </Button>
          )}
          <Button className="flex-1" variant="ghost" onClick={onNavigateHome}>
            Back Home
          </Button>
        </div>
      </div>
    </div>
  )
}
