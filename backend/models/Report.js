import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    issueType: {
      type: String,
      enum: ["Parking", "Payment", "Bug", "Other"],
      default: "Other",
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Report", reportSchema);
