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
      title: "Build Your Professional Brand",
      description: "Create a stunning mentor profile that highlights your experience. Your profile isn't just a listing — it's your digital portfolio of leadership.",
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Connect with the Right Mentees",
      description: "Be discovered by mentees looking for your specific guidance. Transform casual connections into meaningful professional relationships.",
      image: "/connect-with-mentees.jpeg",
    },
    {
      title: "Monetize Your Expertise",
      description: "Mentors can earn up to $500/month or more. Turn your mentoring time into a consistent income stream while creating real-world impact.",
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "Smart Matchmaking AI",
      description: "Our algorithm ensures every connection feels natural. We study goals and styles to suggest ideal matches, backed by human review.",
      image: "/match-making.jpeg",
    },
    {
      title: "Seamless Performance Tracking",
      description: "Track mentee progress and monitor impact. Data-driven insights ensure you stay organized and aware of measurable outcomes.",
      image: "/efficient-mentor-data.jpeg",
    },
    {
      title: "Measure Success",
      description: "Get real-time feedback and benchmarks. Actionable analytics help you refine your approach and celebrate milestones.",
      features: ["Live feedback tracking", "Dashboard analytics", "Monthly summaries"],
      image: "/success-metrics.jpeg",
    },
  ]

  return (
    // Changed bg-white to transparent (or subtle gradient) to blend with Hero
    <section ref={sectionRef} className="relative z-10 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      {/* Subtle separator background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-indigo-50/30 -z-10" />

      <div className="mx-auto max-w-7xl">
        <div
          ref={titleRef}
          className={`mb-20 text-center transition-all duration-700 ease-out ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-base font-semibold uppercase tracking-widest text-indigo-600 mb-3">
            Excellence in Mentorship
          </h2>
          <h3 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
            Benefits of Mentoring with SharingMinds
          </h3>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 leading-relaxed">
            Designed for leaders who want to make their experience impactful while being recognized, rewarded, and connected.
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
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" /> {/* Placeholder while loading */}
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                  />
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">{benefit.title}</h3>
                  <p className="mb-6 flex-1 text-base leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                  
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