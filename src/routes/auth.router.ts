import express, { NextFunction, Response, RequestHandler } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register).post("/login", login).get("/logout", logout);

router.get("/me", protect, getMe);

export default router;
