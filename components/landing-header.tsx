"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { BrandLogo } from "@/components/brand-logo"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/service", label: "Service" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

function LandingLogo() {
  return (
    <Link
      href="/"
      aria-label="SharingMinds home"
      className="flex min-w-0 shrink items-center"
    >
      <BrandLogo
        tone="light"
        priority
        className="gap-2.5 sm:gap-5"
        markClassName="max-[360px]:h-8 max-[360px]:w-16 sm:h-12 sm:w-24"
        wordmarkClassName="max-[360px]:text-[21px] sm:text-[34px]"
        taglineClassName="max-[360px]:mt-1 max-[360px]:text-[7px] sm:mt-2 sm:text-[12px]"
      />
    </Link>
  )
}

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/[0.12] bg-[#031426]/90 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[88px] w-full max-w-[1380px] items-center justify-between px-5 sm:h-[104px] sm:px-8 lg:px-12">
        <LandingLogo />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-5 min-[1280px]:flex lg:gap-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] font-medium text-white/[0.88] transition-colors hover:text-[#f3bd78] lg:text-xs"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 min-[1280px]:flex">
          <Link
            href="/auth/login"
            className="inline-flex h-10 min-w-[92px] items-center justify-center rounded-[4px] border border-[#4f769b] px-5 text-xs font-semibold text-white transition-colors hover:border-[#63a9e9] hover:bg-white/5"
          >
            Log In
          </Link>
          <Link
            href={EXPERT_APPLICATION_PATH}
            className="inline-flex h-10 min-w-[198px] items-center justify-center rounded-[4px] border border-[#229bff] bg-[#0879e4] px-5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(0,142,255,0.72),inset_0_0_12px_rgba(255,255,255,0.16)] transition-all hover:bg-[#168cf4] hover:shadow-[0_0_24px_rgba(0,142,255,0.85)]"
          >
            Start My Expert Application
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded border border-white/20 text-white min-[1280px]:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-b border-white/10 bg-[#031426]/98 transition-all duration-300 min-[1280px]:hidden",
          isOpen ? "max-h-[440px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        )}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col px-5 py-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-white/10 py-3.5 text-sm font-medium text-white/[0.85] last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded border border-[#4f769b] text-sm font-semibold text-white"
            >
              Log In
            </Link>
            <Link
              href={EXPERT_APPLICATION_PATH}
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded border border-[#229bff] bg-[#0879e4] px-3 py-2 text-center text-xs font-semibold leading-tight text-white shadow-[0_0_18px_rgba(0,142,255,0.55)]"
            >
              Start My Expert Application
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
