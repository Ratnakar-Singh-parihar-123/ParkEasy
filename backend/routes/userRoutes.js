import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllParkings,
  getParkingById,
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/parkings", protect, getAllParkings);
router.get("/parkings/:id", protect, getParkingById);
router.post("/bookings", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.put("/bookings/:id/cancel", protect, cancelBooking);

export default router;
