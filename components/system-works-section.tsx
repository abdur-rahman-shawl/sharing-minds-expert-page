"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FileText,
  GraduationCap,
  IdCard,
  Network,
  SearchCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"
import { cn } from "@/lib/utils"

type ProcessStep = {
  number: string
  title: string
  description: string
  detail: string
  areas?: string[]
  isEngagement?: boolean
  icon: LucideIcon
}

const processSteps: ProcessStep[] = [
  {
    number: "1",
    title: "Submit Your Expert Application",
    description:
      "Tell us about your professional experience, areas of expertise, operating context and the decisions where your judgment creates value.",
    detail: "You may apply across one or more areas:",
    areas: ["Careers", "Businesses", "Corporates", "Education"],
    icon: FileText,
  },
  {
    number: "2",
    title: "Application Review",
    description:
      "Every application is individually reviewed for relevant experience, domain credibility, measurable contribution and practical expertise.",
    detail:
      "This helps us understand where your experience is strongest and where it can create the greatest value.",
    icon: SearchCheck,
  },
  {
    number: "3",
    title: "Complete Verification",
    description:
      "Shortlisted applicants may be invited to provide additional professional information, supporting evidence, references or participate in a verification conversation.",
    detail:
      "Verification is designed to establish the credibility and relevance of your expertise.",
    icon: ShieldCheck,
  },
  {
    number: "4",
    title: "Expert Selection",
    description:
      "Applicants who meet the required standards are invited to become SharingMinds Verified Experts.",
    detail:
      "Your approved areas of expertise determine how you are represented across the SharingMinds ecosystem.",
    icon: BadgeCheck,
  },
  {
    number: "5",
    title: "Activate Your Expert Membership",
    description:
      "Selected experts receive the applicable membership, profile activation and participation details.",
    detail:
      "Once activated, your Verified Expert profile presents your experience, expertise and areas of contribution in a clear and structured format.",
    icon: IdCard,
  },
  {
    number: "6",
    title: "Engage Where Your Expertise Matters",
    description:
      "Your expertise can contribute through relevant formats across the four SharingMinds segments:",
    detail:
      "Engagement formats may include individual consultations, mentoring, workshops, decision programmes, knowledge initiatives and strategic assignments.",
    isEngagement: true,
    icon: Network,
  },
]

const engagementAreas = [
  {
    title: "Careers",
    description:
      "Career guidance, leadership development, professional transitions and global mobility.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Businesses",
    description: "Growth, go-to-market, hiring, scaling, operations and execution.",
    icon: Building2,
  },
  {
    title: "Corporates",
    description:
      "Capability development, strategic transformation, leadership and organisational change.",
    icon: Network,
  },
  {
    title: "Education",
    description: "Study-abroad decisions, career-aligned education and academic pathways.",
    icon: GraduationCap,
  },
]

function StepContent({ step, compact = false }: { step: ProcessStep; compact?: boolean }) {
  const detail = (
    <div
      className={cn(
        "border-l-2 border-[#d89c4a] text-[#c5d0db]",
        compact
          ? "mt-3 pl-3 text-[13px] leading-[1.5]"
          : "mt-5 pl-4 text-[14px] leading-[1.65]",
      )}
    >
      {step.detail}
    </div>
  )

  return (
    <>
      <p
        className={cn(
          "text-[#d0d8e2]",
          compact ? "text-[14px] leading-[1.55]" : "text-[15px] leading-[1.65]",
        )}
      >
        {step.description}
      </p>

      {step.isEngagement ? (
        <div
          className={cn(
            "grid",
            compact ? "mt-3 grid-cols-2 gap-2.5" : "mt-5 grid-cols-1 gap-3 sm:grid-cols-2",
          )}
        >
          {engagementAreas.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className={cn(
                "rounded-xl border border-[#4c6f91]/35 bg-[#0a233e]/80",
                compact ? "px-3 py-2.5" : "px-4 py-4",
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "shrink-0 stroke-[1.5] text-[#e1aa58]",
                    compact ? "h-4 w-4" : "h-5 w-5",
                  )}
                  aria-hidden="true"
                />
                <h4 className="text-[14px] font-semibold text-white">{title}</h4>
              </div>
              <p
                className={cn(
                  "text-[#bfcbd7]",
                  compact ? "mt-1.5 text-[13px] leading-[1.42]" : "mt-2 text-[13px] leading-[1.55]",
                )}
              >
                {description}
              </p>
            </article>
          ))}
        </div>
      ) : (
        detail
      )}

      {!step.isEngagement && step.areas && (
        <ul className={cn("flex flex-wrap", compact ? "mt-3 gap-2" : "mt-5 gap-2.5")}>
          {step.areas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-[#3f76ad]/55 bg-[#0a2542] px-3.5 py-1.5 text-[12px] font-medium text-[#e7b66f]"
            >
              {area}
            </li>
          ))}
        </ul>
      )}

      {step.isEngagement && detail}
    </>
  )
}

