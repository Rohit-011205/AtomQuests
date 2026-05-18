import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    description: {
        String
    },
    thrustArea: String,
    uom: String,
    target: Number,
    weightage: Number,
    status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    achievement: { type: Number, default: 0 },

    progressScore: { type: Number, default: 0 },
    managerComment: { type: String },
    auditLogs: [{
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        field: String,
        oldValue: String,
        newValue: String,
        changedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true })

export default mongoose.model("Goal", goalSchema);