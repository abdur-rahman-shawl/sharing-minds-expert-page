import { foundingBenefits } from "./founding-expert-data"

export function FoundingBenefits() {
  return (
    <section
      aria-label="Founding expert benefits"
      className="grid overflow-hidden rounded-[18px] border border-[#d6a24a]/70 bg-white/68 shadow-[0_12px_28px_rgba(113,72,14,0.09)] backdrop-blur-sm sm:grid-cols-2 lg:h-[clamp(72px,10vh,92px)] lg:grid-cols-4 2xl:h-[clamp(72px,10vh,104px)]"
    >
      {foundingBenefits.map(({ title, description, icon: Icon }, index) => (
        <article
          key={title}
          className="flex items-center gap-3 border-[#d9bc83]/65 p-3 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:border-r lg:last:border-r-0 lg:p-[clamp(9px,1vw,14px)]"
        >
          <Icon
            className="h-8 w-8 shrink-0 text-[#c58519] lg:h-[clamp(24px,2vw,32px)] lg:w-[clamp(24px,2vw,32px)]"
            strokeWidth={1.55}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold leading-tight text-[#102747] lg:text-[10px] xl:text-[11px]">
              {title}
            </h3>
            <p className="mt-1 text-[9px] leading-tight text-[#506073] lg:text-[8px] xl:text-[9px]">
              {description}
            </p>
          </div>
          {index < foundingBenefits.length - 1 && (
            <span className="sr-only">Followed by</span>
          )}
        </article>
      ))}
    </section>
  )
}
