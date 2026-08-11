import Image from "next/image"

import { cn } from "@/lib/utils"

import type {
  PlatformBenefit,
  PlatformOutcome,
  PlatformScenario,
} from "./strategic-platform-data"

type StrategicPlatformPanelProps = {
  outcome: PlatformOutcome
}

const scenarioPositions = [
  "left-[1%] top-[2%]",
  "right-[1%] top-[2%]",
  "left-[1%] top-1/2 -translate-y-1/2",
  "right-[1%] top-1/2 -translate-y-1/2",
  "bottom-[2%] left-[1%]",
  "bottom-[2%] right-[1%]",
]

function ScenarioCard({
  scenario,
  position,
}: {
  scenario: PlatformScenario
  position: string
}) {
  const Icon = scenario.icon
  const isLeft = position.includes("left-")

  return (
    <article
      className={cn(
        "absolute z-20 hidden h-[clamp(66px,8.1vh,82px)] w-[clamp(154px,25%,214px)] overflow-hidden rounded-xl border border-[#b7791f]/90 bg-[#07192d]/94 shadow-[0_12px_28px_rgba(0,0,0,0.24)] lg:flex",
        position,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#f0ad2e] shadow-[0_0_12px_rgba(240,173,46,0.9)]",
          isLeft ? "-right-1" : "-left-1",
        )}
      />
      <div className="relative w-[42%] shrink-0 overflow-hidden border-r border-[#9e6e25]/65">
        <Image
          src={scenario.image}
          alt=""
          fill
          sizes="110px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(4,19,35,0.16))]" />
      </div>
      <div className="relative min-w-0 flex-1 px-2.5 py-2">
        <h4 className="pr-5 text-[10px] font-semibold leading-[1.18] text-[#f6f0e6] xl:text-[11px]">
          {scenario.title}
        </h4>
        <p className="mt-1 line-clamp-2 text-[9px] leading-[1.28] text-[#c8d0d9] xl:text-[10px]">
          {scenario.description}
        </p>
        <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#d39225]/80 bg-[#14314d]/95 text-[#efb03e]">
          <Icon className="h-3.5 w-3.5 stroke-[1.6]" aria-hidden="true" />
        </span>
      </div>
    </article>
  )
}

function ExpertNetwork({ outcome }: { outcome: PlatformOutcome }) {
  return (
    <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(37,129,218,0.34)_1px,transparent_1px)] [background-size:8px_8px] [mask-image:linear-gradient(to_bottom,black,transparent_74%)]" />

      <div className="absolute left-[22%] top-[19%] h-px w-[30%] origin-left rotate-[17deg] bg-[linear-gradient(90deg,#c58829,transparent)]" />
      <div className="absolute right-[22%] top-[19%] h-px w-[30%] origin-right -rotate-[17deg] bg-[linear-gradient(270deg,#c58829,transparent)]" />
      <div className="absolute left-[23%] top-1/2 h-px w-[29%] bg-[linear-gradient(90deg,#c58829,transparent)]" />
      <div className="absolute right-[23%] top-1/2 h-px w-[29%] bg-[linear-gradient(270deg,#c58829,transparent)]" />
      <div className="absolute bottom-[19%] left-[22%] h-px w-[30%] origin-left -rotate-[17deg] bg-[linear-gradient(90deg,#c58829,transparent)]" />
      <div className="absolute bottom-[19%] right-[22%] h-px w-[30%] origin-right rotate-[17deg] bg-[linear-gradient(270deg,#c58829,transparent)]" />

      <div className="absolute left-1/2 top-1/2 h-[clamp(178px,19vw,242px)] w-[clamp(178px,19vw,242px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d69a2f]/35 shadow-[0_0_54px_rgba(215,151,41,0.14)]">
        <div className="absolute -inset-3 rounded-full border border-dashed border-[#d69a2f]/35" />
        <div className="absolute -inset-1.5 rounded-full border border-[#2a689b]/55" />
        <div className="absolute inset-2 overflow-hidden rounded-full border-2 border-[#e0a039] bg-[#102b48] shadow-[inset_0_0_34px_rgba(0,0,0,0.36),0_0_20px_rgba(224,160,57,0.22)]">
          <Image
            src={outcome.centralImage}
            alt=""
            fill
            sizes="240px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(4,18,33,0.58))]" />
        </div>
        <span className="absolute bottom-3 left-1/2 flex min-w-[126px] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-[#d69a2f] bg-[#06172b]/95 px-3 py-1.5 text-[11px] font-semibold text-[#f6f0e6] shadow-[0_7px_20px_rgba(0,0,0,0.3)]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] text-[#06172b]">
            ✓
          </span>
          Verified Expert
        </span>
      </div>
    </div>
  )
}

