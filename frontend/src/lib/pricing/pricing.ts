export const PRICING_DATA = {
  cursor: {
    label: "Cursor",
    logo: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
    color: "#a855f7",
    verifiedAt: "2026-05-10",
    url: "https://www.cursor.com/pricing",
    plans: { hobby: 0, pro: 20, business: 40, enterprise: "custom" }
  },
  chatgpt: {
    label: "ChatGPT",
    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    color: "#10a37f",
    verifiedAt: "2026-05-10",
    url: "https://openai.com/chatgpt/pricing/",
    plans: { free: 0, plus: 20, team: 30, enterprise: "custom" }
  },
  claude: {
    label: "Claude",
    logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    color: "#d97757",
    verifiedAt: "2026-05-10",
    url: "https://www.anthropic.com/pricing",
    plans: { free: 0, pro: 20, max: 100, team: 30 }
  },
  github_copilot: {
    label: "GitHub Copilot",
    logo: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    color: "#2ea043",
    verifiedAt: "2026-05-10",
    url: "https://github.com/features/copilot#pricing",
    plans: { free: 0, individual: 10, business: 19, enterprise: 39 }
  },
  gemini: {
    label: "Google Gemini",
    logo: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128",
    color: "#1a73e8",
    verifiedAt: "2026-05-10",
    url: "https://gemini.google.com/advanced",
    plans: { free: 0, advanced: 20, business: 24, enterprise: "custom" }
  },
  openai_api: {
    label: "OpenAI API",
    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    color: "#412991",
    verifiedAt: "2026-05-10",
    url: "https://openai.com/api/pricing/",
    plans: { starter: 50, growth: 200, scale: 500, enterprise: "custom" }
  },
  anthropic_api: {
    label: "Anthropic API",
    logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    color: "#CC785C",
    verifiedAt: "2026-05-10",
    url: "https://www.anthropic.com/api",
    plans: { build: 30, scale: 150, enterprise: "custom" }
  },
  windsurf: {
    label: "Windsurf",
    logo: "https://www.google.com/s2/favicons?domain=codeium.com&sz=128",
    color: "#09C299",
    verifiedAt: "2026-05-11",
    url: "https://codeium.com/windsurf/pricing",
    plans: { free: 0, pro: 15, team: 30, enterprise: "custom" }
  }
} as const;

export interface ToolSelection {
  toolKey: string;
  plan: string;
  seats: number;
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
    return {
      toolKey: sel.toolKey,
      plan: sel.plan,
      seats: sel.seats,
      pricePerSeat,
      totalMonthly: pricePerSeat * sel.seats,
      wastedSeats,
    };
  });
}

export function getTotalMonthlySpend(breakdowns: CostBreakdown[]): number {
  return breakdowns.reduce((sum, b) => sum + b.totalMonthly, 0);
}

export function getRecommendations(breakdowns: CostBreakdown[]): Recommendation[] {
  const recs: Recommendation[] = [];

  for (const b of breakdowns) {
    const tool = PRICING_DATA[b.toolKey as keyof typeof PRICING_DATA];
    if (!tool) continue;

    let toolSavings = 0;
    let suggestedPlan = b.plan;
    let reason = "";

    // 1. Check for wasted seats (Over-provisioning)
    if (b.wastedSeats > 0 && b.pricePerSeat > 0) {
      toolSavings += b.wastedSeats * b.pricePerSeat;
      reason = `You have ${b.wastedSeats} unused seats compared to your total team size.`;
    }

    // 2. Check for cheaper plans
    const plansList = Object.entries(tool.plans);
    const cheaperPlans = plansList.filter(([_, cost]) => typeof cost === "number" && (cost as number) < b.pricePerSeat);

    if (cheaperPlans.length > 0) {
      cheaperPlans.sort((x, y) => (y[1] as number) - (x[1] as number));
      const [newPlan, newPrice] = cheaperPlans[0];
      const planSavings = (b.pricePerSeat - (newPrice as number)) * (b.seats - b.wastedSeats);
      
      if (planSavings > 0) {
        toolSavings += planSavings;
        suggestedPlan = newPlan;
        reason += (reason ? " Also, d" : "D") + `owngrade to ${newPlan} plan to save $${(b.pricePerSeat - (newPrice as number))}/seat.`;
      }
    }

    if (toolSavings > 0) {
      recs.push({
        toolKey: b.toolKey,
        currentPlan: b.plan,
        suggestedPlan,
        monthlySavings: toolSavings,
        reason: reason || "Optimize seat count and plan selection.",
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
