import Image from "next/image"
import {
  BadgeCent,
  Brain,
  Crown,
  Eye,
  FileText,
  Handshake,
  LockKeyhole,
  Radar,
  UserRoundCheck,
} from "lucide-react"

const leveragePoints = [
  { label: "Influence", icon: BadgeCent },
  { label: "Access", icon: LockKeyhole },
  { label: "Strategic Visibility", icon: Eye },
  { label: "Paid Opportunities", icon: Radar },
  { label: "Long-Term Leverage", icon: Handshake },
]

const stages = [
  {
    number: "01",
    title: "Extend Influence",
    description:
      "Move beyond referrals and closed circles into structured visibility with the right decision-makers.",
    image: "/professional-mentor-headshot-2.jpg",
    icon: UserRoundCheck,
  },
  {
    number: "02",
    title: "Stay Relevant",
    description:
      "Engage where decisions are active—careers, business, strategy, and education pathways.",
    image: "/professional-mentor-headshot-3.jpg",
    icon: Eye,
  },
  {
    number: "03",
    title: "Convert Experience",
    description:
      "Turn knowledge into repeatable, trusted, and commercially aligned opportunities.",
    image: "/professional-mentor-headshot-8.jpg",
    icon: Brain,
  },
  {
    number: "04",
    title: "Build Authority",
    description:
      "Each interaction strengthens your credibility, trust, and relevance in the ecosystem.",
    image: "/professional-mentor-headshot-9.jpg",
    icon: Crown,
  },
  {
    number: "05",
    title: "Access Better Rooms",
    description: "Not more conversations. Better ones that lead to stronger outcomes.",
    image: "/business-team-collaboration-with-charts-and-analyt.jpg",
    icon: FileText,
  },
]

export function LeverageLayerSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="leverage-layer-title"
      className="relative flex scroll-mt-[104px] items-center overflow-hidden bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:min-h-[clamp(660px,76vh,800px)] lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_45%,rgba(12,92,183,0.14),transparent_42%),linear-gradient(105deg,rgba(3,16,33,0.55),transparent_55%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-16">
          <div className="max-w-[650px]">
          <h2
            id="leverage-layer-title"
              className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
          >
            A Strategic
            <span className="block">Leverage Layer.</span>
          </h2>

          </div>

          <div>
            <p className="max-w-[620px] text-[16px] leading-[1.75] text-[#d5dce5] sm:text-[17px]">
            SharingMinds is a high-trust infrastructure where serious experts convert real-world
            judgment into:
          </p>

            <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
            {leveragePoints.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2.5 text-[15px] text-[#e5eaf0]">
                  <Icon className="h-5 w-5 shrink-0 stroke-[1.6] text-[#e3a954]" />
                {label}
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="relative mt-20">
          <div className="pointer-events-none absolute left-[5%] right-[5%] top-[104px] hidden h-[142px] xl:block">
            <span className="absolute left-0 top-0 h-full w-[28%] rotate-[5deg] rounded-[50%] border border-[#0c64d3]/50 shadow-[0_0_22px_rgba(23,106,223,0.2)]" />
            <span className="absolute left-[18%] top-0 h-full w-[28%] -rotate-[5deg] rounded-[50%] border border-[#0c64d3]/50 shadow-[0_0_22px_rgba(23,106,223,0.2)]" />
            <span className="absolute left-[36%] top-0 h-full w-[28%] rotate-[5deg] rounded-[50%] border border-[#0c64d3]/50 shadow-[0_0_22px_rgba(23,106,223,0.2)]" />
            <span className="absolute left-[54%] top-0 h-full w-[28%] -rotate-[5deg] rounded-[50%] border border-[#0c64d3]/50 shadow-[0_0_22px_rgba(23,106,223,0.2)]" />
            <span className="absolute right-0 top-0 h-full w-[28%] rotate-[5deg] rounded-[50%] border border-[#0c64d3]/50 shadow-[0_0_22px_rgba(23,106,223,0.2)]" />
          </div>

          <ol className="relative grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {stages.map(({ number, title, description, image, icon: Icon }, index) => (
              <li key={number} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6 aspect-square w-full max-w-[220px]">
                  <span className="absolute -inset-3 rounded-full border border-[#1359a9]/45" />
                  <span className="absolute inset-1 rounded-full border border-[#1269d8]/80 shadow-[0_0_22px_rgba(0,112,255,0.25),inset_0_0_18px_rgba(0,85,196,0.22)]" />
                  <span className="absolute inset-3 overflow-hidden rounded-full border border-[#428add]/35 bg-[#071d35]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="220px"
                      className={`object-cover ${index === stages.length - 1 ? "object-center" : ""}`}
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(2,16,31,0.34))]" />
                  </span>

                  <span className="absolute left-1/2 top-0 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#bf8d50] bg-[#061a30] shadow-[0_0_18px_rgba(4,18,35,0.85)]">
                    <Icon className="h-7 w-7 stroke-[1.5] text-[#e2ab5d]" />
                  </span>
                </div>

                <span className="font-serif text-[24px] leading-none text-[#e6b267]">{number}</span>
                <h3 className="mt-2 text-[18px] font-semibold text-[#f4f5f7]">{title}</h3>
                <p className="mt-3 max-w-[230px] text-[14px] leading-[1.65] text-[#c8d1dc]">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
