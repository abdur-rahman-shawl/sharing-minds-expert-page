import Image from "next/image"
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
      className="relative isolate flex min-h-[calc(100svh-88px)] scroll-mt-[88px] items-center overflow-hidden bg-[#031427] text-white sm:min-h-[calc(100svh-104px)] sm:scroll-mt-[104px]"
    >
      <Image
        src="/expert-network-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-[54%_center] sm:object-center"
      />

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,17,33,0.98)_0%,rgba(2,17,33,0.93)_28%,rgba(2,17,33,0.35)_54%,rgba(2,17,33,0.08)_74%,rgba(2,17,33,0.3)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(1,13,27,0.15)_0%,rgba(1,13,27,0.02)_55%,rgba(1,13,27,0.72)_100%)]" />

      <div className="mx-auto flex w-full max-w-[1380px] items-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-[clamp(340px,39vw,520px)]">
          <div className="mb-5 flex items-end gap-2.5">
            <span className="font-serif text-[31px] leading-none text-[#e9b770]">01</span>
            <span className="pb-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#69a6e3]">
              Expert Network
            </span>
          </div>

          <h1 className="font-serif text-[clamp(38px,4vw,58px)] font-normal leading-[0.98] tracking-[-0.025em] text-[#f7f3ed]">
            Turn Expertise Into
            <span className="mt-1 block text-[#edb46f]">Strategic Leverage</span>
          </h1>

          <p className="mt-6 max-w-[470px] text-[clamp(13px,1.15vw,16px)] leading-[1.65] text-[#e0e7ed]">
            Join a curated expert network designed to compound your authority, expand your
            influence, and create structured access to high-value opportunities.
          </p>
          <p className="mt-3 max-w-[480px] text-[clamp(13px,1.15vw,16px)] leading-[1.65] text-[#d4dde6]">
            Engage with professionals, businesses, corporates, and students making critical
            decisions—without content noise, audience-building, or low-intent discovery.
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={EXPERT_APPLICATION_PATH}
              className="inline-flex h-[50px] min-w-[205px] items-center justify-center rounded-[4px] border border-[#1ea6ff] bg-[#087ee8] px-7 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(0,143,255,0.85),inset_0_0_14px_rgba(255,255,255,0.13)] transition-all hover:bg-[#168ef5] hover:shadow-[0_0_26px_rgba(0,143,255,0.95)]"
            >
              Apply as an Expert
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-[50px] min-w-[184px] items-center justify-center rounded-[4px] border border-[#4f7ba2] bg-[#071a2e]/55 px-7 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#7ba9d0] hover:bg-[#0d2741]/70"
            >
              See How It Works
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-y-3 text-[12px] font-medium text-[#e9c591] sm:gap-x-0">
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
        className="pointer-events-none absolute left-[67.2%] top-[50%] hidden -translate-x-1/2 -translate-y-1/2 font-serif text-[64px] leading-none text-[#83c7ff] drop-shadow-[0_0_10px_rgba(78,169,255,0.95)] min-[840px]:block"
        aria-hidden="true"
      >
        ∞
      </div>

      <aside className="absolute right-[clamp(20px,3.5vw,56px)] top-[52%] hidden w-[clamp(160px,15vw,215px)] -translate-y-1/2 rounded-[6px] border border-[#7890a5]/40 bg-[#08192c]/82 px-4 py-2 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-[8px] min-[840px]:block">
        <h2 className="sr-only">Expert network advantages</h2>
        {advantages.map((advantage, index) => {
          const Icon = advantage.icon

          return (
            <div
              key={advantage.label}
              className={`flex items-center gap-3 py-4 ${
                index < advantages.length - 1 ? "border-b border-white/[0.14]" : ""
              }`}
            >
              <Icon
                className="h-[26px] w-[26px] shrink-0 stroke-[1.6] text-[#e6ad60]"
                aria-hidden="true"
              />
              <div>
                <p className="text-[13px] font-semibold leading-none text-white">
                  {advantage.label}
                </p>
                <p className="mt-2 text-[9px] leading-none text-white/[0.65]">
                  {advantage.description}
                </p>
              </div>
            </div>
          )
        })}
      </aside>
    </section>
  )
}
