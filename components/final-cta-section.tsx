"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function FinalCTASection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.1)

  return (
    <section ref={sectionRef} className="bg-gradient-to-br from-gray-50 to-white py-32 px-4">
      <div className="max-w-4xl mx-auto relative">
        {/* Subtle pattern band (low contrast) */}
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23000000' /%3E%3C/svg%3E")`,
          }}
        />
        {/* Radial spotlight backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_300px_at_50%_30%,rgba(15,23,42,0.08),transparent)]" />

        <div
          className={`relative overflow-hidden rounded-3xl p-12 bg-white border border-black/5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] animate-on-scroll will-change-opacity ${
            sectionVisible ? "animate-fade-in-slow animate-delay-200" : ""
          }`}
        >
          {/* Decorative diagonal background */}
          <svg
            className="pointer-events-none absolute inset-0 -z-10 w-full h-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,260 1200,140 1200,400 0,400" fill="rgba(100,116,139,0.08)" />
            <polygon points="0,340 720,230 1200,280 1200,400 0,400" fill="rgba(100,116,139,0.06)" />
          </svg>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-balance leading-tight text-center">
            Join SharingMinds as a Mentor/Expert Today.
          </h2>

          <div className={`mb-12`}>
            <blockquote className="text-lg text-gray-700 leading-relaxed italic text-center mb-8">
              "SharingMinds is a fantastic mentorship platform that has enabled me to share my knowledge and experience
              with aspiring students. The dashboard is user-friendly and efficient, making the mentoring process smooth
              and enjoyable."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <img
                src="/placeholder.svg?key=nathan"
                alt="Nathan Lopez"
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Nathan Lopez</p>
                <p className="text-gray-500 text-sm">Study Abroad Counsellor</p>
              </div>
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row gap-3 max-w-lg mx-auto`}>
            <Input
              placeholder="Enter your email..."
              className="flex-1 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 font-medium hover:-translate-y-px hover:opacity-90 transition-[transform,opacity,background] duration-200">
              Sign Up as a Mentor
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
