import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";
import User from "../models/User.js";

// get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("parking", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// mark booking completed
export const markBookingCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("parking");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // already completed check
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled booking cannot be completed",
      });
    }
    // update status
    booking.status = "completed";

    // slot wapas add karo
    if (booking.parking) {
      booking.parking.availableSlots += 1;

      // full hatao
      if (booking.parking.availableSlots > 0) {
        booking.parking.isFull = false;
      }

      await booking.parking.save();
    }

    await booking.save();

    res.status(200).json({
      message: "Booking marked as completed",
      booking,
    });
  } catch (error) {
    console.error("Error marking booking as completed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// camcel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("parking");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // completed booking cancel nahi honi chahiye
    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    if (booking.parking) {
      // safe increment
      booking.parking.availableSlots = Math.min(
        booking.parking.availableSlots + 1,
        booking.parking.totalSlots,
      );

      booking.parking.isFull = booking.parking.availableSlots === 0;

      await booking.parking.save();
    }

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // self deactivate block
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot deactivate yourself",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // admin protect
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin user cannot be deactivated",
      });
    }

    // already inactive check
    if (!user.isActive) {
      return res.status(400).json({
        message: "User already deactivated",
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// activate user
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // self protection
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot modify your own status",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // admin protect
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin user cannot be modified",
      });
    }

    if (user.isActive) {
      return res.status(400).json({ message: "User already active" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      message: "User activated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
