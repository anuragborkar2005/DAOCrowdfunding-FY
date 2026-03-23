import { HeroSection } from "@/components/landing/hero-section"

import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"
import { FeaturesSection } from "@/components/landing/featured-section"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
