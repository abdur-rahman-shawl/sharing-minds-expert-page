"use client"

import { AudienceCtaSection } from "@/components/audience-cta-section"
import { LeverageLayerSection } from "@/components/leverage-layer-section"
import { SystemWorksSection } from "@/components/system-works-section"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const faqItems = [
  {
    question: "How are verified experts vetted?",
    answer:
      "Every expert goes through profile verification, domain checks, and trial sessions before joining. We ensure high trust and high quality.",
  },
  {
    question: "Can I reschedule a session?",
    answer:
      "Yes—with flexible rescheduling and automatic timezone support via our seamless calendar integrations.",
  },
  {
    question: "Do you support ongoing expert guidance?",
    answer:
      "Absolutely. You can book recurring sessions, set long-term goals, and pick up exactly where you left off.",
  },
]

function ServiceHero() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section
      ref={ref}
      className="relative flex min-h-[min(620px,calc(100svh-104px))] flex-col justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-white" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[min(1000px,100%)] -translate-x-1/2 rounded-[50%] bg-indigo-200/20 blur-[100px] mix-blend-multiply" />

      <div
        className={`mx-auto w-full max-w-5xl px-4 text-center transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-white/60 px-3 py-1 text-sm font-medium text-indigo-800 shadow-sm ring-1 ring-white/50 backdrop-blur-sm">
          <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
          Our Services
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 drop-shadow-sm sm:text-6xl lg:text-7xl">
          How{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SharingMinds
          </span>{" "}
          Works
        </h1>

        <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-600 sm:text-xl">
          Structured online conversations that connect experienced professionals with founders
          and business leaders—through private 1:1 sessions, small CXO circles, and focused
          roundtables.
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-slate-600 sm:text-xl">
          Designed for real challenges. Delivered with care.
        </p>
      </div>
    </section>
  )
}

function FaqCard({ question, answer, index }: (typeof faqItems)[number] & { index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <article
      ref={ref}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-indigo-200 hover:shadow-md sm:p-8 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
        {question}
      </h3>
      <p className="mt-2 border-l border-slate-100 pl-3.5 leading-relaxed text-slate-600">
        {answer}
      </p>
    </article>
  )
}

function ServiceFaq() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="service-faq-title"
      className="scroll-mt-[104px] bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="service-faq-title"
          className={`mb-12 text-center text-3xl font-bold text-slate-900 transition-all duration-700 md:text-4xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <FaqCard key={item.question} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ServicePageClient() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <ServiceHero />
      <LeverageLayerSection />
      <SystemWorksSection />
      <ServiceFaq />
      <AudienceCtaSection />
    </div>
  )
}
