import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"

import { FoundingApplicationPath } from "@/components/founding-expert/founding-application-path"
import { FoundingBenefits } from "@/components/founding-expert/founding-benefits"
import { FoundingCohortCard } from "@/components/founding-expert/founding-cohort-card"
import { FoundingExpertProfile } from "@/components/founding-expert/founding-expert-profile"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

const networkNodes = [
  "left-[4%] top-[15%] h-2 w-2",
  "left-[14%] top-[8%] h-1.5 w-1.5",
  "left-[28%] top-[26%] h-2.5 w-2.5",
  "right-[26%] top-[7%] h-2 w-2",
  "right-[15%] top-[19%] h-1.5 w-1.5",
  "right-[4%] top-[11%] h-2.5 w-2.5",
  "left-[41%] bottom-[18%] h-2 w-2",
  "right-[32%] bottom-[9%] h-1.5 w-1.5",
  "right-[7%] bottom-[24%] h-2 w-2",
]

function FoundingStatusCallout() {
  return (
    <div className="flex max-w-[570px] gap-4 rounded-2xl border border-[#d4a14d]/65 bg-white/46 p-4 shadow-[0_12px_30px_rgba(128,83,14,0.08)] backdrop-blur-sm lg:p-[clamp(12px,1.25vw,18px)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#c78a24] bg-[linear-gradient(145deg,#fff8de,#e8bf63)] text-[#9b650f] shadow-[0_8px_18px_rgba(134,84,8,0.16)]">
        <ShieldCheck className="h-7 w-7" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div>
        <p className="text-[17px] font-semibold leading-tight text-[#a46b14] lg:text-[15px] xl:text-[17px]">
          Founding status is limited.
        </p>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-[#37495c] lg:text-[11px] xl:text-[13px]">
          It is available only to professionals who successfully complete the application and
          verification process during the founding phase.
        </p>
      </div>
    </div>
  )
}

function FoundingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.94),transparent_35%),radial-gradient(circle_at_78%_46%,rgba(249,214,126,0.36),transparent_39%),linear-gradient(115deg,#f8f3e8_8%,#f8edd3_52%,#f4dfae_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(177,113,18,0.42)_0.8px,transparent_0.8px)] [background-size:17px_17px] [mask-image:linear-gradient(110deg,transparent_3%,black_55%,transparent_98%)]" />

      <span className="absolute -bottom-[48%] -left-[18%] h-[70%] w-[64%] rounded-full border-[34px] border-[#bf7b12]/20" />
      <span className="absolute -bottom-[44%] -left-[15%] h-[66%] w-[60%] rounded-full border border-[#fff8df]" />

      <span className="absolute left-[6%] top-[9%] h-px w-[24%] origin-left rotate-[12deg] bg-[linear-gradient(90deg,transparent,#c79235,transparent)]" />
      <span className="absolute left-[20%] top-[23%] h-px w-[31%] origin-left -rotate-[19deg] bg-[linear-gradient(90deg,transparent,#c79235,transparent)]" />
      <span className="absolute right-[4%] top-[7%] h-px w-[30%] origin-right -rotate-[12deg] bg-[linear-gradient(90deg,transparent,#c79235,transparent)]" />
      <span className="absolute right-[3%] top-[24%] h-px w-[28%] origin-right rotate-[19deg] bg-[linear-gradient(90deg,transparent,#c79235,transparent)]" />
      <span className="absolute bottom-[18%] left-[38%] h-px w-[30%] origin-left rotate-[10deg] bg-[linear-gradient(90deg,transparent,#c79235,transparent)]" />
      <span className="absolute bottom-[17%] right-[3%] h-px w-[31%] origin-right -rotate-[15deg] bg-[linear-gradient(90deg,transparent,#c79235,transparent)]" />

      {networkNodes.map((className) => (
        <span
          key={className}
          className={`absolute rounded-full border border-[#dba946] bg-[#fff8d5] shadow-[0_0_16px_rgba(215,155,47,0.72)] ${className}`}
        />
      ))}
    </div>
  )
}

export function AudienceCtaSection() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-title"
      className="relative scroll-mt-[86px] overflow-hidden border-y border-[#d7bb83] px-4 py-12 text-[#0a2148] sm:px-6 sm:py-16 lg:flex lg:min-h-[calc(100svh-104px)] lg:scroll-mt-[104px] lg:items-center lg:px-6 lg:py-4 xl:px-8"
    >
      <FoundingBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-10 lg:grid-cols-[minmax(330px,0.76fr)_minmax(610px,1.24fr)] lg:items-center lg:gap-[clamp(28px,4vw,68px)]">
        <div className="mx-auto w-full max-w-[610px] lg:mx-0">
          <header>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a96d13]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Founding Cohort
            </p>
            <h2
              id="final-cta-title"
              className="mt-3 text-[clamp(44px,5vw,74px)] font-semibold leading-[0.98] tracking-[-0.045em] text-[#071d43] lg:text-[clamp(42px,4vw,64px)]"
            >
              Founding Expert
              <span className="block">Applications</span>
            </h2>
            <div className="mt-5 flex items-center" aria-hidden="true">
              <span className="h-px w-44 bg-[linear-gradient(90deg,#bd7b17,#d5a13d)]" />
              <span className="h-3 w-3 rotate-45 border border-[#c4821d] bg-[#d69b2f]" />
              <span className="h-px flex-1 bg-[linear-gradient(90deg,#d5a13d,transparent)]" />
            </div>
          </header>

          <div className="mt-6 max-w-[570px] space-y-3 text-[15px] leading-[1.62] text-[#2d4058] lg:mt-[clamp(16px,2.2vh,26px)] lg:text-[13px] xl:text-[15px]">
            <p>SharingMinds is currently evaluating applications for its Founding Expert Cohort.</p>
            <p>
              Professionals selected during this phase may receive Founding Expert recognition
              and the opportunity to establish an early presence within the SharingMinds
              ecosystem.
            </p>
          </div>

          <div className="mt-6 lg:mt-[clamp(16px,2.2vh,26px)]">
            <FoundingStatusCallout />
          </div>

          <Link
            href={EXPERT_APPLICATION_PATH}
            className="group mt-7 inline-flex min-h-[54px] w-full max-w-[570px] items-center justify-center gap-4 rounded-xl border border-[#bc7811] bg-[linear-gradient(180deg,#f7d679,#d99d31)] px-6 text-center text-[16px] font-semibold text-[#10233e] shadow-[0_12px_30px_rgba(165,104,13,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[filter,box-shadow,transform] hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_16px_34px_rgba(165,104,13,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b6311] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8edd3] lg:mt-[clamp(18px,2.5vh,30px)] lg:min-h-[50px] lg:text-[14px] xl:min-h-[54px] xl:text-[16px]"
          >
            Start My Expert Application
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid min-w-0 gap-3 lg:gap-[clamp(10px,1.4vh,14px)]">
          <FoundingExpertProfile />

          <div className="grid gap-3 md:grid-cols-2 lg:gap-[clamp(10px,1.4vh,14px)]">
            <FoundingApplicationPath />
            <FoundingCohortCard />
          </div>

          <FoundingBenefits />
        </div>
      </div>
    </section>
  )
}
