import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  toolName: String,
  currentPlan: String,
  monthlySpend: Number,
  seats: Number,
  wastedSeats: Number,
  recommendedPlan: String,
  recommendedTool: String,
  monthlySavings: Number,
  annualSavings: Number,
  reason: String,
  recommendationType: {
    type: String,
    enum: ["downgrade_plan", "reduce_seats", "keep_plan", "insufficient_data"],
    default: "keep_plan",
  },
  emoji: String,
  source: String,
  sourceUrl: String,
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
      enum: ["coding", "writing", "research", "data", "mixed"],
    },
    usageIntensity: {
      type: String,
      enum: ["light", "medium", "heavy"],
      default: "medium",
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
