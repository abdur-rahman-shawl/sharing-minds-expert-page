import { UsersRound } from "lucide-react"

import { foundingCohort } from "./founding-expert-data"

export function FoundingCohortCard() {
  return (
    <article className="relative overflow-hidden rounded-[20px] border border-[#d7a44d]/70 bg-white/68 p-4 shadow-[0_14px_32px_rgba(113,72,14,0.1)] backdrop-blur-sm lg:h-[clamp(210px,27vh,232px)] lg:p-[clamp(12px,1.2vw,18px)] 2xl:flex 2xl:h-[clamp(220px,27vh,260px)] 2xl:flex-col 2xl:justify-center">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f0c45d]/20 blur-2xl" />
      <p className="relative text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a86610]">
        Founding Cohort
      </p>

      <div className="relative mt-3 flex items-center gap-5 lg:mt-2 lg:gap-4 xl:mt-3 xl:gap-5">
        <span className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full border-[9px] border-[#e7bd61] bg-[#fffaf0] text-[#0b2852] shadow-[inset_0_0_0_1px_#c78a24] lg:h-[70px] lg:w-[70px] lg:border-[7px] xl:h-[82px] xl:w-[82px] xl:border-[9px]">
          <UsersRound className="h-9 w-9 fill-[#0b2852]/10 lg:h-8 lg:w-8" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12px] font-medium text-[#2e4055]">Limited Cohort</p>
          <p className="mt-0.5 text-[clamp(36px,3.4vw,50px)] font-semibold leading-none tracking-[-0.04em] text-[#071d3e]">
            {foundingCohort.capacity}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#b36f0d]">{foundingCohort.label}</p>
        </div>
      </div>

      <div className="relative mt-3 border-t border-[#d8b875]/60 pt-2.5 lg:mt-2 lg:pt-2 xl:mt-3 xl:pt-2.5">
        <p className="text-[13px] font-semibold text-[#b16e0e]">
          Curated. Verified. Impactful.
        </p>
        <p className="mt-1 text-[10px] leading-[1.35] text-[#3f5063]">
          {foundingCohort.description}
        </p>
      </div>
    </article>
  )
}
