"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Quote } from "lucide-react"

export function TestimonialSection() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation(0.2)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-900 px-4 py-24 sm:px-6 sm:py-32"
    >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-3xl"></div>

      <div
        className={`relative z-10 mx-auto max-w-4xl text-center transition-all duration-1000 ${
          sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mb-8 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                <Quote className="h-6 w-6" />
            </div>
        </div>

        <blockquote className="mb-12 text-3xl font-medium leading-tight text-white sm:text-4xl md:text-5xl lg:leading-[1.2]">
          "Being a mentor with SharingMinds has allowed me to make a <span className="text-indigo-400">real impact</span> on the next generation of startup founders."
        </blockquote>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 blur"></div>
            <img
              src="/placeholder.svg?key=harish"
              alt="Harish Iyer"
              loading="lazy"
              className="relative h-16 w-16 rounded-full border-2 border-slate-900 object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="text-lg font-semibold text-white">Harish Iyer</div>
            <div className="text-slate-400">Startup & Scaling Consultant</div>
          </div>
        </div>
      </div>
    </section>
  )
}