import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },

    startTime: {
      type: String, // ✅ FIXED
      required: true,
    },

    endTime: {
      type: String, // ✅ FIXED
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"], // ✅ FIXED
      default: "booked",
    },

    vehicleNumber: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ parking: 1 });

export default mongoose.model("Booking", bookingSchema);
