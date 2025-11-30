"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Quote } from "lucide-react"

export function TestimonialSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.2)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-950 px-4 py-24 sm:px-6 sm:py-32"
    >
      {/* --- ANIMATED BACKGROUND START --- */}

      {/* 1. Deep Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />

      {/* 2. Rotating "Aurora" Gradients - Slow massive rotation */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_60s_linear_infinite] opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,indigo_500_120deg,purple_500_180deg,transparent_360deg)] blur-[120px]" />
      </div>

      {/* 3. Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* 4. SCATTERED "FIREFLY" PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large soft glow orbs */}
        <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-indigo-400/30 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[60%] right-[15%] h-2 w-2 rounded-full bg-purple-400/30 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        {/* Scattered small stars/dots with randomized delays */}
        <div className="absolute top-[15%] left-[35%] h-1 w-1 rounded-full bg-white/20 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
        <div className="absolute top-[10%] right-[30%] h-0.5 w-0.5 rounded-full bg-white/40 animate-pulse" style={{ animationDuration: '2s', animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] left-[25%] h-1 w-1 rounded-full bg-indigo-300/40 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
        <div className="absolute bottom-[10%] right-[40%] h-0.5 w-0.5 rounded-full bg-purple-300/40 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0s' }} />
        
        <div className="absolute top-[40%] left-[5%] h-1 w-1 rounded-full bg-white/10 animate-pulse" style={{ animationDuration: '5s', animationDelay: '3s' }} />
        <div className="absolute top-[80%] left-[8%] h-1.5 w-1.5 rounded-full bg-indigo-500/20 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '1s' }} />
        <div className="absolute top-[5%] right-[5%] h-1 w-1 rounded-full bg-white/20 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-[50%] right-[5%] h-0.5 w-0.5 rounded-full bg-purple-400/30 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        
        {/* Center area subtle particles */}
        <div className="absolute top-[30%] left-[60%] h-0.5 w-0.5 rounded-full bg-white/30 animate-pulse" style={{ animationDuration: '4s', animationDelay: '2.5s' }} />
        <div className="absolute bottom-[30%] right-[20%] h-1 w-1 rounded-full bg-indigo-300/20 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-[70%] left-[40%] h-1 w-1 rounded-full bg-white/10 animate-pulse" style={{ animationDuration: '3s', animationDelay: '4s' }} />
        
        {/* Tiny glinting specks */}
        <div className="absolute top-[25%] right-[50%] h-[2px] w-[2px] rounded-full bg-white/40 animate-ping" style={{ animationDuration: '7s', animationDelay: '1s' }} />
        <div className="absolute bottom-[15%] left-[10%] h-[2px] w-[2px] rounded-full bg-indigo-400/40 animate-ping" style={{ animationDuration: '6s', animationDelay: '3s' }} />
        <div className="absolute top-[15%] right-[10%] h-[2px] w-[2px] rounded-full bg-purple-400/40 animate-ping" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      </div>

      {/* --- ANIMATED BACKGROUND END --- */}

      <div
        className={`relative z-10 mx-auto max-w-4xl text-center transition-all duration-1000 ${
          sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mb-10 flex justify-center">
            <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-40 blur transition duration-500 group-hover:opacity-75"></div>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-white/10 shadow-2xl">
                    <Quote className="h-7 w-7 text-indigo-400" />
                </div>
            </div>
        </div>

        <blockquote className="mb-12 text-3xl font-medium leading-tight text-white/90 sm:text-4xl md:text-5xl lg:leading-[1.2] drop-shadow-sm">
          "Being a mentor with SharingMinds has allowed me to make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-bold">real impact</span> on the next generation of startup founders."
        </blockquote>

        <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-slate-900 animate-[spin_4s_linear_infinite]"></div>
            <img
              src="/placeholder.svg?key=harish"
              alt="Harish Iyer"
              loading="lazy"
              className="relative h-16 w-16 rounded-full border-4 border-slate-950 object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="text-lg font-semibold text-white tracking-wide">Harish Iyer</div>
            <div className="text-indigo-200/80 text-sm uppercase tracking-wider font-medium">Startup & Scaling Consultant</div>
          </div>
        </div>
      </div>
    </section>
  )
}