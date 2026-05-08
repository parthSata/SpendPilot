import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.FRONTEND_ORIGIN.split(",").map((item) => item.trim());
      const isLocalDevOrigin =
        env.NODE_ENV === "development" &&
        typeof origin === "string" &&
        /^https?:\/\/localhost:\d+$/.test(origin);

      // Allow non-browser requests (curl/postman) and whitelisted browser origins.
      if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
