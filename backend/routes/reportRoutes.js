import express from "express";

import {
  createReport,
  getUserReports,
  updateReportStatus,
  deleteReport,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createReport);

router.get("/", getUserReports);

router.put("/:id", updateReportStatus);

router.delete("/:id", deleteReport);

export default router;
