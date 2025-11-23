'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function ContactPageClient() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2)
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.2)
  const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation(0.2)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section
        ref={heroRef}
        className={`relative overflow-hidden px-4 pt-10 pb-14 animate-on-scroll will-change-opacity sm:px-6 sm:pt-14 sm:pb-20 ${
          heroVisible ? "animate-fade-in-slow" : ""
        }`}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">Contact</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">We&apos;d love to hear from you. Send us a message.</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          <div
            ref={formRef}
            className={`rounded-xl border border-gray-200 bg-white p-6 animate-on-scroll will-change-opacity sm:p-8 ${
              formVisible ? "animate-fade-in-up" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-900">Send a message</h2>
            <form className="mt-6 space-y-5" method="post">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="How can we help?" rows={6} />
              </div>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Submit</Button>
            </form>
          </div>

          <div
            ref={infoRef}
            className={`rounded-xl border border-gray-200 bg-white p-6 animate-on-scroll will-change-opacity sm:p-8 ${
              infoVisible ? `animate-fade-in-up animate-delay-100` : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-900">Contact information</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                Email:{" "}
                <a href="mailto:hello@sharingminds.example" className="text-blue-600 hover:underline">
                  hello@sharingminds.example
                </a>
              </p>
              <p>
                Support:{" "}
                <a href="mailto:support@sharingminds.example" className="text-blue-600 hover:underline">
                  support@sharingminds.example
                </a>
              </p>
              <p>Hours: Mon-Fri, 9:00-18:00 IST</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
