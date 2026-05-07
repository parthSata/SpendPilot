import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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

  const total = useMemo(() => {
    const selectedTotal = Object.values(selected).reduce((sum, price) => sum + price, 0);
    const multiplier = useCase === "api" ? 1 : teamSize / 2;
    return selectedTotal * multiplier;
  }, [selected, teamSize, useCase]);

  const estSavings = useMemo(() => Math.round(total * 0.38), [total]);

  const next = () => {
    if (step < AUDIT_STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    void navigate({ to: "/results" });
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
  };
}
