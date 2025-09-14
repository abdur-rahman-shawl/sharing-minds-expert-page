import type { Metadata } from "next"
import { HeartHandshake, Target, Users2 } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us — SharingMinds",
  description: "Our mission, values, and the people behind SharingMinds.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Us</h1>
          <p className="text-lg text-gray-600 mb-4">Welcome to SharingMinds Mentor Onboarding!</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are at development stage of this robust platform, committed to empowering mentors and mentees through
            meaningful connections and valuable experiences
          </p>
        </div>
      </section>

      {/* Trusted Mentorship Platform */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted Mentorship Platform</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              SharingMinds Mentor Onboarding is trusted by mentors and mentees alike for its professional and impactful
              mentorship experiences.
            </p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Beliefs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Content */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Beliefs</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  At SharingMinds, we believe in the power of mentorship to inspire, guide, and uplift individuals
                  towards their full potential.
                </p>
                <p>
                  Our platform is built on the belief that mentorship can create positive change and drive personal and
                  professional growth.
                </p>
                <p>
                  Mentorship isn't a privilege anymore — it's a growth multiplier. Our platform will now allow us to
                  make it available to anyone, anywhere.
                </p>
              </div>
            </div>

            {/* Collage Images */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-12 grid-rows-8 gap-3 h-96">
                {/* Top right large image */}
                <div className="col-span-7 row-span-5 col-start-6">
                  <img
                    src="/images/mentoring-session.jpg"
                    alt="Mentoring session between two women"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Bottom left medium image */}
                <div className="col-span-5 row-span-4 row-start-5">
                  <img
                    src="/images/team-meeting.jpg"
                    alt="Team meeting around computer"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Middle left small image */}
                <div className="col-span-4 row-span-3 row-start-2">
                  <img
                    src="/images/professional-woman.jpg"
                    alt="Professional woman with papers"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Bottom right small image */}
                <div className="col-span-4 row-span-3 col-start-9 row-start-6">
                  <img
                    src="/images/workshop-mentor.jpg"
                    alt="Man working in creative workshop"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Team</h2>
            <div className="space-y-6 text-gray-300">
              <p>
                SharingMinds has been founded by a group of passionate individuals dedicated to fostering mentorship
                opportunities for the next generation.
              </p>
              <p>
                It's an AI-powered, next-gen platform redefining mentorship and career guidance in India — built to
                solve trust gaps and deliver credible, personalized guidance for students, professionals, and founders.
              </p>
              <p>
                Our platform is being built by a high-caliber team of tech leaders and developers with proven track
                records in AI, product development, and large-scale platform engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Our Values</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <HeartHandshake className="h-6 w-6 text-blue-600" />,
                title: "Human-first",
                desc: "Real conversations, empathy, and mutual respect are at the core of great mentorship.",
              },
              {
                icon: <Target className="h-6 w-6 text-blue-600" />,
                title: "Outcome‑oriented",
                desc: "We focus on measurable improvements and practical next steps after every session.",
              },
              {
                icon: <Users2 className="h-6 w-6 text-blue-600" />,
                title: "Trust & Safety",
                desc: "Verified experts, transparent expectations, and privacy‑first design.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-3">
                  {v.icon}
                </div>
                <p className="font-semibold">{v.title}</p>
                <p className="text-gray-600 mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Signup Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
            {/* Profile Photos Grid */}
            <div className="mb-8">
              <div className="flex justify-center gap-3 mb-3">
                {[
                  "/professional-mentor-headshot-1.jpg",
                  "/professional-mentor-headshot-2.jpg",
                  "/professional-mentor-headshot-3.jpg",
                  "/professional-mentor-headshot-4.jpg",
                  "/professional-mentor-headshot-5.jpg",
                  "/professional-mentor-headshot-6.jpg",
                  "/professional-mentor-headshot-7.jpg",
                ].map((src, i) => (
                  <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Mentor ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                {[
                  "/professional-mentor-headshot-8.jpg",
                  "/professional-mentor-headshot-9.jpg",
                  "/professional-mentor-headshot-10.jpg",
                  "/professional-mentor-headshot-11.jpg",
                  "/professional-mentor-headshot-12.jpg",
                  "/professional-mentor-headshot-13.jpg",
                ].map((src, i) => (
                  <div key={i + 7} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Mentor ${i + 8}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Join SharingMinds as a Mentor Today.</h2>

            {/* Testimonial */}
            <blockquote className="text-lg text-gray-600 italic mb-8 max-w-3xl mx-auto">
              "Sharing Minds Mentor Onboarding is a fantastic platform that has enabled me to share my knowledge and
              experience with aspiring individuals. The dashboard is user-friendly and efficient, making the mentoring
              process smooth and enjoyable."
              <cite className="block mt-2 not-italic font-medium">- Fred Taylor</cite>
            </blockquote>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email to sign up as a mentor"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                Sign Up as a Mentor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
