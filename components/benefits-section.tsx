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
          beyond the traditional bio �?" feature your verified testimonials, thought-leadership blogs, and mentorship
          impact data. Your mentor profile isn�?Tt just a listing �?" it�?Ts your <strong>digital portfolio of leadership
          and influence</strong>, helping you attract the right mentees and speaking opportunities.
        </>
      ),
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Connect with the Right Mentees",
      description: (
        <>
          Be discovered by mentees who are genuinely looking for your kind of guidance �?" from emerging professionals
          and founders to career changers and students. Engage through personalized sessions, ongoing mentorship
          programs, and community discussions that <strong>transform casual connections into meaningful relationships.</strong>
        </>
      ),
      image: "/connect-with-mentees.jpeg",
    },
    {
      title: "Monetize Your Expertise",
      description: (
        <>
          Get rewarded for the knowledge and experience you�?Tve built over years. Mentors on SharingMinds can earn{" "}
          <strong>up to $500 a month or more</strong>, depending on engagement and demand. Turn your mentoring time into
          a consistent income stream while continuing to do what you love �?" <strong>sharing wisdom that creates real-world impact.</strong>
        </>
      ),
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "Smarter Matchmaking through AI + Human Touch",
      description: (
        <>
          Our advanced AI algorithm ensures every mentee-mentor connection feels natural and purposeful. It studies
          goals, learning styles, and expertise areas to suggest ideal matches �?" while our team adds a{" "}
          <strong>human layer of review</strong> to ensure quality, chemistry, and mutual fit. No wasted sessions. No
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
          <strong>Data-driven insights</strong> ensure you stay organized and always aware of your mentorship journey�?Ts
          measurable outcomes.
        </>
      ),
      image: "/efficient-mentor-data.jpeg",
    },
    {
      title: "Measure Success, Amplify Impact",
      description: (
        <>
          Get real-time feedback, progress insights, and performance benchmarks �?" all in one intuitive dashboard.
          SharingMinds gives you <strong>actionable analytics</strong> to refine your mentoring approach, enhance
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
    <section ref={sectionRef} className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div
          ref={titleRef}
          className={`mb-16 text-center animate-on-scroll will-change-opacity sm:mb-24 ${
            titleVisible ? "animate-fade-in-slow" : ""
          }`}
        >
          <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 text-balance sm:text-4xl lg:text-5xl">
            Benefits of Mentoring
            <br />
            with SharingMinds
          </h2>
          <h3 className="mb-4 text-xl font-semibold text-gray-700 sm:text-2xl">Why Mentor with SharingMinds?</h3>
          <p className="mx-auto max-w-3xl text-base text-gray-600 sm:text-lg">
            Empower others while accelerating your own professional growth. SharingMinds is designed for leaders,
            educators, and professionals who want to make their experience truly impactful �?" while being recognized,
            rewarded, and connected with a meaningful network.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {benefits.map((benefit, index) => {
            const { ref: cardRef, isVisible: cardVisible } = cardRefs[index]

            return (
              <div
                key={benefit.title}
                ref={cardRef}
                className={`group rounded-2xl bg-gray-50/60 p-6 transition-[background,transform,opacity] duration-300 hover:bg-gray-50 animate-on-scroll will-change-opacity sm:p-8 ${
                  cardVisible ? `animate-fade-in-slow animate-delay-${Math.min(index * 100 + 200, 400)}` : ""
                }`}
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-xl object-cover shadow-sm transition-transform duration-700 ease-out group-hover:scale-[1.03] group-hover:shadow-md"
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-2xl font-semibold leading-tight text-gray-900">{benefit.title}</h3>
                  <p className="mb-6 text-base leading-relaxed text-gray-600">{benefit.description}</p>
                  {benefit.features && (
                    <ul className="space-y-3 text-sm text-gray-600 sm:text-base">
                      {benefit.features.map(feature => (
                        <li key={feature} className="flex items-center gap-3">
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden />
                          <span className="font-medium">{feature}</span>
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
