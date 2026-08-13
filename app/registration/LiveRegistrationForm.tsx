'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { LiveRegistrationAuth } from '@/components/expert-registration/live-registration-auth'
import { ExpertApplicationWizard } from '@/components/mentor-application/expert-application-wizard'
import type { MentorApplication } from '@/components/mentor-application/types'
import { MentorApplicationStatus } from '@/components/mentor/mentor-application-status'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { captureCurrentCampaignVisit } from '@/lib/campaign-attribution/client'
import type { MentorStatusData } from '@/lib/mentor-onboarding'

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export default function LiveRegistrationForm() {
  const router = useRouter()
  const { isMentor, mentor, isLoading: mentorStatusLoading } = useMentorStatus()
  const [draft, setDraft] = useState<MentorApplication | null>(null)
  const [completedMentor, setCompletedMentor] = useState<MentorStatusData | null>(null)
  const [screen, setScreen] = useState<'loading' | 'form' | 'auth' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mentorStatusLoading || isMentor) return
    let active = true

    const bootstrap = async () => {
      try {
        await captureCurrentCampaignVisit()
        let response = await fetch('/api/expert-registration/drafts/current', {
          credentials: 'include',
          cache: 'no-store',
        })
        let body = await responseJson(response)

        if (response.ok && body.success === true && !body.draft) {
          response = await fetch('/api/expert-registration/drafts', {
            method: 'POST',
            credentials: 'include',
          })
          body = await responseJson(response)
        }

        const nextDraft = body.draft as MentorApplication | undefined
        if (!response.ok || body.success !== true || !nextDraft) {
          throw new Error(
            typeof body.error === 'string'
              ? body.error
              : 'Unable to start the expert registration',
          )
        }
        if (!active) return
        setDraft(nextDraft)
        setScreen('form')
      } catch (caught) {
        if (!active) return
        setError(caught instanceof Error ? caught.message : 'Unable to start registration')
        setScreen('error')
      }
    }

    void bootstrap()
    return () => {
      active = false
    }
  }, [isMentor, mentorStatusLoading])

  const statusMentor = completedMentor || (isMentor ? mentor : null)
  if (!mentorStatusLoading && statusMentor) {
    return (
      <MentorApplicationStatus
        mentor={statusMentor}
        onNavigateHome={() => router.push('/')}
        onNavigateDashboard={() => router.push('/dashboard')}
        onNavigateVipLounge={() => router.push('/vip-lounge')}
      />
    )
  }

  if (screen === 'loading' || mentorStatusLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
          <p className="mt-4 font-medium text-slate-600">Preparing your secure application...</p>
        </div>
      </div>
    )
  }

  if (screen === 'error' || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-semibold text-slate-950">Registration unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error || 'We could not open the expert registration.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'auth') {
    return (
      <LiveRegistrationAuth
        fullName={draft.fullName || 'SharingMinds Expert'}
        onBack={() => setScreen('form')}
        onCompleted={setCompletedMentor}
      />
    )
  }

  return (
    <ExpertApplicationWizard
      key={draft.id}
      application={draft}
      registrationMode="live"
      onApplicationChange={setDraft}
      onReadyForAuthentication={prepared => {
        setDraft(prepared)
        setScreen('auth')
      }}
      onExit={() => router.push('/')}
    />
  )
}
