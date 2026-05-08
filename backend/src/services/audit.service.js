import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";
import { AuditModel } from "../models/audit.model.js";
import { LeadModel } from "../models/lead.model.js";
import { SharedReportModel } from "../models/shared-report.model.js";
import { env } from "../config/env.js";

const toolsPath = new URL("../../data/pricing/tools.json", import.meta.url);
const plansPath = new URL("../../data/pricing/plans.json", import.meta.url);

const useCaseFactors = {
  coding: 1.2,
  writing: 0.7,
  research: 0.9,
  data: 1.1,
  mixed: 1.0,
};

const planTargets = {
  Free: 0,
  Hobby: 0,
  Individual: 19,
  Plus: 20,
  Pro: 20,
  Team: 35,
  Business: 39,
  Enterprise: 55,
  Ultra: 50,
  Max: 100,
  "API direct": 180,
  API: 180,
};

const parsePricingCatalog = async () => {
  const [toolsRaw, plansRaw] = await Promise.all([
    readFile(toolsPath, "utf8"),
    readFile(plansPath, "utf8"),
  ]);

  return {
    tools: JSON.parse(toolsRaw),
    plans: JSON.parse(plansRaw),
  };
};

const mapToolId = (toolName, toolsCatalog) => {
  const normalized = toolName.trim().toLowerCase();
  const match = toolsCatalog.find(
    (tool) => tool.id.toLowerCase() === normalized || tool.name.toLowerCase() === normalized
  );
  return match?.id ?? normalized.replace(/\s+/g, "_");
};

const calculateToolRecommendation = (item, plansCatalog, toolsCatalog, useCaseFactor) => {
  const toolId = mapToolId(item.toolName, toolsCatalog);
  const knownPlans = plansCatalog[toolId] ?? ["Pro", "Business", "API direct"];
  const sortedPlans = [...knownPlans].sort(
    (a, b) => (planTargets[a] ?? 9999) - (planTargets[b] ?? 9999)
  );

  const seats = Math.max(1, item.seats);
  const adjustedSpend = item.monthlySpend * useCaseFactor;
  const spendPerSeat = adjustedSpend / seats;
  const currentPlanBudget = planTargets[item.currentPlan] ?? adjustedSpend / seats;

  const recommendedPlan =
    sortedPlans.find((plan) => (planTargets[plan] ?? Infinity) >= spendPerSeat * 0.8) ??
    sortedPlans[sortedPlans.length - 1];

  const targetPerSeat = planTargets[recommendedPlan] ?? currentPlanBudget;
  const recommendedMonthly = Math.max(0, Math.round(targetPerSeat * seats));
  const monthlySavings = Math.max(0, Math.round(item.monthlySpend - recommendedMonthly));
  const annualSavings = monthlySavings * 12;

  const reason =
    monthlySavings > 0
      ? `Current cost profile suggests ${recommendedPlan} is enough for this workload (${seats} seats).`
      : "Current plan is already efficient for current team usage.";

  return {
    toolName: item.toolName,
    currentPlan: item.currentPlan,
    monthlySpend: item.monthlySpend,
    seats,
    recommendedPlan,
    recommendedTool: item.toolName,
    monthlySavings,
    annualSavings,
    reason,
  };
};

const buildFallbackSummary = ({ totalMonthlySavings, totalAnnualSavings, primaryUseCase, recommendations }) => {
  const topItems = recommendations
    .filter((item) => item.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3)
    .map((item) => `${item.toolName} (${item.monthlySavings}/mo)`);

  const topLine = topItems.length
    ? `Top opportunities: ${topItems.join(", ")}.`
    : "Current stack is already optimized with low immediate savings opportunities.";

  return `For a ${primaryUseCase} focused team, estimated savings are ${totalMonthlySavings}/mo (${totalAnnualSavings}/yr). ${topLine}`;
};

