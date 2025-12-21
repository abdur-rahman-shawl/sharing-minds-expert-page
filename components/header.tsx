"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, LogOut, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMentorStatus } from "@/hooks/use-mentor-status"

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
  const { isMentor, isLoading: mentorStatusLoading } = useMentorStatus()
  const isHome = pathname === "/"

  const ctaHref = isMentor ? "/vip-lounge" : "/registration"
  const ctaLabel = isMentor ? "VIP Lounge" : "Founding Mentor Access"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out font-sans",
        scrolled || !isHome
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-3"
          : "bg-transparent py-5 border-b border-transparent"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* --- LEFT SECTION: Logo & Nav Group --- */}
        <div className="flex items-center gap-8 md:gap-12">
          {/* Logo - Increased Size */}
          <Link 
            href="/" 
            className="relative flex items-center transition-opacity hover:opacity-90 shrink-0" 
            aria-label="SharingMinds home"
          >
            <Image
              src="/sharing-minds-logo.png"
              alt="SharingMinds logo"
              width={280}
              height={90}
              className={cn(
                "w-auto transition-all duration-300",
                // 1.5x bigger: h-9 -> h-14, h-11 -> h-16
                scrolled ? "h-14" : "h-16"
              )}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- RIGHT SECTION: Actions --- */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="flex items-center gap-3">
                 <div className="h-9 w-16 animate-pulse rounded-md bg-slate-100" />
                 <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200" />
              </div>
            ) : session?.user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pr-4 border-r border-slate-200/60">
                  <span className="text-sm font-medium text-slate-700 hidden lg:inline-block">
                    {session.user.name}
                  </span>
                  <Avatar className="h-8 w-8 border border-slate-200 shadow-sm">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">
                      {session.user.name?.charAt(0) || <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 font-medium px-4"
              >
                <Link href="/auth/login">Sign in</Link>
              </Button>
            )}

            {!mentorStatusLoading && (
               <Button
               asChild
               className="hidden lg:inline-flex rounded-full bg-slate-900 text-white shadow-lg shadow-indigo-500/20 hover:bg-slate-800 hover:scale-105 transition-all duration-300 px-6 h-11"
             >
               <Link href={ctaHref} className="flex items-center gap-2 font-semibold tracking-wide text-sm">
                 {ctaLabel}
               </Link>
             </Button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-700 hover:bg-slate-100 rounded-full"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-white/95 backdrop-blur-xl border-l border-slate-200">
               <VisuallyHidden>
                  <SheetTitle>Mobile Menu</SheetTitle>
                  <SheetDescription>Navigation links</SheetDescription>
               </VisuallyHidden>

              {/* Mobile Header */}
              <div className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-6">
                   <Image
                      src="/sharing-minds-logo.png"
                      alt="Logo"
                      width={180}
                      height={60}
                      className="h-12 w-auto" // Increased mobile logo size
                    />
                </div>
                {session?.user && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                     <Avatar className="h-10 w-10 border border-white shadow-sm">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600">
                        {session.user.name?.charAt(0) || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</span>
                      <span className="text-xs text-slate-500 truncate">{session.user.email}</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-slate-100" />

              {/* Mobile Links */}
              <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3.5 text-[15px] font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </Link>
                ))}
              </nav>

              {/* Mobile Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                {!mentorStatusLoading && (
                  <Button
                    asChild
                    className="w-full h-11 rounded-xl bg-slate-900 text-white shadow-md hover:bg-slate-800"
                  >
                    <Link href={ctaHref}>
                      {ctaLabel}
                    </Link>
                  </Button>
                )}
                
                {isPending ? (
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                ) : session?.user ? (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full h-11 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-11 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 rounded-xl"
                  >
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
