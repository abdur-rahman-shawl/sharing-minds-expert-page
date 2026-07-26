import Image from "next/image"
import Link from "next/link"
import { Check, X } from "lucide-react"

const seriousExpertGoals = [
  "Build strategic authority",
  "Stay relevant",
  "Engage in better decision environments",
  "Create structured leverage from what they already know",
]

const expertPortraits = [
  "/professional-mentor-headshot-8.jpg",
  "/professional-mentor-headshot-3.jpg",
  "/professional-mentor-headshot-5.jpg",
  "/professional-mentor-headshot-11.jpg",
  "/professional-mentor-headshot-7.jpg",
  "/professional-mentor-headshot-9.jpg",
  "/professional-mentor-headshot-12.jpg",
]

const excludedPortraits = [
  "/professional-mentor-headshot-2.jpg",
  "/professional-mentor-headshot-6.jpg",
  "/professional-mentor-headshot-10.jpg",
]

const lightNetworkPortraits = [
  {
    source: "/professional-mentor-headshot-8.jpg",
    className: "left-[8%] top-[19%] h-11 w-11",
  },
  {
    source: "/professional-mentor-headshot-3.jpg",
    className: "left-[28%] top-[2%] h-10 w-10",
  },
  {
    source: "/professional-mentor-headshot-11.jpg",
    className: "left-[49%] top-[1%] h-10 w-10",
  },
  {
    source: "/professional-mentor-headshot-5.jpg",
    className: "right-[5%] top-[26%] h-11 w-11",
  },
  {
    source: "/professional-mentor-headshot-7.jpg",
    className: "left-[8%] bottom-[16%] h-11 w-11",
  },
  {
    source: "/professional-mentor-headshot-9.jpg",
    className: "left-[39%] bottom-[2%] h-11 w-11",
  },
  {
    source: "/professional-mentor-headshot-12.jpg",
    className: "right-[7%] bottom-[10%] h-10 w-10",
  },
]

const lightNetworkLines = [
  { left: "17%", top: "33%", width: "28%", rotate: "-27deg" },
  { left: "17%", top: "39%", width: "34%", rotate: "16deg" },
  { left: "35%", top: "17%", width: "29%", rotate: "5deg" },
  { left: "51%", top: "18%", width: "35%", rotate: "28deg" },
  { left: "51%", top: "51%", width: "39%", rotate: "-18deg" },
  { left: "18%", top: "69%", width: "34%", rotate: "-4deg" },
  { left: "47%", top: "54%", width: "31%", rotate: "40deg" },
]

