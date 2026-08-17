import Image from "next/image"
import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

interface BrandLogoProps extends ComponentPropsWithoutRef<"span"> {
  markClassName?: string
  priority?: boolean
  showTagline?: boolean
  taglineClassName?: string
  tone?: "dark" | "light"
  wordmarkClassName?: string
}

export function BrandLogo({
  className,
  markClassName,
  priority = false,
  showTagline = true,
  taglineClassName,
  tone = "dark",
  wordmarkClassName,
  ...props
}: BrandLogoProps) {
  const isLight = tone === "light"

  return (
    <span className={cn("inline-flex items-center gap-3", className)} {...props}>
      <span
        className={cn("relative h-9 w-[72px] shrink-0 overflow-hidden", markClassName)}
        aria-hidden="true"
      >
        <Image
          src="/brand/sharingminds-infinity.png"
          alt=""
          fill
          sizes="96px"
          className="object-cover object-center"
          priority={priority}
        />
      </span>

      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "whitespace-nowrap text-[25px] font-normal leading-[0.95] tracking-[-0.045em]",
            isLight ? "text-white" : "text-slate-950",
            wordmarkClassName,
          )}
        >
          <span>sharing</span>
          <span className="font-bold">minds</span>
        </span>

        {showTagline && (
          <span
            className={cn(
              "mt-1.5 whitespace-nowrap text-[9px] font-medium uppercase leading-none tracking-[0.07em]",
              isLight ? "text-white/65" : "text-slate-500",
              taglineClassName,
            )}
          >
            a human intelligence network
          </span>
        )}
      </span>
    </span>
  )
}
