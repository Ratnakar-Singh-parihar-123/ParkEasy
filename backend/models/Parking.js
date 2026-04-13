import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSlots: {
      type: Number,
      default: function () {
        return this.totalSlots;
      },
      min: 0,
    },

    isFull: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // future use
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Parking", parkingSchema);
