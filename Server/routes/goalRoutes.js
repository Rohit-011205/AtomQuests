import express from "express";
import {
    createGoal, clearMyGoals, submitGoalSheet, approveGoal, returnGoal,
    getGoals, getTeamGoals, getReport, unlockGoal
} from "../controllers/goalController.js";
import { checkInGoal, addManagerComment } from "../controllers/checkinController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",                 protect, authorizeRoles("employee"), createGoal);
router.get("/",                  protect, authorizeRoles("employee"), getGoals);
router.get("/team",              protect, authorizeRoles("manager"),  getTeamGoals);
router.get("/report",            protect, authorizeRoles("admin"),    getReport);

router.delete("/clear-my-goals", protect, authorizeRoles("employee"), clearMyGoals);
router.post("/submit-sheet", protect, authorizeRoles("employee"), submitGoalSheet);

router.put("/:id/approve",       protect, authorizeRoles("manager"),  approveGoal);
router.put("/:id/return",        protect, authorizeRoles("manager"),  returnGoal);
router.put("/:id/checkin",       protect, authorizeRoles("employee"), checkInGoal);
router.put("/:id/comment",       protect, authorizeRoles("manager"),  addManagerComment);
router.put("/:id/unlock",        protect, authorizeRoles("admin"),    unlockGoal);


export default router;