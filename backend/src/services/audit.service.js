import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuditModel } from "../models/audit.model.js";
import { LeadModel } from "../models/lead.model.js";
import { SharedReportModel } from "../models/shared-report.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { env } from "../config/env.js";
import { buildToolRecommendations, normalizePlansBundle } from "./audit-engine.js";

const toolsPath = new URL("../../data/pricing/tools.json", import.meta.url);
const plansPath = new URL("../../data/pricing/plans.json", import.meta.url);

const parsePricingCatalog = async () => {
  const [toolsRaw, plansRaw] = await Promise.all([
    readFile(toolsPath, "utf8"),
    readFile(plansPath, "utf8"),
  ]);

  const toolsData = JSON.parse(toolsRaw);
  const plansData = JSON.parse(plansRaw);

  return {
    tools: toolsData.tools || toolsData,
    plansByTool: normalizePlansBundle(plansData),
    lastUpdated: toolsData.lastUpdated || new Date().toISOString(),
  };
};

const buildFallbackSummary = ({
  totalMonthlySavings,
  totalAnnualSavings,
  primaryUseCase,
  usageIntensity,
  recommendations,
}) => {
  const topItems = recommendations
    .filter((item) => item.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3)
    .map((item) => `${item.toolName} (${item.monthlySavings}/mo)`);

  const kept = recommendations.filter((item) => item.recommendationType === "keep_plan" && item.monthlySavings === 0);

  const topLine = topItems.length
    ? `Top opportunities: ${topItems.join(", ")}.`
    : "Current stack is already optimized with low immediate savings opportunities.";

  const keepLine =
    kept.length > 0
      ? ` At ${usageIntensity} usage intensity, ${kept.length} tool${kept.length === 1 ? "" : "s"} should stay on the current paid tier to avoid limits or rework costs.`
      : "";

  return `For a ${primaryUseCase} focused team, estimated savings are $${totalMonthlySavings}/mo ($${totalAnnualSavings}/yr). ${topLine}${keepLine}`;
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
- if any recommendationType is "keep_plan" with monthlySavings 0, acknowledge that heavy usage can block naive downgrades
- do not claim blanket downgrades if tools are marked keep_plan
- keep tone practical and direct
- no markdown`;

    const response = await model.generateContent(prompt);
    const text = response.response.text()?.trim();
    return text || buildFallbackSummary(payload);
  } catch {
    return buildFallbackSummary(payload);
  }
};

export const runAudit = async ({ teamSize, primaryUseCase, usageIntensity = "medium", tools, lead }) => {
  const { tools: toolsCatalog, plansByTool, lastUpdated } = await parsePricingCatalog();

  const recommendations = buildToolRecommendations(tools, {
    plansByTool,
    toolsCatalog,
    teamSize,
    usageIntensity,
  });

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
    usageIntensity,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendations,
  });

  const shareId = randomUUID().slice(0, 12);
  const audit = await AuditModel.create({
    teamSize,
    primaryUseCase,
    usageIntensity,
    tools: recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    aiSummary,
    auditScore,
    isHighSavingsLead: totalMonthlySavings >= 1000,
    publicShareId: shareId,
    pricingLastUpdated: lastUpdated,
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
    usageIntensity,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    auditScore,
    aiSummary,
    tools: recommendations,
    pricingLastUpdated: lastUpdated,
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
    usageIntensity: audit.usageIntensity ?? "medium",
    totalMonthlySpend: audit.totalMonthlySpend,
    totalMonthlySavings: audit.totalMonthlySavings,
    totalAnnualSavings: audit.totalAnnualSavings,
    auditScore: audit.auditScore,
    aiSummary: audit.aiSummary,
    tools: audit.tools,
    pricingLastUpdated: audit.pricingLastUpdated,
  };
};

export const sendAuditEmail = async ({ auditId, toEmail }) => {
  const audit = await AuditModel.findById(auditId).lean();
  if (!audit) return { sent: false, reason: "Audit not found" };
  if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN || !env.EMAIL_USER) {
    return { sent: false, reason: "Gmail provider not configured" };
  }

  const topOpportunities = [...audit.tools]
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3)
    .map((item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">${item.emoji}</span>
            <strong style="color: #000;">${item.toolName}</strong>
          </div>
          <div style="font-size: 13px; color: #666; margin-top: 4px; margin-left: 28px;">Recommended: ${item.recommendedPlan}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          <div style="font-size: 18px; font-weight: bold; color: #10b981;">$${item.monthlySavings}</div>
          <div style="font-size: 12px; color: #666;">per month</div>
        </td>
      </tr>
    `)
    .join("");

  const reportLink = `${env.FRONTEND_ORIGIN.split(",")[0].trim()}/report/${audit.publicShareId}`;

  const emailSubject = "🎯 Your SpendPilot Audit Summary - Save $" + audit.totalMonthlySavings + "/month";
  
  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 700;">SpendPilot</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your AI Spend Audit Results</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Greeting -->
          <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px; font-weight: 600;">You can save</h2>
          
          <!-- Big Savings Card -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center; color: #ffffff;">
            <div style="font-size: 14px; opacity: 0.95; margin-bottom: 10px;">Monthly Savings</div>
            <div style="font-size: 48px; font-weight: 700; margin-bottom: 5px;">$${audit.totalMonthlySavings}</div>
            <div style="font-size: 14px; opacity: 0.95;">or <strong>$${audit.totalAnnualSavings}/year</strong></div>
          </div>

          <!-- Summary -->
          <div style="background-color: #f3f4f6; border-left: 4px solid #6366f1; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <div style="color: #111827; line-height: 1.6;">
              ${audit.aiSummary}
            </div>
          </div>

          <!-- Top Opportunities Section -->
          <h3 style="margin: 30px 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Top Opportunities</h3>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                ${topOpportunities}
              </tbody>
            </table>
          </div>

          <!-- Stats Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0;">
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Current Spend</div>
              <div style="font-size: 24px; font-weight: 700; color: #111827;">$${audit.totalMonthlySpend}</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">per month</div>
            </div>
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Audit Score</div>
              <div style="font-size: 24px; font-weight: 700; color: #6366f1;">${audit.auditScore}%</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">optimization potential</div>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reportLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s;">View Full Report</a>
          </div>

          <!-- Team Info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; color: #666;">
            <strong style="color: #111827;">Audit Details:</strong>
            <div style="margin-top: 8px;">Team Size: ${audit.teamSize} • Focus: ${audit.primaryUseCase}</div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 30px; text-align: center; color: #666; font-size: 13px;">
          <p style="margin: 0 0 10px 0;">
            Questions? <a href="mailto:${env.EMAIL_USER}" style="color: #6366f1; text-decoration: none;">Get in touch</a>
          </p>
          <p style="margin: 0; opacity: 0.8;">
            This is an automated message. Please do not reply to this email.
          </p>
          <p style="margin: 10px 0 0 0; opacity: 0.6; font-size: 12px;">
            © 2026 SpendPilot. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  const sent = await sendEmail(toEmail, emailSubject, emailBody);

  if (!sent) {
    return { sent: false, reason: "Failed to send email via Gmail" };
  }

  console.log("Email sent successfully to:", toEmail);

  // Capture lead after successful email send
  await LeadModel.findOneAndUpdate(
    { email: toEmail.toLowerCase().trim() },
    {
      email: toEmail.toLowerCase().trim(),
      auditId: audit._id,
      teamSize: audit.teamSize,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { sent: true };
};

export const bookConsultation = async ({ email, companyName, role }) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // 1. Save Lead to DB
  await LeadModel.findOneAndUpdate(
    { email: normalizedEmail },
    {
      email: normalizedEmail,
      companyName: companyName || "",
      role: role || "",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 2. Send Admin Notification Email
  const adminEmail = process.env.EMAIL_USER;
  const subject = `🚀 New Consultation Request: ${companyName}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #4f46e5;">New Lead Captured!</h2>
      <p>Someone just requested a free AI spend consultation.</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p><strong>Email:</strong> ${normalizedEmail}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Role:</strong> ${role}</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #666;">Generated by SpendPilot Audit Tool</p>
    </div>
  `;

  await sendEmail(adminEmail, subject, html);

  return { success: true };
};
