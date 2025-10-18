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
      title: "Professional Mentor Profile",
      description:
        "Easily create a professional mentor profile to showcase your expertise and experience to potential mentees.",
      image: "/profesional-mentor-profile.jpeg",
    },
    {
      title: "Connect with Mentees",
      description:
        "Engage and connect with mentees looking for guidance and support in your specific industry or domain.",
      image: "/connect-with-mentees.jpeg",
    },
    {
      title: "Payment for Expertise",
      description:
        "You are paid for your knowledge, wisdom, and experience. We can provide a significant income source of up to 500 dollars a month, making it a viable primary source of income.",
      image: "/payment-for-expertise.jpeg",
    },
    {
      title: "Match Making",
      description:
        "Allow the platform to find the best possible match with our algorithm, empowering your participants to find the right mentor and mentee, and we'll give them a helping hand with manual matchmaking.",
      image: "/Algo2.gif",
    },
    {
      title: "Efficient Mentor Data Export",
      description:
        "Effortlessly export mentor data through the admin panel, ensuring seamless management and comprehensive insights.",
      image: "/Data Export.gif",
    },
    {
      title: "Success Metrics",
      description:
        "Sentiment makes it easy to capture regular feedback needed to understand individual performance and get insights on your live dashboard metrics benchmarking and analytics on overview of your whole program.",
      features: ["Real-time reporting", "Feedback and progress tracking", "Dashboard analytics", "Monthly reporting"],
      image: "/RTR1.gif",
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
