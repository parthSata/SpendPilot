import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PRICING_DATA,
  calculateBreakdowns,
  ToolSelection,
  getRecommendations,
  getTotalSavings,
} from "@/lib/pricing/pricing";
import { runAuditApi } from "@/lib/audit-api";
import { saveAuditReport } from "@/lib/audit-local-storage";

export interface ToolSelectionState {
  plan: string;
  seats: number;
  /** When set, total monthly spend for this tool (assignment: declared actual spend). */
  monthlySpendActual: number | null;
}

export type SelectedTools = Record<string, ToolSelectionState>;

export const AUDIT_STEPS = ["Tools", "Team", "Use case", "Review"] as const;

/** Primary use case labels aligned with the assignment brief. */
export const USE_CASES = [
  { id: "coding", title: "Coding", desc: "Code generation, reviews, debugging, CI" },
  { id: "writing", title: "Writing", desc: "Docs, marketing, internal comms" },
  { id: "data", title: "Data", desc: "Analysis, SQL, spreadsheets, dashboards" },
  { id: "research", title: "Research", desc: "Deep dives, synthesis, competitive intel" },
  { id: "mixed", title: "Mixed", desc: "Several of the above at similar weight" },
] as const;

export function useAuditFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<SelectedTools>({
    chatgpt: { plan: "plus", seats: 5, monthlySpendActual: null },
    cursor: { plan: "pro", seats: 5, monthlySpendActual: null },
  });
  const [teamSize, setTeamSize] = useState(10);
  const [useCase, setUseCase] = useState("coding");
  const [usageIntensity, setUsageIntensity] = useState<"light" | "medium" | "heavy">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  /** Honeypot — must remain empty for the audit request to succeed. */
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");

  const breakdowns = useMemo(() => {
    const selections: ToolSelection[] = Object.entries(selected).map(([toolKey, state]) => ({
      toolKey,
      plan: state.plan,
      seats: state.seats,
      monthlySpendActual: state.monthlySpendActual,
    }));
    return calculateBreakdowns(selections, teamSize);
  }, [selected, teamSize]);

  const total = useMemo(() => breakdowns.reduce((sum, b) => sum + b.totalMonthly, 0), [breakdowns]);

  const estSavings = useMemo(() => {
    const recommendations = getRecommendations(breakdowns, { teamSize, usageIntensity });
    return getTotalSavings(recommendations);
  }, [breakdowns, teamSize, usageIntensity]);

  const next = async () => {
    if (step < AUDIT_STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const toolsPayload = breakdowns.map((b) => ({
        toolName: PRICING_DATA[b.toolKey as keyof typeof PRICING_DATA]?.label || b.toolKey,
        currentPlan: b.plan,
        monthlySpend: b.totalMonthly,
        seats: b.seats,
      }));

      const response = await runAuditApi({
        teamSize,
        primaryUseCase: useCase as "coding" | "writing" | "research" | "data" | "mixed",
        usageIntensity,
        tools: toolsPayload,
        website: websiteHoneypot,
      });

      saveAuditReport({
        ...response.data,
        views: 0,
        createdAt: new Date().toISOString(),
      });

      void navigate({
        to: "/results",
        search: { shareId: response.data.shareId },
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to run audit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return {
    step,
    selected,
    teamSize,
    useCase,
    usageIntensity,
    total,
    estSavings,
    steps: AUDIT_STEPS,
    useCases: USE_CASES,
    websiteHoneypot,
    setSelected,
    setTeamSize,
    setUseCase,
    setUsageIntensity,
    setWebsiteHoneypot,
    next,
    prev,
    isSubmitting,
    submitError,
  };
}
