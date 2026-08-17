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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
    eyebrow: 'APPLICATION RECEIVED',
    title: 'Your Expert Application is under review',
    description: 'Thank you for applying to join SharingMinds.',
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
  contextNotice?: {
    title: string
    description: string
  }
  onStartAnotherApplication?: () => void
  startAnotherLabel?: string
  startAnotherDescription?: string
  isStartingAnother?: boolean
  actionError?: string | null
}

export function MentorApplicationStatus({
  mentor,
  onNavigateHome,
  onNavigateDashboard,
  contextNotice,
  onStartAnotherApplication,
  startAnotherLabel = 'Start another application',
  startAnotherDescription =
    'You will be signed out of the current account. Your submitted application will remain safe.',
  isStartingAnother = false,
  actionError,
}: MentorApplicationStatusProps) {
  const presentation = STATUS_PRESENTATIONS[mentor.verificationStatus]
  const access = getMentorAccess(mentor)
  const Icon = presentation.icon
  const isApplicationUnderReview = mentor.verificationStatus === 'IN_PROGRESS'
  const hasInconsistentVerification =
    mentor.verificationStatus === 'VERIFIED' && mentor.isVerified !== true

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${presentation.iconClassName}`}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {presentation.eyebrow}
              </p>
              {!isApplicationUnderReview && (
                <Badge variant="outline">
                  {mentor.verificationStatus.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {presentation.title}
            </h1>
            {isApplicationUnderReview ? (
              <div className="space-y-4 leading-relaxed text-slate-600">
                <p>{presentation.description}</p>
                <p>
                  We’ve received your application successfully. Our team is now reviewing
                  your professional experience and expertise. We’ll contact you once the
                  review is complete.
                </p>
              </div>
            ) : (
              <p className="leading-relaxed text-slate-600">{presentation.description}</p>
            )}
          </div>
        </div>

        {hasInconsistentVerification && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Your approval is being finalized. Access will activate after the verification record is synchronized.
          </div>
        )}

        {contextNotice && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
            <p className="font-semibold">{contextNotice.title}</p>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              {contextNotice.description}
            </p>
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

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-900">Application Status:</span>{' '}
            {mentor.verificationStatus.replace(/_/g, ' ')}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Submitted:</span>{' '}
            {new Date(mentor.registeredAt).toLocaleDateString()}
          </p>
        </div>

        {isApplicationUnderReview && (
          <p className="text-sm font-medium text-slate-700">
            No action is required at this stage.
          </p>
        )}

        {actionError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          {onStartAnotherApplication && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="flex-1"
                  variant="outline"
                  disabled={isStartingAnother}
                >
                  {isStartingAnother ? 'Preparing...' : startAnotherLabel}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{startAnotherLabel}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {startAnotherDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onStartAnotherApplication}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
