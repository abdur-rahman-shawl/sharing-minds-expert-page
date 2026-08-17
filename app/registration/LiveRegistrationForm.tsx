'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { LiveRegistrationAuth } from '@/components/expert-registration/live-registration-auth'
import { ExpertApplicationWizard } from '@/components/mentor-application/expert-application-wizard'
import type { MentorApplication } from '@/components/mentor-application/types'
import { MentorApplicationStatus } from '@/components/mentor/mentor-application-status'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { captureCurrentCampaignVisit } from '@/lib/campaign-attribution/client'
import { signOut } from '@/lib/auth-client'
import type { ExpertRegistrationFinalizationResult } from '@/lib/expert-registration/lifecycle'

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
  const [completion, setCompletion] =
    useState<ExpertRegistrationFinalizationResult | null>(null)
  const [screen, setScreen] = useState<'loading' | 'form' | 'auth' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [accountActionError, setAccountActionError] = useState<string | null>(null)
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)
  const bootstrapRequest = useRef<Promise<MentorApplication> | null>(null)

  useEffect(() => {
    // Better Auth refreshes the session when a background tab becomes visible.
    // Once the form is open, that refresh must remain in the background: rendering
    // the loading screen would unmount the wizard and discard in-memory File values.
    if (mentorStatusLoading || isMentor || screen !== 'loading') return
    let active = true

    const bootstrap = async (): Promise<MentorApplication> => {
      // Preserve attribution when it responds promptly, but never hold the
      // registration form behind a slow analytics/database request.
      await Promise.race([
        captureCurrentCampaignVisit(),
        new Promise<void>(resolve => window.setTimeout(resolve, 1_500)),
      ])
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

      return nextDraft
    }

    // Reuse an in-flight bootstrap across React's development effect replay and
    // transient auth-state changes so the client cannot create competing drafts.
    const request = bootstrapRequest.current || bootstrap()
    bootstrapRequest.current = request

    void request
      .then(nextDraft => {
        if (!active) return
        setDraft(nextDraft)
        setScreen(
          nextDraft.registrationDraftStatus === 'READY_FOR_AUTH' ? 'auth' : 'form',
        )
      })
      .catch(caught => {
        if (!active) return
        setError(caught instanceof Error ? caught.message : 'Unable to start registration')
        setScreen('error')
      })

    return () => {
      active = false
    }
  }, [isMentor, mentorStatusLoading, screen])

  const continueWithAnotherAccount = async () => {
    setIsSwitchingAccount(true)
    setAccountActionError(null)
    try {
      const result = await signOut()
      if (result?.error) {
        throw new Error(result.error.message || 'Unable to close the current account session')
      }
      window.location.assign('/verified-experts')
    } catch (caught) {
      setAccountActionError(
        caught instanceof Error
          ? caught.message
          : 'Unable to prepare another expert application',
      )
      setIsSwitchingAccount(false)
    }
  }

  const statusMentor = completion?.mentor || (isMentor ? mentor : null)
  if (!mentorStatusLoading && statusMentor) {
    const existingProfile = completion?.outcome === 'EXISTING_PROFILE'
    return (
      <MentorApplicationStatus
        mentor={statusMentor}
        onNavigateHome={() => router.push('/')}
        onNavigateDashboard={() => router.push('/dashboard')}
        contextNotice={
          existingProfile
            ? {
                title: 'An application already exists for this email',
                description:
                  `We found the expert application previously submitted for ${statusMentor.email}. ` +
                  'That existing application is the one currently under review; the form you just ' +
                  'completed was not submitted again or used to replace it.',
              }
            : undefined
        }
        onStartAnotherApplication={() => void continueWithAnotherAccount()}
        startAnotherLabel={
          existingProfile ? 'Use a different account' : 'Start another application'
        }
        startAnotherDescription={
          existingProfile
            ? 'You will be signed out of this account. The completed form will remain saved so the correct person can authenticate and submit it.'
            : 'You will be signed out of this account. The submitted application will remain safe, and a new blank application will open.'
        }
        isStartingAnother={isSwitchingAccount}
        actionError={accountActionError}
      />
    )
  }

  if (screen === 'loading') {
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
        onCompleted={setCompletion}
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
