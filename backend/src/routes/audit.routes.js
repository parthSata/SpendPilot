import { Router } from "express";
import {
  bookConsultationController,
  getSharedAuditController,
  runAuditController,
  sendAuditEmailController,
} from "../controllers/audit.controller.js";

export const auditRouter = Router();

auditRouter.post("/audit/consultation", bookConsultationController);

auditRouter.post("/audit/run", runAuditController);
auditRouter.get("/audit/share/:shareId", getSharedAuditController);
auditRouter.post("/audit/send-email", sendAuditEmailController);
