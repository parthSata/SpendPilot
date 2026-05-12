import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PRICING_DATA, getPrice, calculateBreakdowns, ToolSelection, getRecommendations, getTotalSavings } from "@/lib/pricing/pricing";
import { runAuditApi } from "@/lib/audit-api";

export interface ToolSelectionState {
  plan: string;
  seats: number;
}

export type SelectedTools = Record<string, ToolSelectionState>;

export const AUDIT_STEPS = ["Tools", "Team", "Use case", "Review"] as const;

export const USE_CASES = [
  { id: "engineering", title: "Engineering", desc: "Code generation, reviews, debugging" },
  { id: "product", title: "Product & design", desc: "Specs, research, prototyping" },
  { id: "api", title: "API / production", desc: "LLM-powered features in your app" },
  { id: "ops", title: "Ops & marketing", desc: "Content, support, automation" },
] as const;

export function useAuditFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<SelectedTools>({
    chatgpt: { plan: "plus", seats: 5 },
    cursor: { plan: "pro", seats: 5 },
  });
  const [teamSize, setTeamSize] = useState(10);
  const [useCase, setUseCase] = useState("engineering");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const breakdowns = useMemo(() => {
    const selections: ToolSelection[] = Object.entries(selected).map(([toolKey, state]) => ({
      toolKey,
      plan: state.plan,
      seats: state.seats,
    }));
    return calculateBreakdowns(selections, teamSize);
  }, [selected, teamSize]);

  const total = useMemo(() => breakdowns.reduce((sum, b) => sum + b.totalMonthly, 0), [breakdowns]);
  
  const estSavings = useMemo(() => {
    const recommendations = getRecommendations(breakdowns);
    return getTotalSavings(recommendations);
  }, [breakdowns]);

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

      const mappedUseCase =
        useCase === "engineering"
          ? "coding"
          : useCase === "product"
            ? "writing"
            : useCase === "api"
              ? "data"
              : "mixed";

      const response = await runAuditApi({
        teamSize,
        primaryUseCase: mappedUseCase,
        tools: toolsPayload,
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
    total,
    estSavings,
    steps: AUDIT_STEPS,
    useCases: USE_CASES,
    setSelected,
    setTeamSize,
    setUseCase,
    next,
    prev,
    isSubmitting,
    submitError,
  };
}
