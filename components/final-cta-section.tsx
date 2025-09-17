'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { signIn, signOut, useSession } from "@/lib/auth-client"
import { CheckCircle2 } from "lucide-react"

// Final CTA card styled to match the provided reference image
export function FinalCTASection() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const { data: session, isPending } = useSession()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/verify-email?email=${encodeURIComponent(email)}`)
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google'
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <section className="relative py-20 px-4 bg-[#eaf4fb]" aria-labelledby="mentor-cta-heading">
      {/* dotted pattern on the top-right of the section */}
      <div
        className="pointer-events-none absolute right-6 md:right-16 top-4 md:top-6 h-24 w-40 opacity-40 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.25) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-300/60 bg-[linear-gradient(180deg,#f5fbff,white_30%)] p-6 sm:p-10 md:p-12 shadow-[0_10px_30px_-10px_rgba(2,6,23,0.15)] min-h-[300px] md:min-h-[clamp(360px,36vw,460px)] grid place-items-center">
          {/* decorative diagonal shapes inside card (persistently visible) */}
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,260 1200,140 1200,400 0,400" fill="rgba(59,130,246,0.12)" />
            <polygon points="0,340 720,230 1200,280 1200,400 0,400" fill="rgba(99,102,241,0.10)" />
          </svg>

          <div className="relative z-10 w-full">
            <h2
              id="mentor-cta-heading"
              className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Join SharingMinds as a Mentor Today.
            </h2>

            <p className="mt-6 text-center text-[17px] leading-relaxed text-slate-700 italic max-w-3xl mx-auto">
              "SharingMinds Mentor Onboarding has enabled me early access of tools and priority founder mentor status." –
              Amit Sawant
            </p>

            {isPending ? (
              <div className="mt-10 mx-auto max-w-xl">
                <Card className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-12 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                  </CardContent>
                </Card>
              </div>
            ) : session?.user ? (
              <div className="mt-10 mx-auto max-w-xl">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-slate-700">
                        You're signed in as <span className="font-medium">{session.user.name || session.user.email}</span>
                      </p>
                    </div>
                    <Button
                      onClick={async () => {
                        await signOut()
                        router.refresh()
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-10 mx-auto max-w-xl space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email to sign up as a mentor"
                    className="h-12 bg-white border-slate-300 placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="h-12 px-5 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                    Sign Up as a Mentor
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full h-12 font-medium flex items-center justify-center gap-2 bg-white border-slate-300 hover:bg-slate-50"
                >
                  <FcGoogle className="h-5 w-5" />
                  Sign Up with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}