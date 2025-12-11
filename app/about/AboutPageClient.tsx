'use client'
import { HeartHandshake, Target, Users2, CheckCircle2 } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { FaLinkedin } from "react-icons/fa"
import { signIn, useSession } from "@/lib/auth-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      icon: <HeartHandshake className="h-6 w-6 text-blue-600" />,
      title: "Human-first",
      desc: "Real conversations, empathy, and mutual respect are at the core of great mentorship.",
    },
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Outcome‑oriented",
      desc: "We focus on measurable improvements and practical next steps after every session.",
    },
    {
      icon: <Users2 className="h-6 w-6 text-blue-600" />,
      title: "Trust & Safety",
      desc: "Verified experts, transparent expectations, and privacy‑first design.",
    },
  ]

  const valueCardRefs = values.map(() => useScrollAnimation(0.1))

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section
        ref={heroRef}
        className={`relative bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-20 sm:px-6 sm:py-28 animate-on-scroll ${
          heroVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Us</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Welcome to SharingMinds Mentor Onboarding!
          </p>
          <div className="max-w-3xl mx-auto text-base text-gray-400 space-y-4">
            <p>
              We’re building SharingMinds — a collaborative platform designed to connect mentors, professionals, founders, and learners through purposeful interactions.
            </p>
            <p>
              At this stage of development, our focus is on shaping a robust ecosystem that empowers mentors to share their knowledge, guide meaningful growth journeys, and create lasting impact for mentees.
            </p>
            <p>
              Sign Up and join us in co-creating a community where experience meets curiosity, and every conversation adds value.
            </p>
          </div>
        </div>
      </section>

      {/* Trusted Mentorship Platform */}
      <section
        ref={trustedRef}
        className={`px-4 py-12 animate-on-scroll will-change-opacity sm:px-6 lg:px-8 ${
          trustedVisible ? "animate-fade-in-up" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8 text-center text-white sm:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted Mentorship Platform</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              SharingMinds Mentor Onboarding is trusted by mentors and mentees alike for its professional and impactful
              mentorship experiences.
            </p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-8 h-8 fill-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Beliefs */}
      <section
        ref={beliefsRef}
        className={`px-4 py-16 animate-on-scroll will-change-opacity sm:px-6 lg:px-8 ${
          beliefsVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Content */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Beliefs</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  At SharingMinds, we believe in the power of mentorship to inspire, guide, and uplift individuals
                  towards their full potential.
                </p>
                <p>
                  Our platform is built on the belief that mentorship can create positive change and drive personal and
                  professional growth.
                </p>
                <p>
                  Mentorship isn't a privilege anymore — it's a growth multiplier. Our platform will now allow us to
                  make it available to anyone, anywhere.
                </p>
              </div>
            </div>

            {/* Collage Images */}
            <div className="lg:col-span-7 grid grid-cols-2 auto-rows-[140px] gap-3 sm:grid-cols-3 sm:auto-rows-[180px] lg:auto-rows-[1fr] lg:gap-4 lg:h-[500px]">
              <div className="col-span-2 row-span-2">
                <img
                  src="/images/mentoring-session.jpg"
                  alt="Mentoring session"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="col-span-1 row-span-1">
                <img
                  src="/images/team-meeting.jpg"
                  alt="Team meeting"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="col-span-1 row-span-2">
                <img
                  src="/images/professional-woman.jpg"
                  alt="Professional woman"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="col-span-2 row-span-1">
                <img
                  src="/images/workshop-mentor.jpg"
                  alt="Workshop mentor"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section
        ref={teamRef}
        className={`bg-slate-800 px-4 py-16 text-white animate-on-scroll will-change-opacity sm:px-6 ${
          teamVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Team</h2>
          <div className="space-y-6 text-gray-300">
            <p>
              SharingMinds has been founded by a group of passionate individuals dedicated to fostering mentorship
              opportunities for the next generation.
            </p>
            <p>
              It's an AI-powered, next-gen platform redefining mentorship and career guidance in India — built to
              solve trust gaps and deliver credible, personalized guidance for students, professionals, and founders.
            </p>
            <p>
              Our platform is being built by a high-caliber team of tech leaders and developers with proven track
              records in AI, product development, and large-scale platform engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        ref={valuesRef}
        className={`px-4 py-16 animate-on-scroll will-change-opacity sm:px-6 lg:px-8 ${
          valuesVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Our Values</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, index) => {
              const { ref, isVisible } = valueCardRefs[index]
              return (
                <div
                  key={v.title}
                  ref={ref}
                  className={`rounded-xl border border-slate-200 bg-white p-6 animate-on-scroll will-change-opacity ${
                    isVisible ? `animate-fade-in-up animate-delay-${index * 100}` : ""
                  }`}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-3">
                    {v.icon}
                  </div>
                  <p className="font-semibold">{v.title}</p>
                  <p className="text-gray-600 mt-2">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mentor Signup Section */}
      <section
        ref={signupRef}
        className={`px-4 py-16 animate-on-scroll will-change-opacity sm:px-6 lg:px-8 ${
          signupVisible ? "animate-fade-in-up" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center sm:p-12">
            {/* Profile Photos Grid */}
            <div className="mb-8">
              <div className="mb-3 flex flex-wrap justify-center gap-3">
                {[
                  "/professional-mentor-headshot-1.jpg",
                  "/professional-mentor-headshot-2.jpg",
                  "/professional-mentor-headshot-3.jpg",
                  "/professional-mentor-headshot-4.jpg",
                  "/professional-mentor-headshot-5.jpg",
                  "/professional-mentor-headshot-6.jpg",
                  "/professional-mentor-headshot-7.jpg",
                ].map((src, i) => (
                  <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Mentor ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "/professional-mentor-headshot-8.jpg",
                  "/professional-mentor-headshot-9.jpg",
                  "/professional-mentor-headshot-10.jpg",
                  "/professional-mentor-headshot-11.jpg",
                  "/professional-mentor-headshot-12.jpg",
                  "/professional-mentor-headshot-13.jpg",
                ].map((src, i) => (
                  <div key={i + 7} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Mentor ${i + 8}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Join SharingMinds as a Mentor Today.</h2>

            {/* Testimonial */}
            <blockquote className="text-lg text-gray-600 italic mb-8 max-w-3xl mx-auto">
              "Sharing Minds Mentor Onboarding is a fantastic platform that has enabled me to share my knowledge and
              experience with aspiring individuals. The dashboard is user-friendly and efficient, making the mentoring
              process smooth and enjoyable."
              <cite className="block mt-2 not-italic font-medium">- Fred Taylor</cite>
            </blockquote>

            {/* Email Signup */}
            {isPending ? (
              <div className="max-w-md mx-auto">
                <Card className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </CardContent>
                </Card>
              </div>
            ) : session?.user ? (
              <div className="max-w-md mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-gray-700">
                        You're signed in as <span className="font-medium">{session.user.name || session.user.email}</span>
                      </p>
                    </div>
                    <Button
                      onClick={handleBecomeMentor}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                    >
                      Become a Mentor
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-4">
                <Button
                  onClick={handleBecomeMentor}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Become a Mentor
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-br from-blue-50 to-purple-50 px-2 text-gray-500">Or continue with</span>
                  </div>
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
