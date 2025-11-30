"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

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
      title: "Build Your Professional Mentor Brand",
      description: (
        <>
          Create a stunning mentor profile that highlights your experience, achievements, and industry credibility. Go
          beyond the traditional bio — feature your verified testimonials, thought-leadership blogs, and mentorship
          impact data. Your mentor profile isn't just a listing — it's your{" "}
          <strong className="font-semibold text-slate-900">digital portfolio of leadership and influence</strong>, helping you attract the right mentees and
          speaking opportunities.
        </>
      ),
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Connect with the Right Mentees",
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
      description: (
        <>
          Get rewarded for the knowledge and experience you've built over years. Mentors on SharingMinds can earn{" "}
          <strong className="font-semibold text-slate-900">up to $500 a month or more</strong>, depending on engagement and demand. Turn your mentoring time into
          a consistent income stream while continuing to do what you love —{" "}
          <strong className="font-semibold text-slate-900">sharing wisdom that creates real-world impact.</strong>
        </>
      ),
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "Smarter Matchmaking through AI + Human Touch",
      description: (
        <>
          Our advanced AI algorithm ensures every mentee-mentor connection feels natural and purposeful. It studies
          goals, learning styles, and expertise areas to suggest ideal matches — while our team adds a{" "}
          <strong className="font-semibold text-slate-900">human layer of review</strong> to ensure quality, chemistry, and mutual fit. No wasted sessions. No
          mismatched expectations. Just meaningful collaboration.
        </>
      ),
      image: "/match-making.jpeg",
    },
    {
      title: "Seamless Data Access & Performance Tracking",
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
      {/* Subtle separator background to blend with Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-indigo-50/30 -z-10" />

      <div className="mx-auto max-w-7xl">
        <div
          ref={titleRef}
          className={`mb-20 text-center transition-all duration-700 ease-out ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-sm sm:text-base font-semibold uppercase tracking-widest text-indigo-600 mb-3">
            Excellence in Mentorship
          </h2>
          <h3 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
            Benefits of Mentoring
            <br className="hidden sm:block" /> with SharingMinds
          </h3>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 leading-relaxed">
            Empower others while accelerating your own professional growth. SharingMinds is designed for leaders,
            educators, and professionals who want to make their experience truly impactful — while being recognized,
            rewarded, and connected with a meaningful network.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {benefits.map((benefit, index) => {
            const { ref: cardRef, isVisible: cardVisible } = cardRefs[index]

            return (
              <div
                key={benefit.title}
                ref={cardRef}
                // Glassmorphic Card Style
                className={`group flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-1 shadow-lg backdrop-blur-sm transition-all duration-700 hover:shadow-xl hover:bg-white/60 ring-1 ring-slate-900/5 ${
                  cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-72">
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  <img
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                  />
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="mb-4 text-2xl font-bold text-slate-900">{benefit.title}</h3>
                  <div className="mb-6 flex-1 text-base leading-relaxed text-slate-600">
                    {benefit.description}
                  </div>
                  
                  {benefit.features && (
                    <ul className="mt-auto space-y-2 border-t border-slate-100 pt-4">
                      {benefit.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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