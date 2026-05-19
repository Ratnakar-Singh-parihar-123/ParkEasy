import express from "express";

import {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
  ChangePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

// USER ROUTES
router.put("/update", protect, updateUser);

// FORGOT PASSWORD ROUTES
router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password", resetPassword);

router.post("/resend-otp", resendOTP);

// change password route (optional)
router.put("/change-password", protect, ChangePassword);

export default router;
