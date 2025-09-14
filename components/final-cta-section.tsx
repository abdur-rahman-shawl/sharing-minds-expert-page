"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Final CTA card styled to match the provided reference image
export function FinalCTASection() {
  return (
    <section className="relative py-20 px-4 bg-[#eaf4fb]" aria-labelledby="mentor-cta-heading">
      {/* dotted pattern on the top-right of the section */}
      <div
        className="pointer-events-none absolute right-6 md:right-16 top-4 md:top-6 h-24 w-40 opacity-40 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.25) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-300/60 bg-[linear-gradient(180deg,#f5fbff,white_30%)] p-6 sm:p-10 md:p-12 shadow-[0_10px_30px_-10px_rgba(2,6,23,0.15)] min-h-[300px] md:min-h-[clamp(360px,36vw,460px)] grid place-items-center">
          {/* decorative diagonal shapes inside card (persistently visible) */}
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,260 1200,140 1200,400 0,400" fill="rgba(59,130,246,0.12)" />
            <polygon points="0,340 720,230 1200,280 1200,400 0,400" fill="rgba(99,102,241,0.10)" />
          </svg>

          <div className="relative z-10 w-full">
            <h2
              id="mentor-cta-heading"
              className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Join SharingMinds as a Mentor Today.
            </h2>

            <p className="mt-6 text-center text-[17px] leading-relaxed text-slate-700 italic max-w-3xl mx-auto">
              "SharingMinds Mentor Onboarding has enabled me early access of tools and priority founder mentor status." –
              Amit Sawant
            </p>

            <div className="mt-10 mx-auto max-w-xl flex flex-col sm:flex-row items-stretch gap-3">
              <Input
                type="email"
                placeholder="Enter your email to sign up as a mentor"
                className="h-12 bg-white border-slate-300 placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              />
              <Button className="h-12 px-5 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                Sign Up as a Mentor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