function MobilePlatformVisual({ outcome }: { outcome: PlatformOutcome }) {
  return (
    <div className="lg:hidden">
      <div className="relative mx-auto h-48 w-48 rounded-full border border-dashed border-[#d69a2f]/45 bg-[#173653]/44 sm:h-52 sm:w-52">
        <div className="absolute inset-3 overflow-hidden rounded-full border-2 border-[#d69a2f] bg-[#102b48]">
          <Image
            src={outcome.centralImage}
            alt="A SharingMinds verified expert"
            fill
            sizes="208px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(4,18,33,0.66))]" />
        </div>
        <span className="absolute bottom-3 left-1/2 z-10 flex min-w-[132px] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-[#d69a2f] bg-[#06172b]/95 px-3 py-1.5 text-[11px] font-semibold text-[#f6f0e6]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] text-[#06172b]">
            ✓
          </span>
          Verified Expert
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {outcome.scenarios.map((scenario) => {
          const Icon = scenario.icon

          return (
            <article
              key={scenario.title}
              className="flex min-h-[94px] overflow-hidden rounded-xl border border-[#9f7027]/80 bg-[#081b31]/92"
            >
              <div className="relative w-[38%] shrink-0 overflow-hidden border-r border-[#9f7027]/55">
                <Image
                  src={scenario.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 140px, 38vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative min-w-0 flex-1 px-3 py-3">
                <h4 className="pr-6 text-[13px] font-semibold leading-[1.2] text-[#f6f0e6]">
                  {scenario.title}
                </h4>
                <p className="mt-1.5 text-[11px] leading-[1.4] text-[#c8d0d9]">
                  {scenario.description}
                </p>
                <Icon
                  className="absolute bottom-2.5 right-2.5 h-4 w-4 text-[#e3a634]"
                  aria-hidden="true"
                />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function BenefitCard({ benefit }: { benefit: PlatformBenefit }) {
  const Icon = benefit.icon

  return (
    <article className="relative rounded-xl border border-[#9f7027]/75 bg-[#071a2f]/84 px-3 py-3 lg:min-h-0 lg:px-2.5 lg:py-2.5 xl:px-3">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d39a35] text-[#e7ad3d]",
            benefit.accent === "blue" && "border-[#1eb7bf] text-[#20bdc6]",
          )}
        >
          <Icon className="h-5 w-5 stroke-[1.7]" aria-hidden="true" />
        </span>
        <h4 className="text-[12px] font-semibold leading-[1.18] text-[#f6f0e6] lg:text-[11px] xl:text-[12px]">
          {benefit.title}
        </h4>
      </div>
      <p className="mt-2 text-[11px] leading-[1.38] text-[#cbd4dc] lg:text-[10px] xl:text-[11px]">
        {benefit.description}
      </p>
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-2 left-1/2 h-px w-10 -translate-x-1/2 bg-[#d39a35]",
          benefit.accent === "blue" && "bg-[#20bdc6]",
        )}
      />
    </article>
  )
}

export function StrategicPlatformPanel({ outcome }: StrategicPlatformPanelProps) {
  return (
    <div
      id="strategic-platform-panel"
      className="flex min-w-0 flex-col px-4 py-5 sm:px-6 sm:py-6 lg:h-full lg:px-[clamp(20px,2vw,32px)] lg:py-[clamp(16px,2vh,24px)]"
    >
      <header className="shrink-0">
        <h3 className="max-w-[920px] text-[clamp(29px,3vw,43px)] font-semibold leading-[0.98] tracking-[-0.035em] text-[#f7f1e8]">
          {outcome.title}
        </h3>
        <span aria-hidden="true" className="mt-3 block h-0.5 w-14 bg-[#d79b2f]" />
        <p className="mt-3 max-w-[620px] text-[12px] leading-[1.45] text-[#d8e0e7] xl:text-[13px]">
          {outcome.description}
        </p>
      </header>

      <div
        key={outcome.id}
        className="mt-4 flex min-h-0 flex-1 flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
      >
        <div className="relative min-h-[300px] flex-1 lg:min-h-0">
          {outcome.scenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.title}
              scenario={scenario}
              position={scenarioPositions[index]}
            />
          ))}
          <ExpertNetwork outcome={outcome} />
          <MobilePlatformVisual outcome={outcome} />
        </div>

        <section
          aria-labelledby={`platform-benefits-title-${outcome.id}`}
          className="shrink-0 rounded-2xl border border-[#a86f1f]/85 bg-[#06172b]/72 p-3 lg:h-[150px] lg:p-2.5 xl:h-[166px] xl:p-3"
        >
          <h4
            id={`platform-benefits-title-${outcome.id}`}
            className="text-[18px] font-semibold leading-none tracking-[-0.02em] text-[#e3a634] lg:text-[16px] xl:text-[18px]"
          >
            {outcome.benefitsTitle}
          </h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:h-[calc(100%-28px)] lg:grid-cols-4">
            {outcome.benefits.map((benefit) => (
              <BenefitCard key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
