import { describe, expect, it } from "vitest";
import {
  buildToolRecommendations,
  calculateToolRecommendation,
  normalizePlansBundle,
  planSupportsUsage,
} from "./audit-engine.js";

const toolsCatalog = [
  { id: "chatgpt", name: "ChatGPT", emoji: "🧠", source: "Official", sourceUrl: "https://openai.com" },
  { id: "cursor", name: "Cursor", emoji: "⚡", source: "Official", sourceUrl: "https://cursor.com" },
  { id: "openai_api", name: "OpenAI API", emoji: "⚙️", source: "Official", sourceUrl: "https://openai.com/api" },
];

const plansByTool = normalizePlansBundle(
  JSON.parse(
    JSON.stringify({
      chatgpt: {
        orderedPlans: ["Free", "Plus", "Team"],
        planFit: {
          free: { maxIntensity: "light" },
          plus: { maxIntensity: "heavy" },
          team: { maxIntensity: "heavy" },
        },
      },
      cursor: {
        orderedPlans: ["Hobby", "Pro", "Business"],
        planFit: {
          hobby: { maxIntensity: "medium" },
          pro: { maxIntensity: "heavy" },
          business: { maxIntensity: "heavy" },
        },
      },
      openai_api: {
        orderedPlans: ["Starter", "Growth", "Scale"],
        planFit: {
          starter: { maxIntensity: "heavy" },
          growth: { maxIntensity: "heavy" },
          scale: { maxIntensity: "heavy" },
        },
      },
    })
  )
);

describe("planSupportsUsage", () => {
  it("blocks free tier for heavy usage when maxIntensity is light", () => {
    expect(planSupportsUsage({ maxIntensity: "light" }, "heavy")).toBe(false);
    expect(planSupportsUsage({ maxIntensity: "heavy" }, "heavy")).toBe(true);
  });
});

describe("calculateToolRecommendation", () => {
  it("does not downgrade ChatGPT Plus to Free when usage is heavy (12 seats, team 12)", () => {
    const row = calculateToolRecommendation(
      { toolName: "ChatGPT", currentPlan: "plus", monthlySpend: 200, seats: 10 },
      plansByTool,
      toolsCatalog,
      "heavy",
      12
    );
    expect(row.recommendationType).toBe("keep_plan");
    expect(row.monthlySavings).toBe(0);
    expect(row.recommendedPlan.toLowerCase()).toBe("plus");
  });

  it("allows downgrade ChatGPT Plus to Free for light usage", () => {
    const row = calculateToolRecommendation(
      { toolName: "ChatGPT", currentPlan: "plus", monthlySpend: 200, seats: 10 },
      plansByTool,
      toolsCatalog,
      "light",
      12
    );
    expect(row.recommendationType).toBe("downgrade_plan");
    expect(row.recommendedPlan.toLowerCase()).toBe("free");
    expect(row.monthlySavings).toBeGreaterThan(0);
  });

  it("recommends seat reduction only when plan downgrade is blocked by heavy usage", () => {
    const row = calculateToolRecommendation(
      { toolName: "Cursor", currentPlan: "pro", monthlySpend: 300, seats: 15 },
      plansByTool,
      toolsCatalog,
      "heavy",
      5
    );
    expect(row.recommendationType).toBe("reduce_seats");
    expect(row.monthlySavings).toBeGreaterThan(0);
    expect(row.recommendedPlan.toLowerCase()).toBe("pro");
  });

  it("blocks aggressive OpenAI API tier drop for heavy usage (heuristic)", () => {
    const row = calculateToolRecommendation(
      { toolName: "OpenAI API", currentPlan: "scale", monthlySpend: 500, seats: 1 },
      plansByTool,
      toolsCatalog,
      "heavy",
      10
    );
    expect(row.recommendedPlan.toLowerCase()).toBe("scale");
    expect(row.monthlySavings).toBe(0);
    expect(row.recommendationType).toBe("keep_plan");
  });

  it("marks insufficient_data when no pricing/plan catalog exists for tool", () => {
    const row = calculateToolRecommendation(
      { toolName: "Unknown Vendor XYZ", currentPlan: "enterprise", monthlySpend: 999, seats: 2 },
      plansByTool,
      toolsCatalog,
      "medium",
      10
    );
    expect(row.recommendationType).toBe("insufficient_data");
  });
});

describe("buildToolRecommendations", () => {
  it("returns one row per tool with coherent types", () => {
    const rows = buildToolRecommendations(
      [
        { toolName: "ChatGPT", currentPlan: "plus", monthlySpend: 40, seats: 2 },
        { toolName: "Cursor", currentPlan: "pro", monthlySpend: 40, seats: 2 },
      ],
      { plansByTool, toolsCatalog, teamSize: 12, usageIntensity: "heavy" }
    );
    expect(rows).toHaveLength(2);
    expect(rows.every((r) => typeof r.recommendationType === "string")).toBe(true);
  });
});
