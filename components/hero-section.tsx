import Link from "next/link"
import { BadgeCent, ChartNoAxesCombined, LockKeyhole } from "lucide-react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

const advantages = [
  {
    label: "Influence",
    description: "Extend your impact",
    icon: BadgeCent,
  },
  {
    label: "Access",
    description: "Enter better rooms",
    icon: LockKeyhole,
  },
  {
    label: "Opportunity",
    description: "Create real leverage",
    icon: ChartNoAxesCombined,
  },
]

const qualities = ["Curated", "Verified", "Outcome-Driven", "Selective"]

export function HeroSection() {
  return (
    <section
      id="for-experts"
      className="relative isolate flex min-h-[calc(100svh-88px)] scroll-mt-[88px] items-start overflow-hidden bg-[#031427] text-white sm:min-h-[calc(100svh-104px)] sm:scroll-mt-[104px] sm:items-center"
    >
      <picture className="absolute inset-0 -z-30">
        <source media="(max-width: 639px)" srcSet="/expert-network-hero-mobile.webp" />
        <img
          src="/expert-network-hero-safe-zone.webp"
          alt=""
          fetchPriority="high"
          className="hero-network-art h-full w-full object-cover object-center"
        />
      </picture>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,17,33,0.99)_0%,rgba(2,17,33,0.95)_52%,rgba(2,17,33,0.82)_78%,rgba(2,17,33,0.58)_100%)] sm:bg-[linear-gradient(90deg,rgba(2,17,33,0.98)_0%,rgba(2,17,33,0.93)_28%,rgba(2,17,33,0.35)_54%,rgba(2,17,33,0.08)_74%,rgba(2,17,33,0.3)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(1,13,27,0.15)_0%,rgba(1,13,27,0.02)_55%,rgba(1,13,27,0.72)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1380px] items-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="w-full sm:max-w-[clamp(340px,46vw,640px)]">
          <p className="mb-4 max-w-[34ch] text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-[#79baff] sm:mb-[clamp(12px,2vh,20px)] sm:max-w-none sm:text-[clamp(10px,min(0.8vw,1.45vh),12px)] sm:tracking-[0.18em]">
            Founding Expert Applications Are Open
          </p>

          <h1 className="max-w-[620px] text-balance font-serif text-[clamp(30px,8.8vw,40px)] font-normal leading-[1.04] tracking-[-0.025em] text-[#f7f3ed] sm:text-[clamp(32px,min(3vw,5.6vh),58px)] sm:leading-[1.02]">
            Apply for the SharingMinds
            <span className="mt-1 block text-[#edb46f]">Verified Expert Network</span>
          </h1>

          <p className="mt-6 max-w-[36ch] border-l-2 border-[#dca559]/70 pl-4 text-[14px] leading-[1.65] text-[#e0e7ed] sm:mt-[clamp(18px,3vh,28px)] sm:max-w-[590px] sm:pl-5 sm:text-[clamp(13px,min(0.92vw,1.75vh),17px)]">
            SharingMinds evaluates experienced professionals for inclusion in a curated network
            built around credible expertise, practical judgment and measurable professional
            impact.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-[clamp(20px,3.2vh,32px)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href={EXPERT_APPLICATION_PATH}
              className="inline-flex min-h-[50px] w-full min-w-0 items-center justify-center rounded-[4px] border border-[#1ea6ff] bg-[#087ee8] px-5 py-3 text-center text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(0,143,255,0.85),inset_0_0_14px_rgba(255,255,255,0.13)] transition-all hover:bg-[#168ef5] hover:shadow-[0_0_26px_rgba(0,143,255,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#031427] sm:w-auto sm:min-w-[225px] sm:text-[clamp(12px,min(0.85vw,1.7vh),13px)]"
            >
              Start My Expert Application
            </Link>
            <Link
              href="#who-we-serve"
              className="inline-flex min-h-[50px] w-full min-w-0 items-center justify-center rounded-[4px] border border-[#4f7ba2] bg-[#071a2e]/72 px-5 py-3 text-center text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#7ba9d0] hover:bg-[#0d2741]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ba9d0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#031427] sm:w-auto sm:min-w-[285px] sm:px-6 sm:text-[clamp(12px,min(0.85vw,1.7vh),13px)]"
            >
              Review Eligibility and Selection Process
            </Link>
          </div>

          <ul className="mt-7 grid max-w-[330px] grid-cols-2 gap-x-5 gap-y-3 text-[12px] font-medium text-[#e9c591] sm:hidden">
            {qualities.map((quality) => (
              <li key={quality} className="flex items-center gap-2.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#f0b45d]" aria-hidden="true" />
                {quality}
              </li>
            ))}
          </ul>

          <ul className="mt-[clamp(20px,3.5vh,36px)] hidden flex-wrap items-center text-[clamp(11px,min(0.78vw,1.55vh),12px)] font-medium text-[#e9c591] sm:flex">
            {qualities.map((quality, index) => (
              <li key={quality} className="flex items-center">
                {index > 0 && (
                  <span className="mx-4 h-1 w-1 rounded-full bg-[#f0b45d]" aria-hidden="true" />
                )}
                {quality}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="hero-network-infinity pointer-events-none absolute left-[67.2%] top-[50%] hidden -translate-x-1/2 -translate-y-1/2 font-serif text-[64px] leading-none text-[#83c7ff] drop-shadow-[0_0_10px_rgba(78,169,255,0.95)] min-[840px]:block"
        aria-hidden="true"
      >
        ∞
      </div>

      <div className="hero-network-card-shell pointer-events-none absolute right-[clamp(20px,3.5vw,56px)] top-[52%] z-20 hidden w-[clamp(160px,15vw,215px)] -translate-y-1/2 min-[1100px]:block">
        <aside className="hero-network-card w-full rounded-[6px] border border-[#7890a5]/45 bg-[#06172a]/95 px-4 py-2 shadow-[0_16px_50px_rgba(0,0,0,0.42)] backdrop-blur-[12px]">
          <h2 className="sr-only">Expert network advantages</h2>
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon

            return (
              <div
                key={advantage.label}
                className={`hero-network-advantage flex items-center gap-3 py-4 ${
                  index < advantages.length - 1 ? "border-b border-white/[0.14]" : ""
                }`}
              >
                <Icon
                  className="hero-network-advantage-icon h-[26px] w-[26px] shrink-0 stroke-[1.6] text-[#e6ad60]"
                  aria-hidden="true"
                />
                <div>
                  <p className="hero-network-advantage-title text-[13px] font-semibold leading-none text-white">
                    {advantage.label}
                  </p>
                  <p className="hero-network-advantage-description mt-2 text-[9px] leading-none text-white/[0.65]">
                    {advantage.description}
                  </p>
                </div>
              </div>
            )
          })}
        </aside>
      </div>
    </section>
  )
}
