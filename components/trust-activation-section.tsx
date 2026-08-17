import Image from "next/image"
import {
  BadgeCheck,
  Check,
  CircleUserRound,
  KeyRound,
  ScanSearch,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react"

const trustStandards = ["Quality", "Trust", "Credibility", "Signal Integrity"]

const activationSteps = [
  { label: "Apply and create profile", icon: CircleUserRound },
  { label: "Get reviewed and shortlisted", icon: ScanSearch },
  { label: "Complete verification", icon: BadgeCheck },
  { label: "Activate expert access", icon: KeyRound },
  { label: "Unlock structured opportunities", icon: TrendingUp },
]

const networkPortraits = [
  {
    source: "/professional-mentor-headshot-8.jpg",
    className: "left-[8%] top-[16%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-3.jpg",
    className: "left-[20%] top-[42%] h-14 w-14",
  },
  {
    source: "/professional-mentor-headshot-11.jpg",
    className: "left-[9%] bottom-[9%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-5.jpg",
    className: "left-[30%] bottom-[17%] h-12 w-12",
  },
]

const networkLines = [
  { left: "15%", top: "31%", width: "27%", rotate: "19deg" },
  { left: "18%", top: "52%", width: "24%", rotate: "-7deg" },
  { left: "16%", top: "70%", width: "29%", rotate: "-20deg" },
  { left: "31%", top: "41%", width: "20%", rotate: "27deg" },
]

function TrustNetworkVisual() {
  const vortexLayers = [
    { width: 330, height: 72, top: 268, opacity: 0.24 },
    { width: 302, height: 67, top: 226, opacity: 0.28 },
    { width: 270, height: 61, top: 185, opacity: 0.33 },
    { width: 232, height: 54, top: 145, opacity: 0.38 },
    { width: 190, height: 46, top: 106, opacity: 0.42 },
    { width: 144, height: 36, top: 70, opacity: 0.48 },
    { width: 94, height: 25, top: 38, opacity: 0.52 },
  ]

  return (
    <div
      className="relative mx-auto h-[360px] w-full max-w-[620px] sm:h-[400px]"
      aria-label="A selective network of verified experts"
      role="img"
    >
      <div className="absolute left-[55%] top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1269da]/18 blur-3xl" />

      {networkLines.map((line) => (
        <span
          key={`${line.left}-${line.top}`}
          className="absolute h-px origin-left bg-[linear-gradient(90deg,rgba(71,143,219,0.12),rgba(74,145,222,0.58),rgba(71,143,219,0.12))]"
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            transform: `rotate(${line.rotate})`,
          }}
        />
      ))}

      {networkPortraits.map(({ source, className }) => (
        <span
          key={source}
          className={`absolute overflow-hidden rounded-full border border-[#5a94ce]/70 bg-[#071b31] p-0.5 shadow-[0_0_14px_rgba(32,119,218,0.25)] ${className}`}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image src={source} alt="" fill sizes="64px" className="object-cover" />
          </span>
        </span>
      ))}

      <div className="absolute left-[59%] top-1/2 h-[360px] w-[380px] -translate-x-1/2 -translate-y-1/2">
        {vortexLayers.map((layer, index) => (
          <span
            key={layer.width}
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-[#2b72cf]/45 bg-[linear-gradient(180deg,rgba(19,78,175,0.42),rgba(4,25,51,0.2))] shadow-[inset_0_0_17px_rgba(38,112,230,0.3),0_0_11px_rgba(25,91,202,0.18)]"
            style={{
              width: `${layer.width}px`,
              height: `${layer.height}px`,
              top: `${layer.top}px`,
              opacity: layer.opacity,
              transform: `translateX(-50%) rotate(${index % 2 === 0 ? -4 : 4}deg)`,
            }}
          />
        ))}

        <span className="absolute left-1/2 top-[185px] z-10 h-24 w-40 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/brand/sharingminds-infinity.png"
            alt=""
            fill
            sizes="160px"
            className="object-contain drop-shadow-[0_0_15px_rgba(47,135,255,0.9)]"
          />
        </span>
      </div>

      <div className="absolute right-[2%] top-[26%] flex flex-col gap-14 text-[#d8a454]">
        <UserCheck className="h-7 w-7 stroke-[1.3]" />
        <UsersRound className="ml-4 h-7 w-7 stroke-[1.3]" />
        <UserCheck className="h-7 w-7 stroke-[1.3]" />
      </div>
    </div>
  )
}

