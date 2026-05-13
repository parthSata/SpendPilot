import type { UsageIntensity } from "./plan-fit";
import { apiDowngradeAllowed, planSupportsUsage } from "./plan-fit";

export const PRICING_DATA = {
  cursor: {
    label: "Cursor",
    emoji: "⚡",
    logo: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
    color: "#a855f7",
    verifiedAt: "2026-05-10",
    url: "https://www.cursor.com/pricing",
    plans: { hobby: 0, pro: 20, business: 40, enterprise: "custom" },
  },
  chatgpt: {
    label: "ChatGPT",
    emoji: "🧠",
    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    color: "#10a37f",
    verifiedAt: "2026-05-10",
    url: "https://openai.com/chatgpt/pricing/",
    plans: {
      free: 0,
      plus: 20,
      team: 30,
      enterprise: 60,
      /** Declared ChatGPT-family API spend (usage-based; illustrative floor for comparisons). */
      api_direct: 200,
    },
  },
  claude: {
    label: "Claude",
    emoji: "🤖",
    logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    color: "#d97757",
    verifiedAt: "2026-05-10",
    url: "https://www.anthropic.com/pricing",
    plans: {
      free: 0,
      pro: 20,
      max: 100,
      team: 30,
      enterprise: 70,
      /** Claude API billed direct (usage-based; illustrative monthly anchor). */
      api_direct: 180,
    },
  },
  github_copilot: {
    label: "GitHub Copilot",
    emoji: "🐙",
    logo: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    color: "#2ea043",
    verifiedAt: "2026-05-10",
    url: "https://github.com/features/copilot#pricing",
    plans: { free: 0, individual: 10, business: 19, enterprise: 39 },
  },
  gemini: {
    label: "Google Gemini",
    emoji: "✨",
    logo: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128",
    color: "#1a73e8",
    verifiedAt: "2026-05-10",
    url: "https://gemini.google.com/advanced",
    plans: {
      free: 0,
      advanced: 20,
      business: 24,
      ultra: 35,
      /** Gemini API usage (declared monthly anchor for comparisons). */
      api: 120,
      enterprise: "custom",
    },
  },
  openai_api: {
    label: "OpenAI API",
    emoji: "⚙️",
    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    color: "#412991",
    verifiedAt: "2026-05-10",
    url: "https://openai.com/api/pricing/",
    plans: { starter: 50, growth: 200, scale: 500, enterprise: "custom" },
  },
  anthropic_api: {
    label: "Anthropic API",
    emoji: "🏗️",
    logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    color: "#CC785C",
    verifiedAt: "2026-05-10",
    url: "https://www.anthropic.com/api",
    plans: { build: 30, scale: 150, enterprise: "custom" },
  },
  windsurf: {
    label: "Windsurf",
    emoji: "🏄",
    logo: "https://www.google.com/s2/favicons?domain=codeium.com&sz=128",
    color: "#09C299",
    verifiedAt: "2026-05-11",
    url: "https://codeium.com/windsurf/pricing",
    plans: { free: 0, pro: 15, team: 30, enterprise: "custom" },
  },
} as const;

export interface ToolSelection {
  toolKey: string;
  plan: string;
  seats: number;
  /** Declared monthly spend for this tool; when null, estimated from plan × seats. */
  monthlySpendActual?: number | null;
}

export interface CostBreakdown {
  toolKey: string;
  plan: string;
  seats: number;
  pricePerSeat: number;
  totalMonthly: number;
  wastedSeats: number;
}

export interface Recommendation {
  toolKey: string;
  currentPlan: string;
  suggestedPlan: string;
  monthlySavings: number;
  reason: string;
  recommendationType: "downgrade_plan" | "reduce_seats" | "keep_plan";
}

export function getPrice(toolKey: string, plan: string): number {
  const tool = PRICING_DATA[toolKey as keyof typeof PRICING_DATA];
  if (!tool) return 0;
  const p = (tool.plans as any)[plan];
  return typeof p === "number" ? p : 0;
}

