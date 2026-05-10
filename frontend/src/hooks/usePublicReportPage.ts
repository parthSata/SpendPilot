import { useEffect, useMemo, useState } from "react";
import { getSharedAuditApi, type SharedAuditResponse } from "@/lib/audit-api";

export type PublicReportTool = {
  toolName: string;
  emoji: string;
  monthlySavings: number;
  recommendedPlan: string;
};

export function usePublicReportPage(shareId?: string) {
  const [report, setReport] = useState<SharedAuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shareId) {
      setError("Missing report id. Run audit first.");
      setLoading(false);
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getSharedAuditApi(shareId);
        if (mounted) {
          setReport(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load report.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [shareId]);

  const monthlySavings = report?.totalMonthlySavings ?? 0;
  const annualSavings = report?.totalAnnualSavings ?? 0;
  const reductionPct = report?.totalMonthlySpend
    ? Math.round((monthlySavings / report.totalMonthlySpend) * 100)
    : 0;

  const topTools = useMemo<PublicReportTool[]>(
    () =>
      [...(report?.tools ?? [])]
        .sort((a, b) => b.monthlySavings - a.monthlySavings)
        .slice(0, 4)
        .map((tool) => ({
          toolName: tool.toolName,
          emoji: (tool as any).emoji || "🤖",
          monthlySavings: tool.monthlySavings,
          recommendedPlan: tool.recommendedPlan,
        })),
    [report]
  );

  return {
    report,
    loading,
    error,
    monthlySavings,
    annualSavings,
    reductionPct,
    topTools,
    pricingLastUpdated: report?.pricingLastUpdated,
  };
}
