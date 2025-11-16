"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function BenefitsSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.1)
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
      description:
        "Create a stunning mentor profile that highlights your experience, achievements, and industry credibility. Go beyond the traditional bio — feature your verified testimonials, thought-leadership blogs, and mentorship impact data. Your mentor profile isn’t just a listing — it’s your digital portfolio of leadership and influence, helping you attract the right mentees and speaking opportunities.",
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Connect with the Right Mentees",
      description:
        "Be discovered by mentees who are genuinely looking for your kind of guidance — from emerging professionals and founders to career changers and students. Engage through personalized sessions, ongoing mentorship programs, and community discussions that transform casual connections into meaningful relationships.",
      image: "/connect-with-mentees.jpeg",
    },
    {
      title: "Monetize Your Expertise",
      description:
        "Get rewarded for the knowledge and experience you’ve built over years. Mentors on SharingMinds can earn up to $500 a month or more, depending on engagement and demand. Turn your mentoring time into a consistent income stream while continuing to do what you love — sharing wisdom that creates real-world impact",
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "Smarter Matchmaking through AI + Human Touch",
      description:
        "Our advanced AI algorithm ensures every mentee-mentor connection feels natural and purposeful. It studies goals, learning styles, and expertise areas to suggest ideal matches — while our team adds a human layer of review to ensure quality, chemistry, and mutual fit. No wasted sessions. No mismatched expectations. Just meaningful collaboration.",
      image: "/match-making.jpeg",
    },
    {
      title: "Seamless Data Access & Performance Tracking",
      description:
        "Access and export all your mentorship data with ease through a powerful mentor dashboard. Track mentee progress, manage your bookings, and monitor your impact with clarity and convenience. Data-driven insights ensure you stay organized and always aware of your mentorship journey’s measurable outcomes.",
      image: "/efficient-mentor-data.jpeg",
    },
    {
      title: "Measure Success, Amplify Impact",
      description:
        "Get real-time feedback, progress insights, and performance benchmarks — all in one intuitive dashboard. SharingMinds gives you actionable analytics to refine your mentoring approach, enhance outcomes, and celebrate growth milestones.",
      features: ["Live feedback & sentiment tracking", "Dashboard analytics & benchmarking", "Real-time reporting & monthly summaries", "Continuous performance insights"],
      image: "/success-metrics.jpeg",
    },
  ]

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          ref={titleRef}
          className={`text-center mb-24 animate-on-scroll will-change-opacity ${
            titleVisible ? "animate-fade-in-slow" : ""
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance leading-tight">
            Benefits of Mentoring
            <br />
            with SharingMinds
          </h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Make a Difference as a Mentor</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {benefits.map((benefit, index) => {
            const { ref: cardRef, isVisible: cardVisible } = cardRefs[index]

            return (
              <div
                key={index}
                ref={cardRef}
                className={`bg-gray-50/50 rounded-2xl p-8 hover:bg-gray-50 transition-[background,transform,opacity] duration-300 group animate-on-scroll will-change-opacity ${
                  cardVisible ? `animate-fade-in-slow animate-delay-${Math.min(index * 100 + 200, 400)}` : ""
                }`}
              >
                <div className="mb-6 overflow-hidden rounded-xl relative" style={{ paddingBottom: '75%' }}>
                  <img
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    loading="lazy"
                    className="absolute top-0 left-0 w-full h-full object-cover shadow-sm group-hover:shadow-md transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-base">{benefit.description}</p>
                  {benefit.features && (
                    <ul className="space-y-3">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
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
