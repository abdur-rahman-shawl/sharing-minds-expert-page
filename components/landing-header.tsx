"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#for-experts", label: "For Experts" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "/about", label: "About Us" },
  { href: "#resources", label: "Resources" },
]

function LandingLogo() {
  return (
    <Link
      href="/"
      aria-label="SharingMinds home"
      className="flex shrink-0 items-center gap-3.5 sm:gap-5"
    >
      <span
        className="relative h-9 w-[72px] shrink-0 overflow-hidden sm:h-12 sm:w-24"
        aria-hidden="true"
      >
        <Image
          src="/sharing-minds-logo.png"
          alt=""
          width={256}
          height={118}
          className="absolute -left-[60px] -top-[9px] h-[88.5px] w-48 max-w-none sm:-left-[80px] sm:-top-3 sm:h-[118px] sm:w-64"
          priority
        />
      </span>
      <span className="flex flex-col text-white">
        <span className="text-[25px] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[34px]">
          sharingminds
        </span>
        <span className="mt-1.5 text-[9px] font-medium uppercase leading-none tracking-[0.07em] text-white/[0.65] sm:mt-2 sm:text-[12px]">
          a human intelligence network
        </span>
      </span>
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
          className="hidden items-center gap-5 min-[1180px]:flex lg:gap-8"
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

        <div className="hidden items-center gap-4 min-[1180px]:flex">
          <Link
            href="/auth/login"
            className="inline-flex h-10 min-w-[92px] items-center justify-center rounded-[4px] border border-[#4f769b] px-5 text-xs font-semibold text-white transition-colors hover:border-[#63a9e9] hover:bg-white/5"
          >
            Log In
          </Link>
          <Link
            href={EXPERT_APPLICATION_PATH}
            className="inline-flex h-10 min-w-[144px] items-center justify-center rounded-[4px] border border-[#229bff] bg-[#0879e4] px-5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(0,142,255,0.72),inset_0_0_12px_rgba(255,255,255,0.16)] transition-all hover:bg-[#168cf4] hover:shadow-[0_0_24px_rgba(0,142,255,0.85)]"
          >
            Apply as an Expert
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded border border-white/20 text-white min-[1180px]:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-b border-white/10 bg-[#031426]/98 transition-all duration-300 min-[1180px]:hidden",
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
              className="inline-flex h-11 items-center justify-center rounded border border-[#229bff] bg-[#0879e4] px-3 text-center text-sm font-semibold text-white shadow-[0_0_18px_rgba(0,142,255,0.55)]"
            >
              Apply as an Expert
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
