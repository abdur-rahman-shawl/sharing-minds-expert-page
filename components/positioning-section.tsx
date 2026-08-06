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
      className="scroll-mt-[104px] overflow-hidden border-b border-[#dbe2e9] bg-white px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start xl:gap-20">
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
          <div className="relative mx-auto h-[250px] w-full max-w-[760px] bg-white sm:h-[290px]">
            <Image
              src="/experience-infinity-dots.png"
              alt="A dotted blue and gold SharingMinds infinity symbol"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-contain object-center"
            />
          </div>

          <div className="grid gap-5 text-[#172947] sm:grid-cols-2">
            <div className="h-full rounded-xl border border-[#d6dee7] bg-white p-6 shadow-[0_12px_35px_rgba(21,55,94,0.07)] sm:p-7">
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

            <div className="h-full rounded-xl border border-[#bfcfe1] bg-[#f5f9ff] p-6 shadow-[0_12px_35px_rgba(21,55,94,0.07)] sm:p-7">
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
