import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    email: String,
    subject: String,
    status: {
      type: String,
      enum: ["sent", "failed"]
    },
    provider: {
      type: String,
      default: "resend"
    }
  },
  { timestamps: true }
);

export const EmailLogModel = mongoose.models.EmailLog || mongoose.model("EmailLog", emailLogSchema);
