import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  IdCard,
  Network,
  SearchCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ProcessStep = {
  number: string
  title: string
  description: string
  detail: string
  compactDetail?: string
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
    compactDetail:
      "Consultations, mentoring, workshops, decision programmes and strategic assignments.",
    isEngagement: true,
    icon: Network,
  },
]

const engagementAreas = [
  { title: "Careers", icon: BriefcaseBusiness },
  { title: "Businesses", icon: Building2 },
  { title: "Corporates", icon: Network },
  { title: "Education", icon: GraduationCap },
]

const desktopPlacement = [
  "lg:col-span-2 lg:col-start-1 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-4 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-span-2 lg:col-start-1 lg:row-start-2",
]

function JourneyConnector({ step }: { step: string }) {
  const connectorClasses =
    "pointer-events-none absolute z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-[#3b78b5]/60 bg-[#08233e] text-[#e1aa58] shadow-[0_6px_18px_rgba(0,0,0,0.25)] lg:flex"

  if (step === "3") {
    return (
      <span
        aria-hidden="true"
        className={cn(connectorClasses, "-bottom-[22px] right-[calc(50%-14px)]")}
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </span>
    )
  }

  if (step === "4" || step === "5") {
    return (
      <span
        aria-hidden="true"
        className={cn(connectorClasses, "-left-[22px] top-[calc(50%-14px)]")}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
      </span>
    )
  }

  if (step === "1" || step === "2") {
    return (
      <span
        aria-hidden="true"
        className={cn(connectorClasses, "-right-[22px] top-[calc(50%-14px)]")}
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    )
  }

  return null
}

export function SystemWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="system-works-title"
      className="relative scroll-mt-[104px] overflow-hidden border-t border-[#24415e]/55 bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:flex lg:min-h-[calc(100svh-104px)] lg:items-center lg:px-8 lg:pb-[clamp(12px,1.5vh,20px)] lg:pt-[clamp(32px,4.5vh,48px)] xl:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_38%,rgba(16,91,181,0.18),transparent_43%),linear-gradient(105deg,rgba(2,14,29,0.38),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1380px]">
        <header className="mx-auto max-w-[900px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#72b7ff]">
            Simple. Structured. Selective.
          </p>
          <h2
            id="system-works-title"
            className="mt-2 text-[clamp(40px,3.6vw,54px)] font-normal leading-none tracking-[-0.03em] text-[#f4f1eb]"
          >
            How It Works
          </h2>
        </header>

        <ol className="relative mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-3.5 xl:gap-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon
            const isFeature = step.number === "1" || step.number === "6"

            return (
              <li
                key={step.number}
                className={cn(
                  "relative flex min-h-[220px] flex-col rounded-2xl border bg-[#071c33]/90 px-5 py-5 shadow-[0_16px_38px_rgba(0,0,0,0.18)]",
                  "border-[#52708e]/40 lg:min-h-[220px] lg:px-4 lg:py-3.5 xl:min-h-[228px] xl:px-5 xl:py-5",
                  isFeature &&
                    "border-[#387dbe]/55 bg-[linear-gradient(135deg,rgba(10,42,73,0.96),rgba(7,28,51,0.94))]",
                  desktopPlacement[index],
                )}
              >
                <JourneyConnector step={step.number} />

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#3f78ad] bg-[#08233e] text-[12px] font-semibold text-[#f0bc70]">
                    {step.number.padStart(2, "0")}
                  </span>
                  <h3
                    className={cn(
                      "min-w-0 flex-1 text-[17px] font-semibold leading-[1.25] text-[#f3f5f7]",
                      !isFeature && "lg:text-[15px] xl:text-[16px]",
                    )}
                  >
                    {step.title}
                  </h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d6a05a]/40 bg-[#0a233e] text-[#e1aa58]">
                    <Icon className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden="true" />
                  </span>
                </div>

                <p
                  className={cn(
                    "mt-3 text-[14px] leading-[1.52] text-[#d0d8e2]",
                    !isFeature && "lg:text-[13px] lg:leading-[1.48] xl:text-[14px]",
                  )}
                >
                  {step.description}
                </p>

                {step.areas && (
                  <div className="mt-auto pt-3">
                    <p className="border-l-2 border-[#d89c4a] pl-3 text-[12px] font-medium text-[#c8d3dd]">
                      {step.detail}
                    </p>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {step.areas.map((area) => (
                        <li
                          key={area}
                          className="rounded-full border border-[#3f76ad]/55 bg-[#0a2542] px-3 py-1.5 text-[12px] font-medium text-[#e7b66f]"
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.isEngagement && (
                  <div className="mt-auto pt-3">
                    <ul className="grid grid-cols-2 gap-2">
                      {engagementAreas.map(({ title, icon: AreaIcon }) => (
                        <li
                          key={title}
                          className="flex items-center gap-2 rounded-lg border border-[#466b8d]/45 bg-[#092440]/80 px-2.5 py-2 text-[12px] font-semibold text-[#edf2f6]"
                        >
                          <AreaIcon
                            className="h-4 w-4 shrink-0 stroke-[1.5] text-[#e1aa58]"
                            aria-hidden="true"
                          />
                          {title}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2.5 border-l-2 border-[#d89c4a] pl-3 text-[12px] leading-[1.4] text-[#bdc9d5]">
                      <span className="lg:hidden">{step.detail}</span>
                      <span className="hidden lg:inline">{step.compactDetail}</span>
                    </p>
                  </div>
                )}

                {!isFeature && (
                  <p className="mt-auto border-l-2 border-[#d89c4a] pl-3 pt-0 text-[12px] leading-[1.45] text-[#bdc9d5] xl:text-[13px]">
                    {step.detail}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
