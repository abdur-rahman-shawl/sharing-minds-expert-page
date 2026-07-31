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
      className="relative flex scroll-mt-[104px] items-center overflow-hidden border-t border-[#24415e]/55 bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:min-h-[clamp(540px,64vh,660px)] lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_50%,rgba(14,85,171,0.12),transparent_50%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <div className="max-w-[840px]">
          <h2
            id="positioning-outcomes-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
          >
            More Than Visibility.
            <span className="block">Strategic Positioning.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {positioningOutcomes.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-[#52708e]/30 bg-[#071c33]/70 px-6 py-8 text-center shadow-[0_16px_38px_rgba(0,0,0,0.12)]"
            >
              <Icon className="mb-5 h-16 w-16 stroke-[1.2] text-[#e3aa57]" />
              <h3 className="text-[17px] font-semibold leading-[1.3] text-[#f3f5f7]">{title}</h3>
              <p className="mt-3 max-w-[220px] text-[14px] leading-[1.6] text-[#cbd4dd]">
                {description}
              </p>
            </article>
          ))}

          <article className="flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-[#52708e]/30 bg-[#071c33]/70 px-6 py-8 text-center shadow-[0_16px_38px_rgba(0,0,0,0.12)]">
            <span className="mb-2 font-serif text-[82px] font-light leading-[0.7] text-[#e3aa57]">
              ∞
            </span>
            <h3 className="mt-4 text-[17px] font-semibold leading-[1.3] text-[#f3f5f7]">
              Long-Term Relevance
            </h3>
            <p className="mt-3 max-w-[220px] text-[14px] leading-[1.6] text-[#cbd4dd]">
              Stay relevant as decisions, industries, and priorities evolve.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
