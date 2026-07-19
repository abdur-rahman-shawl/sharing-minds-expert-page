import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { TrustedEcosystemStrip } from "@/components/trusted-ecosystem-strip"
import { VerificationSection } from "@/components/verification-section"

export default function Page() {
  return (
    // Removed space-y-12. Added a seamless background base.
    <div className="min-h-screen w-full bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <HeroSection />
      <TrustedEcosystemStrip />
      <VerificationSection />
      <BenefitsSection />
      <TestimonialSection />
      <FinalCTASection />
    </div>
  )
}
