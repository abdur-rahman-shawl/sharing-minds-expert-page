"use client"
import { CheckCircle2, Layers, Sparkles, CalendarClock } from "lucide-react"
import { FinalCTASection } from "@/components/final-cta-section"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function ServicePageClient() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleItems((prev) => [...prev, index])
          }
        })
      },
      { threshold: 0.2 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero - Mentorship Made Easy */}
      <section className="relative py-24 px-4 overflow-hidden">
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
      <section className="py-12 px-4">
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
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 leading-relaxed">
            SharingMinds Mentor Onboarding software provides a seamless experience for mentors to create profiles,
            connect with mentees, and efficiently manage their mentoring relationships.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              data-index={index}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center transition-all duration-700 ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-gray-600">A simple flow to find the right mentor and get quality time.</p>
            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Tell us your goals</p>
                  <p className="text-gray-600">Share your background, challenges, and what you want to achieve.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Match and book</p>
                  <p className="text-gray-600">We recommend mentors; pick a time that works via calendar sync.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Meet and grow</p>
                  <p className="text-gray-600">
                    Actionable advice on live video with notes, next steps, and follow‑ups.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-tr from-blue-50 to-indigo-50 p-10">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(800px_300px_at_50%_30%,rgba(59,130,246,0.4),transparent)]" />
            <div className="relative grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="font-semibold">Average rating</p>
                <p className="text-3xl font-bold mt-2">4.9/5</p>
                <p className="text-sm text-gray-500 mt-1">from verified mentees</p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="font-semibold">Sessions booked</p>
                <p className="text-3xl font-bold mt-2">12k+</p>
                <p className="text-sm text-gray-500 mt-1">across 40+ countries</p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="font-semibold">Time to first call</p>
                <p className="text-3xl font-bold mt-2">
                  <span className="align-middle">24</span>h
                </p>
                <p className="text-sm text-gray-500 mt-1">on average</p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="font-semibold">Expert network</p>
                <p className="text-3xl font-bold mt-2">1,000+</p>
                <p className="text-sm text-gray-500 mt-1">verified mentors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose SharingMinds */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Why Choose SharingMinds</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Verified experts only",
              "Outcome‑oriented sessions",
              "Flexible scheduling",
              "Transparent pricing",
              "Private & secure",
              "Follow‑ups & notes",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 p-5 bg-white">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="font-medium text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {[
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
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 p-5 bg-white">
                <p className="font-medium">{item.q}</p>
                <p className="text-gray-600 mt-2">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  )
}
