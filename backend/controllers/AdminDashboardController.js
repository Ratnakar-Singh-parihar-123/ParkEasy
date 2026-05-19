// controllers/AdminDashboardController.js

import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

import { getIO } from "../socket/socket.js";

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

// CREATE NOTIFICATION
export const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const notification = await Notification.create({
      title,
      message,
    });

    const io = getIO();

    // send realtime
    io.emit("newNotification", notification);

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