export function calculateBreakdowns(selections: ToolSelection[], totalTeamSize: number): CostBreakdown[] {
  return selections.map((sel) => {
    const pricePerSeat = getPrice(sel.toolKey, sel.plan);
    const wastedSeats = Math.max(0, sel.seats - totalTeamSize);
    const fromCatalog = pricePerSeat * sel.seats;
    const declared =
      typeof sel.monthlySpendActual === "number" && !Number.isNaN(sel.monthlySpendActual) && sel.monthlySpendActual >= 0
        ? sel.monthlySpendActual
        : null;
    const totalMonthly = declared !== null ? declared : fromCatalog;
    return {
      toolKey: sel.toolKey,
      plan: sel.plan,
      seats: sel.seats,
      pricePerSeat,
      totalMonthly,
      wastedSeats,
    };
  });
}

export function getTotalMonthlySpend(breakdowns: CostBreakdown[]): number {
  return breakdowns.reduce((sum, b) => sum + b.totalMonthly, 0);
}

export function getRecommendations(
  breakdowns: CostBreakdown[],
  options?: { teamSize?: number; usageIntensity?: UsageIntensity }
): Recommendation[] {
  const usageIntensity = options?.usageIntensity ?? "medium";
  const teamSize = options?.teamSize ?? 999;
  const recs: Recommendation[] = [];

  for (const b of breakdowns) {
    const tool = PRICING_DATA[b.toolKey as keyof typeof PRICING_DATA];
    if (!tool) continue;

    let toolSavings = 0;
    let suggestedPlan = b.plan;
    const reasons: string[] = [];
    let recommendationType: Recommendation["recommendationType"] = "keep_plan";

    const wastedSeats = Math.max(0, b.seats - teamSize);
    const activeSeats = Math.max(0, b.seats - wastedSeats);

    if (wastedSeats > 0 && b.pricePerSeat > 0) {
      toolSavings += wastedSeats * b.pricePerSeat;
      reasons.push(
        `You have ${wastedSeats} unused seat${wastedSeats === 1 ? "" : "s"} compared to your total team size (${teamSize}).`
      );
      recommendationType = "reduce_seats";
    }

    const plansList = Object.entries(tool.plans).filter(
      ([_, cost]) => typeof cost === "number"
    ) as [string, number][];
    const cheaperPlans = plansList
      .filter(([name, cost]) => cost < b.pricePerSeat)
      .filter(([name]) => planSupportsUsage(b.toolKey, name, usageIntensity))
      .filter(([name, cost]) =>
        apiDowngradeAllowed(b.toolKey, usageIntensity, b.pricePerSeat, cost, activeSeats)
      )
      .sort((x, y) => y[1] - x[1]);

    if (cheaperPlans.length > 0 && activeSeats > 0) {
      const [newPlan, newPrice] = cheaperPlans[0];
      const planSavings = (b.pricePerSeat - newPrice) * activeSeats;
      if (planSavings > 0) {
        toolSavings += planSavings;
        suggestedPlan = newPlan;
        reasons.push(
          `At ${usageIntensity} usage, ${newPlan} still fits your workload and saves ~$${b.pricePerSeat - newPrice}/seat/mo on ${activeSeats} active seat${activeSeats === 1 ? "" : "s"}.`
        );
      }
    }

    if (toolSavings > 0) {
      recommendationType = suggestedPlan === b.plan ? "reduce_seats" : "downgrade_plan";
      recs.push({
        toolKey: b.toolKey,
        currentPlan: b.plan,
        suggestedPlan,
        monthlySavings: Math.round(toolSavings),
        reason: reasons.join(" "),
        recommendationType,
      });
    }
  }

  return recs;
}

export function getTotalSavings(recommendations: Recommendation[]): number {
  return recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
}

export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  if (price >= 1000000) return "$" + (price / 1000000).toFixed(1) + "M";
  if (price >= 1000) return "$" + (price / 1000).toFixed(1) + "K";
  return "$" + price.toLocaleString();
}

/** Dollar amounts for savings — zero is `$0`, never `"Free"`. */
export function formatSavingsUsd(price: number): string {
  const n = Math.round(price);
  if (n <= 0) return "$0";
  return formatPrice(n);
}
