import { useEffect, useMemo, useState } from "react";
import { sendAuditEmailApi, type SharedAuditResponse } from "@/lib/audit-api";
import { fetchAuditForDisplay } from "@/lib/report-loader";

export type SpendTrendPoint = {
  m: string;
  current: number;
  optimized: number;
};

export type ToolRecommendation = {
  toolName: string;
  currentPlan: string;
  current: number;
  recommended: number;
  monthlySpend: number;
  recommendedPlan: string;
  monthlySavings: number;
  reason: string;
  severity: "high" | "medium" | "low";
  recommendationType?: string;
  source?: string;
  sourceUrl?: string;
};

export function useResultsPage(shareId?: string) {
  const [copied, setCopied] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState<SharedAuditResponse | null>(null);

  const trimmedShareId = shareId?.trim() ?? "";

  useEffect(() => {
    if (!trimmedShareId) {
      setAudit(null);
      setError("");
      setLoading(false);
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await fetchAuditForDisplay(trimmedShareId);
        if (mounted) {
          setAudit(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load audit.");
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
  }, [trimmedShareId]);

  const monthly = audit?.totalMonthlySavings ?? 0;
  const yearly = audit?.totalAnnualSavings ?? 0;
  const totalSpend = audit?.totalMonthlySpend ?? 0;
  const reductionPct = totalSpend ? Math.round((monthly / totalSpend) * 100) : 0;

  const tools: ToolRecommendation[] = useMemo(
    () =>
      (audit?.tools ?? []).map((tool) => ({
        toolName: tool.toolName,
        currentPlan: tool.currentPlan,
        current: tool.monthlySpend,
        recommended: Math.max(0, tool.monthlySpend - tool.monthlySavings),
        monthlySpend: tool.monthlySpend,
        recommendedPlan: tool.recommendedPlan,
        monthlySavings: tool.monthlySavings,
        reason: tool.reason,
        recommendationType: tool.recommendationType ?? "keep_plan",
        source: tool.source,
        sourceUrl: tool.sourceUrl,
        severity:
          tool.monthlySavings >= 200
            ? "high"
            : tool.monthlySavings >= 80
              ? "medium"
              : "low",
      })),
    [audit]
  );

  const trend: SpendTrendPoint[] = useMemo(() => {
    const baseline = totalSpend;
    const optimized = Math.max(0, totalSpend - monthly);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, i) => {
      const slope = 1 + i * 0.06;
      return {
        m,
        current: Math.round(baseline * slope),
        optimized: Math.round(optimized * slope),
      };
    });
  }, [monthly, totalSpend]);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
  const shareUrl = trimmedShareId ? `${origin}/report/${encodeURIComponent(trimmedShareId)}` : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!audit?.auditId) {
      setEmailStatus("Audit data missing.");
      return;
    }
    if (!email) {
      setEmailStatus("Please enter an email.");
      return;
    }

    try {
      setSendingEmail(true);
      setEmailStatus("");
      await sendAuditEmailApi({ auditId: audit.auditId, email });
      setEmailStatus("Report emailed successfully.");
    } catch (err) {
      setEmailStatus(err instanceof Error ? err.message : "Unable to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  return {
    copied,
    leadOpen,
    monthly,
    yearly,
    reductionPct,
    trend,
    tools,
    shareUrl,
    shareId: trimmedShareId,
    aiSummary: audit?.aiSummary || "",
    usageIntensity: audit?.usageIntensity ?? "medium",
    pricingLastUpdated: audit?.pricingLastUpdated,
    loading,
    error,
    email,
    emailStatus,
    sendingEmail,
    setLeadOpen,
    setEmail,
    handleCopy,
    handleSendEmail,
  };
}
