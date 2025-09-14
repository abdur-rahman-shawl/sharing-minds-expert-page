import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Video, Calendar } from "lucide-react"
import { FinalCTASection } from "@/components/final-cta-section"

export const metadata: Metadata = {
  title: "Service • SharingMinds",
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

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Service</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Practical, outcome-driven mentoring experiences to help you level up with confidence.
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card key={s.title} className="border-gray-200">
              <CardHeader className="space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
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

      <FinalCTASection />

    </div>
  )
}
