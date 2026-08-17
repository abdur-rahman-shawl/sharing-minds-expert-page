import { ArrowRight, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"

import type { JourneySignal, JourneyStage } from "./journey-data"

type JourneyStagePanelProps = {
  stage: JourneyStage
  onNext: () => void
}

const journeyNodes = [
  { id: 1, position: "left-[7%]" },
  { id: 2, position: "left-[23%]" },
  { id: 5, position: "right-[23%]" },
  { id: 6, position: "right-[7%]" },
]

function SignalCard({ signal, position }: { signal: JourneySignal; position: string }) {
  return (
    <article
      className={cn(
        "absolute z-20 hidden w-[clamp(126px,20%,154px)] rounded-xl border border-[#38516d]/65 bg-[#0b2039]/88 px-3 py-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.16)] backdrop-blur-sm lg:block",
        position,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-[#18304c] bg-[#d3a347] shadow-[0_0_14px_rgba(211,163,71,0.7)]",
          position.includes("left-") ? "-right-1.5" : "-left-1.5",
        )}
      />
      <h4 className="text-[11px] font-semibold leading-[1.25] text-[#f5f1e8] xl:text-[12px]">
        {signal.title}
      </h4>
      <p className="mt-1 text-[10px] leading-[1.38] text-[#b9c5d2] xl:text-[11px]">
        {signal.description}
      </p>
    </article>
  )
}

function JourneyOrbit({ stage }: { stage: JourneyStage }) {
  const centerIsActive = stage.id === 3 || stage.id === 4

  return (
    <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
      <div className="absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(211,163,71,0.75)_20%,rgba(211,163,71,0.75)_80%,transparent)]" />

      <div className="absolute left-[23%] top-[28%] h-px w-[27%] origin-left rotate-[17deg] bg-[#8b6c36]/30" />
      <div className="absolute left-[23%] bottom-[28%] h-px w-[27%] origin-left -rotate-[17deg] bg-[#8b6c36]/30" />
      <div className="absolute right-[23%] top-[28%] h-px w-[27%] origin-right -rotate-[17deg] bg-[#8b6c36]/30" />
      <div className="absolute right-[23%] bottom-[28%] h-px w-[27%] origin-right rotate-[17deg] bg-[#8b6c36]/30" />

      {journeyNodes.map((node) => {
        const isActive = stage.id === node.id

        return (
          <div
            key={node.id}
            className={cn(
              "absolute top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#385677] bg-[#0a1e36] text-[10px] font-semibold text-[#e8eef4] transition-all duration-300 xl:h-11 xl:w-11",
              node.position,
              isActive &&
                "h-12 w-12 border-[#d3a347] bg-[#d3a347] text-[#071a31] shadow-[0_0_0_8px_rgba(211,163,71,0.10),0_12px_26px_rgba(0,0,0,0.28)] xl:h-14 xl:w-14",
            )}
          >
            {String(node.id).padStart(2, "0")}
          </div>
        )
      })}

      <div className="absolute left-1/2 top-1/2 z-10 h-[clamp(170px,18vw,224px)] w-[clamp(170px,18vw,224px)] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#b0843e]/45" />
        <div className="absolute inset-[9px] rounded-full bg-[#183354]/45" />
        <div className="absolute inset-[19px] rounded-full bg-[#213c5c]/42" />
        <div
          className={cn(
            "absolute inset-[29px] flex flex-col items-center justify-center rounded-full border border-[#b98c3f] bg-[radial-gradient(circle_at_50%_30%,#173657,#0b213b_72%)] px-5 text-center shadow-[inset_0_0_32px_rgba(5,18,35,0.55)] transition-shadow duration-300",
            centerIsActive &&
              "shadow-[0_0_0_9px_rgba(211,163,71,0.08),0_0_34px_rgba(211,163,71,0.16),inset_0_0_32px_rgba(5,18,35,0.55)]",
          )}
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e3b45f] xl:text-[10px]">
            {stage.centerLabel}
          </span>
          <span className="mt-2 text-[clamp(16px,1.45vw,21px)] font-semibold leading-[0.98] tracking-[-0.025em] text-[#f7f1e8]">
            {stage.centerTitle}
          </span>
        </div>
      </div>
    </div>
  )
}

function MobileStageVisual({ stage }: { stage: JourneyStage }) {
  return (
    <div className="lg:hidden">
      <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-dashed border-[#b0843e]/50 bg-[#173353]/38 sm:h-52 sm:w-52">
        <div className="absolute inset-3 rounded-full bg-[#203b5c]/45" />
        <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full border border-[#bd9147] bg-[radial-gradient(circle_at_50%_30%,#173657,#0b213b_72%)] px-4 text-center">
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#e3b45f]">
            {stage.centerLabel}
          </span>
          <span className="mt-2 text-[19px] font-semibold leading-none tracking-[-0.025em] text-[#f7f1e8]">
            {stage.centerTitle}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {stage.signals.map((signal) => (
          <article
            key={signal.title}
            className="rounded-xl border border-[#38516d]/65 bg-[#0b2039]/88 px-4 py-3.5"
          >
            <h4 className="text-[13px] font-semibold text-[#f5f1e8]">{signal.title}</h4>
            <p className="mt-1.5 text-[12px] leading-[1.45] text-[#b9c5d2]">
              {signal.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

function OutcomeGrid({ stage }: { stage: JourneyStage }) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:h-[76px] xl:h-[88px]">
      {stage.outcomes.map((outcome) => (
        <article
          key={`${outcome.label}-${outcome.value}`}
          className="rounded-xl border border-[#38516d]/65 bg-[#132943]/72 px-3 py-3 lg:px-2.5 lg:py-2.5 xl:px-3"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#e3b45f]">
            {outcome.label}
          </p>
          <p className="mt-1.5 text-[12px] font-semibold leading-tight text-[#f5f1e8] lg:text-[11px] xl:text-[12px]">
            {outcome.value}
          </p>
        </article>
      ))}
    </div>
  )
}

export function JourneyStagePanel({ stage, onNext }: JourneyStagePanelProps) {
  const isLastStage = stage.id === 6
  const progress = (stage.id / 6) * 100
  const NextIcon = isLastStage ? RotateCcw : ArrowRight

  return (
    <div
      id="journey-stage-panel"
      className="flex min-w-0 flex-col px-4 py-5 sm:px-6 sm:py-6 lg:h-full lg:px-[clamp(20px,2.2vw,34px)] lg:py-[clamp(16px,2.1vh,24px)]"
    >
      <header className="shrink-0">
        <div className="flex items-center gap-5">
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e3b45f] xl:text-[11px]">
            Stage {String(stage.id).padStart(2, "0")} of 06 · {stage.category}
          </p>
          <div
            className="relative ml-auto h-[3px] w-[min(32vw,180px)] overflow-hidden rounded-full bg-[#2c415c]"
            role="progressbar"
            aria-label="Expert journey progress"
            aria-valuemin={1}
            aria-valuemax={6}
            aria-valuenow={stage.id}
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-[#d3a347] transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h3 className="mt-2 max-w-[760px] text-[clamp(29px,3.2vw,43px)] font-semibold leading-[0.98] tracking-[-0.035em] text-[#f7f1e8]">
          {stage.title}
        </h3>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-[690px] text-[12px] leading-[1.45] text-[#d9e1e9] xl:text-[13px]">
            {stage.description}
          </p>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#a57c3a] bg-[#142a43]/80 px-4 text-[11px] font-semibold text-[#edbe68] transition-colors hover:border-[#d3a347] hover:bg-[#1a3554] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d28e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2039] sm:min-h-9"
            aria-label={isLastStage ? "Return to the first stage" : `Continue to stage ${stage.id + 1}`}
          >
            {isLastStage ? "Back to beginning" : "Next stage"}
            <NextIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        key={stage.id}
        className="mt-5 flex min-h-0 flex-1 flex-col gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 lg:mt-3"
      >
        <div className="relative min-h-[286px] flex-1 lg:min-h-0">
          <SignalCard signal={stage.signals[0]} position="left-[1%] top-[3%]" />
          <SignalCard signal={stage.signals[1]} position="right-[1%] top-[3%]" />
          <SignalCard signal={stage.signals[2]} position="bottom-[3%] left-[1%]" />
          <SignalCard signal={stage.signals[3]} position="bottom-[3%] right-[1%]" />
          <JourneyOrbit stage={stage} />
          <MobileStageVisual stage={stage} />
        </div>

        <OutcomeGrid stage={stage} />
      </div>
    </div>
  )
}
