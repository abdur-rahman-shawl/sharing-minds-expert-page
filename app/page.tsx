import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen space-y-16">
      <HeroSection />
      <BenefitsSection />
      <TestimonialSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
