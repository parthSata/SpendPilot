export const PRICING_DATA = {
  cursor: {
    label: "Cursor",
    emoji: "⚡",
    color: "#a855f7",
    verifiedAt: "2026-05-10",
    url: "https://www.cursor.com/pricing",
    plans: { hobby: 0, pro: 20, business: 40, enterprise: "custom" }
  },
  chatgpt: {
    label: "ChatGPT",
    emoji: "🧠",
    color: "#10a37f",
    verifiedAt: "2026-05-10",
    url: "https://openai.com/chatgpt/pricing/",
    plans: { free: 0, plus: 20, team: 30, enterprise: "custom" }
  },
  claude: {
    label: "Claude",
    emoji: "🤖",
    color: "#d97757",
    verifiedAt: "2026-05-10",
    url: "https://www.anthropic.com/pricing",
    plans: { free: 0, pro: 20, max: 100, team: 30 }
  },
  github_copilot: {
    label: "GitHub Copilot",
    emoji: "🐙",
    color: "#2ea043",
    verifiedAt: "2026-05-10",
    url: "https://github.com/features/copilot#pricing",
    plans: { free: 0, individual: 10, business: 19, enterprise: 39 }
  },
  gemini: {
    label: "Google Gemini",
    emoji: "✨",
    color: "#1a73e8",
    verifiedAt: "2026-05-10",
    url: "https://gemini.google.com/advanced",
    plans: { free: 0, advanced: 20, business: 24, enterprise: "custom" }
  },
  openai_api: {
    label: "OpenAI API",
    emoji: "⚙️",
    color: "#412991",
    verifiedAt: "2026-05-10",
    url: "https://openai.com/api/pricing/",
    plans: { starter: 50, growth: 200, scale: 500, enterprise: "custom" }
  },
  anthropic_api: {
    label: "Anthropic API",
    emoji: "🏗️",
    color: "#CC785C",
    verifiedAt: "2026-05-10",
    url: "https://www.anthropic.com/api",
    plans: { build: 30, scale: 150, enterprise: "custom" }
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
}

export interface Recommendation {
  toolKey: string;
  currentPlan: string;
  suggestedPlan: string;
  monthlySavings: number;
}

export function getPrice(toolKey: string, plan: string): number {
  const tool = PRICING_DATA[toolKey as keyof typeof PRICING_DATA];
  if (!tool) return 0;
  const p = (tool.plans as any)[plan];
  return typeof p === 'number' ? p : 0;
}

export function calculateBreakdowns(selections: ToolSelection[]): CostBreakdown[] {
  return selections.map(sel => {
    const pricePerSeat = getPrice(sel.toolKey, sel.plan);
    return {
      toolKey: sel.toolKey,
      plan: sel.plan,
      seats: sel.seats,
      pricePerSeat,
      totalMonthly: pricePerSeat * sel.seats
    };
  });
}

export function getTotalMonthlySpend(breakdowns: CostBreakdown[]): number {
  return breakdowns.reduce((sum, b) => sum + b.totalMonthly, 0);
}

export function getRecommendations(breakdowns: CostBreakdown[]): Recommendation[] {
  const recs: Recommendation[] = [];
  
  for (const b of breakdowns) {
    if (b.pricePerSeat > 0) {
      const tool = PRICING_DATA[b.toolKey as keyof typeof PRICING_DATA];
      if (!tool) continue;
      
      const plansList = Object.entries(tool.plans);
      const cheaperPlans = plansList.filter(([_, cost]) => typeof cost === 'number' && cost < b.pricePerSeat);
      
      if (cheaperPlans.length > 0) {
        cheaperPlans.sort((x, y) => (y[1] as number) - (x[1] as number));
        const [suggestedPlan, suggestedPrice] = cheaperPlans[0];
        const monthlySavings = (b.pricePerSeat - (suggestedPrice as number)) * b.seats;
        
        if (monthlySavings > 0) {
          recs.push({
            toolKey: b.toolKey,
            currentPlan: b.plan,
            suggestedPlan,
            monthlySavings
          });
        }
      }
    }
  }
  
  return recs;
}

export function getTotalSavings(recommendations: Recommendation[]): number {
  return recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
}

export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return "$" + price + "/mo";
}
