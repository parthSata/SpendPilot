import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    totalAudits: {
      type: Number,
      default: 0
    },
    totalLeads: {
      type: Number,
      default: 0
    },
    totalSharedReports: {
      type: Number,
      default: 0
    },
    averageSavings: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const AnalyticsModel = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);
