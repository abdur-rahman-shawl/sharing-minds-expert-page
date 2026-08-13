import { AudienceCtaSection } from "@/components/audience-cta-section"
import { HeroSection } from "@/components/hero-section"
import { EngagementSection } from "@/components/engagement-section"
import { PositioningSection } from "@/components/positioning-section"
import { EvaluationCriteriaSection } from "@/components/evaluation-criteria-section"

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-slate-50 selection:bg-[#e8b572] selection:text-[#06182a]">
      <HeroSection />
      <PositioningSection />
      <EngagementSection />
      <EvaluationCriteriaSection />
      <AudienceCtaSection />
    </div>
  )
}
