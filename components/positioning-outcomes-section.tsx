import {
  Crown,
  Filter,
  ShieldCheck,
  Target,
} from "lucide-react"

const positioningOutcomes = [
  {
    title: "Stronger Authority Layer",
    description: "Positioned with clarity, credibility, and trust.",
    icon: Crown,
  },
  {
    title: "Higher-Quality Deal Flow",
    description: "Engage with relevant opportunities that create real impact.",
    icon: Filter,
  },
  {
    title: "Structured Visibility",
    description: "Be visible in the right decision cycles and contexts.",
    icon: Target,
  },
  {
    title: "Stronger Trust Signals",
    description: "Outcomes build credibility that speaks for your expertise.",
    icon: ShieldCheck,
  },
]

export function PositioningOutcomesSection() {
  return (
    <section
      id="positioning-outcomes"
      aria-labelledby="positioning-outcomes-title"
      className="relative scroll-mt-[104px] overflow-hidden bg-[#03172c] px-5 py-8 text-white sm:px-8 sm:py-9 lg:px-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_50%,rgba(14,85,171,0.12),transparent_50%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto grid w-full max-w-[1380px] gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:gap-0">
        <div className="pr-7">
          <div className="mb-5 flex items-end gap-3">
            <span className="font-serif text-[33px] leading-none text-[#e0aa5b]">06</span>
            <span className="pb-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#5e9bd8]">
              What You Actually Build Here
            </span>
          </div>

          <h2
            id="positioning-outcomes-title"
            className="font-serif text-[clamp(29px,2.1vw,34px)] font-normal leading-[1.06] tracking-[-0.025em] text-[#f4f1eb]"
          >
            More Than Visibility.
            <span className="block">Strategic Positioning.</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {positioningOutcomes.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="flex min-h-[130px] flex-col items-center justify-center px-5 text-center lg:border-l lg:border-[#667b91]/30"
            >
              <Icon className="mb-3 h-11 w-11 stroke-[1.25] text-[#e3aa57]" />
              <h3 className="text-[12px] font-semibold text-[#f3f5f7]">{title}</h3>
              <p className="mt-2 max-w-[180px] text-[10px] leading-[1.5] text-[#cbd4dd]">
                {description}
              </p>
            </article>
          ))}

          <article className="flex min-h-[130px] flex-col items-center justify-center px-5 text-center lg:border-l lg:border-[#667b91]/30">
            <span className="mb-1 font-serif text-[65px] font-light leading-[0.7] text-[#e3aa57]">
              ∞
            </span>
            <h3 className="mt-3 text-[12px] font-semibold text-[#f3f5f7]">
              Long-Term Relevance
            </h3>
            <p className="mt-2 max-w-[180px] text-[10px] leading-[1.5] text-[#cbd4dd]">
              Stay relevant as decisions, industries, and priorities evolve.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
