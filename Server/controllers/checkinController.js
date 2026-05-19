import Goal from "../models/Goal.js";
import { calculateProgress } from "../utils/progressCalculator.js";

export const checkInGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        if (goal.approvalStatus !== "approved") {
            return res.status(400).json({ message: "Can only check in on approved goals" });
        }

        const month = new Date().getMonth();
        // const allowedMonths = [6, 9, 0, 2]; 
        // if (!allowedMonths.includes(month)) {
        //     return res.status(400).json({ message: "Check-in not allowed outside quarterly window" });
        // }

        const oldAchievement = goal.achievement;
        goal.achievement = req.body.achievement;
        goal.progressStatus = req.body.progressStatus || goal.progressStatus;
        goal.progressScore = calculateProgress(goal);

        goal.auditLogs.push({
            changedBy: req.user._id,
            field: "achievement",
            oldValue: String(oldAchievement),
            newValue: String(req.body.achievement)
        });

        await goal.save();
        res.json({ message: "Achievement updated", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to update achievement", error: error.message });
    }
};

export const addManagerComment = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        const oldComment = goal.managerComment;
        goal.managerComment = req.body.comment;

        goal.auditLogs.push({
            changedBy: req.user._id,
            field: "managerComment",
            oldValue: oldComment || "",
            newValue: req.body.comment
        });

        await goal.save();
        res.json({ message: "Comment added", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
};