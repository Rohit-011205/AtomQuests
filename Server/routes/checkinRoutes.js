import express from "express";
import { checkInGoal, addManagerComment } from "../controllers/checkinController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id/checkin", protect, authorizeRoles("employee"), checkInGoal);

router.put("/:id/comment", protect, authorizeRoles("manager"), addManagerComment);

export default router;
