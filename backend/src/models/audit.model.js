import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  toolName: String,
  currentPlan: String,
  monthlySpend: Number,
  seats: Number,
  recommendedPlan: String,
  recommendedTool: String,
  monthlySavings: Number,
  annualSavings: Number,
  reason: String,
  source: String,
  sourceUrl: String
});

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    teamSize: Number,
    primaryUseCase: {
      type: String,
      enum: ["coding", "writing", "research", "data", "mixed"]
    },
    tools: [toolSchema],
    totalMonthlySpend: Number,
    totalMonthlySavings: Number,
    totalAnnualSavings: Number,
    aiSummary: String,
    auditScore: {
      type: Number,
      default: 0
    },
    isHighSavingsLead: {
      type: Boolean,
      default: false
    },
    publicShareId: {
      type: String,
      unique: true
    },
    pricingLastUpdated: {
      type: String,
      default: () => new Date().toISOString()
    }
  },
  { timestamps: true }
);

export const AuditModel = mongoose.models.Audit || mongoose.model("Audit", auditSchema);
