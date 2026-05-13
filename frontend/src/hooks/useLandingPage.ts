import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Brain, Rocket, Zap } from "lucide-react";
import { PRICING_DATA } from "@/lib/pricing/pricing";

export type FloatingTool = {
  id: string;
  label: string;
  emoji: string;
  color: string;
};
export type LandingStat = { value: number; prefix: string; suffix: string; label: string };
export type LandingFlowStep = { icon: LucideIcon; title: string; desc: string };
export type SavingsExample = { team: string; before: number; after: number; tools: string[] };
export type LandingFaq = { q: string; a: string };

export function useLandingPage() {
  const tools = Object.entries(PRICING_DATA).slice(0, 8).map(([key, t]) => ({
    id: key,
    label: t.label,
    emoji: t.emoji ?? "🤖",
    color: t.color,
  }));
  const toolPositions = [
    "top-10 left-2 md:left-10",
    "top-24 right-2 md:right-12",
    "top-56 left-4 md:left-24",
    "top-72 right-6 md:right-32",
    /* Was centered near top — overlapped the “New · …” pill (Gemini is 5th tool). Keep off-center, lower. */
    "top-[17rem] right-2 md:right-6 lg:top-[18rem]",
    "top-96 left-12 md:left-40",
    "top-[26rem] right-12 md:right-40",
    "top-28 left-[8%] md:left-[12%]",
  ];

  const stats = [
    { value: 12000, prefix: "", suffix: "+", label: "Audits run" },
    { value: 4200000, prefix: "$", suffix: "", label: "Saved for teams" },
    { value: 38, prefix: "", suffix: "%", label: "Average reduction" },
    { value: 120, prefix: "", suffix: "s", label: "Avg audit time" },
  ];

  const flowSteps = [
    { icon: Zap, title: "Connect your stack", desc: "Pick the AI tools and APIs your team uses today. Takes 60 seconds." },
    { icon: Brain, title: "AI analyzes usage", desc: "We benchmark plans, seats, and API tiers against your actual usage." },
    { icon: Rocket, title: "Get your savings plan", desc: "Tool-by-tool recommendations with ROI and migration steps." },
  ];

  const savingsExamples = [
    { team: "10-person startup", before: 1840, after: 1120, tools: ["ChatGPT", "Cursor", "Copilot"] },
    { team: "Series A engineering team", before: 6200, after: 3800, tools: ["Claude", "OpenAI API", "Cursor"] },
    { team: "Solo founder", before: 240, after: 60, tools: ["Claude Pro", "v0", "Perplexity"] },
  ];

  const faqs = [
    { q: "Is my data secure?", a: "Yes. We don't connect to your billing accounts. You input what you spend, we analyze it locally and never store sensitive credentials." },
    { q: "How accurate are the recommendations?", a: "Our pricing data is updated weekly across 40+ AI tools. Most teams realize 80%+ of estimated savings within 30 days." },
    { q: "Do you support enterprise plans?", a: "Yes. We benchmark Team, Business, and Enterprise tiers including custom OpenAI and Anthropic contracts." },
    { q: "How long does an audit take?", a: "Around 2 minutes. Just select your tools, enter rough monthly spend, and get an instant report." },
    { q: "Is it really free?", a: "The audit is free forever. We earn from optional premium consultation when you're saving over $5k/month." },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => setOpenFaq((prev) => (prev === index ? null : index));

  return {
    tools,
    toolPositions,
    stats,
    flowSteps,
    savingsExamples,
    faqs,
    openFaq,
    toggleFaq,
  };
}
