import Image from "next/image"
import { Check, Circle } from "lucide-react"
import type { CSSProperties } from "react"

const scatteredExpertise = [
  "Professional relationships",
  "Personal introductions",
  "Informal guidance",
  "Individual conversations",
]

const structuredExpertise = [
  "Verified professional recognition",
  "Greater discoverability",
  "Relevant professional connections",
  "Meaningful expert engagements",
  "A growing presence within the SharingMinds ecosystem",
]

const portraits = [
  "/professional-mentor-headshot-1.jpg",
  "/professional-mentor-headshot-2.jpg",
  "/professional-mentor-headshot-3.jpg",
  "/professional-mentor-headshot-8.jpg",
  "/professional-mentor-headshot-9.jpg",
]

const scatteredNodes = [
  { left: "7%", top: "15%", size: 31, portrait: 0 },
  { left: "35%", top: "4%", size: 37, portrait: 1 },
  { left: "73%", top: "15%", size: 33, portrait: 2 },
  { left: "18%", top: "42%", size: 35, portrait: 3 },
  { left: "48%", top: "34%", size: 29, portrait: 4 },
  { left: "81%", top: "45%", size: 34, portrait: 0 },
  { left: "34%", top: "69%", size: 34, portrait: 2 },
  { left: "64%", top: "67%", size: 38, portrait: 1 },
  { left: "86%", top: "75%", size: 29, portrait: 3 },
]

const orbitNodes = [
  { left: "43%", top: "-2%", size: 42, portrait: 3 },
  { left: "78%", top: "15%", size: 37, portrait: 2 },
  { left: "85%", top: "54%", size: 38, portrait: 1 },
  { left: "61%", top: "79%", size: 43, portrait: 0 },
  { left: "22%", top: "76%", size: 38, portrait: 4 },
  { left: "3%", top: "45%", size: 38, portrait: 2 },
  { left: "13%", top: "15%", size: 40, portrait: 1 },
]

const scatteredLines = [
  { left: "13%", top: "29%", width: "32%", rotate: "17deg" },
  { left: "39%", top: "22%", width: "38%", rotate: "8deg" },
  { left: "21%", top: "55%", width: "30%", rotate: "-24deg" },
  { left: "48%", top: "49%", width: "38%", rotate: "19deg" },
  { left: "35%", top: "74%", width: "34%", rotate: "-5deg" },
  { left: "10%", top: "37%", width: "74%", rotate: "27deg" },
  { left: "19%", top: "70%", width: "61%", rotate: "-35deg" },
]

interface NetworkAvatarProps {
  source: string
  size: number
  style: CSSProperties
}

function NetworkAvatar({ source, size, style }: NetworkAvatarProps) {
  return (
    <span
      className="absolute z-10 overflow-hidden rounded-full border border-[#6d96c7] bg-white shadow-[0_3px_10px_rgba(21,55,94,0.18)]"
      style={{ ...style, width: size, height: size }}
    >
      <Image src={source} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  )
}

