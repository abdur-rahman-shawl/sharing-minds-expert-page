'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { FaLinkedin } from "react-icons/fa"
import { signIn, useSession } from "@/lib/auth-client"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useMentorStatus } from "@/hooks/use-mentor-status"

export function FinalCTASection() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { isMentor, isLoading: mentorStatusLoading } = useMentorStatus()

  const handleBecomeMentor = () => {
    if (isMentor) {
      router.push('/vip-lounge')
      return
    }
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
      console.error("Sign in error:", error)
    }
  }

  const handleLinkedInSignIn = async () => {
    try {
      await signIn.social({
        provider: 'linkedin',
        callbackURL: '/registration'
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-4 py-24 sm:px-6 sm:py-32">
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5">
          <div className="grid lg:grid-cols-5">
            
            {/* Left Content Side */}
            <div className="px-8 py-12 lg:col-span-3 lg:p-14">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Ready to Shape the Future?
              </h2>
              <p className="mb-8 text-lg text-slate-600 leading-relaxed">
                Join our private circle of category-defining experts. Experience white-glove onboarding, concierge support, and influence our product roadmap.
              </p>

              {isPending || mentorStatusLoading ? (
                <div className="max-w-md">
                   <div className="h-12 w-full bg-slate-100 rounded-lg animate-pulse"></div>
                </div>
              ) : session?.user ? (
                <div className="rounded-xl bg-indigo-50/50 p-6 border border-indigo-100">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                    <p className="text-slate-700 font-medium">
                      Signed in as {session.user.name}
                    </p>
                  </div>
                  
                  {/* LOGGED IN BUTTON - Premium Style */}
                  <Button
                    onClick={handleBecomeMentor}
                    className="group relative w-full h-12 text-base font-semibold text-white bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 shadow-md hover:shadow-indigo-500/25 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-1000 ease-in-out z-10" />
                    
                    <span className="relative z-20 flex items-center justify-center gap-2">
                      {isMentor ? 'Enter VIP Lounge' : 'Continue Application'} 
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-w-md">
                  
                  {/* PRIMARY ACTION BUTTON - Premium Style */}
                  <Button
                    onClick={handleBecomeMentor}
                    className="group relative w-full h-14 text-base font-semibold text-white bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 shadow-xl hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)] hover:scale-[1.02]"
                  >
                    {/* Background & Shine Layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-1000 ease-in-out z-10" />

                    <span className="relative z-20 flex items-center justify-center gap-2">
                      Request Founding Access
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </span>
                  </Button>
                  
                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* SECONDARY BUTTON - Tactile Lift Style */}
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="relative w-full h-12 bg-white border-slate-200 text-slate-700 font-medium transition-all duration-300 hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
                  >
                    <FcGoogle className="h-5 w-5 mr-3" />
                    Fast Track with Google
                  </Button>
                  <Button
                    onClick={handleLinkedInSignIn}
                    variant="outline"
                    className="w-full h-12 font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2]/90 to-[#004182]/80 text-white border-transparent hover:brightness-110"
                  >
                    <FaLinkedin className="h-5 w-5 mr-3" />
                    Fast Track with LinkedIn
                  </Button>
                </div>
              )}
            </div>

            {/* Right Visual Side */}
            <div className="relative bg-slate-900 lg:col-span-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
                {/* Decorative circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]">
                    <div className="absolute inset-0 border-[40px] border-white/5 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border-[40px] border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                </div>
                
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center text-white/90">
                    <div className="mb-4 rounded-full bg-white/10 p-3 backdrop-blur-sm shadow-inner ring-1 ring-white/20">
                        <CheckCircle2 className="h-8 w-8 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-wide">Verified Community</h3>
                    <p className="mt-2 text-sm text-indigo-200 font-medium tracking-wide">High trust. High touch.</p>
                </div>
                </div>
          </div>
        </div>
        </div>
    </section>
  )
}
