import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../services/api.js";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle, 
  Target, 
  SendHorizontal
} from "lucide-react";

export default function EmployeeGoals() {
    const [goals, setGoals] = useState([]);
    const [hasReturnedGoals, setHasReturnedGoals] = useState(false);
    const [form, setForm] = useState({
        title: "", description: "", thrustArea: "",
        target: "", weightage: 10, uom: "numeric",
    });

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const res = await axiosInstance.get("/goals");
                const returned = res.data.filter(g => g.approvalStatus === "draft" && g.managerComment);
                if (returned.length > 0) setHasReturnedGoals(true);

                const editableGoals = res.data.filter(g => g.approvalStatus === "draft" || g.approvalStatus === "pending");

                if (editableGoals.length > 0) {
                    setGoals(editableGoals.map(g => ({
                        _id: g._id,
                        title: g.title,
                        description: g.description || "",
                        thrustArea: g.thrustArea || "",
                        target: g.target ?? "",
                        weightage: g.weightage,
                        uom: g.uom,
                        managerComment: g.managerComment || "",
                    })));
                } else {
                    const saved = localStorage.getItem("my_goals_draft");
                    if (saved) setGoals(JSON.parse(saved));
                }
            } catch (err) {
                const saved = localStorage.getItem("my_goals_draft");
                if (saved) setGoals(JSON.parse(saved));
            }
        };
        loadGoals();
    }, []);

    useEffect(() => {
        localStorage.setItem("my_goals_draft", JSON.stringify(goals));
    }, [goals]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const totalWeightage = goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (goals.length >= 8) return alert("Maximum 8 goals allowed");
        if (Number(form.weightage) < 10) return alert("Minimum weightage per goal is 10%");
        if (totalWeightage + Number(form.weightage) > 100) return alert("Total weightage cannot exceed 100%");
        if (!form.title) return alert("Please enter a goal title");

        setGoals([...goals, { ...form, weightage: Number(form.weightage) }]);
        setForm({ title: "", description: "", thrustArea: "", target: "", weightage: 10, uom: "numeric" });
    };

    const handleDeleteGoal = (index) => setGoals(goals.filter((_, i) => i !== index));

    const handleEditGoal = (index) => {
        setForm({ ...goals[index] });
        handleDeleteGoal(index);
    };

    const doSubmit = async () => {
        for (const goal of goals) {
            if ((goal.uom === "numeric" || goal.uom === "%") && !goal.target) {
                alert(`Please enter a target for: "${goal.title}"`);
                return;
            }
        }

        try {
            await axiosInstance.delete("/goals/clear-my-goals");
            for (const goal of goals) {
                const cleanGoal = {
                    title: goal.title,
                    description: goal.description || "",
                    thrustArea: goal.thrustArea || "",
                    uom: goal.uom,
                    weightage: Number(goal.weightage),
                    target: goal.uom === "zero" ? 0 
                            : goal.uom === "timeline" ? goal.target 
                            : Number(goal.target),
                };
                await axiosInstance.post("/goals", cleanGoal);
            }
            await axiosInstance.post("/goals/submit-sheet");
            alert("Goal Sheet Submitted!");
            setGoals([]);
            setHasReturnedGoals(false);
            localStorage.removeItem("my_goals_draft");
        } catch (err) {
            alert(err.response?.data?.message || "Submission failed.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Active Goal Sheet</h1>
                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        totalWeightage === 100 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                        Total Weightage: {totalWeightage}% {totalWeightage === 100 ? "✓ Ready" : ""}
                    </div>
                </div>
                
                {/* Submit Actions */}
                <div className="flex items-center gap-3">
                    {totalWeightage === 100 && !hasReturnedGoals && (
                        <button onClick={doSubmit} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-md">
                            <SendHorizontal size={16} /> Submit Goal Sheet for Approval
                        </button>
                    )}
                    {hasReturnedGoals && goals.length > 0 && (
                        <button onClick={doSubmit} className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-md">
                            <SendHorizontal size={16} /> Resubmit for Approval
                        </button>
                    )}
                </div>
            </div>

            {hasReturnedGoals && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
                    <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-800">⚠ Some goals were returned by your manager for rework.</p>
                        <p className="text-xs text-amber-700 mt-1">Review manager comments, make edits, then click Resubmit.</p>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-8">
                {/* ADD GOAL FORM */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleAddGoal} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-6">
                        <h2 className="font-semibold text-slate-700">Add a Goal</h2>

                        <input
                            name="title" value={form.title} onChange={handleChange}
                            placeholder="Goal Title" required
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none"
                        />

                        <textarea
                            name="description" value={form.description} onChange={handleChange}
                            placeholder="Description (optional)" rows={2}
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none resize-none"
                        />

                        <select name="thrustArea" value={form.thrustArea} onChange={handleChange}
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none">
                            <option value="">Select Thrust Area</option>
                            <option value="Revenue Growth">Revenue Growth</option>
                            <option value="Customer Satisfaction">Customer Satisfaction</option>
                            <option value="Operational Efficiency">Operational Efficiency</option>
                            <option value="Innovation">Innovation</option>
                            <option value="Compliance & Safety">Compliance & Safety</option>
                        </select>

                        <select name="uom" value={form.uom} onChange={handleChange}
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none">
                            <option value="numeric">Numeric</option>
                            <option value="%">Percentage</option>
                            <option value="timeline">Timeline</option>
                            <option value="zero">Zero-based</option>
                        </select>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">Planned Target</label>
                            {form.uom === "timeline" ? (
                                <input type="date" name="target" value={form.target} onChange={handleChange}
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none" />
                            ) : (
                                <input type="number" name="target"
                                    value={form.uom === "zero" ? 0 : form.target}
                                    onChange={handleChange}
                                    disabled={form.uom === "zero"}
                                    placeholder={form.uom === "zero" ? "Auto-set to 0" : "Enter target value"}
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none disabled:bg-slate-50" />
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                                Weightage (%) — min 10%, remaining: {100 - totalWeightage}%
                            </label>
                            <input type="number" name="weightage" value={form.weightage} onChange={handleChange}
                                min={10} max={100}
                                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none" />
                        </div>

                        <button type="submit" disabled={totalWeightage >= 100}
                            className="w-full bg-[#003D32] text-white py-2.5 rounded-lg hover:bg-[#005246] transition text-sm font-semibold disabled:opacity-40">
                            + Add Goal
                        </button>
                    </form>
                </div>

                {/* GOALS LIST */}
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-lg font-bold text-slate-700 px-2">My Goals ({goals.length}/8)</h2>

                    {goals.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-100 rounded-2xl p-16 text-center">
                            <Target className="mx-auto text-slate-200 mb-2" size={40} />
                            <p className="text-slate-400 text-sm">No goals added yet. Use the form to start.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {goals.map((goal, index) => (
                                <div key={index} className={`p-5 bg-white border rounded-2xl shadow-sm group ${goal.managerComment ? 'border-amber-300 bg-amber-50' : 'border-slate-100'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-slate-800">{goal.title}</h3>
                                                <span className="text-xs font-black text-emerald-600">{goal.weightage}%</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                                {goal.thrustArea || "No thrust area"} • {goal.uom} • Target: {goal.target || "—"}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEditGoal(index)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteGoal(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {goal.description && <p className="text-xs text-slate-400 mt-2 italic border-l-2 border-slate-100 pl-2">{goal.description}</p>}

                                    {goal.managerComment && (
                                        <div className="mt-3 p-3 bg-white border border-amber-200 rounded-xl">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Manager Feedback</p>
                                            <p className="text-xs text-amber-800 mt-0.5">"{goal.managerComment}"</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}