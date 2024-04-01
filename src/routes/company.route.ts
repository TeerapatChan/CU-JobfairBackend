import express from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "../controllers/company.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(getCompanies)
  .post(protect, authorize("admin"), createCompany);
router
  .route("/:id")
  .get(protect, getCompany)
  .put(protect, authorize("admin"), updateCompany)
  .delete(protect, authorize("admin"), deleteCompany);

export default router;
