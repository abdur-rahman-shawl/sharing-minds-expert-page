"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Gentle delayed reveal for hero content
  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-xy"></div>
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-blue-100/40 via-transparent to-indigo-100/40 animate-gradient-slow"></div>
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-bl from-transparent via-purple-50/30 to-blue-100/30 animate-gradient-diagonal"></div>

      {/* Fluid, morphing blobs for a premium, visible motion */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-[48rem] h-[48rem] opacity-60 blur-2xl blob-shape animate-blob animate-blob-slower saturate-150 
          bg-gradient-to-tr from-blue-500/45 via-indigo-500/35 to-purple-500/45" />
        <div className="absolute top-36 -right-28 w-[40rem] h-[40rem] opacity-50 blur-2xl blob-shape animate-blob animate-delay-5s saturate-150 
          bg-gradient-to-tr from-sky-500/40 via-blue-500/35 to-indigo-500/40" />
        <div className="absolute -bottom-28 left-1/3 w-[44rem] h-[44rem] opacity-45 blur-2xl blob-shape animate-blob animate-delay-10s saturate-150 
          bg-gradient-to-tr from-violet-500/35 via-indigo-500/30 to-blue-500/35" />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg viewBox="0 0 40 20" className="w-10 h-5 text-blue-600" fill="currentColor">
                <path d="M10 10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c-2.8 0-5.3-1.1-7.1-2.9C11.1 15.3 10 12.8 10 10zm-10 0c0 5.5 4.5 10 10 10 2.8 0 5.3-1.1 7.1-2.9C8.9 15.3 10 12.8 10 10S8.9 4.7 7.1 2.9C5.3 1.1 2.8 0 0 0c5.5 0 10 4.5 10 10z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">sharingminds</h1>
              <p className="text-xs text-gray-500 -mt-0.5">a human intelligence network</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Service
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About Us
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`max-w-6xl mx-auto text-center relative z-10 pt-20 animate-on-scroll will-change-opacity ${
          reveal ? "animate-fade-in" : ""
        }`}
      >
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
          Join SharingMinds as an Expert
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
          Empower minds by becoming a mentor. Create your profile, share expertise and connect 1 to 1 on video calls
          with mentees.
        </p>
        <p className="text-gray-500 mb-12 italic">"Lead with experience, empowers with guidance"</p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-12">
          <Input
            placeholder="Enter your email to sign up as a mentor"
            className="flex-1 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 font-medium">
            Sign Up as a Mentor
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-600 ml-2 font-medium">Master Mentors</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">Dashboard Access</span>
          </div>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <img
              src="/professional-headshot.png"
              alt="Ulysses Rodriguez"
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">"Helped me connect with amazing talents."</p>
              <p className="text-xs text-gray-500">Ulysses Rodriguez, Instructor and upskill experts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
