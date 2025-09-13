"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function TestimonialSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.2)

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-blue-600 to-blue-700 py-32 px-4 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className={`absolute inset-0 ${sectionVisible ? "animate-bg-pan-x will-change-bg" : ""}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div
        className={`max-w-6xl mx-auto text-center relative z-10 animate-on-scroll will-change-opacity ${
          sectionVisible ? "animate-fade-in-slow" : ""
        }`}
      >
        <blockquote className="text-2xl md:text-4xl font-medium mb-12 leading-relaxed text-balance">
          "Being a mentor with SharingMinds has allowed me to make a real impact on the next generation startup
          founders"
        </blockquote>

        <div
          className={`flex items-center justify-center gap-4 animate-on-scroll will-change-opacity ${
            sectionVisible ? "animate-fade-in-slow animate-delay-300" : ""
          }`}
        >
          <img
            src="/placeholder.svg?key=harish"
            alt="Harish Iyer"
            loading="lazy"
            className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
          />
          <div className="text-left">
            <p className="font-semibold text-lg">Harish Iyer</p>
            <p className="text-blue-100 text-sm">Startup & Scaling Consultant</p>
          </div>
        </div>
      </div>
    </section>
  )
}
