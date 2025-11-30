'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { FaLinkedin } from "react-icons/fa"
import { signIn, signOut, useSession } from "@/lib/auth-client"
import { useMentorStatus } from "@/hooks/use-mentor-status"

export function HeroSection() {
  const [reveal, setReveal] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { isMentor, mentor, isLoading: mentorStatusLoading } = useMentorStatus()

  const handleRegisterClick = () => {
    if (session?.user) {
      router.push('/registration')
      return
    }
    router.push(`/auth/login?callbackUrl=${encodeURIComponent('/registration')}`)
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/registration'
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleLinkedInSignIn = async () => {
    try {
      await signIn.social({
        provider: 'linkedin',
        callbackURL: '/registration'
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  }

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative mt-[-48px] flex min-h-[85vh] flex-col justify-center overflow-hidden pt-20 pb-16 sm:mt-[-64px] sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28">
      
      {/* Background image layer */}
      <div
        className={`absolute inset-0 z-0 bg-[url('/mentor-background-photo.png')] bg-cover bg-top transition-opacity duration-1000 ${
          reveal ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 transition-all duration-1000 ease-out ${reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white/50 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur-sm mb-6 shadow-sm ring-1 ring-white/50">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
          Invitation Only
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl drop-shadow-sm">
          The Founding <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Mentor Cohort</span>
        </h1>
        
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
          A private circle of category-defining experts shaping our platform. 
          White-glove onboarding and priority access for pioneers.
        </p>

        {/* Logic Block */}
        {isPending ? (
          <div className="max-w-lg mx-auto mb-10">
            <Card className="border border-slate-200/60 shadow-lg bg-white/50 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="h-12 bg-slate-200/50 rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-slate-200/50 rounded w-3/4 mx-auto animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        ) : session?.user ? (
          <div className="max-w-lg mx-auto mb-10">
            {!mentorStatusLoading && isMentor ? (
              <div className="relative group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white shadow-2xl ring-1 ring-slate-900/5 transition-transform duration-500 group-hover:scale-[1.01]">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Star className="h-7 w-7 text-indigo-600 fill-indigo-600 animate-[spin_10s_linear_infinite]" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Welcome, Founding Mentor
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                        <AvatarImage src={session.user.image || undefined} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                          {getUserInitials(session.user.name, session.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium text-slate-900 text-sm">{mentor?.fullName || session.user.name}</p>
                        <p className="text-xs text-slate-500 font-medium">Verified Mentor</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-900 hover:bg-white"
                    >
                      Sign out
                    </Button>
                  </div>

                  {mentor?.verificationStatus === 'VERIFIED' && (
                    <div className="mt-4">
                      <Button
                        onClick={() => router.push('/dashboard')}
                        className="group relative w-full overflow-hidden bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 hover:scale-[1.02]"
                      >
                         <span className="relative z-10 flex items-center justify-center gap-2">
                           Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </span>
                         {/* Shine Effect */}
                         <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl p-6 ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-indigo-50 text-indigo-700">
                        {getUserInitials(session.user.name, session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm text-slate-500">Logged in as</p>
                      <p className="font-semibold text-slate-900">{session.user.name || session.user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {!isMentor && (
                      <Button 
                        onClick={handleRegisterClick} 
                        size="sm" 
                        className="flex-1 bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg transition-all"
                      >
                        Apply Now
                      </Button>
                    )}
                    <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-slate-500 hover:bg-white/50">
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto mb-12 space-y-4">
            
            {/* PRIMARY LUXE BUTTON */}
            <Button
              onClick={handleRegisterClick}
              className="group relative w-full h-14 text-base font-semibold text-white bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 shadow-xl hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
              
              {/* Shine Animation Layer */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-1000 ease-in-out z-10" />

              <span className="relative z-20 flex items-center justify-center gap-2">
                Request Founding Access 
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </span>
            </Button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-900/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                <span className="bg-transparent px-2 text-slate-500">or</span>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="btn-ghost-luxe w-full h-12 font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-black/30 to-black/20 text-amber-50 border-amber-200/40"
              >
                <FcGoogle className="h-5 w-5" />
                Fast Track with Google
              </Button>
              <Button
                onClick={handleLinkedInSignIn}
                variant="outline"
                className="w-full h-12 font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2]/90 to-[#004182]/80 text-white border-transparent hover:brightness-110"
              >
                <FaLinkedin className="h-5 w-5" />
                Fast Track with LinkedIn
              </Button>
            </div>
          </div>
        )}

        {/* Social Proof */}
        <div className="flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-full bg-white/40 backdrop-blur-md border border-white/40 p-2 pr-6 shadow-sm transition-transform hover:scale-105 duration-300 cursor-default">
                <img
                src="/professional-headshot.png"
                alt="Ulysses Rodriguez"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
                <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 leading-none">"Helped me connect with amazing talents."</p>
                    <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wide">Ulysses Rodriguez • Upskill Expert</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}