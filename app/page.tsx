import { AudienceCtaSection } from "@/components/audience-cta-section"
import { HeroSection } from "@/components/hero-section"
import { EngagementSection } from "@/components/engagement-section"
import { LeverageLayerSection } from "@/components/leverage-layer-section"
import { PositioningSection } from "@/components/positioning-section"
import { EvaluationCriteriaSection } from "@/components/evaluation-criteria-section"
import { SystemWorksSection } from "@/components/system-works-section"
import { TrustActivationSection } from "@/components/trust-activation-section"
import { ValueStackSection } from "@/components/value-stack-section"

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-slate-50 selection:bg-[#e8b572] selection:text-[#06182a]">
      <HeroSection />
      <PositioningSection />
      <LeverageLayerSection />
      <EngagementSection />
      <SystemWorksSection />
      <EvaluationCriteriaSection />
      <ValueStackSection />
      <TrustActivationSection />
      <AudienceCtaSection />
    </div>
  )
}
