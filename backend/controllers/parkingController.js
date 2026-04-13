import Parking from "../models/Parking.js";

// carete parking

export const createParking = async (req, res) => {
  try {
    const { name, address, pricePerHour, totalSlots } = req.body;

    if (!name || !address || !pricePerHour || !totalSlots) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parking = await Parking.create({
      name,
      address,
      pricePerHour,
      totalSlots,
      availableSlots: totalSlots,
    });

    res.status(201).json({
      message: "Parking created successfully",
      parking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all parking
export const getAllParking = async (req, res) => {
  try {
    const parkings = await Parking.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: parkings.length,
      parkings,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// update parking
export const updateParking = async (req, res) => {
  try {
    const { id } = req.params;

    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }

    Object.assign(parking, req.body);

    await parking.save();

    res.status(200).json({
      message: "Parking updated successfully",
      parking,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// delete parking
export const deleteParking = async (req, res) => {
  try {
    const { id } = req.params;

    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }

    await parking.deleteOne();

    res.status(200).json({
      message: "Parking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// mark parking full
export const markParkingFull = async (req, res) => {
  try {
    const { id } = req.params;

    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }

    parking.isFull = true;
    parking.availableSlots = 0;

    await parking.save();

    res.status(200).json({
      message: "Parking marked as full",
      parking,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
