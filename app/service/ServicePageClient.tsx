"use client"
import { CheckCircle2, Layers, Sparkles, CalendarClock } from "lucide-react"
import { FinalCTASection } from "@/components/final-cta-section"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function ServicePageClient() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2)
  const { ref: dashboardRef, isVisible: dashboardVisible } = useScrollAnimation(0.2)
  const { ref: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation(0.2)
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation(0.1)
  const { ref: whyChooseRef, isVisible: whyChooseVisible } = useScrollAnimation(0.1)
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation(0.1)

  const features = [
    {
      title: "Professional Mentor Profile",
      description:
        "Easily create a professional mentor profile to showcase your expertise and experience to potential mentees.",
      image: "/images/professional-mentor.jpg",
      alt: "Professional mentor in office setting",
    },
    {
      title: "Mentor-Mentee Connection",
      description:
        "Engage and connect with mentees looking for guidance and support in your specific industry or domain.",
      image: "/images/mentor-connection.jpg",
      alt: "Mentor-mentee connection",
    },
    {
      title: "Personalized Dashboard Access",
      description:
        "Access a personalized dashboard to manage your mentorship activities, upload content, and track your progress.",
      image: "/images/leadership-dashboard.jpg",
      alt: "Personalized dashboard interface",
    },
  ]

  const featureCardRefs = features.map(() => useScrollAnimation(0.2))

  const whyChooseItems = [
    "Verified experts only",
    "Outcome‑oriented sessions",
    "Flexible scheduling",
    "Transparent pricing",
    "Private & secure",
    "Follow‑ups & notes",
  ]
  const whyChooseCardRefs = whyChooseItems.map(() => useScrollAnimation(0.1))

  const faqItems = [
    {
      q: "How are mentors vetted?",
      a: "Every expert goes through profile verification, domain checks, and trial sessions before joining.",
    },
    {
      q: "Can I reschedule a session?",
      a: "Yes — with flexible rescheduling and timezone support via calendar integrations.",
    },
    {
      q: "Do you support ongoing mentorship?",
      a: "Absolutely. You can book recurring sessions and continue where you left off.",
    },
  ]
  const faqCardRefs = faqItems.map(() => useScrollAnimation(0.1))

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero - Mentorship Made Easy */}
      <section
        ref={heroRef}
        className={`relative py-24 px-4 overflow-hidden animate-on-scroll will-change-opacity ${
          heroVisible ? "animate-fade-in-slow" : ""
        }`}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-blue-100/40 via-transparent to-indigo-100/40" />
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Mentorship Made Easy</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join SharingMinds as a mentor to empower and guide young minds towards success.
          </p>
          <div className="mt-6">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        ref={dashboardRef}
        className={`py-12 px-4 animate-on-scroll will-change-opacity ${
          dashboardVisible ? "animate-fade-in-up" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl border bg-white shadow-lg overflow-hidden">
            <Image
              src="/images/dashboard-mockup.jpg"
              alt="Mentorship Dashboard showing analytics and team members"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Description */}
      <section
        ref={descriptionRef}
        className={`py-12 px-4 animate-on-scroll will-change-opacity ${
          descriptionVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 leading-relaxed">
            SharingMinds Mentor Onboarding software provides a seamless experience for mentors to create profiles,
            connect with mentees, and efficiently manage their mentoring relationships.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section
        ref={featuresRef}
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto space-y-20">
          {features.map((feature, index) => {
            const { ref, isVisible } = featureCardRefs[index]
            return (
              <div
                key={index}
                ref={ref}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 items-center animate-on-scroll will-change-opacity ${
                  isVisible ? "animate-fade-in-up" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.alt}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why choose SharingMinds */}
      <section
        ref={whyChooseRef}
        className={`py-16 px-4 animate-on-scroll will-change-opacity ${
          whyChooseVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Why Choose SharingMinds</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseItems.map((item, index) => {
              const { ref, isVisible } = whyChooseCardRefs[index]
              return (
                <div
                  key={item}
                  ref={ref}
                  className={`flex items-start gap-3 rounded-xl border border-slate-200 p-5 bg-white animate-on-scroll will-change-opacity ${
                    isVisible ? `animate-fade-in-up animate-delay-${index * 100}` : ""
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="font-medium text-gray-800">{item}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqRef}
        className={`py-16 px-4 animate-on-scroll will-change-opacity ${
          faqVisible ? "animate-fade-in" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {faqItems.map((item, index) => {
              const { ref, isVisible } = faqCardRefs[index]
              return (
                <div
                  key={item.q}
                  ref={ref}
                  className={`rounded-xl border border-slate-200 p-5 bg-white animate-on-scroll will-change-opacity ${
                    isVisible ? `animate-fade-in-up animate-delay-${index * 100}` : ""
                  }`}
                >
                  <p className="font-medium">{item.q}</p>
                  <p className="text-gray-600 mt-2">{item.a}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  )
}
