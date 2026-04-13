// controllers/AdminDashboardController.js

import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const recentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email") // ✅ IMPORTANT
      .populate("parking", "name address") // ✅ IMPORTANT
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // ✅ total users
    const totalUsers = await User.countDocuments();

    // ✅ total bookings
    const totalBookings = await Booking.countDocuments();

    // ✅ pending bookings
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    // ✅ completed bookings
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    // ✅ revenue (only completed)
    const revenueData = await Booking.find({ status: "completed" });

    const totalRevenue = revenueData.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );

    res.status(200).json({
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
