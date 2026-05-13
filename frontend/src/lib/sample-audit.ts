import type { SharedAuditResponse } from "@/lib/audit-api";

/** Built-in demo report for `?shareId=sample` — no server required (assignment: shareable preview / landing CTA). */
export const SAMPLE_SHARE_ID = "sample";

export const SAMPLE_SHARED_AUDIT: SharedAuditResponse = {
  auditId: "000000000000000000000000",
  shareId: SAMPLE_SHARE_ID,
  views: 0,
  createdAt: new Date().toISOString(),
  teamSize: 12,
  primaryUseCase: "coding",
  usageIntensity: "medium",
  totalMonthlySpend: 240,
  totalMonthlySavings: 40,
  totalAnnualSavings: 480,
  auditScore: 17,
  aiSummary:
    "This sample stack spends $240/mo on ChatGPT Plus and Cursor Pro. The engine flags seat hygiene and plan-fit; totals are illustrative for the landing demo.",
  pricingLastUpdated: "2026-05-12T00:00:00.000Z",
  tools: [
    {
      toolName: "ChatGPT",
      currentPlan: "plus",
      monthlySpend: 200,
      seats: 10,
      wastedSeats: 0,
      recommendedPlan: "plus",
      recommendedTool: "ChatGPT",
      monthlySavings: 0,
      annualSavings: 0,
      recommendationType: "keep_plan",
      reason:
        "Keep plus: declared medium usage means cheaper tiers would likely hit limits — not worth the operational risk for the saved dollars.",
      emoji: "🧠",
      source: "Official Pricing",
      sourceUrl: "https://openai.com/chatgpt/pricing/",
    },
    {
      toolName: "Cursor",
      currentPlan: "pro",
      monthlySpend: 40,
      seats: 2,
      wastedSeats: 0,
      recommendedPlan: "hobby",
      recommendedTool: "Cursor",
      monthlySavings: 40,
      annualSavings: 480,
      recommendationType: "downgrade_plan",
      reason:
        "Downgrade from pro to Hobby saves ~$20/seat/mo for 2 active seats at medium usage intensity (plan tier still fits your workload).",
      emoji: "⚡",
      source: "Official Pricing",
      sourceUrl: "https://www.cursor.com/pricing",
    },
  ],
};
