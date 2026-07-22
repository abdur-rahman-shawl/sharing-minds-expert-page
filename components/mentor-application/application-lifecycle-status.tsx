'use client'

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MentorApplication, MentorApplicationStatus } from './types'

interface StatusPresentation {
  eyebrow: string
  title: string
  description: string
  icon: typeof Clock3
  iconClassName: string
}

const PRESENTATIONS: Partial<Record<MentorApplicationStatus, StatusPresentation>> = {
  SUBMITTED: {
    eyebrow: 'Application received',
    title: 'Your expert application is safely submitted',
    description: 'Our verification team will review your professional background and contact you if anything else is needed.',
    icon: FileCheck2,
    iconClassName: 'bg-indigo-100 text-indigo-700',
  },
  IN_REVIEW: {
    eyebrow: 'Review in progress',
    title: 'Our team is reviewing your application',
    description: 'No action is needed right now. We will send updates to your verified email address.',
    icon: Clock3,
    iconClassName: 'bg-amber-100 text-amber-700',
  },
  RESUBMITTED: {
    eyebrow: 'Updates received',
    title: 'Your revised application is back in review',
    description: 'We have received your changes and will notify you after the next review.',
    icon: Clock3,
    iconClassName: 'bg-violet-100 text-violet-700',
  },
  APPROVED: {
    eyebrow: 'Application approved',
    title: 'Welcome to the SharingMinds expert community',
    description: 'Your application is approved. Sign in to SharingMinds later with this same verified email to connect it to your platform account.',
    icon: CheckCircle2,
    iconClassName: 'bg-emerald-100 text-emerald-700',
  },
  REJECTED: {
    eyebrow: 'Review complete',
    title: 'We could not approve your application',
    description: 'Review the note from our verification team below. You can contact support if you need clarification.',
    icon: AlertCircle,
    iconClassName: 'bg-red-100 text-red-700',
  },
  WITHDRAWN: {
    eyebrow: 'Application withdrawn',
    title: 'This application is no longer active',
    description: 'Contact SharingMinds support if you withdrew it by mistake or would like to apply again.',
    icon: AlertCircle,
    iconClassName: 'bg-slate-100 text-slate-700',
  },
}

interface ApplicationLifecycleStatusProps {
  application: MentorApplication
  onNavigateHome: () => void
  onUseAnotherEmail: () => void
  onExitApplication: () => void
  isClosing?: boolean
  actionError?: string | null
}

export function ApplicationLifecycleStatus({
  application,
  onNavigateHome,
  onUseAnotherEmail,
  onExitApplication,
  isClosing = false,
  actionError = null,
}: ApplicationLifecycleStatusProps) {
  const basePresentation = PRESENTATIONS[application.status] ?? {
    eyebrow: 'Application status',
    title: 'Your application is saved',
    description: 'We will send updates to your verified email address.',
    icon: ShieldCheck,
    iconClassName: 'bg-slate-100 text-slate-700',
  }
  const presentation = application.status === 'APPROVED' && application.mentorId
    ? {
        ...basePresentation,
        description: 'Your approved application is connected to your SharingMinds mentor profile.',
      }
    : application.status === 'APPROVED' && application.linkedUserId
      ? {
          ...basePresentation,
          description: 'Your application is approved and connected to your SharingMinds account. Your mentor profile is being finalized.',
        }
      : basePresentation
  const Icon = presentation.icon
  const notes = application.applicantVisibleNotes || application.verificationNotes

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 sm:px-6">
      <main className="w-full max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${presentation.iconClassName}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {presentation.eyebrow}
              </p>
              <Badge variant="outline">{application.status.replace(/_/g, ' ')}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {presentation.title}
            </h1>
            <p className="leading-relaxed text-slate-600">{presentation.description}</p>
          </div>
        </div>

        {notes && (
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="review-note-heading">
            <h2 id="review-note-heading" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Note from the verification team
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {notes}
            </p>
          </section>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <Badge variant="secondary">Verified email: {application.email}</Badge>
          {application.submittedAt && (
            <Badge variant="secondary">
              Submitted {new Date(application.submittedAt).toLocaleDateString()}
            </Badge>
          )}
        </div>

        {actionError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button variant="outline" onClick={onNavigateHome} disabled={isClosing}>
            Back to home
          </Button>
          <Button variant="ghost" onClick={onUseAnotherEmail} disabled={isClosing}>
            Use another email
          </Button>
          <Button variant="ghost" onClick={onExitApplication} disabled={isClosing}>
            {isClosing ? 'Closing application session...' : 'Exit application'}
          </Button>
        </div>
      </main>
    </div>
  )
}
