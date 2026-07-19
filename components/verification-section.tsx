import { ShieldCheck } from "lucide-react"

const verificationPrinciples = [
  "Anyone can claim expertise.",
  "Experience should be earned.",
  "Expertise should be demonstrated.",
  "Trust should be verified.",
]

export function VerificationSection() {
  return (
    <section
      id="why-verification"
      aria-labelledby="why-verification-title"
      className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_42%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-400/10">
            <ShieldCheck className="h-7 w-7 text-indigo-300" aria-hidden="true" />
          </div>
          <h2
            id="why-verification-title"
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Why Verification Matters?
          </h2>
        </div>

        <div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {verificationPrinciples.map((principle) => (
              <li
                key={principle}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-base font-semibold text-slate-100 backdrop-blur-sm"
              >
                {principle}
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300">
            That&apos;s why every application at SharingMinds undergoes a structured review before
            becoming part of our expert community.
          </p>
        </div>
      </div>
    </section>
  )
}
