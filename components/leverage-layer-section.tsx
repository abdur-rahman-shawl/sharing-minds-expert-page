"use client"

import { useCallback, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

import { platformOutcomes } from "@/components/strategic-platform/strategic-platform-data"
import { StrategicPlatformPanel } from "@/components/strategic-platform/strategic-platform-panel"
import { cn } from "@/lib/utils"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

const LAST_OUTCOME_INDEX = platformOutcomes.length - 1

function ApplicationCallout({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#a86f1f]/85 bg-[#07192e]/94 shadow-[0_14px_32px_rgba(0,0,0,0.22)]",
        compact ? "p-4 sm:p-5" : "p-3 xl:p-4",
      )}
    >
      <p className="text-[15px] font-semibold leading-tight text-[#e8ac39] lg:text-[13px] xl:text-[15px]">
        Apply where your expertise creates value.
      </p>
      <p className="mt-2 text-[11px] leading-[1.42] text-[#ccd5de] lg:text-[10px] xl:text-[11px]">
        Applications are individually reviewed for experience, credibility, contribution and
        practical judgment.
      </p>
      <Link
        href={EXPERT_APPLICATION_PATH}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#efb643] bg-[linear-gradient(180deg,#e8aa37,#bf7612)] px-4 text-center text-[12px] font-semibold text-[#06172b] shadow-[0_8px_22px_rgba(213,145,31,0.24)] transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_10px_28px_rgba(213,145,31,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d593] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06172b]"
      >
        Start My Expert Application
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

export function LeverageLayerSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeOutcome = platformOutcomes[activeIndex]

  const selectOutcome = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const handleOutcomeKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      let nextIndex: number | null = null

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = activeIndex === LAST_OUTCOME_INDEX ? 0 : activeIndex + 1
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = activeIndex === 0 ? LAST_OUTCOME_INDEX : activeIndex - 1
      }

      if (event.key === "Home") nextIndex = 0
      if (event.key === "End") nextIndex = LAST_OUTCOME_INDEX

      if (nextIndex === null) return

      event.preventDefault()
      setActiveIndex(nextIndex)

      window.requestAnimationFrame(() => {
        document.getElementById(`platform-outcome-tab-${nextIndex + 1}`)?.focus()
      })
    },
    [activeIndex],
  )

  return (
    <section
      id="strategic-platform"
      aria-labelledby="leverage-layer-title"
      className="relative scroll-mt-[104px] overflow-hidden bg-[#03172c] px-3 py-10 text-white sm:px-5 sm:py-14 lg:flex lg:min-h-[calc(100svh-104px)] lg:items-center lg:px-6 lg:py-3 xl:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(12,92,183,0.16),transparent_42%),linear-gradient(105deg,rgba(3,16,33,0.60),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] overflow-hidden rounded-[24px] border border-[#a86f1f]/65 bg-[#06172b] shadow-[0_24px_72px_rgba(0,0,0,0.32)] lg:h-[clamp(560px,calc(100svh-132px),710px)]">
        <p className="sr-only" role="status" aria-live="polite">
          Platform outcome {activeOutcome.id} of {platformOutcomes.length} selected:{" "}
          {activeOutcome.title}
        </p>

        <div className="grid lg:h-full lg:grid-cols-[minmax(270px,30%)_minmax(0,70%)]">
          <aside className="border-b border-[#324a62]/75 bg-[#041426]/96 px-4 py-5 sm:px-6 sm:py-6 lg:flex lg:min-h-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-[clamp(16px,1.7vw,26px)] lg:py-[clamp(16px,2vh,24px)]">
            <header className="shrink-0">
              <h2
                id="leverage-layer-title"
                className="text-[clamp(30px,3vw,42px)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#f5efe5]"
              >
                A Strategic Platform
                <span className="block">for Your Expertise</span>
              </h2>
              <span aria-hidden="true" className="mt-4 block h-0.5 w-12 bg-[#d99c31]" />
              <p className="mt-4 max-w-[440px] text-[12px] leading-[1.5] text-[#d3dbe3] lg:max-w-[300px] lg:text-[10px] xl:text-[12px]">
                A structured platform for experienced professionals to bring their judgment into
                relevant decision contexts and meaningful expert engagements.
              </p>
            </header>

            <nav className="mt-5 lg:min-h-0 lg:flex-1" aria-label="Strategic platform outcomes">
              <ol className="grid grid-cols-5 gap-2 lg:flex lg:h-full lg:flex-col lg:justify-between lg:gap-1.5">
                {platformOutcomes.map((outcome, index) => {
                  const Icon = outcome.icon
                  const isActive = activeIndex === index

                  return (
                    <li key={outcome.id} className="min-w-0 lg:min-h-0 lg:flex-1">
                      <button
                        id={`platform-outcome-tab-${outcome.id}`}
                        type="button"
                        onClick={() => selectOutcome(index)}
                        onKeyDown={handleOutcomeKeyDown}
                        className={cn(
                          "group flex min-h-11 w-full items-center justify-center rounded-xl border border-[#40536a]/80 bg-[#08182b]/86 px-2 text-left transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#80643b] hover:bg-[#102238] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3d38f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#041426] lg:h-full lg:min-h-0 lg:justify-start lg:gap-3 lg:px-3",
                          isActive &&
                            "border-[#d7982d] bg-[#112238] shadow-[0_0_20px_rgba(215,152,45,0.18),inset_3px_0_0_#d7982d]",
                        )}
                        aria-current={isActive ? "step" : undefined}
                        aria-controls="strategic-platform-panel"
                        tabIndex={isActive ? 0 : -1}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#52677d] text-[#e8edf2] transition-colors",
                            isActive && "border-[#e4a52f] text-[#eeb13a]",
                          )}
                        >
                          <Icon className="h-[18px] w-[18px] stroke-[1.6]" aria-hidden="true" />
                        </span>
                        <span className="hidden min-w-0 flex-1 text-[11px] font-semibold leading-[1.17] text-[#f3f0eb] lg:block xl:text-[12px]">
                          {outcome.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "hidden h-4 w-4 shrink-0 text-[#e9edf1] lg:block",
                            isActive && "text-[#e5a330]",
                          )}
                          aria-hidden="true"
                        />
                        <span className="sr-only lg:hidden">{outcome.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </nav>

            <div className="mt-4 hidden shrink-0 lg:block">
              <ApplicationCallout />
            </div>
          </aside>

          <StrategicPlatformPanel outcome={activeOutcome} />

          <div className="border-t border-[#324a62]/75 p-4 sm:p-6 lg:hidden">
            <ApplicationCallout compact />
          </div>
        </div>
      </div>
    </section>
  )
}
