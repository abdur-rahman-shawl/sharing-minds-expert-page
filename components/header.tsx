"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"

const navLinks = [
  { href: "/service", label: "Service" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()
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

  const handleSignOut = async () => {
    try {
      await signOut()
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

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
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
          ) : session?.user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="btn-ghost-luxe bg-gradient-to-r from-black/40 to-black/20 text-amber-50 border-amber-300/40">
              Sign out
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex btn-ghost-luxe bg-gradient-to-r from-black/30 to-black/10 text-amber-50 border-amber-300/40">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="btn-luxe px-5 py-2 text-xs sm:text-sm uppercase tracking-[0.08em]">
            <Link href="/registration">Founding Mentor Access</Link>
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
              {isPending ? (
                <div className="h-11 w-full animate-pulse rounded-full bg-gray-200" />
              ) : session?.user ? (
                <Button onClick={handleSignOut} variant="outline" className="w-full justify-center btn-ghost-luxe bg-gradient-to-r from-black/40 to-black/20 text-amber-50 border-amber-300/40">
                  Sign out
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full justify-center btn-ghost-luxe bg-gradient-to-r from-black/30 to-black/10 text-amber-50 border-amber-300/40">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              )}
              <Button asChild className="w-full justify-center btn-luxe text-xs uppercase tracking-[0.08em]">
                <Link href="/registration">Founding Mentor Access</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
