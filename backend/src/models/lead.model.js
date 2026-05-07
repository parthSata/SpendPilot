import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    companyName: { type: String, trim: true },
    role: { type: String, trim: true },
    teamSize: { type: Number, min: 1 },
    auditId: { type: mongoose.Schema.Types.ObjectId, ref: "Audit" }
  },
  { timestamps: true }
);

leadSchema.index({ email: 1 }, { unique: true });

export const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
