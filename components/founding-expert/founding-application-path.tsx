import { ArrowRight } from "lucide-react"

import { foundingPathSteps } from "./founding-expert-data"

export function FoundingApplicationPath() {
  return (
    <article className="rounded-[20px] border border-[#d7a44d]/70 bg-white/68 p-4 shadow-[0_14px_32px_rgba(113,72,14,0.1)] backdrop-blur-sm lg:h-[clamp(210px,27vh,232px)] lg:p-[clamp(12px,1.2vw,18px)] 2xl:flex 2xl:h-[clamp(220px,27vh,260px)] 2xl:flex-col 2xl:justify-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a86610]">
        Application Path
      </p>

      <ol className="mt-3 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-1.5 xl:gap-2.5">
        {foundingPathSteps.map(({ title, description, icon: Icon }, index) => (
          <li
            key={title}
            className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#e2c38c]/55 bg-[#fffaf1]/66 px-3 py-2 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d5982e] bg-[#fffaf0] text-[#b97513] lg:h-8 lg:w-8">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-[9px] font-semibold tracking-[0.12em] text-[#b47618]">
                  0{index + 1}
                </span>
                <span className="text-[12px] font-semibold text-[#102747]">{title}</span>
              </span>
              <span className="mt-0.5 block text-[10px] leading-[1.3] text-[#4c5b6d] lg:line-clamp-1 xl:line-clamp-none">
                {description}
              </span>
            </span>
            {index < foundingPathSteps.length - 1 && (
              <ArrowRight
                className="hidden h-3.5 w-3.5 shrink-0 text-[#cf9025] sm:block lg:hidden"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </article>
  )
}
