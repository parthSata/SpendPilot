import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { AuroraBackground } from "@/components/site/Background";
import { LeadModal } from "@/components/site/LeadModal";
import { useResultsPage } from "@/hooks/useResultsPage";
import { ResultsHeroSection } from "@/components/features/results/components/ResultsHeroSection";
import { AiSummarySection } from "@/components/features/results/components/AiSummarySection";
import { ResultsChartsSection } from "@/components/features/results/components/ResultsChartsSection";
import { ToolRecommendationsSection } from "@/components/features/results/components/ToolRecommendationsSection";
import { ResultsCtaSection } from "@/components/features/results/components/ResultsCtaSection";
import useAISummary from "@/hooks/useAISummary";
import { getLatestStoredShareId } from "@/lib/audit-local-storage";
import { SAMPLE_SHARE_ID } from "@/lib/sample-audit";

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
    usageIntensity,
    pricingLastUpdated,
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

  const { summary: clientSummary, isLoading: summaryLoading, error: summaryError, generateSummary } = useAISummary();

  const [latestLocalShareId, setLatestLocalShareId] = useState<string | null>(null);
  useEffect(() => {
    setLatestLocalShareId(getLatestStoredShareId());
  }, [resolvedShareId]);

  useEffect(() => {
    if (!tools?.length || clientSummary || summaryLoading || summaryError) {
      return undefined;
    }

    const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
    const totalSavings = tools.reduce((sum, t) => sum + t.monthlySavings, 0);
    const recommendations = tools.map((t) => ({
      toolName: t.toolName,
      toolKey: t.toolName,
      currentPlan: t.currentPlan,
      suggestedPlan: t.recommendedPlan,
      monthlySavings: t.monthlySavings,
      recommendationType: t.recommendationType ?? "keep_plan",
    }));

    const id = window.setTimeout(() => {
      void generateSummary({ totalSpend, totalSavings, recommendations });
    }, 400);
    return () => window.clearTimeout(id);
  }, [tools, clientSummary, summaryLoading, summaryError, generateSummary]);

  const displaySummary = summaryLoading ? "Generating fresh AI summary directly in your browser..." : (clientSummary || aiSummary);

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />

      <div className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="glass-strong rounded-3xl p-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-t-electric animate-spin" />
                <div className="text-xl font-medium text-muted-foreground">Analyzing your spend...</div>
              </div>
            </div>
          ) : error ? (
            <div className="glass-strong rounded-3xl p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-destructive/10 rounded-full grid place-items-center mx-auto mb-6">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">Audit Error</h2>
                <p className="text-muted-foreground mb-8">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="hero" asChild>
                    <Link to="/audit">Run New Audit</Link>
                  </Button>
                  <Button variant="glass" asChild>
                    <Link to="/results" search={{ shareId: SAMPLE_SHARE_ID }}>
                      Open sample report
                    </Link>
                  </Button>
                  {latestLocalShareId ? (
                    <Button variant="outline" asChild className="border-white/20 bg-white/5">
                      <Link to="/results" search={{ shareId: latestLocalShareId }}>
                        Try saved copy
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ResultsHeroSection
                monthly={monthly}
                yearly={yearly}
                reductionPct={reductionPct}
                usageIntensity={usageIntensity}
              />
              <AiSummarySection summary={displaySummary} />
              <ResultsChartsSection trend={trend} tools={tools} />
              <ToolRecommendationsSection tools={tools} />
              
              {pricingLastUpdated && (
                <div className="mt-8 text-center text-xs text-muted-foreground">
                  <span>Pricing data last updated: {new Date(pricingLastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}

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
