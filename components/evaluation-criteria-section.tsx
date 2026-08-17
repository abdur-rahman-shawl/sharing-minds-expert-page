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
      className="relative scroll-mt-[104px] overflow-hidden border-t border-[#24415e]/55 bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:flex lg:min-h-[calc(100svh-104px)] lg:items-center lg:px-8 lg:py-[clamp(28px,4vh,48px)] xl:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_42%,rgba(14,85,171,0.14),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1380px]">
        <div className="mx-auto max-w-[850px] text-center">
          <h2
            id="evaluation-criteria-title"
            className="text-[clamp(40px,3.5vw,54px)] font-normal leading-none tracking-[-0.03em] text-[#f4f1eb]"
          >
            What We Evaluate
          </h2>
          <p className="mt-3 text-[15px] leading-[1.55] text-[#d0d8e2] sm:text-[16px]">
            Every application may be reviewed against the following criteria:
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-3.5 xl:grid-cols-5 xl:gap-4">
          {evaluationCriteria.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className={cn(
                "flex flex-col rounded-xl border border-[#52708e]/35 bg-[#071c33]/[0.76] px-5 py-5 shadow-[0_14px_34px_rgba(0,0,0,0.15)] transition-colors hover:border-[#527da6]/55 lg:col-span-2 lg:min-h-[150px] lg:flex-row lg:items-start lg:gap-4 lg:px-4 lg:py-4 xl:col-span-1 xl:min-h-[205px] xl:flex-col xl:gap-0 xl:px-5 xl:py-5",
                index === 3 && "lg:col-start-2 xl:col-start-auto",
              )}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d6a05a]/55 bg-[#0a233e] text-[#e3aa57] shadow-[0_8px_24px_rgba(0,0,0,0.18)] lg:h-10 lg:w-10 xl:h-11 xl:w-11">
                <Icon className="h-6 w-6 stroke-[1.45] lg:h-5 lg:w-5 xl:h-[22px] xl:w-[22px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 lg:flex-1">
                <h3 className="mt-4 text-[18px] font-semibold leading-[1.3] text-[#f3f5f7] lg:mt-0 lg:text-[16px] xl:mt-4 xl:text-[17px]">
                  {title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.6] text-[#cbd4dd] lg:mt-2 lg:leading-[1.55] xl:mt-2.5">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-5 max-w-[980px] rounded-xl border border-[#547392]/40 bg-[#082039]/[0.78] px-5 py-3.5 text-center sm:px-7">
          <p className="text-[13px] leading-[1.55] text-[#d0d8e2] sm:text-[14px]">
            SharingMinds may request additional information, references, documents or a
            verification conversation before making a decision.
          </p>
        </div>
      </div>
    </section>
  )
}
