import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bookConsultation, getSharedAudit, runAudit, sendAuditEmail } from "../services/audit.service.js";

const leadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().min(1),
  role: z.string().optional(),
});

const toolInputSchema = z.object({
  toolName: z.string().min(1),
  currentPlan: z.string().min(1),
  monthlySpend: z.coerce.number().nonnegative(),
  seats: z.coerce.number().int().positive().default(1),
});

const runAuditSchema = z
  .object({
    teamSize: z.coerce.number().int().positive(),
    primaryUseCase: z.enum(["coding", "writing", "research", "data", "mixed"]),
    usageIntensity: z.enum(["light", "medium", "heavy"]).default("medium"),
    tools: z.array(toolInputSchema).min(1),
    /** Honeypot — leave empty; reject if filled (simple bot / scraper friction). */
    website: z.string().optional(),
    lead: z
      .object({
        email: z.string().email(),
        companyName: z.string().optional(),
        role: z.string().optional(),
      })
      .optional(),
  })
  .refine((d) => (d.website ?? "").length === 0, {
    message: "Invalid request",
    path: ["website"],
  });

const sendAuditEmailSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
});

export const runAuditController = asyncHandler(async (req, res) => {
  const parsed = runAuditSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid audit payload", parsed.error.issues);
  }

  const { website: _hp, ...auditPayload } = parsed.data;
  const data = await runAudit(auditPayload);
  return res.status(201).json(new ApiResponse(201, data, "Audit generated successfully"));
});

export const getSharedAuditController = asyncHandler(async (req, res) => {
  const { shareId } = req.params;
  const data = await getSharedAudit(shareId);

  if (!data) {
    throw new ApiError(404, "Shared report not found");
  }

  return res.status(200).json(new ApiResponse(200, data, "Shared audit loaded"));
});

export const sendAuditEmailController = asyncHandler(async (req, res) => {
  const parsed = sendAuditEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid email payload", parsed.error.issues);
  }

  const result = await sendAuditEmail({
    auditId: parsed.data.auditId,
    toEmail: parsed.data.email,
  });

  if (!result.sent) {
    throw new ApiError(400, result.reason || "Unable to send email");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Audit email sent"));
});

export const bookConsultationController = asyncHandler(async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid consultation payload", parsed.error.issues);
  }

  await bookConsultation(parsed.data);
  return res.status(200).json(new ApiResponse(200, {}, "Consultation booked successfully"));
});
