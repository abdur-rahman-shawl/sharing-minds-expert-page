'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'
import { useAuth } from '@/contexts/auth-context'
import { FcGoogle } from 'react-icons/fc'
import { createAuthClient } from 'better-auth/react'

const client = createAuthClient()

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { signIn } = useAuth()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SignInFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await signIn('email', values)
      router.replace(callbackUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} {...form.register('password')} />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  )
}

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await client.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" type="text" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...form.register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}

export default function LoginPageClient() {
  const [isSigningIn, setIsSigningIn] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { signIn } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 bg-white p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-3 mb-8" aria-label="SharingMinds home">
            <Image
              src="/sharing-minds-logo.png"
              alt="SharingMinds logo"
              width={200}
              height={62.5}
              className="h-14 w-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="block">Unlock your potential.</span>
            <span className="block text-2xl text-gray-600">Transforming minds into institutions</span>
          </h1>
          
          <div className="space-y-4 mt-6">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {isSigningIn ? <SignInForm /> : <SignUpForm />}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSigningIn ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={() => setIsSigningIn(!isSigningIn)} className="font-medium text-primary hover:underline">
                {isSigningIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/2 relative">
        <Image
          src="/sign-in-banner.jpeg"
          alt="Connect. Learn. Grow."
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white text-center">
            <span className="block">Your Space for</span>
            <span className="block">Growth. Purpose. Possibilities</span>
          </h2>
        </div>
      </div>
    </div>
  )
}