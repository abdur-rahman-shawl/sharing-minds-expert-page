"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { BrandLogo } from "@/components/brand-logo"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

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

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)")
    const closeOnDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setIsOpen(false)
    }

    closeOnDesktop(desktopQuery)
    desktopQuery.addEventListener("change", closeOnDesktop)

    return () => desktopQuery.removeEventListener("change", closeOnDesktop)
  }, [])

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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded border border-white/20 text-white transition-colors hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff] min-[1280px]:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="!w-full !max-w-none overflow-y-auto border-l-0 border-white/10 bg-[#031426] p-0 text-white [&>button]:right-5 [&>button]:top-6 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded [&>button]:border [&>button]:border-white/20 [&>button]:text-white [&>button]:opacity-100 [&>button>svg]:h-5 [&>button>svg]:w-5 sm:!w-[420px] sm:!max-w-[420px] sm:border-l"
          >
            <SheetHeader className="border-b border-white/10 px-5 pb-6 pt-5 text-left sm:px-7">
              <Link
                href="/"
                aria-label="SharingMinds home"
                onClick={() => setIsOpen(false)}
                className="flex w-fit min-w-0 items-center pr-14"
              >
                <BrandLogo
                  tone="light"
                  markClassName="h-10 w-20"
                  wordmarkClassName="text-[26px]"
                  taglineClassName="mt-1 text-[8px]"
                />
              </Link>
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate SharingMinds or start your expert application.
              </SheetDescription>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="flex min-h-[calc(100dvh-91px)] flex-col px-5 py-7 sm:px-7"
            >
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-14 items-center border-b border-white/10 text-base font-medium text-white/[0.9] transition-colors hover:text-[#f3bd78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65b9ff]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-10">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded border border-[#4f769b] px-5 text-sm font-semibold text-white transition-colors hover:border-[#63a9e9] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff]"
                >
                  Log In
                </Link>
                <Link
                  href={EXPERT_APPLICATION_PATH}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded border border-[#229bff] bg-[#0879e4] px-5 py-3 text-center text-sm font-semibold leading-snug text-white shadow-[0_0_18px_rgba(0,142,255,0.55)] transition-colors hover:bg-[#168cf4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff]"
                >
                  Start My Expert Application
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
