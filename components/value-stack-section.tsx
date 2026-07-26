import {
  ArrowRight,
  BadgeCent,
  Hourglass,
  LockKeyhole,
  Network,
  UserRound,
} from "lucide-react"

const valueStack = [
  {
    title: "Authority",
    description: "Your expertise is positioned with clarity and trust.",
    icon: UserRound,
  },
  {
    title: "Influence",
    description: "You engage where real decisions are being made.",
    icon: BadgeCent,
  },
  {
    title: "Access",
    description: "You enter better conversations and higher-quality rooms.",
    icon: LockKeyhole,
  },
  {
    title: "Opportunity",
    description: "Relevant demand turns into strategic and commercial upside.",
    icon: Network,
  },
  {
    title: "Leverage",
    description: "Your expertise scales beyond fragmented 1:1 interactions.",
    icon: Hourglass,
  },
]

export function ValueStackSection() {
  return (
    <section
      id="resources"
      aria-labelledby="value-stack-title"
      className="scroll-mt-[104px] overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-7 text-[#0d2147] sm:px-8 sm:py-8 lg:px-12"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:gap-7">
        <div className="max-w-[280px]">
          <div className="mb-5 flex items-end gap-3">
            <span className="font-serif text-[33px] leading-none text-[#d79d42]">07</span>
            <span className="pb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#2775d6]">
              The Value Stack
            </span>
          </div>

          <h2
            id="value-stack-title"
            className="font-serif text-[clamp(30px,2.15vw,35px)] font-normal leading-[1.06] tracking-[-0.025em]"
          >
            What Compounds
            <span className="block">When You Join</span>
          </h2>
        </div>

        <ol className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {valueStack.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              <div className="relative mb-3 flex h-[78px] w-[78px] items-center justify-center rounded-full border border-dashed border-[#5e96d2]/65 bg-white shadow-[0_0_18px_rgba(42,116,217,0.08)]">
                <span className="absolute inset-2 rounded-full border border-[#2f77d2]/15" />
                <Icon className="relative h-9 w-9 stroke-[1.35] text-[#176ed1]" />
              </div>

              <h3 className="text-[12px] font-bold text-[#14294e]">{title}</h3>
              <p className="mt-1.5 max-w-[160px] text-[9px] leading-[1.45] text-[#263b59]">
                {description}
              </p>

              {index < valueStack.length - 1 && (
                <ArrowRight
                  className="absolute -right-5 top-[28px] hidden h-6 w-6 stroke-[1.5] text-[#d79d42] lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
