'use client'

import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signIn, signUp, useSession } from '@/lib/auth-client'
import {
  EXPERT_REGISTRATION_FINALIZATION_OUTCOMES,
  type ExpertRegistrationFinalizationOutcome,
  type ExpertRegistrationFinalizationResult,
} from '@/lib/expert-registration/lifecycle'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'

type AuthMethod = 'GOOGLE' | 'LINKEDIN' | 'EMAIL_PASSWORD' | 'EXISTING_SESSION'

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export function LiveRegistrationAuth({
  fullName,
  onBack,
  onCompleted,
}: {
  fullName: string
  onBack: () => void
  onCompleted: (result: ExpertRegistrationFinalizationResult) => void
}) {
  const { data: session, isPending } = useSession()
  const [emailOpen, setEmailOpen] = useState(false)
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const resetSensitiveFields = () => {
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setFieldErrors({})
  }

  const finalize = async (authMethod: AuthMethod) => {
    let lastError = 'Unable to complete the expert registration'
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch('/api/expert-registration/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ authMethod }),
      })
      const body = await responseJson(response)
      const outcome = body.outcome
      if (
        response.ok &&
        body.success === true &&
        body.mentor &&
        typeof outcome === 'string' &&
        EXPERT_REGISTRATION_FINALIZATION_OUTCOMES.includes(
          outcome as ExpertRegistrationFinalizationOutcome,
        )
      ) {
        onCompleted({
          mentor: body.mentor as ExpertRegistrationFinalizationResult['mentor'],
          outcome: outcome as ExpertRegistrationFinalizationOutcome,
        })
        return
      }
      lastError =
        typeof body.error === 'string' ? body.error : lastError
      if (response.status !== 401 || attempt === 2) break
      await new Promise(resolve => window.setTimeout(resolve, 300 * (attempt + 1)))
    }
    throw new Error(lastError)
  }

  const handleGoogle = async () => {
    setIsWorking(true)
    setError(null)
    try {
      const callbackURL = `${window.location.origin}/verified-experts/complete?method=GOOGLE`
      const result = await signIn.social({ provider: 'google', callbackURL })
      if (result?.error) {
        throw new Error(result.error.message || 'Unable to continue with Google')
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to open secure sign in')
      setIsWorking(false)
    }
  }

  const handleExistingSession = async () => {
    setIsWorking(true)
    setError(null)
    try {
      await finalize('EXISTING_SESSION')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to submit the registration')
    } finally {
      setIsWorking(false)
    }
  }

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const parsed =
      mode === 'sign-up'
        ? signUpSchema.safeParse({
            name: fullName,
            email,
            password,
            confirmPassword,
          })
        : signInSchema.safeParse({ email, password })
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] || 'form')
        if (!nextErrors[field]) nextErrors[field] = issue.message
      }
      setFieldErrors(nextErrors)
      return
    }

    setIsWorking(true)
    try {
      const result =
        mode === 'sign-up'
          ? await signUp.email({
              name: fullName,
              email: parsed.data.email,
              password: parsed.data.password,
            })
          : await signIn.email({
              email: parsed.data.email,
              password: parsed.data.password,
            })

      if (result.error) {
        if (
          mode === 'sign-up' &&
          result.error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
        ) {
          setMode('sign-in')
          resetSensitiveFields()
          setError(
            'An account already exists for this email. Sign in with its password, or close this window and continue with Google.',
          )
          return
        }
        throw new Error(
          result.error.message ||
            (mode === 'sign-up'
              ? 'Unable to create this account. Try signing in if it already exists.'
              : 'The email or password is incorrect.'),
        )
      }

      setEmailOpen(false)
      resetSensitiveFields()
      await finalize('EMAIL_PASSWORD')
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to complete secure email sign in',
      )
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" onClick={onBack} disabled={isWorking}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to application
        </Button>

        <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              Final secure step
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Connect your application to your account
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your completed application is saved. Sign in once so we can securely create and
              connect your expert profile.
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-9">
            {!isPending && session?.user ? (
              <>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-950">Signed in securely</p>
                  <p className="mt-1 break-all text-sm text-emerald-800">
                    {session.user.email}
                  </p>
                </div>
                <Button
                  className="h-12 w-full bg-slate-950 text-white hover:bg-blue-700"
                  disabled={isWorking}
                  onClick={() => void handleExistingSession()}
                >
                  {isWorking ? 'Submitting securely...' : 'Submit expert application'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-center"
                  disabled={isPending || isWorking}
                  onClick={() => void handleGoogle()}
                >
                  <FcGoogle className="mr-3 h-5 w-5" /> Continue with Google
                </Button>
                <div className="relative py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span className="relative z-10 bg-white px-3">or</span>
                  <span className="absolute left-0 right-0 top-1/2 border-t border-slate-200" />
                </div>
                <Button
                  variant="outline"
                  className="h-12 w-full"
                  disabled={isPending || isWorking}
                  onClick={() => {
                    setError(null)
                    setEmailOpen(true)
                  }}
                >
                  <Mail className="mr-3 h-5 w-5" /> Continue with email
                </Button>
              </>
            )}

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <p className="pt-2 text-center text-xs leading-5 text-slate-500">
              Authentication creates or connects your SharingMinds account. It does not approve
              the expert application; professional verification remains a separate review.
            </p>
          </div>
        </section>
      </div>

      <Dialog
        open={emailOpen}
        onOpenChange={open => {
          if (isWorking) return
          setEmailOpen(open)
          if (!open) {
            resetSensitiveFields()
            setError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Continue securely with email</DialogTitle>
            <DialogDescription>
              Sign in to an existing account or create one without leaving your application.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={mode}
            onValueChange={value => {
              setMode(value as 'sign-in' | 'sign-up')
              setError(null)
              resetSensitiveFields()
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign in</TabsTrigger>
              <TabsTrigger value="sign-up">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value={mode} className="mt-5">
              <form className="space-y-4" onSubmit={handleEmailAuth}>
                <div className="space-y-2">
                  <Label htmlFor="registration-auth-email">Email address</Label>
                  <Input
                    id="registration-auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration-auth-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="registration-auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      className="pr-11"
                      aria-invalid={Boolean(fieldErrors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(value => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                  {mode === 'sign-up' && !fieldErrors.password && (
                    <p className="text-xs text-slate-500">
                      Use 8–128 characters with at least one letter and one number.
                    </p>
                  )}
                </div>
                {mode === 'sign-up' && (
                  <div className="space-y-2">
                    <Label htmlFor="registration-auth-confirm-password">
                      Confirm password
                    </Label>
                    <Input
                      id="registration-auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={event => setConfirmPassword(event.target.value)}
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full bg-slate-950 hover:bg-blue-700"
                  disabled={isWorking}
                >
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  {isWorking
                    ? 'Securing your application...'
                    : mode === 'sign-up'
                      ? 'Create account and submit'
                      : 'Sign in and submit'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
