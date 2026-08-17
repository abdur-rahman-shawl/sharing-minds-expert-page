'use client'
import { HeartHandshake, Target, Users2, CheckCircle2, ShieldCheck } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"

export default function AboutPageClient() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2)
  const { ref: trustedRef, isVisible: trustedVisible } = useScrollAnimation(0.2)
  const { ref: beliefsRef, isVisible: beliefsVisible } = useScrollAnimation(0.1)
  const { ref: teamRef, isVisible: teamVisible } = useScrollAnimation(0.1)
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation(0.1)

  const values = [
    {
      icon: <HeartHandshake className="h-6 w-6 text-white" />,
      title: "Thoughtful by Design",
      desc: "We create space for real conversations — grounded in respect, context, and lived experience.",
      color: "bg-pink-500"
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Practical Outcomes",
      desc: "Every engagement is meant to leave people clearer than they arrived — with concrete next steps, not abstract advice.",
      color: "bg-indigo-500"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Trust Comes First",
      desc: "We work with verified practitioners, set clear expectations, and design with privacy and integrity in mind.",
      color: "bg-emerald-500"
    },
  ]

  // FIX 1: Hooks must be called at the top level, not inside .map()
  const valAnim1 = useScrollAnimation(0.1)
  const valAnim2 = useScrollAnimation(0.1)
  const valAnim3 = useScrollAnimation(0.1)
  const valueCardRefs = [valAnim1, valAnim2, valAnim3]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden"
      >
        {/* Background System */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-white"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div
          className={`max-w-6xl mx-auto text-center px-4 transition-all duration-1000 ease-out ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white/60 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur-sm mb-6 shadow-sm ring-1 ring-white/50">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            Our Mission
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl drop-shadow-sm">
            <span className="lg:whitespace-nowrap">Turning Real Experience into</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Better Decisions</span>
          </h1>

          <div className="mx-auto mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-slate-600 sm:text-xl font-light">
            <p>
              SharingMinds is being built to close a simple gap: people making important career and business choices rarely have access to those who’ve already walked similar paths.
            </p>
            <p className="font-medium text-slate-800">
              Our mission is to make lived experience more accessible — so founders, professionals, and students can learn directly from people who’ve built, led, and navigated change.
            </p>
            <p className="font-medium text-slate-800">
              We’re creating an ecosystem where experience travels faster than advice.
            </p>
          </div>
        </div>
      </section>

      {/* --- TRUSTED PLATFORM BADGE --- */}
      <section
        ref={trustedRef}
        className={`px-4 py-12 relative z-10 -mt-8 transition-all duration-1000 delay-200 ${trustedVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl p-8 sm:p-12 text-center text-white ring-1 ring-white/10">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">A Curated Ecosystem for Experience Sharing</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                SharingMinds connects practitioners, founders, and learners through structured online engagements — creating space for reflection, perspective, and informed action.
              </p>
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 sm:w-8 sm:h-8 fill-yellow-400 drop-shadow-lg" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR BELIEFS --- */}
      <section
        ref={beliefsRef}
        className="px-4 py-24 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            {/* Text Content */}
            <div
              className={`lg:col-span-5 flex flex-col justify-center transition-all duration-1000 ${beliefsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-indigo-500"></div>
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Our Beliefs</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
                Better Decisions Come from <br />
                <span className="text-indigo-600">Shared Experience.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  We believe people don’t need more information — they need perspective.
                </p>
                <p>
                  The fastest way to learn isn’t through content or courses. It’s through conversations with people who’ve already navigated similar paths
                </p>
                <p>
                  SharingMinds is built on a simple idea: experience should be easier to access, thoughtfully shared, and grounded in real-world context.
                </p>
                <p>
                  When that happens, progress becomes clearer — in careers, in leadership, and in business.
                </p>
                <div className="flex items-center gap-3 font-medium text-slate-900">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  <span>Accessible to anyone, anywhere.</span>
                </div>
              </div>
            </div>

            {/* Premium Masonry Grid */}
            <div
              className={`lg:col-span-7 grid grid-cols-2 gap-4 lg:gap-6 transition-all duration-1000 delay-200 ${beliefsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
            >
              {/* Column 1 - Staggered Down */}
              <div className="space-y-4 pt-12">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/mentoring-session.jpg"
                    alt="Expert guidance session"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/team-meeting.jpg"
                    alt="Team meeting"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/professional-woman.jpg"
                    alt="Professional woman"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/workshop-mentor.jpg"
                    alt="Workshop expert"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR TEAM --- */}
      <section
        ref={teamRef}
        className="relative py-32 bg-slate-950 text-white overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />

        <div
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-8">
            <Users2 className="w-4 h-4 mr-2" />
            Who We Are
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Building a Better Way to Learn From Experience</h2>

          <div className="space-y-8 text-xl text-slate-300 font-light leading-relaxed">
            <p>
              SharingMinds is being built by operators, product builders, and business leaders who’ve seen firsthand how difficult it is to find thoughtful guidance at important moments.
            </p>
            <p className="text-white font-normal text-2xl">
              We’re creating a platform that makes real-world experience easier to access — not through content or generic advice, but through structured conversations with people who’ve built, led, and navigated change.
            </p>
            <p>
              Our focus is simple: design a reliable, online space where experienced professionals can share perspective, and founders, professionals, and students can learn directly from lived journeys.
            </p>
            <p>
              Behind SharingMinds is a team combining product, technology, and business experience — working quietly to build something practical, human, and useful at scale.
            </p>
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section
        ref={valuesRef}
        className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Core Values</h2>
            <p className="mt-4 text-slate-600">The principles that shape how we work.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, index) => {
              const { ref, isVisible } = valueCardRefs[index]
              return (
                <div
                  key={v.title}
                  ref={ref}
                  className={`group relative rounded-3xl bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ring-1 ring-slate-200 ${isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${v.color} shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
