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
      className="flex scroll-mt-[104px] items-center overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:min-h-[clamp(540px,64vh,660px)] lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="max-w-[820px]">
          <h2
            id="value-stack-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em]"
          >
            What Compounds
            <span className="block">When You Join</span>
          </h2>
        </div>

        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-5">
          {valueStack.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              <div className="relative mb-5 flex h-[118px] w-[118px] items-center justify-center rounded-full border border-dashed border-[#5e96d2]/65 bg-white shadow-[0_0_24px_rgba(42,116,217,0.11)]">
                <span className="absolute inset-3 rounded-full border border-[#2f77d2]/15" />
                <Icon className="relative h-12 w-12 stroke-[1.35] text-[#176ed1]" />
              </div>

              <h3 className="text-[18px] font-bold text-[#14294e]">{title}</h3>
              <p className="mt-3 max-w-[220px] text-[14px] leading-[1.6] text-[#263b59]">
                {description}
              </p>

              {index < valueStack.length - 1 && (
                <ArrowRight
                  className="absolute -right-7 top-[46px] hidden h-8 w-8 stroke-[1.5] text-[#d79d42] xl:block"
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
