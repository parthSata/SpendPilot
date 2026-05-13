import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AuroraBackground } from "@/components/site/Background";
import { useLandingPage } from "@/hooks/useLandingPage";
import { HeroSection } from "@/components/features/home/components/HeroSection";
import { TrustBarSection } from "@/components/features/home/components/TrustBarSection";
import { DashboardPreviewSection } from "@/components/features/home/components/DashboardPreviewSection";
import { HowItWorksSection } from "@/components/features/home/components/HowItWorksSection";
import { SavingsExamplesSection } from "@/components/features/home/components/SavingsExamplesSection";
import { FaqSection } from "@/components/features/home/components/FaqSection";
import { CtaSection } from "@/components/features/home/components/CtaSection";
import { SavedReportsSection } from "@/components/features/home/components/SavedReportsSection";

export function LandingPage() {
  const {
    tools,
    toolPositions,
    stats,
    flowSteps,
    savingsExamples,
    faqs,
    openFaq,
    toggleFaq,
  } = useLandingPage();

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />
      <HeroSection tools={tools} toolPositions={toolPositions} />
      <TrustBarSection stats={stats} />
      <SavedReportsSection />
      <DashboardPreviewSection />
      <HowItWorksSection flowSteps={flowSteps} />
      <SavingsExamplesSection savingsExamples={savingsExamples} />
      <FaqSection faqs={faqs} openFaq={openFaq} toggleFaq={toggleFaq} />
      <CtaSection />
      <Footer />
    </div>
  );
}
