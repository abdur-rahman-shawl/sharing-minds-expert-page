import Image from "next/image"
import { ChartNoAxesCombined, Cpu, UsersRound } from "lucide-react"

const systemSteps = [
  {
    number: "1",
    title: "Build Your Expert Profile",
    description: "Showcase your experience, operating context, and decision depth.",
    visual: "portrait",
  },
  {
    number: "2",
    title: "Get Matched to Relevant Demand",
    description: "AI matches your expertise with real decision needs.",
    visual: "ai",
  },
  {
    number: "3",
    title: "Engage Through Structured Formats",
    description:
      "1:1 sessions, decision programs, workshops, and strategic engagements.",
    visual: "formats",
  },
  {
    number: "4",
    title: "Compound Authority Through Outcomes",
    description:
      "Every outcome strengthens your trust, relevance, and future opportunity.",
    visual: "outcomes",
  },
]

function StepVisual({ visual }: { visual: string }) {
  if (visual === "portrait") {
    return (
      <span className="absolute inset-2 overflow-hidden rounded-full border border-[#367ecc]/60">
        <Image
          src="/professional-mentor-headshot-8.jpg"
          alt=""
          fill
          sizes="116px"
          className="object-cover"
        />
      </span>
    )
  }

  if (visual === "ai") {
    return (
      <span className="absolute inset-2 flex items-center justify-center rounded-[24px] border border-[#367ecc]/45 bg-[#09203a] shadow-[inset_0_0_24px_rgba(24,102,190,0.2)]">
        <Cpu className="h-20 w-20 stroke-[1.15] text-[#c4d7ec]" />
        <span className="absolute inset-4 rounded-[18px] border border-dashed border-[#5d9ade]/30" />
      </span>
    )
  }

  if (visual === "formats") {
    const formatPortraits = [
      "/professional-mentor-headshot-1.jpg",
      "/professional-mentor-headshot-2.jpg",
      "/professional-mentor-headshot-3.jpg",
      "/professional-mentor-headshot-9.jpg",
    ]

    return (
      <span className="absolute inset-2 grid grid-cols-2 gap-1 overflow-hidden rounded-[18px] border border-[#367ecc]/50 bg-[#09203a] p-1">
        {formatPortraits.map((source) => (
          <span key={source} className="relative overflow-hidden rounded-[7px]">
            <Image src={source} alt="" fill sizes="52px" className="object-cover" />
          </span>
        ))}
        <UsersRound className="absolute bottom-3 left-1/2 h-8 w-8 -translate-x-1/2 rounded bg-[#071a30]/75 p-1.5 text-[#e1ab5b]" />
      </span>
    )
  }

  return (
    <span className="absolute inset-2 flex items-center justify-center overflow-hidden rounded-full border border-[#367ecc]/50 bg-[radial-gradient(circle_at_center,rgba(24,108,205,0.24),rgba(5,25,47,0.95)_70%)]">
      <span className="absolute inset-4 rounded-full border border-dashed border-[#5d9ade]/35" />
      <ChartNoAxesCombined className="h-20 w-20 stroke-[1.2] text-[#267bdc]" />
    </span>
  )
}

export function SystemWorksSection() {
  return (
    <section
      id="system-works"
      aria-labelledby="system-works-title"
      className="relative flex scroll-mt-[104px] items-center overflow-hidden bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:min-h-[clamp(620px,72vh,740px)] lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_45%,rgba(16,91,181,0.13),transparent_48%),linear-gradient(105deg,rgba(2,14,29,0.35),transparent_60%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <div className="max-w-[820px]">
          <h2
            id="system-works-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
          >
            <span className="block lg:whitespace-nowrap">Simple. Structured.</span>
            <span className="block lg:whitespace-nowrap">High-Leverage.</span>
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-[7%] right-[7%] top-[88px] hidden h-px bg-[linear-gradient(90deg,transparent,#2b80df_12%,#6bb3ff_50%,#2b80df_88%,transparent)] shadow-[0_0_12px_rgba(55,145,239,0.9)] lg:block" />

          <ol className="relative grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {systemSteps.map(({ number, title, description, visual }, index) => (
              <li
                key={number}
                className={`relative flex flex-col items-center px-5 text-center ${
                  index < systemSteps.length - 1
                    ? "lg:border-r lg:border-[#6f8296]/25"
                    : ""
                }`}
              >
                <div className="relative mb-6 h-[176px] w-[176px]">
                  <span className="absolute inset-0 rounded-full border border-[#2d73c7]/50 shadow-[0_0_22px_rgba(23,106,223,0.18)]" />
                  <StepVisual visual={visual} />

                  <span className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#377ed2] bg-[#061a31] font-serif text-[17px] text-[#c8d9ec]">
                    {number}
                  </span>
                </div>

                <h3 className="max-w-[250px] text-[18px] font-semibold leading-[1.35] text-[#f2f4f7]">
                  {title}
                </h3>
                <p className="mt-3 max-w-[250px] text-[14px] leading-[1.65] text-[#c8d1dc]">
                  {description}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center text-[14px] font-medium text-[#e1aa58]">
            No content treadmill. No cold outreach. No audience-building.
          </p>
        </div>
      </div>
    </section>
  )
}
