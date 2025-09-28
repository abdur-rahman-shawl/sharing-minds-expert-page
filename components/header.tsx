"use client"

import Link from "next/link"
import Image from 'next/image'
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const containerClass = cn(
    "sticky top-0 z-50 transition-colors duration-300",
    isHome && !scrolled ? "bg-transparent" : "bg-white/80 backdrop-blur-md shadow-sm",
  )

  return (
    <header className={containerClass}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="SharingMinds home">
          <Image
            src="/sharing-minds-logo.png"
            alt="SharingMinds logo"
            width={320}
            height={100}
            className="h-14 w-auto md:h-20"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/service" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Service
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
