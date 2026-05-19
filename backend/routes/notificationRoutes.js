import express from "express";

import {
  createNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/AdminDashboardController.js";

const router = express.Router();

router.post("/create", createNotification);

router.get("/", getNotifications);

router.delete("/:id", deleteNotification);

export default router;
