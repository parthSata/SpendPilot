import { Navbar } from "@/components/site/Navbar";
import { AuroraBackground } from "@/components/site/Background";
import { LeadModal } from "@/components/site/LeadModal";
import { useResultsPage } from "@/hooks/useResultsPage";
import { ResultsHeroSection } from "@/components/features/results/components/ResultsHeroSection";
import { AiSummarySection } from "@/components/features/results/components/AiSummarySection";
import { ResultsChartsSection } from "@/components/features/results/components/ResultsChartsSection";
import { ToolRecommendationsSection } from "@/components/features/results/components/ToolRecommendationsSection";
import { ResultsCtaSection } from "@/components/features/results/components/ResultsCtaSection";

type ResultsPageProps = {
  shareId?: string;
};

export function ResultsPage({ shareId }: ResultsPageProps) {
  const {
    copied,
    leadOpen,
    monthly,
    yearly,
    reductionPct,
    trend,
    tools,
    shareUrl,
    aiSummary,
    loading,
    error,
    email,
    emailStatus,
    sendingEmail,
    setEmail,
    handleSendEmail,
    shareId: resolvedShareId,
    setLeadOpen,
    handleCopy,
  } = useResultsPage(shareId);

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />

      <div className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="glass-strong rounded-2xl p-8 text-center text-muted-foreground">Loading results...</div>
          ) : error ? (
            <div className="glass-strong rounded-2xl p-8 text-center text-destructive">{error}</div>
          ) : (
            <>
              <ResultsHeroSection monthly={monthly} yearly={yearly} reductionPct={reductionPct} />
              <AiSummarySection summary={aiSummary} />
              <ResultsChartsSection trend={trend} tools={tools} />
              <ToolRecommendationsSection tools={tools} />
              <ResultsCtaSection
                copied={copied}
                shareUrl={shareUrl}
                shareId={resolvedShareId}
                email={email}
                emailStatus={emailStatus}
                sendingEmail={sendingEmail}
                onCopy={() => void handleCopy()}
                onEmailChange={setEmail}
                onSendEmail={() => void handleSendEmail()}
                onOpenLeadModal={() => setLeadOpen(true)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
