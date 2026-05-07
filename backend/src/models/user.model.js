import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    companyName: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: ""
    },
    teamSize: {
      type: Number,
      default: 1
    },
    source: {
      type: String,
      default: "website"
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
