import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";

export default function AchievementUpdate() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState({});

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await axiosInstance.get("/goals");
                // FIX: use approvalStatus not status
                setGoals(res.data.filter(g => g.approvalStatus === "approved"));
            } catch (err) {
                console.error("Failed to fetch goals", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...goals];
        updated[index][field] = value;
        setGoals(updated);
    };

    const computeScore = (goal) => {
        const { uom, target, achievement } = goal;
        if (achievement === null || achievement === undefined || achievement === "") return "—";

        if (uom === "numeric" || uom === "%") {
            if (!target) return "—";
            return ((Number(achievement) / Number(target)) * 100).toFixed(1) + "%";
        }
        if (uom === "timeline") {
            return new Date(achievement) <= new Date(target) ? "✓ On Time" : "⚠ Delayed";
        }
        if (uom === "zero") {
            return Number(achievement) === 0 ? "100%" : "0%";
        }
        return "—";
    };

    const saveCheckIn = async (goal) => {
        try {
            await axiosInstance.put(`/goals/${goal._id}/checkin`, {
                achievement:    goal.achievement,
                progressStatus: goal.progressStatus,
            });
            setSaved(prev => ({ ...prev, [goal._id]: true }));
            setTimeout(() => setSaved(prev => ({ ...prev, [goal._id]: false })), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save check-in");
        }
    };

    if (loading) return <div className="text-gray-500 text-sm p-6">Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Quarterly Achievement Update</h1>

            {goals.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-gray-500">No approved goals yet.</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Goals appear here once your manager approves them.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {goals.map((goal, i) => (
                        <div key={goal._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">

                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="font-bold text-slate-800">{goal.title}</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {goal.thrustArea} · {goal.uom} · Target: <span className="font-semibold text-slate-600">{goal.target}</span>
                                    </p>
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">
                                    approved
                                </span>
                            </div>

                            {/* Manager comment — show if exists */}
                            {goal.managerComment && (
                                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs font-bold text-amber-700 mb-1">Manager Comment</p>
                                    <p className="text-sm text-amber-800">{goal.managerComment}</p>
                                </div>
                            )}

                            {/* Achievement input */}
                            {goal.uom === "timeline" ? (
                                <input
                                    type="date"
                                    value={goal.achievement || ""}
                                    onChange={e => handleChange(i, "achievement", e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-blue-400"
                                />
                            ) : goal.uom === "zero" ? (
                                <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                    Target is zero-based. Mark status below to record completion.
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    value={goal.achievement || ""}
                                    onChange={e => handleChange(i, "achievement", e.target.value)}
                                    placeholder="Enter actual achievement"
                                    className="w-full p-2 border border-slate-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-blue-400"
                                />
                            )}

                            {/* Status dropdown */}
                            <select
                                value={goal.progressStatus || "Not Started"}
                                onChange={e => handleChange(i, "progressStatus", e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg mt-2 text-sm focus:outline-none focus:border-blue-400"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="On Track">On Track</option>
                                <option value="Completed">Completed</option>
                            </select>

                            {/* Score */}
                            <div className="mt-3 flex justify-between items-center">
                                <p className="text-sm text-slate-600">
                                    Computed Score: <span className="font-bold text-blue-700">{computeScore(goal)}</span>
                                </p>
                                <button
                                    onClick={() => saveCheckIn(goal)}
                                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                                        saved[goal._id]
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-900 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {saved[goal._id] ? "Saved ✓" : "Save Check-in"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}