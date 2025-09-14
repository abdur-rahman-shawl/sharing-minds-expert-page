import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Video, Calendar, CheckCircle2, Layers, Sparkles, CalendarClock } from "lucide-react"
import { FinalCTASection } from "@/components/final-cta-section"

export const metadata: Metadata = {
  title: "Services — SharingMinds",
  description: "Explore our expert mentoring services and how we help you connect, learn, and grow.",
}

export default function ServicePage() {
  const services = [
    {
      icon: <Video className="w-5 h-5 text-blue-600" />,
      title: "1:1 Video Mentorship",
      desc: "Book focused, private sessions with verified experts across domains.",
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: "Group Sessions",
      desc: "Join small cohorts for collaborative learning, reviews, and Q&A.",
    },
    {
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      title: "Career Guidance",
      desc: "Portfolio reviews, interview prep, growth plans tailored to you.",
    },
    {
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      title: "Flexible Scheduling",
      desc: "Easy booking with timezone support and calendar integrations.",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-blue-100/40 via-transparent to-indigo-100/40" />
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Mentorship Services</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Practical, outcome‑driven sessions that pair you with verified experts to reach your goals faster.
          </p>
        </div>
      </section>

      {/* Core services */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card key={s.title} className="border-gray-200">
              <CardHeader className="space-y-2">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-50">
                  {s.icon}
                </div>
                <CardTitle className="text-xl">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
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
                  <p className="text-gray-600">Actionable advice on live video with notes, next steps, and follow‑ups.</p>
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
                <p className="text-3xl font-bold mt-2"><span className="align-middle">24</span>h</p>
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
            {["Verified experts only", "Outcome‑oriented sessions", "Flexible scheduling", "Transparent pricing", "Private & secure", "Follow‑ups & notes"].map((item) => (
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
              { q: "How are mentors vetted?", a: "Every expert goes through profile verification, domain checks, and trial sessions before joining." },
              { q: "Can I reschedule a session?", a: "Yes — with flexible rescheduling and timezone support via calendar integrations." },
              { q: "Do you support ongoing mentorship?", a: "Absolutely. You can book recurring sessions and continue where you left off." },
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

