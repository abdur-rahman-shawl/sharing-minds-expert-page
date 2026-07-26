import Image from "next/image"
import { Check, X } from "lucide-react"
import type { CSSProperties } from "react"

const scatteredExpertise = [
  "fragmented conversations",
  "scattered introductions",
  "unpaid advice",
  "low-leverage visibility",
]

const structuredExpertise = [
  "structured authority",
  "high-intent access",
  "better positioning",
  "compounding opportunity",
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
      className="relative mx-auto h-[270px] w-full max-w-[560px]"
      aria-label="Scattered expertise becoming structured opportunity"
    >
      <div className="absolute left-0 top-1/2 h-[210px] w-[43%] -translate-y-1/2">
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
            size={node.size}
            style={{ left: node.left, top: node.top }}
          />
        ))}

        <span className="absolute left-[56%] top-[53%] h-2 w-2 rounded-full border-2 border-[#2f76d5] bg-white" />
        <span className="absolute left-[92%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#e3a643]" />
      </div>

      <div
        className="absolute left-[43%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 font-serif text-[45px] font-light text-[#dca445]"
        aria-hidden="true"
      >
        →
      </div>

      <div className="absolute right-0 top-1/2 h-[250px] w-[52%] -translate-y-1/2">
        <span className="absolute left-1/2 top-1/2 h-[224px] w-[224px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2c71d0]/65" />
        <span className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2c71d0]/50" />
        <span className="absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9a24a]/65" />
        <span className="absolute left-1/2 top-1/2 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2878dd]/25 bg-white shadow-[0_0_25px_rgba(42,116,217,0.14)]" />

        <span className="absolute left-1/2 top-[6%] h-[88%] w-px -translate-x-1/2 bg-[#2c71d0]/25" />
        <span className="absolute left-[6%] top-1/2 h-px w-[88%] -translate-y-1/2 bg-[#2c71d0]/25" />

        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-serif text-[58px] leading-none text-[#1875e7] drop-shadow-[0_0_8px_rgba(38,126,231,0.28)]">
          ∞
        </span>

        {orbitNodes.map((node, index) => (
          <NetworkAvatar
            key={index}
            source={portraits[node.portrait]}
            size={node.size}
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
      id="who-we-serve"
      aria-labelledby="positioning-title"
      className="scroll-mt-[104px] overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-12 text-[#0d2147] sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-10 lg:grid-cols-[0.98fr_1.32fr_0.9fr] lg:items-center lg:gap-8">
        <div className="max-w-[380px]">
          <div className="mb-5 flex items-end gap-3">
            <span className="font-serif text-[33px] leading-none text-[#d79d42]">02</span>
            <span className="pb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#2775d6]">
              Positioning
            </span>
          </div>

          <h2
            id="positioning-title"
            className="font-serif text-[clamp(32px,2.5vw,40px)] font-normal leading-[1.08] tracking-[-0.025em]"
          >
            Built for Experts
            <span className="block">Who Should Be in</span>
            <span className="block">More Important Rooms</span>
          </h2>

          <div className="mt-7 max-w-[330px] text-[13px] leading-[1.7] text-[#263d5d] sm:text-sm">
            <p>Your experience is already valuable.</p>
            <p className="mt-1">
              What&apos;s missing is a structured way to extend its reach, relevance, and
              strategic upside.
            </p>
          </div>
        </div>

        <ExpertiseTransformation />

        <div className="grid gap-8 text-[#172947] sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <h3 className="mb-3 text-[13px] font-semibold">Most expertise stays trapped in:</h3>
            <ul className="space-y-2">
              {scatteredExpertise.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[12px]">
                  <X className="h-3.5 w-3.5 shrink-0 stroke-[1.7] text-[#d99c35]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[13px] font-semibold">SharingMinds turns that into:</h3>
            <ul className="space-y-2">
              {structuredExpertise.map((item, index) => (
                <li key={item} className="flex items-center gap-3 text-[12px]">
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 stroke-[2] ${
                      index === structuredExpertise.length - 1
                        ? "text-[#d99c35]"
                        : "text-[#1d70d7]"
                    }`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
