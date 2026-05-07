import { Navbar } from "@/components/site/Navbar";
import { AuroraBackground } from "@/components/site/Background";
import { LeadModal } from "@/components/site/LeadModal";
import { useResultsPage } from "@/hooks/useResultsPage";
import { ResultsHeroSection } from "@/components/features/results/components/ResultsHeroSection";
import { AiSummarySection } from "@/components/features/results/components/AiSummarySection";
import { ResultsChartsSection } from "@/components/features/results/components/ResultsChartsSection";
import { ToolRecommendationsSection } from "@/components/features/results/components/ToolRecommendationsSection";
import { ResultsCtaSection } from "@/components/features/results/components/ResultsCtaSection";

export function ResultsPage() {
  const {
    copied,
    leadOpen,
    monthly,
    yearly,
    trend,
    tools,
    shareUrl,
    setLeadOpen,
    handleCopy,
  } = useResultsPage();

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />

      <div className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <ResultsHeroSection monthly={monthly} yearly={yearly} />
          <AiSummarySection />
          <ResultsChartsSection trend={trend} tools={tools} />
          <ToolRecommendationsSection tools={tools} />
          <ResultsCtaSection
            copied={copied}
            shareUrl={shareUrl}
            onCopy={() => void handleCopy()}
            onOpenLeadModal={() => setLeadOpen(true)}
          />
        </div>
      </div>
    </div>
  );
}
