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
    className: "left-[8%] top-[18%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-3.jpg",
    className: "left-[28%] top-[2%] h-14 w-14",
  },
  {
    source: "/professional-mentor-headshot-11.jpg",
    className: "left-[49%] top-[1%] h-14 w-14",
  },
  {
    source: "/professional-mentor-headshot-5.jpg",
    className: "right-[5%] top-[25%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-7.jpg",
    className: "left-[8%] bottom-[15%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-9.jpg",
    className: "left-[39%] bottom-[2%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-12.jpg",
    className: "right-[7%] bottom-[9%] h-14 w-14",
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
    <div className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-[#d6dde5] bg-white shadow-[0_16px_38px_rgba(13,33,71,0.08)]">
        <p className="px-6 pt-5 text-[15px] font-semibold text-[#b77e2f]">
          This is for you if you:
        </p>
        <div className="flex h-[180px] items-end justify-center gap-2 px-4 sm:h-[205px]">
          {expertPortraits.map((source, index) => (
            <span
              key={source}
              className={`relative overflow-hidden rounded-t-full border-x border-t border-[#dce3ea] bg-[#edf2f6] ${
                index % 3 === 1
                  ? "h-[165px] w-[86px]"
                  : "h-[145px] w-[78px]"
              }`}
            >
              <Image
                src={source}
                alt=""
                fill
                sizes="86px"
                className="object-cover object-top"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-h-[190px] overflow-hidden rounded-xl border border-[#d6dde5] bg-white shadow-[0_16px_38px_rgba(13,33,71,0.07)] sm:grid-cols-[1fr_260px]">
        <div className="px-6 py-5">
          <p className="text-[15px] font-semibold text-[#b77e2f]">
            This is not for you if you:
          </p>
          <ul className="mt-4 space-y-3">
            {["Casual mentors", "Low-intent advisors", "Generic visibility seekers"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[14px] leading-[1.45] text-[#39495e]"
                >
                  <X className="h-4 w-4 stroke-[2] text-[#bd8a42]" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="flex min-h-[160px] items-end justify-center gap-2 px-4 sm:justify-end sm:pr-5">
          {excludedPortraits.map((source) => (
            <span
              key={source}
              className="relative h-[155px] w-[78px] overflow-hidden rounded-t-full border-x border-t border-[#d5dbe1] bg-[#edf0f3] grayscale"
            >
              <Image
                src={source}
                alt=""
                fill
                sizes="78px"
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
      className="relative mx-auto h-[340px] w-full max-w-[620px] sm:h-[390px]"
      aria-label="A connected network of high-quality experts"
      role="img"
    >
      <span className="absolute left-1/2 top-1/2 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#277bd8]/10 blur-3xl" />

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

      <span className="absolute left-1/2 top-1/2 z-10 h-[116px] w-[200px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/brand/sharingminds-infinity.png"
          alt=""
          fill
          sizes="200px"
          className="object-contain drop-shadow-[0_7px_12px_rgba(35,110,210,0.22)]"
        />
      </span>

      {lightNetworkPortraits.map(({ source, className }) => (
        <span
          key={source}
          className={`absolute z-20 overflow-hidden rounded-full border border-[#5c94cd] bg-white p-0.5 shadow-[0_3px_9px_rgba(18,60,108,0.14)] ${className}`}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image src={source} alt="" fill sizes="64px" className="object-cover" />
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
    <div className="overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] text-[#0d2147]">
        <section
          id="who-this-is-for"
          aria-labelledby="who-this-is-for-title"
          className="px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[clamp(640px,74vh,760px)] lg:px-12 lg:py-24"
        >
          <div className="mx-auto grid w-full max-w-[1380px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
          <div className="max-w-[560px]">
            <h2
              id="who-this-is-for-title"
              className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em]"
            >
              Built for
              <span className="block">Serious Experts</span>
            </h2>

            <p className="mt-7 max-w-[520px] text-[16px] leading-[1.7] text-[#33445b]">
              This is for operators, specialists, and decision-makers who want to:
            </p>

            <ul className="mt-5 space-y-3">
              {seriousExpertGoals.map((goal) => (
                <li
                  key={goal}
                  className="flex items-start gap-3 text-[15px] leading-[1.55] text-[#253951]"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 stroke-[2.1] text-[#2775d6]" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <ExpertFitCards />
          </div>
        </section>

        <section
          id="final-cta"
          aria-labelledby="final-cta-title"
          className="relative overflow-hidden border-t border-[#cfd8e2] bg-[radial-gradient(circle_at_72%_50%,rgba(39,117,214,0.12),transparent_38%)] px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[clamp(600px,70vh,720px)] lg:px-12 lg:py-24"
        >
          <div className="mx-auto grid w-full max-w-[1380px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
          <div className="max-w-[600px]">
            <h2
              id="final-cta-title"
              className="font-serif text-[clamp(44px,4.2vw,62px)] font-normal leading-[1.02] tracking-[-0.03em]"
            >
              Apply as an
              <span className="block">Early Expert</span>
            </h2>

            <p className="mt-7 text-[17px] font-medium leading-[1.7] text-[#233851] sm:text-[18px]">
              Build strategic authority.
              <span className="block">Expand your influence.</span>
              <span className="block">Enter better rooms.</span>
            </p>

            <Link
              href="/verified-experts"
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-[5px] bg-[#1673d8] px-7 text-[15px] font-semibold text-white shadow-[0_8px_22px_rgba(22,115,216,0.3)] transition-colors hover:bg-[#0e64c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-2"
            >
              Complete Your Expert Profile
            </Link>

            <p className="mt-4 text-[14px] leading-[1.5] text-[#4f5f71]">
              Limited onboarding for high-quality experts
            </p>
          </div>

          <LightExpertNetwork />
          </div>
        </section>
    </div>
  )
}
