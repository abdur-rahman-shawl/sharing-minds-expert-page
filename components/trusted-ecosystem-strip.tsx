import { CheckCircle2 } from "lucide-react"

const ecosystemMembers = ["Professionals", "Founders", "Startups", "Businesses"]

export function TrustedEcosystemStrip() {
  return (
    <section
      aria-labelledby="trusted-ecosystem-title"
      className="border-y border-slate-200/70 bg-white px-4 py-8 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 lg:flex-row lg:justify-between">
        <h2
          id="trusted-ecosystem-title"
          className="text-center text-lg font-semibold text-slate-900 lg:text-left"
        >
          SharingMinds is building a trusted ecosystem for
        </h2>

        <ul className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
          {ecosystemMembers.map((member) => (
            <li
              key={member}
              className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
              {member}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
