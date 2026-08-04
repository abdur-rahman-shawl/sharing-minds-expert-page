import Link from "next/link"
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  IdCard,
  Network,
  SearchCheck,
  ShieldCheck,
} from "lucide-react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"
import { cn } from "@/lib/utils"

const selectionSteps = [
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
    areas: undefined,
    icon: SearchCheck,
  },
  {
    number: "3",
    title: "Complete Verification",
    description:
      "Shortlisted applicants may be invited to provide additional professional information, supporting evidence, references or participate in a verification conversation.",
    detail:
      "Verification is designed to establish the credibility and relevance of your expertise.",
    areas: undefined,
    icon: ShieldCheck,
  },
  {
    number: "4",
    title: "Expert Selection",
    description:
      "Applicants who meet the required standards are invited to become SharingMinds Verified Experts.",
    detail:
      "Your approved areas of expertise determine how you are represented across the SharingMinds ecosystem.",
    areas: undefined,
    icon: BadgeCheck,
  },
  {
    number: "5",
    title: "Activate Your Expert Membership",
    description:
      "Selected experts receive the applicable membership, profile activation and participation details.",
    detail:
      "Once activated, your Verified Expert profile presents your experience, expertise and areas of contribution in a clear and structured format.",
    areas: undefined,
    icon: IdCard,
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

export function SystemWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="system-works-title"
      className="relative scroll-mt-[104px] overflow-hidden bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_34%,rgba(16,91,181,0.16),transparent_45%),linear-gradient(105deg,rgba(2,14,29,0.35),transparent_60%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#72b7ff]">
            Simple. Structured. Selective.
          </p>
          <h2
            id="system-works-title"
            className="mt-5 font-serif text-[clamp(44px,4.2vw,62px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
          >
            How It Works
          </h2>
        </div>

        <ol className="relative mt-14 grid gap-7 lg:grid-cols-2">
          {selectionSteps.map(
            ({ number, title, description, detail, areas, icon: Icon }, index) => (
              <li
                key={number}
                className={cn(
                  "relative rounded-2xl border border-[#52708e]/35 bg-[#071c33]/[0.78] px-6 pb-7 pt-9 shadow-[0_18px_44px_rgba(0,0,0,0.17)] sm:px-8",
                  index === selectionSteps.length - 1 &&
                    "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-[677px]",
                )}
              >
                <span className="absolute -top-5 left-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#367ed2] bg-[#061a31] font-serif text-[20px] text-[#edb46f] shadow-[0_0_18px_rgba(23,106,223,0.25)] sm:left-8">
                  {number}
                </span>
                <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#d6a05a]/45 bg-[#0a233e] text-[#e1aa58] sm:right-8">
                  <Icon className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
                </span>

                <h3 className="max-w-[80%] text-[21px] font-semibold leading-[1.35] text-[#f3f5f7]">
                  {title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.72] text-[#d0d8e2]">{description}</p>
                <p className="mt-3 text-[15px] leading-[1.72] text-[#bfcbd7]">{detail}</p>

                {areas && (
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {areas.map((area) => (
                      <li
                        key={area}
                        className="rounded-full border border-[#3f76ad]/55 bg-[#0a2542] px-4 py-2 text-[13px] font-medium text-[#e7b66f]"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ),
          )}

          <li className="relative rounded-2xl border border-[#52708e]/40 bg-[#071c33]/[0.86] px-6 pb-8 pt-10 shadow-[0_20px_52px_rgba(0,0,0,0.2)] sm:px-8 lg:col-span-2">
            <span className="absolute -top-5 left-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#367ed2] bg-[#061a31] font-serif text-[20px] text-[#edb46f] shadow-[0_0_18px_rgba(23,106,223,0.25)] sm:left-8">
              6
            </span>
            <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#d6a05a]/45 bg-[#0a233e] text-[#e1aa58] sm:right-8">
              <Network className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
            </span>

            <h3 className="max-w-[80%] text-[23px] font-semibold leading-[1.35] text-[#f3f5f7]">
              Engage Where Your Expertise Matters
            </h3>
            <p className="mt-4 max-w-[940px] text-[15px] leading-[1.72] text-[#d0d8e2]">
              Your expertise can contribute through relevant formats across the four
              SharingMinds segments:
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {engagementAreas.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-xl border border-[#4c6f91]/35 bg-[#0a233e]/80 px-5 py-6"
                >
                  <Icon className="h-8 w-8 stroke-[1.45] text-[#e1aa58]" aria-hidden="true" />
                  <h4 className="mt-4 text-[17px] font-semibold text-white">{title}</h4>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[#c7d1dc]">{description}</p>
                </article>
              ))}
            </div>

            <p className="mt-7 text-[15px] leading-[1.72] text-[#cbd5df]">
              Engagement formats may include individual consultations, mentoring, workshops,
              decision programmes, knowledge initiatives and strategic assignments.
            </p>
          </li>
        </ol>

        <div className="mx-auto mt-12 max-w-[940px] rounded-2xl border border-[#4e7092]/40 bg-[#082039]/75 px-6 py-8 text-center sm:px-10">
          <h3 className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.1] text-[#f4f1eb]">
            Build Long-Term Professional Value
          </h3>
          <p className="mx-auto mt-4 max-w-[760px] text-[16px] leading-[1.72] text-[#cbd5df]">
            Every meaningful contribution strengthens the visibility, credibility and relevance
            of your expertise within the SharingMinds ecosystem.
          </p>
          <Link
            href={EXPERT_APPLICATION_PATH}
            className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-[5px] border border-[#279fff] bg-[#087ee8] px-8 py-3 text-center text-[14px] font-semibold text-white shadow-[0_0_22px_rgba(0,143,255,0.5)] transition-all hover:bg-[#168ef5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03172c]"
          >
            Start My Expert Application
          </Link>
          <p className="mt-4 text-[13px] leading-[1.55] text-[#9eacba]">
            Applications are individually reviewed. Submission does not guarantee selection.
          </p>
        </div>
      </div>
    </section>
  )
}
