import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAllBookings,
  markBookingCompleted,
  cancelBooking,
  deactivateUser,
  activateUser,
} from "../controllers/adminController.js";

// admin dashboard routes
import {
  recentBookings,
  getDashboardStats,
} from "../controllers/AdminDashboardController.js";

// parking controllers
import {
  createParking,
  getAllParking,
  updateParking,
  deleteParking,
  markParkingFull,
} from "../controllers/parkingController.js";

const router = express.Router();

// users
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id/deactivate", protect, isAdmin, deactivateUser);
router.put("/users/:id/activate", protect, isAdmin, activateUser);

// bookings
router.get("/bookings", protect, isAdmin, getAllBookings);
router.put("/bookings/:id/complete", protect, isAdmin, markBookingCompleted);
router.put("/bookings/:id/cancel", protect, isAdmin, cancelBooking);

// dashboard
router.get("/dashboard/recent-bookings", protect, isAdmin, recentBookings);
router.get("/dashboard/stats", protect, isAdmin, getDashboardStats);
// parking
router.post("/parkings", protect, isAdmin, createParking);
router.get("/parkings", protect, isAdmin, getAllParking);
router.put("/parkings/:id", protect, isAdmin, updateParking);
router.delete("/parkings/:id", protect, isAdmin, deleteParking);
router.put("/parkings/:id/full", protect, isAdmin, markParkingFull);

export default router;
