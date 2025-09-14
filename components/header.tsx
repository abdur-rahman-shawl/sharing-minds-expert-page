"use client"

import Link from "next/link"
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
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <svg viewBox="0 0 40 20" className="w-10 h-5 text-blue-600" fill="currentColor" aria-hidden="true">
              <path d="M10 10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c-2.8 0-5.3-1.1-7.1-2.9C11.1 15.3 10 12.8 10 10zm-10 0c0 5.5 4.5 10 10 10 2.8 0 5.3-1.1 7.1-2.9C8.9 15.3 10 12.8 10 10S8.9 4.7 7.1 2.9C5.3 1.1 2.8 0 0 0c5.5 0 10 4.5 10 10z" />
            </svg>
          </div>
          <div>
            <span className="block text-xl font-bold text-gray-900 tracking-tight">SharingMinds</span>
            <span className="block text-xs text-gray-500 -mt-0.5">a human intelligence network</span>
          </div>
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
