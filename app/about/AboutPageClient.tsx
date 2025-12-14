'use client'
import { HeartHandshake, Target, Users2, CheckCircle2, ArrowRight, ShieldCheck, Quote } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { FaLinkedin } from "react-icons/fa"
import { signIn, useSession } from "@/lib/auth-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AboutPageClient() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const handleBecomeMentor = () => {
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

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2)
  const { ref: trustedRef, isVisible: trustedVisible } = useScrollAnimation(0.2)
  const { ref: beliefsRef, isVisible: beliefsVisible } = useScrollAnimation(0.1)
  const { ref: teamRef, isVisible: teamVisible } = useScrollAnimation(0.1)
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation(0.1)
  const { ref: signupRef, isVisible: signupVisible } = useScrollAnimation(0.1)

  const values = [
    {
      icon: <HeartHandshake className="h-6 w-6 text-white" />,
      title: "Human-first",
      desc: "Real conversations, empathy, and mutual respect are at the core of great mentorship.",
      color: "bg-pink-500"
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Outcome‑oriented",
      desc: "We focus on measurable improvements and practical next steps after every session.",
      color: "bg-indigo-500"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Trust & Safety",
      desc: "Verified experts, transparent expectations, and privacy‑first design.",
      color: "bg-emerald-500"
    },
  ]

  const valueCardRefs = values.map(() => useScrollAnimation(0.1))

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section
        ref={heroRef}
        // CHANGED: Reduced padding-top significantly (pt-32 -> pt-24, sm:pt-40 -> sm:pt-32, etc.)
        className="relative flex flex-col justify-center pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden"
      >
        {/* Background System */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-white"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div 
          className={`max-w-4xl mx-auto text-center px-4 transition-all duration-1000 ease-out ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white/60 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur-sm mb-6 shadow-sm ring-1 ring-white/50">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            Our Mission
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl drop-shadow-sm">
            Bridging Experience <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">With Curiosity</span>
          </h1>
          
          <div className="mx-auto mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-slate-600 sm:text-xl font-light">
             <p>
              We’re building SharingMinds — a collaborative platform designed to connect mentors, professionals, founders, and learners through purposeful interactions.
            </p>
            <p className="font-medium text-slate-800">
              At this stage, our focus is simple: shape a robust ecosystem that empowers mentors to share knowledge and guide meaningful growth journeys.
            </p>
          </div>
        </div>
      </section>

      {/* --- TRUSTED PLATFORM BADGE --- */}
      <section
        ref={trustedRef}
        className={`px-4 py-12 relative z-10 -mt-8 transition-all duration-1000 delay-200 ${
          trustedVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl p-8 sm:p-12 text-center text-white ring-1 ring-white/10">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Trusted Mentorship Platform</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                SharingMinds is trusted by mentors and mentees alike for its professional, impactful, and data-driven mentorship experiences.
              </p>
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 sm:w-8 sm:h-8 fill-yellow-400 drop-shadow-lg" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR BELIEFS --- */}
      <section
        ref={beliefsRef}
        className="px-4 py-24 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            {/* Text Content */}
            <div 
              className={`lg:col-span-5 flex flex-col justify-center transition-all duration-1000 ${
                beliefsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-indigo-500"></div>
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Our Beliefs</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
                Mentorship is a <br />
                <span className="text-indigo-600">Growth Multiplier.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  At SharingMinds, we believe in the power of mentorship to inspire, guide, and uplift individuals towards their full potential.
                </p>
                <p>
                  Our platform is built on the belief that mentorship can create positive change. It isn't a privilege anymore — it's a necessity. 
                </p>
                <div className="flex items-center gap-3 font-medium text-slate-900">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  <span>Accessible to anyone, anywhere.</span>
                </div>
              </div>
            </div>

            {/* Premium Masonry Grid */}
            <div 
              className={`lg:col-span-7 grid grid-cols-2 gap-4 lg:gap-6 transition-all duration-1000 delay-200 ${
                beliefsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              {/* Column 1 - Staggered Down */}
              <div className="space-y-4 pt-12">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/mentoring-session.jpg"
                    alt="Mentoring session"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/team-meeting.jpg"
                    alt="Team meeting"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              
              {/* Column 2 */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                   <Image
                    src="/images/professional-woman.jpg"
                    alt="Professional woman"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                   <Image
                    src="/images/workshop-mentor.jpg"
                    alt="Workshop mentor"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR TEAM --- */}
      <section
        ref={teamRef}
        className="relative py-32 bg-slate-950 text-white overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
        
        <div 
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${
            teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-8">
            <Users2 className="w-4 h-4 mr-2" />
            Who We Are
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Our Team</h2>
          
          <div className="space-y-8 text-xl text-slate-300 font-light leading-relaxed">
            <p>
              SharingMinds has been founded by a group of passionate individuals dedicated to fostering mentorship opportunities for the next generation.
            </p>
            <p className="text-white font-normal text-2xl">
              It's an AI-powered, next-gen platform redefining career guidance in India — built to solve trust gaps and deliver credible, personalized guidance.
            </p>
            <p>
              Our platform is being built by a high-caliber team of tech leaders and developers with proven track records in <span className="text-indigo-400 font-medium">AI, product development, and large-scale platform engineering.</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section
        ref={valuesRef}
        className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Core Values</h2>
            <p className="mt-4 text-slate-600">The principles that guide every decision we make.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, index) => {
              const { ref, isVisible } = valueCardRefs[index]
              return (
                <div
                  key={v.title}
                  ref={ref}
                  className={`group relative rounded-3xl bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ring-1 ring-slate-200 ${
                    isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${v.color} shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- MENTOR SIGNUP --- */}
      <section
        ref={signupRef}
        className={`px-4 py-24 animate-on-scroll will-change-opacity sm:px-6 lg:px-8 bg-white ${
          signupVisible ? "animate-fade-in-up" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-2xl p-8 text-center sm:p-16">
            
            {/* Background Texture */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            
            <div className="relative z-10">
              {/* Profile Photos Grid - Animated */}
              <div className="mb-10">
                <div className="flex flex-wrap justify-center gap-[-12px] isolate">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-md -ml-3 hover:scale-110 hover:z-10 transition-transform duration-300">
                      <Image
                        src={`/professional-mentor-headshot-${i + 1}.jpg`}
                        alt={`Mentor ${i + 1}`}
                        width={60}
                        height={60}
                        className="w-full h-full object-cover"
                         // Fallback logic for demo
                         onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
                      />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-xs font-bold text-indigo-600 -ml-3 shadow-md z-10">
                    +200
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Join SharingMinds <br/> as a Mentor Today.</h2>

              {/* Testimonial */}
              <div className="max-w-2xl mx-auto mb-10">
                 <Quote className="w-8 h-8 text-indigo-200 mx-auto mb-4" />
                 <p className="text-xl text-slate-600 font-light italic">
                  "SharingMinds is a fantastic platform that enabled me to share my knowledge. The dashboard is efficient, making the mentoring process smooth."
                 </p>
                 <p className="mt-4 font-semibold text-slate-900">— Fred Taylor</p>
              </div>

              {/* Action Buttons */}
              {isPending ? (
                <div className="max-w-md mx-auto h-14 bg-slate-100 rounded-full animate-pulse" />
              ) : session?.user ? (
                <div className="max-w-md mx-auto">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-2 shadow-sm inline-flex items-center gap-4 pr-6">
                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                     </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900">{session.user.name}</p>
                    </div>
                    <Button
                      onClick={handleBecomeMentor}
                      className="ml-4 rounded-full bg-slate-900 text-white hover:bg-slate-800"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-4">
                  <Button
                    onClick={handleBecomeMentor}
                    className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all"
                  >
                    Become a Mentor
                  </Button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                      <span className="bg-white px-3 text-slate-400">Or</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-center gap-2"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Sign Up with Google
                  </Button>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Sign Up with Google
                  </Button>
                  <Button
                    onClick={handleLinkedInSignIn}
                    variant="outline"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FaLinkedin className="h-5 w-5 text-[#0A66C2]" />
                    Sign Up with LinkedIn
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}