import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout)
  .get("/me", protect, getMe)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password/:resetToken", resetPassword);

export default router;
