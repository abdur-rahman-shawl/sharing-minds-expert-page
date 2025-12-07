'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Mail, MessageSquare, Clock, ArrowRight, MapPin } from "lucide-react"

export default function ContactPageClient() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2)
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.2)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* --- BACKGROUND SYSTEM --- */}
      {/* Base Gradient */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50 to-white"></div>
      
      {/* Technical Grid - Modified Mask to hide grid at the very top */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)]"></div>

      {/* --- HERO SECTION --- */}
      <section
        ref={heroRef}
        // Reduced padding-top (pt-24/32) to remove excess whitespace
        className={`relative px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:pt-32 transition-all duration-1000 ease-out ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white/60 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur-sm mb-6 shadow-sm ring-1 ring-white/50">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            Contact Us
          </div>
          
          {/* More Professional / High-Ticket Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl drop-shadow-sm mb-6">
            Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SharingMinds</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed font-light">
            Concierge support for the Founding Mentor Cohort, strategic partnerships, and category-defining experts.
          </p>
        </div>
      </section>

      {/* --- CONTENT GRID --- */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div 
          ref={contentRef}
          className={`mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 transition-all duration-1000 delay-200 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          
          {/* LEFT: Contact Form Card */}
          <div className="relative rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-indigo-500/10 p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Send an Inquiry</h2>
              <p className="text-slate-500 mt-2">Submit your details below. Our team will prioritize your request.</p>
            </div>
            
            <form className="space-y-6" method="post">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Name</Label>
                  <Input id="name" name="name" placeholder="Full Name" className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Work Email</Label>
                  <Input id="email" name="email" type="email" placeholder="name@company.com" className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500/20" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                <Input id="subject" name="subject" placeholder="Founding Mentor Application..." className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-500/20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="How can we assist you?" 
                  rows={6} 
                  className="bg-slate-50 border-slate-200 resize-none focus:ring-indigo-500/20" 
                />
              </div>

              <Button className="group relative w-full h-12 overflow-hidden rounded-xl bg-slate-900 text-white shadow-lg transition-all duration-300 hover:bg-slate-800 hover:shadow-indigo-500/25 hover:scale-[1.01]">
                 <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                   Submit Inquiry <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                 </span>
                 <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-1000 ease-in-out" />
              </Button>
            </form>
          </div>

          {/* RIGHT: Info Cards */}
          <div className="flex flex-col gap-6 lg:pt-8">
            
            {/* Info Card 1: Email */}
            <div className="group rounded-2xl border border-white/60 bg-white/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Direct Inquiries</h3>
                  <p className="text-slate-600 mt-1 mb-2 text-sm leading-relaxed">
                    For partnerships and mentor support.
                  </p>
                  <a href="mailto:hello@sharingminds.example" className="text-indigo-600 font-medium hover:underline">
                    hello@sharingminds.example
                  </a>
                </div>
              </div>
            </div>

            {/* Info Card 2: Support */}
            <div className="group rounded-2xl border border-white/60 bg-white/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Platform Support</h3>
                  <p className="text-slate-600 mt-1 mb-2 text-sm leading-relaxed">
                    Technical assistance for onboarding.
                  </p>
                  <a href="mailto:support@sharingminds.example" className="text-purple-600 font-medium hover:underline">
                    support@sharingminds.example
                  </a>
                </div>
              </div>
            </div>

            {/* Info Card 3: Hours */}
            <div className="group rounded-2xl border border-white/60 bg-white/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Concierge Hours</h3>
                  <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                    Monday - Friday <br/>
                    9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>

             {/* Decorative Map/Location Placeholder */}
            <div className="relative mt-auto h-48 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100 group">
                {/* Simulated Map Pattern */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale contrast-50"></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-bold text-slate-800">Bangalore, India</span>
                </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}