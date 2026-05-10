import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
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

  useEffect(() => {
    if (tools && tools.length > 0 && !clientSummary && !summaryLoading && !summaryError) {
      const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
      const totalSavings = tools.reduce((sum, t) => sum + t.monthlySavings, 0);
      const recommendations = tools.map(t => ({
        toolKey: t.toolName,
        currentPlan: "Current Plan", // Fallback if not mapped
        suggestedPlan: t.recommendedPlan,
        monthlySavings: t.monthlySavings
      }));

      generateSummary({ totalSpend, totalSavings, recommendations });
    }
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
                <h2 className="text-2xl font-bold mb-3">{error.includes("Missing") ? "No Report Found" : "Audit Error"}</h2>
                <p className="text-muted-foreground mb-8">
                  {error.includes("Missing")
                    ? "We couldn't find an audit report associated with this link. You might need to run a new audit first."
                    : error}
                </p>
                <Button variant="hero" asChild>
                  <Link to="/audit">Run New Audit</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ResultsHeroSection monthly={monthly} yearly={yearly} reductionPct={reductionPct} />
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
