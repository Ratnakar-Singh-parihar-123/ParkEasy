import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";

//  Get all parkings
export const getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({ isFull: false })
      .select("name address pricePerHour availableSlots")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: parkings.length,
      parkings,
    });
  } catch (error) {
    console.error("Get Parkings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get single parking
export const getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }

    res.status(200).json(parking);
  } catch (error) {
    console.error("Get Parking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Create booking (UPDATED 🔥)
export const createBooking = async (req, res) => {
  try {
    const { parkingId, date, startTime, endTime } = req.body;

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const parking = await Parking.findById(parkingId);

    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }

    if (parking.availableSlots <= 0) {
      return res.status(400).json({ message: "No slots available" });
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    const hours = (end - start) / (1000 * 60 * 60);

    if (hours <= 0) {
      return res.status(400).json({ message: "Invalid time" });
    }

    const totalPrice = hours * parking.pricePerHour;

    const slotNumber =
      Math.floor(Math.random() * (parking.totalSlots || 10)) + 1;

    const booking = await Booking.create({
      user: req.user._id,
      parking: parkingId,
      date: new Date(date),
      startTime,
      endTime,
      totalPrice,
      slotNumber,
      status: "booked",
    });

    parking.availableSlots -= 1;
    if (parking.availableSlots === 0) parking.isFull = true;

    await parking.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    console.error("🔥 FULL ERROR:", error); // IMPORTANT
    res.status(500).json({ message: "Internal server error" });
  }
};

//  My bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("parking", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("My Bookings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Cancel booking (clean)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("parking");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    if (booking.parking) {
      booking.parking.availableSlots = Math.min(
        booking.parking.availableSlots + 1,
        booking.parking.totalSlots,
      );

      booking.parking.isFull = booking.parking.availableSlots === 0;

      await booking.parking.save();
    }

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
