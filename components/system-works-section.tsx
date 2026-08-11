"use client"

import { useCallback, useState, type KeyboardEvent } from "react"
import { ChevronRight } from "lucide-react"

import { JourneyStagePanel } from "@/components/how-it-works/journey-stage-panel"
import { journeyStages } from "@/components/how-it-works/journey-data"
import { cn } from "@/lib/utils"

const LAST_STAGE_INDEX = journeyStages.length - 1

export function SystemWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStage = journeyStages[activeIndex]

  const selectStage = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const showNextStage = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === LAST_STAGE_INDEX ? 0 : currentIndex + 1,
    )
  }, [])

  const handleStageKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | null = null

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = activeIndex === LAST_STAGE_INDEX ? 0 : activeIndex + 1
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = activeIndex === 0 ? LAST_STAGE_INDEX : activeIndex - 1
    }

    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = LAST_STAGE_INDEX

    if (nextIndex === null) return

    event.preventDefault()
    setActiveIndex(nextIndex)

    window.requestAnimationFrame(() => {
      document.getElementById(`journey-stage-tab-${nextIndex + 1}`)?.focus()
    })
  }, [activeIndex])

  return (
    <section
      id="how-it-works"
      aria-labelledby="system-works-title"
      className="relative scroll-mt-[104px] overflow-hidden border-t border-[#24415e]/55 bg-[#03172c] px-3 py-10 text-white sm:px-5 sm:py-14 lg:flex lg:min-h-[calc(100svh-104px)] lg:items-center lg:px-6 lg:py-3 xl:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(16,91,181,0.18),transparent_46%),linear-gradient(105deg,rgba(2,14,29,0.42),transparent_64%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] overflow-hidden rounded-[24px] border border-[#29435f]/70 bg-[#071a31] shadow-[0_24px_70px_rgba(0,0,0,0.30)] lg:h-[clamp(560px,calc(100svh-132px),680px)]">
        <p className="sr-only" role="status" aria-live="polite">
          Stage {activeStage.id} of {journeyStages.length} selected: {activeStage.title}
        </p>
        <div className="grid lg:h-full lg:grid-cols-[minmax(250px,35.7%)_minmax(0,64.3%)]">
          <aside className="border-b border-[#29435f]/70 bg-[#06172c]/96 px-4 py-5 sm:px-6 sm:py-6 lg:flex lg:min-h-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-[clamp(16px,1.6vw,24px)] lg:py-[clamp(16px,2.2vh,26px)]">
            <header className="shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e3b45f] xl:text-[11px]">
                A Structured Expert Journey
              </p>
              <h2
                id="system-works-title"
                className="mt-2 text-[clamp(31px,3vw,42px)] font-semibold leading-none tracking-[-0.04em] text-[#f7f1e8]"
              >
                How It Works
              </h2>
              <p className="mt-3 max-w-[410px] text-[12px] leading-[1.48] text-[#d5dee7] lg:max-w-[260px] lg:text-[11px] xl:text-[12px]">
                A six-stage process designed to understand, verify and activate expertise before it
                enters the SharingMinds ecosystem.
              </p>
            </header>

            <nav
              className="mt-5 lg:min-h-0 lg:flex-1"
              aria-label="Expert journey stages"
            >
              <ol className="grid grid-cols-6 gap-2 sm:grid-cols-3 lg:flex lg:h-full lg:flex-col lg:justify-between lg:gap-1.5">
                {journeyStages.map((stage, index) => {
                  const isActive = activeIndex === index

                  return (
                    <li key={stage.id} className="min-w-0 lg:flex-1">
                      <button
                        id={`journey-stage-tab-${stage.id}`}
                        type="button"
                        onClick={() => selectStage(index)}
                        onKeyDown={handleStageKeyDown}
                        className={cn(
                          "group relative flex min-h-11 w-full items-center justify-center rounded-xl border border-[#344b64]/80 bg-[#0a1d34]/85 px-1.5 text-left transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#7a653f] hover:bg-[#10243c] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d28c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06172c] sm:justify-start sm:gap-3 sm:px-3 lg:h-full lg:min-h-0 lg:rounded-xl lg:px-2.5 xl:px-3",
                          isActive &&
                            "border-[#d3a347] bg-[#12243a] shadow-[inset_4px_0_0_#d3a347]",
                        )}
                        aria-current={isActive ? "step" : undefined}
                        aria-controls="journey-stage-panel"
                        tabIndex={isActive ? 0 : -1}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#425d79] bg-[#0b2139] text-[11px] font-semibold text-[#efbe68] transition-colors",
                            isActive && "border-[#d3a347] bg-[#d3a347] text-[#071a31]",
                          )}
                        >
                          {String(stage.id).padStart(2, "0")}
                        </span>
                        <span className="hidden min-w-0 flex-1 text-[12px] font-semibold leading-[1.18] text-[#f2f3f4] sm:block lg:text-[11px] xl:text-[12px]">
                          {stage.title}
                        </span>
                        <ChevronRight
                          className="hidden h-4 w-4 shrink-0 text-[#e3b45f] sm:block"
                          aria-hidden="true"
                        />
                        <span className="sr-only sm:hidden">{stage.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </aside>

          <JourneyStagePanel stage={activeStage} onNext={showNextStage} />
        </div>
      </div>
    </section>
  )
}
