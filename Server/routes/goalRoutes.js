import express from "express";
import { createGoal, approveGoal, checkInGoal, getReport } from "../controllers/goalController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("employee"), createGoal);
router.put("/:id/approve", protect, authorizeRoles("manager"), approveGoal);
router.put("/:id/checkin", protect, authorizeRoles("employee"), checkInGoal);
router.get("/report", protect, authorizeRoles("admin"), getReport);

export default router