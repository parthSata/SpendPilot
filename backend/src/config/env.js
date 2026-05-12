import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  FRONTEND_ORIGIN: z.string().min(1).default("http://localhost:8080,http://localhost:5173"),
  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  ACCESS_TOKEN_EXPIRY: z.string().default("1d"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
  GMAIL_CLIENT_ID: z.string().optional(),
  GMAIL_CLIENT_SECRET: z.string().optional(),
  GMAIL_REFRESH_TOKEN: z.string().optional(),
  EMAIL_USER: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

const data = parsed.data;

const mongoLooksLocal =
  /(^|@)(localhost|127\.0\.0\.1)(:|\/|$)/i.test(data.MONGO_URI) ||
  data.MONGO_URI.startsWith("mongodb://localhost") ||
  data.MONGO_URI.startsWith("mongodb://127.0.0.1");

if (data.NODE_ENV === "production" && mongoLooksLocal) {
  throw new Error(
    "MONGO_URI points at localhost, which has no MongoDB on Render. " +
      "Use MongoDB Atlas (or another hosted cluster) and set MONGO_URI to that connection string in the Render dashboard."
  );
}

export const env = data;