export function SystemWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="system-works-title"
      className="relative scroll-mt-[104px] overflow-hidden bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:h-[calc(100svh-104px)] lg:min-h-[600px] lg:px-8 lg:pb-[clamp(12px,1.5vh,20px)] lg:pt-[clamp(36px,5vh,56px)] xl:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_36%,rgba(16,91,181,0.19),transparent_42%),linear-gradient(105deg,rgba(2,14,29,0.4),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1380px] lg:grid lg:h-full lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-[clamp(8px,1.5vh,16px)]">
        <header className="mx-auto max-w-[900px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#72b7ff]">
            Simple. Structured. Selective.
          </p>
          <h2
            id="system-works-title"
            className="mt-3 text-[clamp(38px,4vw,54px)] font-normal leading-none tracking-[-0.03em] text-[#f4f1eb] lg:mt-2"
          >
            How It Works
          </h2>
        </header>

        <TabsPrimitive.Root
          defaultValue="1"
          orientation="vertical"
          className="mt-10 hidden min-h-0 grid-cols-[minmax(270px,0.78fr)_minmax(0,1.55fr)] gap-4 lg:grid lg:mt-0 xl:grid-cols-[minmax(310px,0.72fr)_minmax(0,1.55fr)] xl:gap-6"
        >
          <TabsPrimitive.List
            aria-label="Expert application process"
            className="grid h-full min-h-0 grid-rows-6 gap-2"
          >
            {processSteps.map(({ number, title, icon: Icon }) => (
              <TabsPrimitive.Trigger
                key={number}
                value={number}
                className="group flex h-full min-h-[48px] w-full items-center gap-3 rounded-xl border border-[#496984]/35 bg-[#071c33]/70 px-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 hover:border-[#4f8bc6]/70 hover:bg-[#09233e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03172c] data-[state=active]:translate-x-1 data-[state=active]:border-[#318ee9] data-[state=active]:bg-[#0b2a49] data-[state=active]:shadow-[0_10px_28px_rgba(0,0,0,0.18),inset_3px_0_0_#e3a957]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3c6b98]/65 bg-[#08233e] text-[12px] font-semibold text-[#89b9e8] group-data-[state=active]:border-[#dca958] group-data-[state=active]:bg-[#dca958]/10 group-data-[state=active]:text-[#f0bc70]">
                  {number.padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-semibold leading-[1.25] text-[#eef3f7] xl:text-[14px]">
                  {title}
                </span>
                <Icon
                  className="h-4 w-4 shrink-0 stroke-[1.6] text-[#6687a6] transition-colors group-hover:text-[#93b9dd] group-data-[state=active]:text-[#e1aa58]"
                  aria-hidden="true"
                />
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          <div className="min-h-0">
            {processSteps.map((step) => {
              const Icon = step.icon

              return (
                <TabsPrimitive.Content
                  key={step.number}
                  value={step.number}
                  className="h-full min-h-0 rounded-2xl border border-[#52708e]/45 bg-[#071c33]/90 p-[clamp(16px,1.8vw,24px)] shadow-[0_20px_52px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#72b7ff]">
                        Step {step.number.padStart(2, "0")} of 06
                      </p>
                      <h3 className="mt-2 max-w-[760px] text-[clamp(24px,2.4vw,36px)] font-semibold leading-[1.08] tracking-[-0.02em] text-[#f3f5f7]">
                        {step.title}
                      </h3>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d6a05a]/45 bg-[#0a233e] text-[#e1aa58]">
                      <Icon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-[clamp(12px,1.7vh,20px)]">
                    <StepContent step={step} compact />
                  </div>
                </TabsPrimitive.Content>
              )
            })}
          </div>
        </TabsPrimitive.Root>

        <ol className="mt-10 space-y-3 lg:hidden">
          {processSteps.map((step) => {
            const Icon = step.icon

            return (
              <li key={step.number}>
                <details className="group rounded-2xl border border-[#52708e]/40 bg-[#071c33]/85 shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65b9ff] [&::-webkit-details-marker]:hidden">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#3c7cba] bg-[#08233e] text-[12px] font-semibold text-[#efb86c]">
                      {step.number.padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold leading-[1.3] text-[#f2f5f8]">
                      {step.title}
                    </span>
                    <Icon className="h-5 w-5 shrink-0 stroke-[1.5] text-[#e1aa58]" aria-hidden="true" />
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#8ca9c4] transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="border-t border-[#4b6c8b]/30 px-4 pb-5 pt-4 sm:px-6">
                    <StepContent step={step} />
                  </div>
                </details>
              </li>
            )
          })}
        </ol>

        <div className="mt-8 rounded-2xl border border-[#4e7092]/40 bg-[#082039]/90 px-5 py-5 sm:px-7 lg:mt-0 lg:flex lg:items-center lg:justify-between lg:gap-6 lg:rounded-xl lg:px-5 lg:py-3.5 xl:px-6">
          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold leading-tight text-[#f4f1eb] lg:text-[16px] xl:text-[18px]">
              Build Long-Term Professional Value
            </h3>
            <p className="mt-1 max-w-[820px] text-[13px] leading-[1.45] text-[#bfcbd7]">
              Every contribution strengthens the visibility, credibility and relevance of your
              expertise.
            </p>
            <p className="mt-1 text-[11px] leading-[1.4] text-[#8596a7]">
              Applications are individually reviewed. Submission does not guarantee selection.
            </p>
          </div>
          <Link
            href={EXPERT_APPLICATION_PATH}
            className="mt-5 inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-[5px] border border-[#279fff] bg-[#087ee8] px-6 py-2.5 text-center text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(0,143,255,0.42)] transition-all hover:bg-[#168ef5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03172c] lg:mt-0"
          >
            Start My Expert Application
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
