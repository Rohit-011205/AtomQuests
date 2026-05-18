import express from "express"
import Goal from "../models/Goal.js";
import { Parser } from "json2csv";

export const exportAchievementReport = async (req, res) => {
    try {
        const goals = await Goal.find().populate("owner", "name email department role");
        const fields = ["owner.name", "owner.email", "title", "target", "achievement", "progressScore", "status"];
        const parser = new Parser({ fields });
        const csv = parser.parse(goals);

        res.header("Content-Type", "text/csv");
        res.attachment("achievement_report.csv");
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Failed to export report", error: error.message });
    }
};


export const completionDashboard = async (req, res) => {
    try {
        const goals = await Goal.find().populate("owner", "name email role department");
        const dashboard = goals.map(g => ({
            employee: g.owner.name,
            department: g.owner.department,
            status: g.status,
            achievement: g.achievement,
            progressScore: g.progressScore
        }));
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard", error: error.message });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id).populate("auditLogs.changedBy", "name email role");
        res.json(goal.auditLogs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch audit logs", error: error.message });
    }
};