function ExpertiseTransformation() {
  return (
    <div
      className="relative mx-auto h-[340px] w-full max-w-[720px] sm:h-[390px]"
      aria-label="Scattered expertise becoming structured opportunity"
    >
      <div className="absolute left-0 top-1/2 h-[270px] w-[43%] -translate-y-1/2 sm:h-[310px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(22,105,213,0.16)_1px,transparent_1.7px)] bg-[size:18px_18px] opacity-80" />

        {scatteredLines.map((line, index) => (
          <span
            key={index}
            className="absolute h-px origin-left bg-[#6fa8e5]/35"
            style={{
              left: line.left,
              top: line.top,
              width: line.width,
              transform: `rotate(${line.rotate})`,
            }}
          />
        ))}

        {scatteredNodes.map((node, index) => (
          <NetworkAvatar
            key={index}
            source={portraits[node.portrait]}
            size={Math.round(node.size * 1.35)}
            style={{ left: node.left, top: node.top }}
          />
        ))}

        <span className="absolute left-[56%] top-[53%] h-2 w-2 rounded-full border-2 border-[#2f76d5] bg-white" />
        <span className="absolute left-[92%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#e3a643]" />
      </div>

      <div
        className="absolute left-[43%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 font-serif text-[58px] font-light text-[#dca445]"
        aria-hidden="true"
      >
        →
      </div>

      <div className="absolute right-0 top-1/2 h-[320px] w-[52%] -translate-y-1/2 sm:h-[360px]">
        <span className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2c71d0]/65 sm:h-[286px] sm:w-[286px]" />
        <span className="absolute left-1/2 top-1/2 h-[166px] w-[166px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2c71d0]/50 sm:h-[216px] sm:w-[216px]" />
        <span className="absolute left-1/2 top-1/2 h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9a24a]/65 sm:h-[148px] sm:w-[148px]" />
        <span className="absolute left-1/2 top-1/2 h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2878dd]/25 bg-white shadow-[0_0_32px_rgba(42,116,217,0.18)] sm:h-[82px] sm:w-[82px]" />

        <span className="absolute left-1/2 top-[6%] h-[88%] w-px -translate-x-1/2 bg-[#2c71d0]/25" />
        <span className="absolute left-[6%] top-1/2 h-px w-[88%] -translate-y-1/2 bg-[#2c71d0]/25" />

        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-serif text-[76px] leading-none text-[#1875e7] drop-shadow-[0_0_10px_rgba(38,126,231,0.32)]">
          ∞
        </span>

        {orbitNodes.map((node, index) => (
          <NetworkAvatar
            key={index}
            source={portraits[node.portrait]}
            size={Math.round(node.size * 1.4)}
            style={{ left: node.left, top: node.top }}
          />
        ))}
      </div>
    </div>
  )
}

export function PositioningSection() {
  return (
    <section
      id="take-your-expertise-further"
      aria-labelledby="positioning-title"
      className="flex scroll-mt-[104px] items-center overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:min-h-[clamp(620px,72vh,760px)] lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center xl:gap-20">
        <div className="max-w-[540px]">
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2674d3]">
            Built for Experienced Professionals
          </p>
          <h2
            id="positioning-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em]"
          >
            Take Your Expertise
            <span className="block">Further</span>
          </h2>

          <div className="mt-8 max-w-[500px] text-[16px] leading-[1.75] text-[#263d5d] sm:text-[17px]">
            <p>Your experience has already created value.</p>
            <p className="mt-3">
              SharingMinds gives it a structured professional identity—helping the right people
              recognise your expertise, understand where it is relevant and connect with you for
              meaningful engagements.
            </p>
          </div>
        </div>

        <div className="grid gap-10">
          <ExpertiseTransformation />

          <div className="grid gap-5 text-[#172947] sm:grid-cols-2">
            <div className="rounded-xl border border-[#d6dee7] bg-white p-6 shadow-[0_12px_35px_rgba(21,55,94,0.07)]">
              <h3 className="mb-5 text-[18px] font-semibold">Experience often grows through:</h3>
              <ul className="space-y-3">
                {scatteredExpertise.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] leading-[1.5]">
                    <Circle className="h-4 w-4 shrink-0 fill-[#d99c35]/15 stroke-[1.7] text-[#d99c35]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#bfcfe1] bg-[#f5f9ff] p-6 shadow-[0_12px_35px_rgba(21,55,94,0.07)]">
              <h3 className="mb-5 text-[18px] font-semibold">SharingMinds helps extend it through:</h3>
              <ul className="space-y-3">
                {structuredExpertise.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 stroke-[2] text-[#1d70d7]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center font-serif text-[clamp(24px,2.4vw,34px)] leading-[1.2] text-[#b77e2f]">
            Your Experience Has Influence. Give It Greater Reach.
          </p>
        </div>
      </div>
    </section>
  )
}
