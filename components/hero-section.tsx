'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
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

    router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/registration')}`)
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

  // Gentle delayed reveal for hero content
  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen px-4 overflow-hidden flex items-center -mt-10">
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-xy"></div>
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-blue-100/40 via-transparent to-indigo-100/40 animate-gradient-slow"></div>
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-bl from-transparent via-purple-50/30 to-blue-100/30 animate-gradient-diagonal"></div>

      {/* Fluid, morphing blobs for a premium, visible motion */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-[48rem] h-[48rem] opacity-60 blur-2xl blob-shape animate-blob animate-blob-slower saturate-150 
          bg-gradient-to-tr from-blue-500/45 via-indigo-500/35 to-purple-500/45" />
        <div className="absolute top-36 -right-28 w-[40rem] h-[40rem] opacity-50 blur-2xl blob-shape animate-blob animate-delay-5s saturate-150 
          bg-gradient-to-tr from-sky-500/40 via-blue-500/35 to-indigo-500/40" />
        <div className="absolute -bottom-28 left-1/3 w-[44rem] h-[44rem] opacity-45 blur-2xl blob-shape animate-blob animate-delay-10s saturate-150 
          bg-gradient-to-tr from-violet-500/35 via-indigo-500/30 to-blue-500/35" />
      </div>

      {/* Navigation is provided globally via layout header */}

      <div
        className={`max-w-6xl mx-auto text-center relative z-10 animate-on-scroll will-change-opacity ${reveal ? "animate-fade-in" : ""}`}
      >
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
          Join SharingMinds as an Expert
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
          Empower minds by becoming a mentor. Create your profile, share expertise and connect 1 to 1 on video calls
          with mentees.
        </p>
        <p className="text-gray-500 mb-12 italic">"Lead with experience, empowers with guidance"</p>

        {/* Show loading state */}
        {isPending ? (
          <div className="max-w-lg mx-auto mb-12">
            <Card className="border-2 border-gray-200 animate-pulse">
              <CardContent className="p-8">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </CardContent>
            </Card>
          </div>
        ) : session?.user ? (
          /* Show welcome with mentor status */
          <div className="max-w-lg mx-auto mb-12">
            {!mentorStatusLoading && isMentor ? (
              /* Show appreciation for registered mentors */
              <div className="relative group animate-fade-in-slow">
                {/* Subtle glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/50 shadow-2xl overflow-hidden">
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] animate-shimmer pointer-events-none"></div>

                  <div className="text-center mb-6 relative z-10">
                    {/* Premium icon with subtle animation */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                      <Star className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600 fill-purple-600" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold mb-2 tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 animate-gradient-text">
                        Thank You for Being a Mentor!
                      </span>
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm font-light tracking-wide px-2">
                      Your expertise is shaping the next generation
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 blur-sm"></div>
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 relative border-2 border-white/80">
                          <AvatarImage src={session.user.image || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 font-medium text-sm">
                            {getUserInitials(session.user.name, session.user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-gray-900 tracking-tight capitalize text-sm sm:text-base truncate">{mentor?.fullName || session.user.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse flex-shrink-0"></div>
                          <span className="text-[10px] sm:text-xs text-gray-500 font-light tracking-wide uppercase">Registered • We'll get back to you</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 font-medium w-full sm:w-auto"
                    >
                      Sign out
                    </Button>
                  </div>

                  {mentor?.verificationStatus === 'VERIFIED' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium tracking-wide"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Show regular welcome for non-mentors */
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                        {getUserInitials(session.user.name, session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-600">Welcome back,</p>
                      <p className="font-medium text-gray-900">{session.user.name || session.user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isMentor && (
                      <Button
                        onClick={handleRegisterClick}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Become a Mentor
                      </Button>
                    )}
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Show registration options for non-authenticated users */
          <div className="max-w-lg mx-auto mb-12 space-y-4">
            <Button
              onClick={handleRegisterClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium"
            >
              Register as a Mentor
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 font-medium flex items-center justify-center gap-2"
            >
              <FcGoogle className="h-5 w-5" />
              Register with Google
            </Button>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <img
              src="/professional-headshot.png"
              alt="Ulysses Rodriguez"
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">"Helped me connect with amazing talents."</p>
              <p className="text-xs text-gray-500">Ulysses Rodriguez, Instructor and upskill experts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}