import express from "express";
import { exportAchievementReport, completionDashboard, getAuditLogs } from "../controllers/reportController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/achievement", protect, authorizeRoles("admin"), exportAchievementReport);
router.get("/dashboard", protect, authorizeRoles("admin"), completionDashboard);
router.get("/:id/audit", protect, authorizeRoles("admin"), getAuditLogs);

export default router;
