import { HeroSection } from "@/components/hero-section"
import { EngagementSection } from "@/components/engagement-section"
import { LeverageLayerSection } from "@/components/leverage-layer-section"
import { PositioningSection } from "@/components/positioning-section"
import { PositioningOutcomesSection } from "@/components/positioning-outcomes-section"
import { SystemWorksSection } from "@/components/system-works-section"
import { ValueStackSection } from "@/components/value-stack-section"

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-slate-50 selection:bg-[#e8b572] selection:text-[#06182a]">
      <HeroSection />
      <PositioningSection />
      <LeverageLayerSection />
      <EngagementSection />
      <SystemWorksSection />
      <PositioningOutcomesSection />
      <ValueStackSection />
    </div>
  )
}