function ParticleInfinity() {
  return (
    <div
      className="relative mx-auto h-[320px] w-full max-w-[600px] sm:h-[380px]"
      aria-label="Expert access activating into compounding opportunity"
      role="img"
    >
      <span className="absolute inset-x-[6%] inset-y-[18%] rounded-full bg-[#1678e9]/20 blur-3xl" />
      <span
        className="absolute inset-0"
        style={{
          WebkitMaskImage: "url('/brand/sharingminds-infinity.png')",
          maskImage: "url('/brand/sharingminds-infinity.png')",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          backgroundImage:
            "radial-gradient(circle, #58a8ff 1.2px, transparent 1.7px), radial-gradient(circle, #e1a953 1.1px, transparent 1.6px)",
          backgroundPosition: "0 0, 4px 5px",
          backgroundSize: "7px 7px, 10px 10px",
          filter: "drop-shadow(0 0 10px rgba(40, 126, 229, 0.65))",
        }}
      />
      <span className="absolute left-[48%] top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4d9aec]/35 shadow-[0_0_18px_rgba(60,145,245,0.55)]" />
    </div>
  )
}

export function TrustActivationSection() {
  return (
    <div className="relative overflow-hidden bg-[#03172c] px-5 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_48%,rgba(16,90,185,0.14),transparent_32%),radial-gradient(circle_at_78%_45%,rgba(16,90,185,0.12),transparent_30%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <section
          id="trust-quality"
          aria-labelledby="trust-quality-title"
          className="grid gap-12 py-16 sm:py-20 lg:min-h-[clamp(620px,72vh,740px)] lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16 lg:py-24"
        >
          <div className="max-w-[560px]">
            <h2
              id="trust-quality-title"
              className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
            >
              Curated. Verified.
              <span className="block">Selective.</span>
            </h2>

            <p className="mt-7 max-w-[520px] text-[16px] leading-[1.7] text-[#d0d8e2]">
              This is not an open marketplace.
            </p>
            <p className="mt-2 max-w-[520px] text-[16px] leading-[1.7] text-[#d0d8e2]">
              Experts are reviewed, verified, and selectively activated to maintain:
            </p>

            <ul className="mt-5 space-y-3">
              {trustStandards.map((standard) => (
                <li
                  key={standard}
                  className="flex items-center gap-3 text-[15px] leading-[1.5] text-[#eff3f6]"
                >
                  <Check className="h-5 w-5 stroke-[2.2] text-[#e1aa58]" />
                  {standard}
                </li>
              ))}
            </ul>

            <p className="mt-5 max-w-[520px] text-[15px] leading-[1.65] text-[#d0d8e2]">
              We optimize for relevance and outcomes—not volume.
            </p>
          </div>

          <TrustNetworkVisual />
        </section>

        <section
          id="activation-model"
          aria-labelledby="activation-model-title"
          className="grid gap-12 border-t border-[#67809b]/35 py-16 sm:py-20 lg:min-h-[clamp(620px,72vh,740px)] lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16 lg:py-24"
        >
          <div className="max-w-[560px] lg:order-2">
            <h2
              id="activation-model-title"
              className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
            >
              Join Free.
              <span className="block">Activate When Verified.</span>
            </h2>

            <ol className="relative mt-8 space-y-4 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-[linear-gradient(#d9a85a,#2b7ad6)]">
              {activationSteps.map(({ label, icon: Icon }, index) => (
                <li
                  key={label}
                  className="relative z-10 flex items-center gap-4 text-[15px] leading-[1.45] text-[#d8e0e8]"
                >
                  <span
                    className={`flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border bg-[#071b31] ${
                      index < 3
                        ? "border-[#d7a24f]/80 text-[#e1aa58]"
                        : "border-[#347fda]/80 text-[#54a0f4]"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] stroke-[1.6]" />
                  </span>
                  {label}
                </li>
              ))}
            </ol>

            <p className="mt-7 text-[15px] font-medium leading-[1.55] text-[#e1aa58]">
              Free to apply. Selective to activate. Built to compound.
            </p>
          </div>

          <div className="lg:order-1">
            <ParticleInfinity />
          </div>
        </section>
      </div>
    </div>
  )
}
