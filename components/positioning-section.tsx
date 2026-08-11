import Image from "next/image"
import { Check, Circle } from "lucide-react"

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

export function PositioningSection() {
  return (
    <section
      id="take-your-expertise-further"
      aria-labelledby="positioning-title"
      className="relative isolate scroll-mt-[104px] overflow-hidden border-b border-[#dbe2e9] bg-[#f8f4ec] px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <Image
        src="/positioning-background.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none -z-30 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.58)_58%,rgba(255,255,255,0.48)_100%)] lg:bg-[linear-gradient(90deg,rgba(255,255,255,0.80)_0%,rgba(255,255,255,0.68)_38%,rgba(255,255,255,0.18)_70%,rgba(255,255,255,0.10)_100%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1380px] gap-14 xl:grid-cols-[0.8fr_1.2fr] xl:items-start xl:gap-20">
        <div className="max-w-[560px]">
          <header>
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
          </header>

          <div className="mt-9 text-[16px] leading-[1.75] text-[#263d5d] sm:text-[17px]">
            <p>Your experience has already created value.</p>
            <p className="mt-4">
              SharingMinds gives it a structured professional identity—helping the right people
              recognise your expertise, understand where it is relevant and connect with you for
              meaningful engagements.
            </p>
          </div>

          <div className="mt-10 max-w-[520px] border-l-2 border-[#d69a3a] pl-5">
            <p className="text-[clamp(23px,2.2vw,32px)] font-semibold leading-[1.25] tracking-[-0.025em] text-[#a96e20]">
              Your Experience Has Influence.
              <span className="block">Give It Greater Reach.</span>
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="relative h-[250px] w-full sm:h-[310px] lg:h-auto lg:min-h-[300px] lg:max-h-[390px] lg:aspect-[21/10]">
            <Image
              src="/positioning-infinity.webp"
              alt="An infinity symbol formed from a network of expert portraits"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-contain object-center lg:object-cover"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%)",
                maskComposite: "intersect",
              }}
            />
          </div>

          <div className="grid gap-5 text-[#172947] sm:grid-cols-2">
            <div className="h-full rounded-xl border border-white/80 bg-white/85 p-6 shadow-[0_16px_42px_rgba(21,55,94,0.10)] backdrop-blur-md sm:p-7">
              <h3 className="mb-5 text-[18px] font-semibold">
                Experience often grows through:
              </h3>
              <ul className="space-y-3">
                {scatteredExpertise.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] leading-[1.5]">
                    <Circle className="h-4 w-4 shrink-0 fill-[#d99c35]/15 stroke-[1.7] text-[#d99c35]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-full rounded-xl border border-[#bfcfe1]/80 bg-[#f5f9ff]/88 p-6 shadow-[0_16px_42px_rgba(21,55,94,0.10)] backdrop-blur-md sm:p-7">
              <h3 className="mb-5 text-[18px] font-semibold">
                SharingMinds helps extend it through:
              </h3>
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
        </div>
      </div>
    </section>
  )
}
