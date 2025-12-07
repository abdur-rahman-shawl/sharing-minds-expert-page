"use client"

import { CheckCircle2, LayoutDashboard, Users, UserCircle, ArrowRight } from "lucide-react"
import { FinalCTASection } from "@/components/final-cta-section"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Button } from "@/components/ui/button"

export default function ServicePageClient() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2)
  const { ref: dashboardRef, isVisible: dashboardVisible } = useScrollAnimation(0.2)
  const { ref: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation(0.2)
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation(0.1)
  const { ref: whyChooseRef, isVisible: whyChooseVisible } = useScrollAnimation(0.1)
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation(0.1)

  const features = [
    {
      title: "Professional Mentor Profile",
      description:
        "Easily create a professional mentor profile to showcase your expertise and experience to potential mentees. Your digital portfolio of leadership.",
      image: "/images/professional-mentor.jpg",
      alt: "Professional mentor in office setting",
      icon: UserCircle
    },
    {
      title: "Mentor-Mentee Connection",
      description:
        "Engage and connect with mentees looking for guidance. Our algorithm ensures meaningful chemistry and domain alignment.",
      image: "/images/mentor-connection.jpg",
      alt: "Mentor-mentee connection",
      icon: Users
    },
    {
      title: "Personalized Dashboard Access",
      description:
        "Access a personalized dashboard to manage your mentorship activities, upload content, and track your progress with data-driven insights.",
      image: "/images/leadership-dashboard.jpg",
      alt: "Personalized dashboard interface",
      icon: LayoutDashboard
    },
  ]

  const featureCardRefs = features.map(() => useScrollAnimation(0.2))

  const whyChooseItems = [
    "Verified experts only",
    "Outcome‑oriented sessions",
    "Flexible scheduling",
    "Transparent pricing",
    "Private & secure",
    "Follow‑ups & notes",
  ]
  const whyChooseCardRefs = whyChooseItems.map(() => useScrollAnimation(0.1))

  const faqItems = [
    {
      q: "How are mentors vetted?",
      a: "Every expert goes through profile verification, domain checks, and trial sessions before joining. We ensure high trust and high quality.",
    },
    {
      q: "Can I reschedule a session?",
      a: "Yes — with flexible rescheduling and automatic timezone support via our seamless calendar integrations.",
    },
    {
      q: "Do you support ongoing mentorship?",
      a: "Absolutely. You can book recurring sessions, set long-term goals, and pick up exactly where you left off.",
    },
  ]
  const faqCardRefs = faqItems.map(() => useScrollAnimation(0.1))

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section
        ref={heroRef}
        // CHANGED: Reduced pt-32/pt-40/pt-48 to pt-24/pt-32/pt-36 to bring text up
        className="relative flex flex-col justify-center pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden"
      >
        {/* Background System */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-white"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] -z-10 bg-indigo-200/20 blur-[100px] rounded-[50%] pointer-events-none mix-blend-multiply"></div>

        <div 
          className={`max-w-5xl mx-auto text-center px-4 transition-all duration-1000 ease-out ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white/60 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur-sm mb-6 shadow-sm ring-1 ring-white/50">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            Our Services
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl drop-shadow-sm">
            Mentorship <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Made Easy</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
            Join SharingMinds as a mentor to empower and guide young minds towards success using our premium suite of tools.
          </p>

          <div className="mt-8">
            <Button className="h-12 px-8 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:scale-105 transition-all duration-300 group">
              Start Your Journey <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD PREVIEW --- */}
      <section
        ref={dashboardRef}
        className={`px-4 pb-24 sm:px-6 lg:px-8 -mt-8 relative z-10 transition-all duration-1000 delay-200 ${
          dashboardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Browser Window Effect */}
          <div className="relative rounded-2xl border border-slate-200/60 bg-white/50 shadow-2xl backdrop-blur-sm p-2 ring-1 ring-slate-900/5">
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/80 border-b border-slate-100 rounded-t-xl flex items-center px-4 gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden mt-8 shadow-inner bg-slate-100 aspect-[16/10]">
               {/* Replace with actual image */}
              <Image
                src="/images/dashboard-mockup.jpg"
                alt="Mentorship Dashboard showing analytics and team members"
                fill
                className="object-cover object-top"
              />
               {/* Placeholder fallback if image missing */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center -z-10">
                 <span className="text-slate-400 font-medium">Dashboard Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DESCRIPTION --- */}
      <section
        ref={descriptionRef}
        className={`px-4 py-20 relative transition-all duration-1000 ${
          descriptionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="absolute inset-0 bg-white skew-y-1 -z-10 shadow-sm border-y border-slate-100/50"></div>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
            "SharingMinds Mentor Onboarding software provides a <span className="font-semibold text-indigo-600">seamless experience</span> for mentors to create profiles,
            connect with mentees, and efficiently manage their mentoring relationships."
          </p>
        </div>
      </section>

      {/* --- FEATURE CARDS --- */}
      <section ref={featuresRef} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          {features.map((feature, index) => {
            const { ref, isVisible } = featureCardRefs[index]
            const Icon = feature.icon

            return (
              <div
                key={index}
                ref={ref}
                className={`flex flex-col gap-12 lg:gap-20 items-center ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                {/* Visual Side */}
                <div className="flex-1 w-full group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-slate-200 shadow-2xl shadow-indigo-500/10">
                    <div className="absolute inset-0 bg-slate-200 animate-pulse -z-10" />
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-6 left-6 h-14 w-14 rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-indigo-600">
                        <Icon className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest">
                    Feature 0{index + 1}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">{feature.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed border-l-2 border-indigo-100 pl-6">
                    {feature.description}
                  </p>
                  <Button variant="link" className="text-indigo-600 p-0 h-auto font-semibold group">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section
        ref={whyChooseRef}
        className="px-4 py-24 bg-slate-900 text-white relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose SharingMinds</h2>
            <p className="text-indigo-200 text-lg">Experience the difference of a platform built for excellence.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseItems.map((item, index) => {
              const { ref, isVisible } = whyChooseCardRefs[index]
              return (
                <div
                  key={item}
                  ref={ref}
                  className={`group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-indigo-500/50 hover:-translate-y-1 ${
                    isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-indigo-300 group-hover:text-white" />
                  </div>
                  <p className="font-medium text-lg text-slate-100">{item}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section
        ref={faqRef}
        className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-50"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => {
              const { ref, isVisible } = faqCardRefs[index]
              return (
                <div
                  key={item.q}
                  ref={ref}
                  className={`rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-md hover:border-indigo-200 ${
                    isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    {item.q}
                  </h4>
                  <p className="text-slate-600 leading-relaxed pl-3.5 border-l border-slate-100">{item.a}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  )
}