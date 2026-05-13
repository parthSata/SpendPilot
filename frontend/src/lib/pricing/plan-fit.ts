/**
 * Mirrors backend/data/pricing/plans.json planFit.maxIntensity for client-side savings preview.
 * Keep in sync when plan tiers change.
 */
export type UsageIntensity = "light" | "medium" | "heavy";

const INTENSITY_RANK: Record<UsageIntensity, number> = {
  light: 1,
  medium: 2,
  heavy: 3,
};

export const PLAN_FIT: Record<string, Record<string, { maxIntensity?: UsageIntensity }>> = {
  cursor: {
    hobby: { maxIntensity: "medium" },
    pro: { maxIntensity: "heavy" },
    business: { maxIntensity: "heavy" },
  },
  github_copilot: {
    free: { maxIntensity: "light" },
    individual: { maxIntensity: "heavy" },
    business: { maxIntensity: "heavy" },
    enterprise: { maxIntensity: "heavy" },
  },
  claude: {
    free: { maxIntensity: "light" },
    pro: { maxIntensity: "heavy" },
    max: { maxIntensity: "heavy" },
    team: { maxIntensity: "heavy" },
    enterprise: { maxIntensity: "heavy" },
    api_direct: { maxIntensity: "heavy" },
  },
  chatgpt: {
    free: { maxIntensity: "light" },
    plus: { maxIntensity: "heavy" },
    team: { maxIntensity: "heavy" },
    enterprise: { maxIntensity: "heavy" },
    api_direct: { maxIntensity: "heavy" },
  },
  anthropic_api: {
    build: { maxIntensity: "heavy" },
    scale: { maxIntensity: "heavy" },
  },
  openai_api: {
    starter: { maxIntensity: "heavy" },
    growth: { maxIntensity: "heavy" },
    scale: { maxIntensity: "heavy" },
  },
  gemini: {
    free: { maxIntensity: "light" },
    advanced: { maxIntensity: "heavy" },
    business: { maxIntensity: "heavy" },
    ultra: { maxIntensity: "heavy" },
    api: { maxIntensity: "heavy" },
  },
  windsurf: {
    free: { maxIntensity: "light" },
    pro: { maxIntensity: "medium" },
    team: { maxIntensity: "heavy" },
  },
};

export function planSupportsUsage(
  toolKey: string,
  planName: string,
  usageIntensity: UsageIntensity
): boolean {
  const fit = PLAN_FIT[toolKey]?.[planName.toLowerCase()];
  if (!fit?.maxIntensity) return true;
  const cap = INTENSITY_RANK[fit.maxIntensity];
  const need = INTENSITY_RANK[usageIntensity];
  return cap >= need;
}

const isApiTool = (toolKey: string) => toolKey.endsWith("_api");

export function apiDowngradeAllowed(
  toolKey: string,
  usageIntensity: UsageIntensity,
  currentPrice: number,
  candidatePrice: number,
  activeSeats: number
): boolean {
  if (!isApiTool(toolKey) || usageIntensity !== "heavy") return true;
  const monthlyDelta = (currentPrice - candidatePrice) * activeSeats;
  return monthlyDelta <= 220;
}
