import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { auditRouter } from "./audit.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(auditRouter);
