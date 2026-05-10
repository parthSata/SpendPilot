import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AI_TOOLS } from "@/lib/tools";
import { runAuditApi } from "@/lib/audit-api";

export type SelectedTools = Record<string, number>;

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
  const [selected, setSelected] = useState<SelectedTools>({ chatgpt: 20, cursor: 20 });
  const [teamSize, setTeamSize] = useState(8);
  const [useCase, setUseCase] = useState("engineering");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const total = useMemo(() => {
    const selectedTotal = Object.values(selected).reduce((sum, price) => sum + price, 0);
    const multiplier = useCase === "api" ? 1 : teamSize / 2;
    return selectedTotal * multiplier;
  }, [selected, teamSize, useCase]);

  const estSavings = useMemo(() => Math.round(total * 0.38), [total]);

  const next = async () => {
    if (step < AUDIT_STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const multiplier = useCase === "api" ? 1 : teamSize / 2;
      const toolsPayload = Object.entries(selected).map(([toolId, monthlySpend]) => {
        const tool = AI_TOOLS.find((item) => item.id === toolId);
        return {
          toolName: toolId,
          currentPlan: "Pro",
          monthlySpend: Math.round(monthlySpend * multiplier),
          seats: Math.max(1, useCase === "api" ? 1 : Math.round(teamSize / 2)),
        };
      });

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
