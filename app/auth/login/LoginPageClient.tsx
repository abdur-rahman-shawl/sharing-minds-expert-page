'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'
import { useAuth } from '@/contexts/auth-context'
import { FcGoogle } from 'react-icons/fc'
import { FaLinkedin } from 'react-icons/fa'
import { createAuthClient } from 'better-auth/react'

const client = createAuthClient()

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

// --- SUB-COMPONENT: SIGN IN FORM ---
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
    // Reduced space-y from 5 to 4 (mobile) and 3 (laptop)
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:space-y-3">
      <div className="space-y-1.5 lg:space-y-1">
        <Label htmlFor="email" className="text-gray-600 font-medium ml-1">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          {...form.register('email')} 
          // h-12 on mobile, h-10 on laptop to save vertical space
          className="rounded-xl h-12 lg:h-10 text-base border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200" 
          placeholder="name@example.com"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1 ml-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5 lg:space-y-1">
        <Label htmlFor="password" className="text-gray-600 font-medium ml-1">Password</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? 'text' : 'password'} 
            {...form.register('password')} 
            className="rounded-xl h-12 lg:h-10 text-base border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200 pr-10" 
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-red-500 mt-1 ml-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

      <Button 
        type="submit" 
        disabled={isLoading} 
        // Reduced height on laptop
        className="w-full h-12 lg:h-10 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 mt-2"
      >
        {isLoading ? 'Signing In...' : 'Sign In to Founding Cohort'}
      </Button>
    </form>
  )
}

// --- SUB-COMPONENT: SIGN UP FORM ---
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
    // Tightened spacing significantly for desktop (space-y-2) to fit 4 inputs
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 lg:space-y-2">
      <div className="space-y-1">
        <Label htmlFor="name" className="text-gray-600 font-medium ml-1">Full Name</Label>
        <Input 
          id="name" 
          type="text" 
          {...form.register('name')} 
          // h-11 mobile, h-9 or h-10 desktop
          className="rounded-xl h-11 lg:h-9 xl:h-10 text-base border-gray-200 bg-gray-50 focus:bg-white" 
        />
        {form.formState.errors.name && (
          <p className="text-xs text-red-500 mt-0.5 ml-1">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-gray-600 font-medium ml-1">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          {...form.register('email')} 
          className="rounded-xl h-11 lg:h-9 xl:h-10 text-base border-gray-200 bg-gray-50 focus:bg-white" 
        />
        {form.formState.errors.email && (
          <p className="text-xs text-red-500 mt-0.5 ml-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password" className="text-gray-600 font-medium ml-1">Password</Label>
        <Input 
          id="password" 
          type="password" 
          {...form.register('password')} 
          className="rounded-xl h-11 lg:h-9 xl:h-10 text-base border-gray-200 bg-gray-50 focus:bg-white" 
        />
        {form.formState.errors.password && (
          <p className="text-xs text-red-500 mt-0.5 ml-1">{form.formState.errors.password.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirmPassword" className="text-gray-600 font-medium ml-1">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...form.register('confirmPassword')}
            className="rounded-xl h-11 lg:h-9 xl:h-10 text-base border-gray-200 bg-gray-50 focus:bg-white pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-0.5 ml-1">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full h-12 lg:h-10 rounded-xl text-base font-semibold shadow-md mt-2 lg:mt-3">
        {isLoading ? 'Creating Account...' : 'Request Founding Access'}
      </Button>
    </form>
  )
}

// --- MAIN PAGE COMPONENT ---
export default function LoginPageClient() {
  const [isSigningIn, setIsSigningIn] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { signIn } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signIn('social', {
        provider: 'google',
        callbackURL: callbackUrl,
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleLinkedInSignIn = async () => {
    try {
      await signIn('social', {
        provider: 'linkedin',
        callbackURL: callbackUrl,
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    // Changed: h-screen overflow-hidden ensures it never scrolls the main window
    <div className="flex flex-col lg:flex-row h-screen max-h-screen bg-white overflow-hidden">
      
      {/* 
        Container Logic:
        1. overflow-y-auto: Allows scrolling ONLY inside this panel if screen is tiny (phone landscape), 
           but on laptop it should fit.
        2. scrollbar-hide: Keeps the clean look even if it overflows slightly.
        3. justify-center: Vertically centers content.
      */}
      <div className="flex-1 flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12 relative h-full overflow-y-auto no-scrollbar">
        
        {/* Navigation Button */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-8 z-20">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-sm lg:max-w-md mx-auto flex flex-col justify-center">
          {/* Logo Container - Tightened mb */}
          <Link href="/" className="flex justify-center mb-6 lg:mb-4" aria-label="SharingMinds home">
            <Image
              src="/sharing-minds-logo.png"
              alt="SharingMinds logo"
              width={400}
              height={125}
              // Shrunk logo height for laptops
              className="h-20 lg:h-16 xl:h-20 w-auto object-contain transition-all" 
            />
          </Link>
          
          {/* Headline - Updated Text */}
          <h1 className="text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-6 lg:mb-4 text-center tracking-tight transition-all leading-tight">
            Transforming minds into <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Institutions!</span>
          </h1>
          
          {/* Google Button - Reduced height and margin */}
          <div className="space-y-4 mb-6 lg:mb-4">
            <Button 
              variant="outline" 
              className="w-full h-12 lg:h-10 rounded-xl text-base font-medium border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm" 
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="h-5 w-5" />

              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full py-3 btn-ghost-luxe bg-gradient-to-r from-[#0A66C2]/80 to-[#004182]/70 text-white border-transparent hover:scale-[1.01]"
              onClick={handleLinkedInSignIn}
            >
              <FaLinkedin className="mr-2 h-5 w-5" />
              Continue with LinkedIn
            </Button>
          </div>

          <div className="relative mb-6 lg:mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Form Container */}
          <div className="mb-4 lg:mb-2">
             {isSigningIn ? <SignInForm /> : <SignUpForm />}
          </div>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-500">
              {isSigningIn ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsSigningIn(!isSigningIn)} 
                className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
              >
                {isSigningIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 h-full">
        <Image
          src="/sign-in-banner.jpeg"
          alt="Connect. Learn. Grow."
          layout="fill"
          objectFit="cover"
          priority
          className="opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center leading-tight px-8">
            <span className="block mb-2">Your Space for</span>
            <span className="block text-gray-200">Growth. Purpose. Possibilities</span>
          </h2>
        </div>
      </div>
    </div>
  )
}