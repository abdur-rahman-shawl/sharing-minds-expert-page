'use client'

import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'

interface ApplicationAccessCardProps {
  step: 'email' | 'otp'
  email: string
  otp: string
  error: string | null
  isLoading: boolean
  resendSeconds: number
  onEmailChange: (email: string) => void
  onOtpChange: (otp: string) => void
  onRequestOtp: (event: FormEvent<HTMLFormElement>) => void
  onVerifyOtp: (event: FormEvent<HTMLFormElement>) => void
  onResendOtp: () => void
  onChangeEmail: () => void
}
export function ApplicationAccessCard({
  step,
  email,
  otp,
  error,
  isLoading,
  resendSeconds,
  onEmailChange,
  onOtpChange,
  onRequestOtp,
  onVerifyOtp,
  onResendOtp,
  onChangeEmail,
}: ApplicationAccessCardProps) {
  const isEmailStep = step === 'email'

  return (
    <Card className="overflow-hidden rounded-3xl border-white/20 bg-white/85 shadow-2xl ring-1 ring-slate-900/5 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
            {isEmailStep ? <Mail className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            {isEmailStep ? 'Verify your email to begin' : 'Enter your verification code'}
          </CardTitle>
        </div>
        <CardDescription className="text-base leading-relaxed text-slate-600">
          {isEmailStep
            ? 'No SharingMinds account is required. We will use this email to secure and recover your expert application.'
            : `We sent a six-digit code to ${email}. The code expires shortly.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {isEmailStep ? (
          <form className="space-y-5" onSubmit={onRequestOtp}>
            <div className="space-y-2">
              <Label htmlFor="applicationEmail">Email address</Label>
              <Input
                id="applicationEmail"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={event => onEmailChange(event.target.value)}
                placeholder="name@company.com"
                required
                disabled={isLoading}
                className="h-12 bg-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="h-12 w-full bg-slate-900 text-base font-semibold text-white hover:bg-slate-800"
            >
              {isLoading ? 'Sending secure code…' : 'Continue with email'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
            </Button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={onVerifyOtp}>
            <div className="space-y-3">
              <Label htmlFor="applicationOtp">Six-digit verification code</Label>
              <InputOTP
                id="applicationOtp"
                name="otp"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                value={otp}
                onChange={onOtpChange}
                disabled={isLoading}
                containerClassName="justify-center sm:justify-start"
                aria-describedby="otp-help"
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot key={index} index={index} className="h-12 w-11 text-lg sm:w-12" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <p id="otp-help" className="text-sm text-slate-500">
                Check your spam folder if the email does not arrive within a minute.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="h-12 w-full bg-slate-900 text-base font-semibold text-white hover:bg-slate-800"
            >
              {isLoading ? 'Verifying…' : 'Verify and start application'}
              {!isLoading && <ShieldCheck className="ml-2 h-4 w-4" aria-hidden="true" />}
            </Button>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 text-sm sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onChangeEmail}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Change email
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={onResendOtp}
                disabled={isLoading || resendSeconds > 0}
              >
                {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend code'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-indigo-50/70 p-4 text-sm text-indigo-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
          <p>
            Email verification protects your application. When you later join SharingMinds with the
            same verified email, we can securely connect this application to your account.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
