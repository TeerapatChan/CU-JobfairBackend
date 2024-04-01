import express from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "../controllers/company.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(getCompanies).post(protect, createCompany);
router
  .route("/:id")
  .get(protect, getCompany)
  .put(protect, updateCompany)
  .delete(protect, deleteCompany);

export default router;
