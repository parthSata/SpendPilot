import mongoose from "mongoose";
import { env } from "../config/env.js";

export const connectDb = async () => {
  await mongoose.connect(env.MONGO_URI);
};
