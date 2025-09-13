import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us • SharingMinds",
  description: "Learn about SharingMinds — our mission, values, and the people behind the platform.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            We believe the most impactful learning happens human-to-human. SharingMinds connects ambitious learners
            with experienced mentors to unlock growth through real conversations and practical guidance.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Empower people everywhere to learn faster by making expert knowledge accessible, personal, and actionable.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-semibold">What We Value</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Respect, clarity, and outcomes. We prioritize meaningful matches, transparent expectations, and measurable progress.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-semibold">How We Work</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              A product-first approach built with care. We design simple, focused experiences that people love to use.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 p-10">
            <h2 className="text-2xl md:text-3xl font-semibold">Building a human intelligence network</h2>
            <p className="mt-3 text-gray-600">
              We’re just getting started. If our mission resonates with you, join us as an expert or reach out for partnerships.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
