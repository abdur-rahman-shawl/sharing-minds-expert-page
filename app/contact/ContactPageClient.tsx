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
        className={`relative py-20 px-4 overflow-hidden animate-on-scroll will-change-opacity ${
          heroVisible ? "animate-fade-in-slow" : ""
        }`}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact</h1>
          <p className="mt-4 text-lg text-gray-600">We’d love to hear from you. Send us a message.</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-2">
          <div
            ref={formRef}
            className={`rounded-xl border border-gray-200 p-6 bg-white animate-on-scroll will-change-opacity ${
              formVisible ? "animate-fade-in-up" : ""
            }`}
          >
            <h2 className="text-xl font-semibold">Send a message</h2>
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Submit</Button>
            </form>
          </div>

          <div
            ref={infoRef}
            className={`rounded-xl border border-gray-200 p-6 bg-white animate-on-scroll will-change-opacity ${
              infoVisible ? `animate-fade-in-up animate-delay-100` : ""
            }`}
          >
            <h2 className="text-xl font-semibold">Contact information</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                Email: <a href="mailto:hello@sharingminds.example" className="text-blue-600 hover:underline">hello@sharingminds.example</a>
              </p>
              <p>
                Support: <a href="mailto:support@sharingminds.example" className="text-blue-600 hover:underline">support@sharingminds.example</a>
              </p>
              <p>Hours: Mon–Fri, 9:00–18:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
