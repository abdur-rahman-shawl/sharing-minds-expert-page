import type { Metadata } from "next"
import { HeartHandshake, Target, Users2, Trophy, Rocket, Globe2 } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us — SharingMinds",
  description: "Our mission, values, and the people behind SharingMinds.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">We Build Better Mentorship</h1>
          <p className="mt-4 text-lg text-gray-600">
            SharingMinds connects ambitious learners with experienced mentors so expertise can move faster through the world.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ label: "Mentors", value: "1,000+" }, { label: "Sessions", value: "12k+" }, { label: "Avg. Rating", value: "4.9/5" }, { label: "Countries", value: "40+" }].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Our Values</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              icon: <HeartHandshake className="h-6 w-6 text-blue-600" />, title: "Human-first",
              desc: "Real conversations, empathy, and mutual respect are at the core of great mentorship.",
            },{
              icon: <Target className="h-6 w-6 text-blue-600" />, title: "Outcome‑oriented",
              desc: "We focus on measurable improvements and practical next steps after every session.",
            },{
              icon: <Users2 className="h-6 w-6 text-blue-600" />, title: "Trust & Safety",
              desc: "Verified experts, transparent expectations, and privacy‑first design.",
            }].map((v) => (
              <div key={v.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-3">{v.icon}</div>
                <p className="font-semibold">{v.title}</p>
                <p className="text-gray-600 mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / timeline */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">Our Story</h2>
          <div className="mt-8 space-y-6">
            {[{
              year: "2023",
              title: "Started the journey",
              desc: "We began as a small initiative to make expert time more accessible to early‑stage founders and students.",
              icon: <Rocket className="h-5 w-5 text-blue-600" />,
            },{
              year: "2024",
              title: "Verified expert network",
              desc: "Scaled vetting, added scheduling and payments, and crossed ten thousand sessions.",
              icon: <Trophy className="h-5 w-5 text-blue-600" />,
            },{
              year: "Today",
              title: "Global community",
              desc: "A growing network across 40+ countries with a shared goal: help people grow faster together.",
              icon: <Globe2 className="h-5 w-5 text-blue-600" />,
            }].map((e) => (
              <div key={e.title} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">{e.icon}</div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{e.year}</p>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-gray-600 mt-1">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing banner */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-tr from-blue-50 to-indigo-50 p-10">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(800px_300px_at_50%_30%,rgba(59,130,246,0.4),transparent)]" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-semibold">Building a human intelligence network</h2>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                If our mission resonates with you, join us as an expert or reach out for partnerships. We’re just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

