import {
  BadgeCheck,
  Brain,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Compass,
} from "lucide-react"

import { cn } from "@/lib/utils"

const evaluationCriteria = [
  {
    title: "Relevant Professional Experience",
    description: "The depth, duration and relevance of your real-world responsibilities.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Demonstrable Expertise",
    description:
      "The specific industries, functions, subjects or professional challenges in which you have developed meaningful capability.",
    icon: Brain,
  },
  {
    title: "Measurable Contribution",
    description:
      "Evidence of outcomes created, problems solved, decisions influenced, teams led, systems built or organisations supported.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Professional Credibility",
    description:
      "The consistency and verifiability of your professional history, qualifications, references and body of work.",
    icon: BadgeCheck,
  },
  {
    title: "Practical Judgment",
    description:
      "Your ability to translate experience into useful, responsible and contextually relevant guidance.",
    icon: Compass,
  },
]

export function EvaluationCriteriaSection() {
  return (
    <section
      id="what-we-evaluate"
      aria-labelledby="evaluation-criteria-title"
      className="relative scroll-mt-[104px] overflow-hidden border-t border-[#24415e]/55 bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_42%,rgba(14,85,171,0.14),transparent_48%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <div className="mx-auto max-w-[850px] text-center">
          <h2
            id="evaluation-criteria-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
          >
            What We Evaluate
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-[#d0d8e2] sm:text-[17px]">
            Every application may be reviewed against the following criteria:
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {evaluationCriteria.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className={cn(
                "flex min-h-[280px] flex-col rounded-2xl border border-[#52708e]/35 bg-[#071c33]/[0.76] px-7 py-8 shadow-[0_18px_44px_rgba(0,0,0,0.16)] xl:col-span-2",
                index === 3 && "xl:col-start-2",
              )}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d6a05a]/55 bg-[#0a233e] text-[#e3aa57] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <Icon className="h-7 w-7 stroke-[1.45]" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-[20px] font-semibold leading-[1.35] text-[#f3f5f7]">
                {title}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#cbd4dd]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[980px] rounded-xl border border-[#547392]/40 bg-[#082039]/[0.78] px-6 py-6 text-center sm:px-9">
          <p className="text-[15px] leading-[1.7] text-[#d0d8e2]">
            SharingMinds may request additional information, references, documents or a
            verification conversation before making a decision.
          </p>
        </div>
      </div>
    </section>
  )
}
