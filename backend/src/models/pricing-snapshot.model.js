import mongoose from "mongoose";

const pricingSnapshotSchema = new mongoose.Schema(
  {
    toolName: String,
    planName: String,
    pricePerMonth: Number,
    billingType: String,
    officialUrl: String,
    verifiedDate: String
  },
  { timestamps: true }
);

export const PricingSnapshotModel =
  mongoose.models.PricingSnapshot || mongoose.model("PricingSnapshot", pricingSnapshotSchema);
