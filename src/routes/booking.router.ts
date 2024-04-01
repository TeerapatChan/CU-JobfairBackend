import express from "express";
import {
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  addBooking,
} from "../controllers/booking.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(protect, getBookings).post(protect, addBooking);

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

export default router;
