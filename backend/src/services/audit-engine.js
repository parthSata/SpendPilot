/**
 * Usage-aware audit recommendations (pure logic, testable).
 * Downgrade suggestions require plan capacity (maxIntensity) vs declared usageIntensity.
 */

export const globalPlanFallbacks = {
  free: 0,
  plus: 20,
  pro: 20,
  team: 30,
  business: 40,
  enterprise: 50,
  hobby: 0,
  individual: 10,
  advanced: 20,
  max: 100,
  build: 30,
  scale: 150,
  starter: 50,
  growth: 200,
};

export const toolPricing = {
  cursor: { hobby: 0, pro: 20, business: 40 },
  chatgpt: { free: 0, plus: 20, team: 30 },
  claude: { free: 0, pro: 20, max: 100, team: 30 },
  github_copilot: { free: 0, individual: 10, business: 19, enterprise: 39 },
  gemini: { free: 0, advanced: 20, business: 24 },
  openai_api: { starter: 50, growth: 200, scale: 500 },
  anthropic_api: { build: 30, scale: 150 },
  windsurf: { free: 0, pro: 15, team: 30 },
};

const INTENSITY_RANK = { light: 1, medium: 2, heavy: 3 };

/** @typedef {"light"|"medium"|"heavy"} UsageIntensity */
/** @typedef {"downgrade_plan"|"reduce_seats"|"keep_plan"|"insufficient_data"} RecommendationType */

/**
 * Normalize legacy plans.json (array per tool) or new object shape.
 * @param {Record<string, unknown>} plansData
 */
export function normalizePlansBundle(plansData) {
  /** @type {Record<string, { orderedPlans: string[]; planFit: Record<string, { maxIntensity?: string }> }>} */
  const out = {};
  for (const [toolId, value] of Object.entries(plansData)) {
    if (Array.isArray(value)) {
      out[toolId] = { orderedPlans: value, planFit: {} };
    } else if (value && typeof value === "object") {
      const v = /** @type {{ orderedPlans?: string[]; plans?: string[]; planFit?: Record<string, { maxIntensity?: string }> }} */ (
        value
      );
      const ordered = v.orderedPlans ?? v.plans ?? [];
      const rawFit = v.planFit ?? {};
      const planFit = {};
      for (const [planName, fit] of Object.entries(rawFit)) {
        planFit[planName.toLowerCase()] = fit;
      }
      out[toolId] = { orderedPlans: ordered, planFit };
    }
  }
  return out;
}

export const mapToolId = (toolName, toolsCatalog) => {
  const normalized = toolName.trim().toLowerCase();
  const match = toolsCatalog.find(
    (tool) => tool.id.toLowerCase() === normalized || tool.name.toLowerCase() === normalized
  );
  return match?.id ?? normalized.replace(/\s+/g, "_");
};

export const findToolInfo = (toolName, toolsCatalog) => {
  const normalized = toolName.trim().toLowerCase();
  return toolsCatalog.find(
    (tool) => tool.id.toLowerCase() === normalized || tool.name.toLowerCase() === normalized
  );
};

const getPriceForRow = (row, plan) => {
  const p = plan.toLowerCase();
  return row[p] ?? globalPlanFallbacks[p] ?? 0;
};

/**
 * Plan supports declared usage if plan.maxIntensity >= user intensity (ordinal).
 * Missing fit metadata defaults to permissive (allows downgrade).
 */
export const planSupportsUsage = (planFitEntry, usageIntensity) => {
  if (!planFitEntry?.maxIntensity) return true;
  const cap = INTENSITY_RANK[/** @type {keyof typeof INTENSITY_RANK} */ (planFitEntry.maxIntensity)] ?? 3;
  const need = INTENSITY_RANK[/** @type {keyof typeof INTENSITY_RANK} */ (usageIntensity)] ?? 2;
  return cap >= need;
};

const isApiToolId = (toolId) => toolId.endsWith("_api");

/**
 * Block aggressive API tier drops for heavy workloads (heuristic; avoids false savings).
 */
const apiDowngradeAllowed = (toolId, usageIntensity, currentPrice, candidatePrice, activeSeats) => {
  if (!isApiToolId(toolId) || usageIntensity !== "heavy") return true;
  const monthlyDelta = (currentPrice - candidatePrice) * activeSeats;
  return monthlyDelta <= 220;
};

/**
 * @param {object} item
 * @param {string} item.toolName
 * @param {string} item.currentPlan
 * @param {number} item.monthlySpend
 * @param {number} item.seats
 * @param {Record<string, { orderedPlans: string[]; planFit: Record<string, { maxIntensity?: string }> }>} plansByTool
 * @param {Array<{ id: string; name: string; emoji?: string; source?: string; sourceUrl?: string }>} toolsCatalog
 * @param {UsageIntensity} usageIntensity
 * @param {number} totalTeamSize
 */
