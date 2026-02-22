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
      title: "Build Your Professional Presence",
      icon: UserCircle,
      description: (
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-800">Practitioner Profile — A Clear, Practical Snapshot</p>
          <p>
            Share the signals that matter: roles you&apos;ve held, key outcomes you delivered, relevant case examples, and vetted endorsements. Not a CV — a practical portrait that helps leaders decide to speak with you.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500" />
            Set Up Your Profile — Takes ~5 minutes. Share key roles, outcomes, and areas of expertise.
          </div>
        </div>
      ),
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Matching & Requests",
      icon: Users,
      description: (
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-800">Better Matches, Better Conversations</p>
          <p>
            We route leaders to practitioners based on the challenge they describe — not random interests. That means fewer low-intent messages and more conversations that start at the right level of relevance.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" />
            Manage Availability — You choose when and how you engage.
          </div>
        </div>
      ),
      image: "/connect-with-mentees.jpeg",
    },
    {
      title: "Commercials",
      icon: Wallet,
      description: (
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-800">Paid Conversations on Your Terms</p>
          <p>
            Engage in paid 1:1 sessions or platform-led group formats. You set your rates for direct bookings; platform-matched sessions follow a transparent payout model. We focus on quality engagements, not volume-based income promises.
          </p>
          <p className="text-sm text-slate-500 italic">
            We do not publish earnings guarantees; your income depends on availability, demand, and the profile you curate.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" />
            Enable Paid Sessions
          </div>
          <p className="text-xs text-slate-400 ml-[18px]">Set your pricing for direct bookings.</p>
        </div>
      ),
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "Feature: Matching tech ",
      icon: Sparkles,
      description: (
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-800">Smart Matching, Human Reviewed</p>
          <p>
            Intent-led matching helps surface relevant requests; a human reviewer ensures context and quality before a session is scheduled. Tech helps find the right signal — people ensure the fit.
          </p>
        </div>
      ),
      image: "/match-making.jpeg",
    },
    {
      title: "Feature: Workflow",
      icon: BarChart3,
      description: (
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-800">Manage Sessions, Without the Noise</p>
          <p>
            A clean workspace to view upcoming conversations, confirm availability, and manage bookings. Designed to stay out of your way so you can focus on the conversation itself.
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
            {["Manage availability", "View confirmed sessions", "Download session notes"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" />
            View Upcoming Conversations
          </div>
        </div>
      ),
      image: "/efficient-mentor-data.jpeg",
    },
    {
      title: "Outcomes",
      icon: LineChart,
      description: (
        <div className="space-y-3">
          <p className="text-base font-semibold text-slate-800">Practical Feedback, Not Vanity Metrics</p>
          <p>
            After each engagement you receive concise feedback and a short decision summary from the session. Use this to refine your approach — not to chase engagement metrics.
          </p>
        </div>
      ),
      features: [
        "Session summary (one page)",
        "Participant feedback (short form)",
        "Optional monthly summary on request",
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
          className={`mb-24 text-center transition-all duration-700 ease-out ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* Badge */}
          <div className="mb-8 inline-flex justify-center">
            <span className="relative inline-block overflow-hidden rounded-full p-[2px]">
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#6366f1_50%,#E2E8F0_100%)]" />
              <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-indigo-600 backdrop-blur-3xl shadow-lg">
                Why Partner with Us?
              </div>
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance">
            Where Experience Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Purposeful Conversation</span>
          </h2>

          {/* Intro text + bullet list */}
          <div className="mx-auto max-w-3xl text-left">
            <p className="text-xl text-slate-600 leading-relaxed text-center mb-4">
              SharingMinds is designed for practitioners who value depth over noise.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed text-center mb-6">
              We connect senior practitioners with founders and business leaders through structured online sessions — 1:1 conversations, curated CXO circles, and focused roundtables. Quietly curated. Clearly useful.
            </p>
            <p className="text-base font-semibold text-slate-800 mb-3">What you can expect:</p>
            <ul className="space-y-2.5">
              {[
                "Carefully aligned conversations with founders and CXOs",
                "Clear formats — 1:1 sessions, small circles, focused roundtables",
                "Flexible participation, fully online",
                "You choose when and how you engage",
                "Paid engagements for professional work (with optional pro-bono if you wish)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-base text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
                className={`group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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