'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { MentorApplicationStatus } from '@/components/mentor/mentor-application-status'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from '@/lib/auth-client'
import {
  EXPERT_REGISTRATION_FINALIZATION_OUTCOMES,
  type ExpertRegistrationFinalizationOutcome,
  type ExpertRegistrationFinalizationResult,
} from '@/lib/expert-registration/lifecycle'

const AUTH_METHODS = new Set(['GOOGLE', 'LINKEDIN'])

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export default function ExpertRegistrationCompleteClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()
  const attempted = useRef(false)
  const [completion, setCompletion] =
    useState<ExpertRegistrationFinalizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isWorking, setIsWorking] = useState(true)
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)
  const [accountActionError, setAccountActionError] = useState<string | null>(null)

  const complete = useCallback(async () => {
    const method = searchParams.get('method') || ''
    if (!AUTH_METHODS.has(method)) {
      setError('The sign-in completion link is invalid. Return to your application and try again.')
      setIsWorking(false)
      return
    }
    if (!session?.user) {
      setError('Secure sign in did not complete. Your application is still saved.')
      setIsWorking(false)
      return
    }

    setIsWorking(true)
    setError(null)
    try {
      const response = await fetch('/api/expert-registration/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ authMethod: method }),
      })
      const body = await responseJson(response)
      const outcome = body.outcome
      if (
        !response.ok ||
        body.success !== true ||
        !body.mentor ||
        typeof outcome !== 'string' ||
        !EXPERT_REGISTRATION_FINALIZATION_OUTCOMES.includes(
          outcome as ExpertRegistrationFinalizationOutcome,
        )
      ) {
        throw new Error(
          typeof body.error === 'string'
            ? body.error
            : 'Unable to complete the expert registration',
        )
      }
      setCompletion({
        mentor: body.mentor as ExpertRegistrationFinalizationResult['mentor'],
        outcome: outcome as ExpertRegistrationFinalizationOutcome,
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to complete registration')
    } finally {
      setIsWorking(false)
    }
  }, [searchParams, session?.user])

  useEffect(() => {
    if (isPending || attempted.current) return
    attempted.current = true
    void complete()
  }, [complete, isPending])

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

  if (completion) {
    const existingProfile = completion.outcome === 'EXISTING_PROFILE'
    return (
      <MentorApplicationStatus
        mentor={completion.mentor}
        onNavigateHome={() => router.push('/')}
        onNavigateDashboard={() => router.push('/dashboard')}
        contextNotice={
          existingProfile
            ? {
                title: 'An application already exists for this email',
                description:
                  `We found the expert application previously submitted for ${completion.mentor.email}. ` +
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-10">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            error ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
          }`}
        >
          {error ? <AlertTriangle className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
          {isWorking ? 'Securing your expert profile' : 'Your application is still safe'}
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {isWorking
            ? 'Please stay on this page while we connect your account and submit your application.'
            : error}
        </p>
        {!isWorking && error && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => {
                attempted.current = true
                void complete()
              }}
              className="bg-slate-950 hover:bg-blue-700"
            >
              Try completion again
            </Button>
            <Button variant="outline" onClick={() => router.push('/verified-experts')}>
              Return to application
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}
