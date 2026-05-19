import express from "express"
import Goal from "../models/Goal.js";
import { Parser } from "json2csv";

export const exportAchievementReport = async (req, res) => {
    try {
        const goals = await Goal.find().populate("owner", "name email department role");

        const flat = goals.map(g => ({
            employeeName: g.owner?.name || "",
            employeeEmail: g.owner?.email || "",
            department: g.owner?.department || "",
            role: g.owner?.role || "",
            goalTitle: g.title || "",
            thrustArea: g.thrustArea || "",
            uom: g.uom || "",
            target: g.target ?? "",
            achievement: g.achievement ?? "",
            progressScore: g.progressScore ?? 0,
            approvalStatus: g.approvalStatus || "",
            progressStatus: g.progressStatus || "",
        }));

        const fields = [
            "employeeName", "employeeEmail", "department", "role",
            "goalTitle", "thrustArea", "uom",
            "target", "achievement", "progressScore",
            "approvalStatus", "progressStatus",
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(flat);

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
            employee:       g.owner?.name        || "Unknown",
            department:     g.owner?.department  || "Unknown",
            title:          g.title,
            target:         g.target,
            achievement:    g.achievement,
            // Use progressStatus for check-in state
            status:         g.progressStatus     || "Not Started",
            approvalStatus: g.approvalStatus,
            progressScore:  g.progressScore,
            lockedAt:       g.lockedAt,
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


