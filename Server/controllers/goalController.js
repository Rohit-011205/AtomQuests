import Goal from "../models/Goal.js";
import User from "../models/User.js";

export const createGoal = async (req, res) => {
    try {
        const { title, description, thrustArea, uom, target, weightage } = req.body;

        if (!title || !weightage) {
            return res.status(400).json({ message: "Title and weightage are required" });
        }
        if (Number(weightage) < 10) {
            return res.status(400).json({ message: "Minimum weightage per goal is 10%" });
        }

        const existingGoals = await Goal.find({ owner: req.user._id });

        if (existingGoals.length >= 8) {
            return res.status(400).json({ message: "Maximum 8 goals allowed per employee" });
        }

        const currentTotal = existingGoals.reduce((sum, g) => sum + (g.weightage || 0), 0);
        const remaining = Math.round(100 - currentTotal);

        if (Math.round(currentTotal + Number(weightage)) > 100) {
            return res.status(400).json({
                message: `Total weightage would exceed 100%. You have ${remaining}% remaining.`
            });
        }

        const goal = await Goal.create({
            title,
            description,
            thrustArea,
            uom,
            target,
            weightage: Number(weightage),
            owner: req.user._id,
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: "Failed to create goal", error: error.message });
    }
};

export const clearMyGoals = async (req, res) => {
    try {
        await Goal.deleteMany({ owner: req.user._id });
        res.json({ message: "All your goals cleared" });
    } catch (err) {
        res.status(500).json({ message: "Failed to clear goals" });
    }
};

export const approveGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        const { target, weightage, managerComment } = req.body;
        if (target !== undefined) goal.target = target;
        if (weightage !== undefined) goal.weightage = Number(weightage);
        if (managerComment) goal.managerComment = managerComment;

        goal.approvalStatus = "approved";
        goal.lockedAt = new Date();

        goal.auditLogs.push({
            changedBy: req.user._id,
            field: "approvalStatus",
            oldValue: "pending",
            newValue: "approved",
        });

        await goal.save();
        res.json({ message: "Goal approved", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to approve goal", error: error.message });
    }
};

export const returnGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        goal.approvalStatus = "draft";
        goal.managerComment = req.body.reason || "Returned for rework";

        goal.auditLogs.push({
            changedBy: req.user._id,
            field: "approvalStatus",
            oldValue: "pending",
            newValue: "draft",
        });

        await goal.save();
        res.json({ message: "Goal returned for rework", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to return goal", error: error.message });
    }
};

export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ owner: req.user._id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch goals", error: error.message });
    }
};

export const getTeamGoals = async (req, res) => {
    try {
        const teamMembers = await User.find({ managerId: req.user._id }, "_id");
        const memberIds = teamMembers.map(m => m._id);
        const goals = await Goal.find({ owner: { $in: memberIds } })
            .populate("owner", "name email department");
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch team goals", error: error.message });
    }
};

export const getReport = async (req, res) => {
    try {
        const goals = await Goal.find().populate("owner", "name email role department");
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch report", error: error.message });
    }
};

export const unlockGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        goal.lockedAt = null;
        goal.approvalStatus = "draft";

        goal.auditLogs.push({
            changedBy: req.user._id,
            field: "approvalStatus",
            oldValue: "approved",
            newValue: "draft (unlocked by admin)",
        });

        await goal.save();
        res.json({ message: "Goal unlocked", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to unlock goal", error: error.message });
    }
};

export const submitGoalSheet = async (req, res) => {
    try {
        await Goal.updateMany(
            { owner: req.user._id, approvalStatus: "draft" },
            { $set: { approvalStatus: "pending" } }
        );
        res.json({ message: "Goal sheet submitted for approval" });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit goal sheet", error: error.message });
    }
};