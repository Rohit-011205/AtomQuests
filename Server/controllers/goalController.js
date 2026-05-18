import Goal from "../models/Goal.js";

export const createGoal = async (req, res) => {
    try {
        const goal = await Goal.create({ ...req.body, owner: req.user._id });
        res.status(201).json(goal);
    } catch (error) {
        console.log("Error in createGoal: ", error.message)
        res.status(500).json({ message: "Failed to create goal", error: error.message });
    }
};

export const approveGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        goal.status = "approved";
        await goal.save();
        res.json({ message: "Goal approved", goal });
    } catch (error) {
        console.log("Error in approveGoal: ", error.message)
        res.status(500).json({ message: "Failed to approve goal", error: error.message });
    }
};

export const checkInGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: "Goal not found" });

        goal.achievement = req.body.achievement;
        await goal.save();
        res.json({ message: "Achievement updated", goal });
    } catch (error) {
        res.status(500).json({ message: "Failed to update achievement", error: error.message });
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