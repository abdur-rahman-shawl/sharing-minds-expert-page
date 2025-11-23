"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "/service", label: "Service" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const containerClass = cn(
    "sticky top-0 z-50 border-b border-transparent transition-colors duration-300",
    isHome && !scrolled ? "bg-transparent" : "bg-white/90 backdrop-blur-xl shadow-sm border-white/50",
  )

  return (
    <header className={containerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="SharingMinds home">
          <Image
            src="/sharing-minds-logo.png"
            alt="SharingMinds logo"
            width={280}
            height={90}
            className="h-10 w-auto sm:h-14"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-blue-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
            <Link href="/registration">Become a mentor</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger className="inline-flex items-center rounded-full p-2 text-gray-900 transition hover:bg-gray-100 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs bg-white px-6 py-10 sm:max-w-sm">
            <nav className="flex flex-col gap-4 text-lg font-medium text-gray-900">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="rounded-md px-2 py-2 hover:bg-gray-100">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 space-y-3">
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700">
                <Link href="/registration">Become a mentor</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
