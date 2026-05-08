import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  register
} from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/forgot-password", forgotPassword);
authRouter.post("/auth/refresh-token", refreshAccessToken);
authRouter.post("/auth/logout", logout);