function ExpertFitCards() {
  return (
    <div className="grid gap-2.5">
      <div className="overflow-hidden rounded-[7px] border border-[#d6dde5] bg-white shadow-[0_7px_18px_rgba(13,33,71,0.06)]">
        <p className="px-3 pt-2 text-[9px] font-medium text-[#c28c3f]">
          This is for you if you:
        </p>
        <div className="flex h-[78px] items-end justify-center gap-1 px-2">
          {expertPortraits.map((source, index) => (
            <span
              key={source}
              className={`relative overflow-hidden rounded-t-full border-x border-t border-[#dce3ea] bg-[#edf2f6] ${
                index % 3 === 1 ? "h-[68px] w-[45px]" : "h-[60px] w-[42px]"
              }`}
            >
              <Image
                src={source}
                alt=""
                fill
                sizes="45px"
                className="object-cover object-top"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-h-[78px] grid-cols-[1fr_156px] overflow-hidden rounded-[7px] border border-[#d6dde5] bg-white shadow-[0_7px_18px_rgba(13,33,71,0.05)]">
        <div className="px-3 py-2">
          <p className="text-[9px] font-medium text-[#c28c3f]">
            This is not for you if you:
          </p>
          <ul className="mt-1 space-y-0.5">
            {["Casual mentors", "Low-intent advisors", "Generic visibility seekers"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 text-[8px] leading-[1.35] text-[#39495e]"
                >
                  <X className="h-2.5 w-2.5 stroke-[2] text-[#bd8a42]" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="flex items-end justify-end gap-1 pr-2">
          {excludedPortraits.map((source) => (
            <span
              key={source}
              className="relative h-[68px] w-[43px] overflow-hidden rounded-t-full border-x border-t border-[#d5dbe1] bg-[#edf0f3] grayscale"
            >
              <Image
                src={source}
                alt=""
                fill
                sizes="43px"
                className="object-cover object-top opacity-80"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function LightExpertNetwork() {
  return (
    <div
      className="relative mx-auto h-[190px] w-full max-w-[390px]"
      aria-label="A connected network of high-quality experts"
      role="img"
    >
      <span className="absolute left-1/2 top-1/2 h-32 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#277bd8]/8 blur-3xl" />

      {lightNetworkLines.map((line) => (
        <span
          key={`${line.left}-${line.top}`}
          className="absolute h-px origin-left bg-[linear-gradient(90deg,rgba(54,130,211,0.14),rgba(54,130,211,0.52),rgba(54,130,211,0.14))]"
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            transform: `rotate(${line.rotate})`,
          }}
        />
      ))}

      <span className="absolute left-1/2 top-1/2 z-10 h-[68px] w-[116px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/brand/sharingminds-infinity.png"
          alt=""
          fill
          sizes="116px"
          className="object-contain drop-shadow-[0_7px_12px_rgba(35,110,210,0.22)]"
        />
      </span>

      {lightNetworkPortraits.map(({ source, className }) => (
        <span
          key={source}
          className={`absolute z-20 overflow-hidden rounded-full border border-[#5c94cd] bg-white p-0.5 shadow-[0_3px_9px_rgba(18,60,108,0.14)] ${className}`}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image src={source} alt="" fill sizes="44px" className="object-cover" />
          </span>
        </span>
      ))}

      {["22% 22%", "69% 18%", "82% 58%", "30% 81%", "63% 78%"].map(
        (position) => {
          const [left, top] = position.split(" ")

          return (
            <span
              key={position}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#dfa650] shadow-[0_0_7px_rgba(223,166,80,0.7)]"
              style={{ left, top }}
            />
          )
        },
      )}
    </div>
  )
}

export function AudienceCtaSection() {
  return (
    <div className="overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 text-[#0d2147] sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1380px] lg:grid-cols-[1.12fr_0.88fr]">
        <section
          id="who-this-is-for"
          aria-labelledby="who-this-is-for-title"
          className="grid gap-8 py-8 sm:py-9 md:grid-cols-[225px_minmax(0,1fr)] md:items-center lg:pr-8"
        >
          <div>
            <div className="mb-4 flex items-end gap-3">
              <span className="font-serif text-[33px] leading-none text-[#d79d42]">10</span>
              <span className="pb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#2775d6]">
                Who This Is For
              </span>
            </div>

            <h2
              id="who-this-is-for-title"
              className="font-serif text-[clamp(29px,2.05vw,34px)] font-normal leading-[1.03] tracking-[-0.025em]"
            >
              Built for
              <span className="block">Serious Experts</span>
            </h2>

            <p className="mt-3 max-w-[220px] text-[9px] leading-[1.45] text-[#33445b]">
              This is for operators, specialists, and decision-makers who want to:
            </p>

            <ul className="mt-2 space-y-0.5">
              {seriousExpertGoals.map((goal) => (
                <li
                  key={goal}
                  className="flex items-start gap-1.5 text-[8.5px] leading-[1.42] text-[#253951]"
                >
                  <Check className="mt-0.5 h-3 w-3 shrink-0 stroke-[2.1] text-[#2775d6]" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <ExpertFitCards />
        </section>

        <section
          id="final-cta"
          aria-labelledby="final-cta-title"
          className="grid gap-8 border-t border-[#cfd8e2] py-8 sm:py-9 md:grid-cols-[225px_minmax(0,1fr)] md:items-center lg:border-l lg:border-t-0 lg:pl-8"
        >
          <div>
            <div className="mb-4 flex items-end gap-3">
              <span className="font-serif text-[33px] leading-none text-[#d79d42]">11</span>
              <span className="pb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#2775d6]">
                Final CTA
              </span>
            </div>

            <h2
              id="final-cta-title"
              className="font-serif text-[clamp(29px,2.05vw,34px)] font-normal leading-[1.03] tracking-[-0.025em]"
            >
              Apply as an
              <span className="block">Early Expert</span>
            </h2>

            <p className="mt-3 text-[9.5px] font-medium leading-[1.55] text-[#233851]">
              Build strategic authority.
              <span className="block">Expand your influence.</span>
              <span className="block">Enter better rooms.</span>
            </p>

            <Link
              href="/verified-experts"
              className="mt-4 inline-flex min-h-9 items-center justify-center rounded-[3px] bg-[#1673d8] px-4 text-[9px] font-semibold text-white shadow-[0_5px_14px_rgba(22,115,216,0.3)] transition-colors hover:bg-[#0e64c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-2"
            >
              Complete Your Expert Profile
            </Link>

            <p className="mt-2 text-[8px] leading-[1.4] text-[#4f5f71]">
              Limited onboarding for high-quality experts
            </p>
          </div>

          <LightExpertNetwork />
        </section>
      </div>
    </div>
  )
}
