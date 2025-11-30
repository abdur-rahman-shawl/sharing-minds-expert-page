"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  UserCircle, 
  Users, 
  Wallet, 
  Sparkles, 
  BarChart3, 
  LineChart, 
  ArrowUpRight 
} from "lucide-react"

export function BenefitsSection() {
  const { ref: sectionRef } = useScrollAnimation(0.1)
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2)
  
  const { ref: card0Ref, isVisible: card0Visible } = useScrollAnimation(0.1)
  const { ref: card1Ref, isVisible: card1Visible } = useScrollAnimation(0.1)
  const { ref: card2Ref, isVisible: card2Visible } = useScrollAnimation(0.1)
  const { ref: card3Ref, isVisible: card3Visible } = useScrollAnimation(0.1)
  const { ref: card4Ref, isVisible: card4Visible } = useScrollAnimation(0.1)
  const { ref: card5Ref, isVisible: card5Visible } = useScrollAnimation(0.1)

  const cardRefs = [
    { ref: card0Ref, isVisible: card0Visible },
    { ref: card1Ref, isVisible: card1Visible },
    { ref: card2Ref, isVisible: card2Visible },
    { ref: card3Ref, isVisible: card3Visible },
    { ref: card4Ref, isVisible: card4Visible },
    { ref: card5Ref, isVisible: card5Visible },
  ]

  const benefits = [
    {
      title: "Build Your Professional Brand",
      icon: UserCircle,
      description: (
        <>
          Create a stunning mentor profile that highlights your experience, achievements, and industry credibility. Go
          beyond the traditional bio — feature your verified testimonials, thought-leadership blogs, and mentorship
          impact data. Your mentor profile isn't just a listing — it's your{" "}
          <strong className="font-semibold text-slate-900">digital portfolio of leadership and influence</strong>.
        </>
      ),
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Connect with the Right Mentees",
      icon: Users,
      description: (
        <>
          Be discovered by mentees who are genuinely looking for your kind of guidance — from emerging professionals and
          founders to career changers and students. Engage through personalized sessions, ongoing mentorship programs,
          and community discussions that <strong className="font-semibold text-slate-900">transform casual connections into meaningful relationships.</strong>
        </>
      ),
      image: "/connect-with-mentees.jpeg",
    },
    {
      title: "Monetize Your Expertise",
      icon: Wallet,
      description: (
        <>
          Get rewarded for the knowledge and experience you've built over years. Mentors on SharingMinds can earn{" "}
          <strong className="font-semibold text-slate-900">up to $500 a month or more</strong>, depending on engagement and demand. Turn your mentoring time into
          a consistent income stream while continuing to do what you love —{" "}
          <strong className="font-semibold text-slate-900">sharing wisdom.</strong>
        </>
      ),
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "AI Matchmaking + Human Touch",
      icon: Sparkles,
      description: (
        <>
          Our advanced AI algorithm ensures every mentee-mentor connection feels natural and purposeful. It studies
          goals, learning styles, and expertise areas to suggest ideal matches — while our team adds a{" "}
          <strong className="font-semibold text-slate-900">human layer of review</strong> to ensure quality, chemistry, and mutual fit.
        </>
      ),
      image: "/match-making.jpeg",
    },
    {
      title: "Data Access & Tracking",
      icon: BarChart3,
      description: (
        <>
          Access and export all your mentorship data with ease through a powerful mentor dashboard. Track mentee
          progress, manage your bookings, and monitor your impact with clarity and convenience.{" "}
          <strong className="font-semibold text-slate-900">Data-driven insights</strong> ensure you stay organized and always aware of your mentorship journey's
          measurable outcomes.
        </>
      ),
      image: "/efficient-mentor-data.jpeg",
    },
    {
      title: "Measure Success, Amplify Impact",
      icon: LineChart,
      description: (
        <>
          Get real-time feedback, progress insights, and performance benchmarks — all in one intuitive dashboard.
          SharingMinds gives you <strong className="font-semibold text-slate-900">actionable analytics</strong> to refine your mentoring approach, enhance
          outcomes, and celebrate growth milestones.
        </>
      ),
      features: [
        "Live feedback & sentiment tracking",
        "Dashboard analytics & benchmarking",
        "Real-time reporting & monthly summaries",
        "Continuous performance insights",
      ],
      image: "/success-metrics.jpeg",
    },
  ]

  return (
    <section ref={sectionRef} className="relative z-10 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-indigo-50/20 -z-10" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`mb-24 text-center transition-all duration-700 ease-out ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="mb-8 inline-flex justify-center">
            <span className="relative inline-block overflow-hidden rounded-full p-[2px]">
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#6366f1_50%,#E2E8F0_100%)]" />
              <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-indigo-600 backdrop-blur-3xl shadow-lg">
                Why Mentor With Us?
              </div>
            </span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Mentorship Journey</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600 leading-relaxed">
            SharingMinds is designed for leaders who want to make their experience impactful while being recognized, rewarded, and connected.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {benefits.map((benefit, index) => {
            const { ref: cardRef, isVisible: cardVisible } = cardRefs[index]
            const Icon = benefit.icon

            return (
              <div
                key={benefit.title}
                ref={cardRef}
                className={`group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${
                  cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* 
                   IMAGE SECTION:
                   - aspect-video ensures 16:9 ratio
                   - object-center ensures the image is vertically centered
                */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100">
                  <div className="absolute inset-0 bg-slate-100 animate-pulse" />
                  
                  <img
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 will-change-transform group-hover:scale-105"
                  />
                  
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none" />
                </div>
                
                {/* Content Section */}
                <div className="flex flex-1 flex-col p-8 sm:p-10">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {benefit.title}
                      </h3>
                    </div>
                    
                    <ArrowUpRight className="h-6 w-6 text-slate-300 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                  
                  <div className="mb-6 flex-1 text-lg leading-relaxed text-slate-600">
                    {benefit.description}
                  </div>
                  
                  {benefit.features && (
                    <div className="mt-auto rounded-xl bg-slate-50/80 p-5 border border-slate-100">
                      <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                        {benefit.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}