const buildGeminiSummary = async (payload) => {
  if (!env.GEMINI_API_KEY) {
    return buildFallbackSummary(payload);
  }

  try {
    const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: env.GEMINI_MODEL });
    const prompt = `You are SpendPilot's audit assistant. Return a concise 3-4 sentence executive summary.
Input:
${JSON.stringify(payload, null, 2)}
Rules:
- mention estimated monthly and annual savings
- highlight top 2 opportunities
- keep tone practical and direct
- no markdown`;

    const response = await model.generateContent(prompt);
    const text = response.response.text()?.trim();
    return text || buildFallbackSummary(payload);
  } catch {
    return buildFallbackSummary(payload);
  }
};

export const runAudit = async ({ teamSize, primaryUseCase, tools, lead }) => {
  const { tools: toolsCatalog, plans: plansCatalog } = await parsePricingCatalog();
  const useCaseFactor = useCaseFactors[primaryUseCase] ?? 1;

  const recommendations = tools.map((item) =>
    calculateToolRecommendation(item, plansCatalog, toolsCatalog, useCaseFactor)
  );

  const totalMonthlySpend = recommendations.reduce((sum, item) => sum + item.monthlySpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, item) => sum + item.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const auditScore = Math.max(
    1,
    Math.min(100, Math.round((totalMonthlySavings / Math.max(totalMonthlySpend, 1)) * 100))
  );

  const aiSummary = await buildGeminiSummary({
    teamSize,
    primaryUseCase,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendations,
  });

  const shareId = randomUUID().slice(0, 12);
  const audit = await AuditModel.create({
    teamSize,
    primaryUseCase,
    tools: recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    aiSummary,
    auditScore,
    isHighSavingsLead: totalMonthlySavings >= 1000,
    publicShareId: shareId,
  });

  await SharedReportModel.create({
    auditId: audit._id,
    shareId,
  });

  if (lead?.email) {
    await LeadModel.findOneAndUpdate(
      { email: lead.email.toLowerCase().trim() },
      {
        email: lead.email.toLowerCase().trim(),
        companyName: lead.companyName ?? "",
        role: lead.role ?? "",
        teamSize,
        auditId: audit._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return {
    auditId: audit._id,
    shareId,
    teamSize,
    primaryUseCase,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    auditScore,
    aiSummary,
    tools: recommendations,
  };
};

export const getSharedAudit = async (shareId) => {
  const shared = await SharedReportModel.findOneAndUpdate(
    { shareId },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!shared) return null;

  const audit = await AuditModel.findById(shared.auditId).lean();
  if (!audit) return null;

  return {
    auditId: audit._id,
    shareId,
    views: shared.views,
    createdAt: audit.createdAt,
    teamSize: audit.teamSize,
    primaryUseCase: audit.primaryUseCase,
    totalMonthlySpend: audit.totalMonthlySpend,
    totalMonthlySavings: audit.totalMonthlySavings,
    totalAnnualSavings: audit.totalAnnualSavings,
    auditScore: audit.auditScore,
    aiSummary: audit.aiSummary,
    tools: audit.tools,
  };
};

export const sendAuditEmail = async ({ auditId, toEmail }) => {
  const audit = await AuditModel.findById(auditId).lean();
  if (!audit) return { sent: false, reason: "Audit not found" };
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { sent: false, reason: "Email provider not configured" };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const topOpportunities = [...audit.tools]
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3)
    .map((item) => `<li><strong>${item.toolName}</strong>: save $${item.monthlySavings}/mo (${item.recommendedPlan})</li>`)
    .join("");

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: toEmail,
    subject: "Your SpendPilot audit summary",
    html: `
      <h2>Your AI spend audit is ready</h2>
      <p>Estimated savings: <strong>$${audit.totalMonthlySavings}/mo</strong> ($${audit.totalAnnualSavings}/yr)</p>
      <p>${audit.aiSummary}</p>
      <ul>${topOpportunities}</ul>
      <p>Public report: ${env.FRONTEND_ORIGIN.split(",")[0].trim()}/report/${audit.publicShareId}</p>
    `,
  });

  return { sent: true };
};
