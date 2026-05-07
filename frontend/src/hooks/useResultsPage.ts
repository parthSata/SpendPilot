import { useState } from "react";

export type SpendTrendPoint = {
  m: string;
  current: number;
  optimized: number;
};

export type ToolRecommendation = {
  name: string;
  current: number;
  recommended: number;
  action: string;
  severity: "high" | "medium" | "low";
};

const SHARE_URL = "https://spendpilot.app/r/abc123";

export function useResultsPage() {
  const [copied, setCopied] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

  const monthly = 1840;
  const yearly = monthly * 12;

  const trend: SpendTrendPoint[] = [
    { m: "Jan", current: 4800, optimized: 4800 },
    { m: "Feb", current: 5100, optimized: 4200 },
    { m: "Mar", current: 5400, optimized: 3900 },
    { m: "Apr", current: 5800, optimized: 3700 },
    { m: "May", current: 6100, optimized: 3500 },
    { m: "Jun", current: 6500, optimized: 3400 },
  ];

  const tools: ToolRecommendation[] = [
    { name: "OpenAI API", current: 2200, recommended: 1100, action: "Switch to gpt-4o-mini for 80% of calls", severity: "high" },
    { name: "Cursor Pro", current: 320, recommended: 240, action: "Drop 4 inactive seats", severity: "medium" },
    { name: "ChatGPT Team", current: 600, recommended: 480, action: "Move 6 users to free tier", severity: "medium" },
    { name: "GitHub Copilot", current: 380, recommended: 380, action: "Keep - high utilization", severity: "low" },
    { name: "Claude Pro", current: 200, recommended: 80, action: "Consolidate to 4 power users", severity: "high" },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    copied,
    leadOpen,
    monthly,
    yearly,
    trend,
    tools,
    shareUrl: SHARE_URL,
    setLeadOpen,
    handleCopy,
  };
}
