import mongoose from "mongoose";

const sharedReportSchema = new mongoose.Schema(
  {
    auditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audit",
      required: true
    },
    shareId: {
      type: String,
      unique: true,
      required: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const SharedReportModel =
  mongoose.models.SharedReport || mongoose.model("SharedReport", sharedReportSchema);
