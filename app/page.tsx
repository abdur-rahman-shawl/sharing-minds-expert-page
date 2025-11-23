import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { FinalCTASection } from "@/components/final-cta-section"

export default function Page() {
  return (
    <div className="min-h-screen space-y-12 sm:space-y-16">
      <HeroSection />
      <BenefitsSection />
      <TestimonialSection />
      <FinalCTASection />
    </div>
  )
}
