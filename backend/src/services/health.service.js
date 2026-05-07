import { env } from "../config/env.js";

export const buildHealthPayload = () => ({
  ok: true,
  service: "spendpilot-backend",
  env: env.NODE_ENV
});
