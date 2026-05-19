import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";

export default function ManagerCheckIn() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [saved, setSaved] = useState({});

  useEffect(() => {
    axiosInstance.get("/goals/team")
      .then(res => setGoals(res.data.filter(g => g.approvalStatus === "approved")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const computeScore = (goal) => {
    const { uom, target, achievement } = goal;
    if (achievement === null || achievement === undefined) return "—";
    switch (uom) {
      case "numeric":
      case "%":
        return ((Number(achievement) / Number(target)) * 100).toFixed(1) + "%";
      case "timeline":
        return new Date(achievement) <= new Date(target) ? "On Time ✓" : "Delayed";
      case "zero":
        return Number(achievement) === 0 ? "100%" : "0%";
      default:
        return "—";
    }
  };

  const handleSaveComment = async (goal) => {
    try {
      await axiosInstance.put(`/goals/${goal._id}/comment`, {
        comment: comments[goal._id] || "",
      });
      setSaved(prev => ({ ...prev, [goal._id]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [goal._id]: false })), 2000);
    } catch (err) {
      alert("Failed to save comment");
    }
  };

  // Group by employee
  const byEmployee = goals.reduce((acc, g) => {
    const id = g.owner._id;
    if (!acc[id]) acc[id] = { name: g.owner.name, department: g.owner.department, goals: [] };
    acc[id].goals.push(g);
    return acc;
  }, {});

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Check-in Review</h1>

      {Object.keys(byEmployee).length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-gray-500">
          No approved goals to review yet.
        </div>
      ) : (
        Object.values(byEmployee).map((emp, ei) => (
          <div key={ei} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <p className="font-bold text-slate-700">{emp.name}</p>
              <p className="text-xs text-slate-400">{emp.department}</p>
            </div>

            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-slate-400 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-3">Goal</th>
                  <th className="p-3">UoM</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Achievement</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emp.goals.map(goal => (
                  <tr key={goal._id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{goal.title}</td>
                    <td className="p-3 text-slate-500">{goal.uom}</td>
                    <td className="p-3">{goal.target ?? "—"}</td>
                    <td className="p-3">
                      {goal.achievement !== null && goal.achievement !== undefined
                        ? goal.achievement
                        : <span className="text-slate-400 italic">Not entered</span>}
                    </td>
                    <td className="p-3 font-semibold text-blue-700">{computeScore(goal)}</td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        goal.progressStatus === "Completed"  ? "bg-green-50 text-green-700" :
                        goal.progressStatus === "On Track"   ? "bg-blue-50 text-blue-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {goal.progressStatus || "Not Started"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Per-employee comment block */}
            <div className="p-4 border-t border-slate-100 flex gap-3 items-start">
              <textarea
                rows={2}
                placeholder={`Check-in comment for ${emp.name}...`}
                value={comments[emp.goals[0]?.owner._id] || ""}
                onChange={e => setComments(prev => ({
                  ...prev,
                  [emp.goals[0]?.owner._id]: e.target.value
                }))}
                className="flex-1 p-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-400"
              />
              <div className="flex flex-col gap-2">
                {emp.goals.map(goal => (
                  <button
                    key={goal._id}
                    onClick={() => {
                      setComments(prev => ({ ...prev, [goal._id]: prev[emp.goals[0]?.owner._id] || "" }));
                      handleSaveComment({ ...goal, _id: goal._id });
                    }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                      saved[goal._id]
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-900 text-white hover:bg-blue-700"
                    }`}
                  >
                    {saved[goal._id] ? "Saved ✓" : `Save: ${goal.title.slice(0, 18)}…`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}