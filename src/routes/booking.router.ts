import express from "express";
import {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(protect, getBookings);

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

export default router;