export function calculateToolRecommendation(
  item,
  plansByTool,
  toolsCatalog,
  usageIntensity,
  totalTeamSize
) {
  const toolId = mapToolId(item.toolName, toolsCatalog);
  const toolInfo = findToolInfo(item.toolName, toolsCatalog);
  const row = toolPricing[toolId] || {};

  const currentPricePerSeat = getPriceForRow(row, item.currentPlan);
  const seats = Math.max(1, Number(item.seats) || 1);
  const wastedSeats = Math.max(0, seats - totalTeamSize);
  const activeSeats = seats - wastedSeats;

  const bundle = plansByTool[toolId] ?? { orderedPlans: Object.keys(row), planFit: {} };
  const { orderedPlans, planFit } = bundle;

  const sortedPlans = [...new Set(orderedPlans.map((p) => p.trim()))].sort(
    (a, b) => getPriceForRow(row, a) - getPriceForRow(row, b)
  );

  const seatSavingsMonthly = wastedSeats > 0 && currentPricePerSeat > 0 ? wastedSeats * currentPricePerSeat : 0;

  /** @type {RecommendationType} */
  let recommendationType = "keep_plan";
  let recommendedPlan = item.currentPlan;
  let planSavingsMonthly = 0;
  const reasons = [];

  if (seatSavingsMonthly > 0) {
    reasons.push(
      `Reduce ${wastedSeats} unused seat${wastedSeats === 1 ? "" : "s"} (you have ${seats} seats vs ${totalTeamSize} people).`
    );
    recommendationType = "reduce_seats";
  }

  const cheaperPlans = sortedPlans
    .filter((p) => getPriceForRow(row, p) < currentPricePerSeat)
    .sort((a, b) => getPriceForRow(row, b) - getPriceForRow(row, a));

  let bestCandidate = null;
  let bestCandidatePrice = -1;

  for (const candidate of cheaperPlans) {
    const candidatePrice = getPriceForRow(row, candidate);
    const fit = planFit[candidate.toLowerCase()] ?? {};
    if (!planSupportsUsage(fit, usageIntensity)) continue;
    if (!apiDowngradeAllowed(toolId, usageIntensity, currentPricePerSeat, candidatePrice, activeSeats)) continue;

    if (candidatePrice > bestCandidatePrice) {
      bestCandidatePrice = candidatePrice;
      bestCandidate = candidate;
    }
  }

  if (bestCandidate && activeSeats > 0) {
    const deltaPerSeat = currentPricePerSeat - bestCandidatePrice;
    planSavingsMonthly = deltaPerSeat * activeSeats;
    recommendedPlan = bestCandidate;
    recommendationType = "downgrade_plan";
    reasons.push(
      `Downgrade from ${item.currentPlan} to ${bestCandidate} saves ~$${Math.round(deltaPerSeat)}/seat/mo for ${activeSeats} active seat${activeSeats === 1 ? "" : "s"} at ${usageIntensity} usage intensity (plan tier still fits your workload).`
    );
  } else if (seatSavingsMonthly === 0) {
    if (sortedPlans.length === 0) {
      recommendationType = "insufficient_data";
      reasons.push("Insufficient catalog data to recommend a different plan safely.");
    } else if (cheaperPlans.length > 0) {
      recommendationType = "keep_plan";
      reasons.push(
        `Keep ${item.currentPlan}: declared ${usageIntensity} usage means cheaper tiers would likely hit limits, quotas, or feature gaps — not worth the operational risk for the saved dollars.`
      );
    } else {
      recommendationType = "keep_plan";
      reasons.push(`Keep ${item.currentPlan}: already on the lowest priced tier in our catalog for this tool.`);
    }
  }

  const monthlySavings = Math.round(seatSavingsMonthly + planSavingsMonthly);

  if (!bestCandidate && seatSavingsMonthly > 0) {
    recommendationType = "reduce_seats";
  }

  const reason = reasons.join(" ");

  return {
    toolName: item.toolName,
    currentPlan: item.currentPlan,
    monthlySpend: item.monthlySpend,
    seats,
    wastedSeats,
    recommendedPlan,
    recommendedTool: item.toolName,
    monthlySavings,
    annualSavings: Math.round(monthlySavings * 12),
    reason,
    emoji: toolInfo?.emoji || "🤖",
    source: toolInfo?.source || "Pricing Data",
    sourceUrl: toolInfo?.sourceUrl || "",
    recommendationType,
  };
}

/**
 * @param {Array<{ toolName: string; currentPlan: string; monthlySpend: number; seats: number }>} tools
 * @param {{ plansByTool: Record<string, unknown>; toolsCatalog: Array<{ id: string; name: string }>; teamSize: number; usageIntensity: UsageIntensity }} ctx
 */
export function buildToolRecommendations(tools, ctx) {
  const { plansByTool, toolsCatalog, teamSize, usageIntensity } = ctx;
  return tools.map((item) => calculateToolRecommendation(item, plansByTool, toolsCatalog, usageIntensity, teamSize));
}
