import express from "express";
import { uploadFile } from "../controllers/file.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/upload", protect, uploadFile);

export default router;
