import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";

export default function ManagerGoalApproval() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMap, setEditMap] = useState({});   // { goalId: { target, weightage } }
  const [commentMap, setCommentMap] = useState({}); // { goalId: string }
  const [filter, setFilter] = useState("pending");

  const fetchGoals = () => {
    setLoading(true);
    axiosInstance.get("/goals/team")
      .then(res => setGoals(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGoals(); }, []);

  const displayed = goals.filter(g =>
    filter === "all" ? true : g.approvalStatus === filter
  );

  const getEdit = (id, field, fallback) =>
    editMap[id]?.[field] !== undefined ? editMap[id][field] : fallback;

  const setEdit = (id, field, value) =>
    setEditMap(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const handleApprove = async (goal) => {
    try {
      await axiosInstance.put(`/goals/${goal._id}/approve`, {
        target: getEdit(goal._id, "target", goal.target),
        weightage: getEdit(goal._id, "weightage", goal.weightage),
        managerComment: commentMap[goal._id] || "",
      });
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const handleReturn = async (goal) => {
    const reason = commentMap[goal._id];
    if (!reason?.trim()) {
      alert("Please add a comment explaining what needs to be changed before returning.");
      return;
    }
    try {
      await axiosInstance.put(`/goals/${goal._id}/return`, { reason });
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  const statusBadge = (status) => {
    const map = {
      draft:    "bg-slate-100 text-slate-600",
      pending:  "bg-amber-50 text-amber-700",
      approved: "bg-green-50 text-green-700",
    };
    return `text-xs font-bold px-2 py-0.5 rounded ${map[status] || "bg-slate-100 text-slate-600"}`;
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Goal Approvals</h1>
        <div className="flex gap-2">
          {["pending", "approved", "all"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-gray-500">
          No {filter === "all" ? "" : filter} goals.
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map(goal => (
            <div key={goal._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-slate-800">{goal.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {goal.owner?.name} · {goal.owner?.department}
                  </p>
                </div>
                <span className={statusBadge(goal.approvalStatus)}>
                  {goal.approvalStatus}
                </span>
              </div>

              {/* Goal details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Thrust Area</p>
                  <p className="font-medium text-slate-700">{goal.thrustArea || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">UoM</p>
                  <p className="font-medium text-slate-700">{goal.uom}</p>
                </div>

                {/* Editable target */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Target</p>
                  {goal.approvalStatus === "pending" ? (
                    <input
                      type={goal.uom === "timeline" ? "date" : "number"}
                      value={getEdit(goal._id, "target", goal.target)}
                      onChange={e => setEdit(goal._id, "target", e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="font-medium text-slate-700">{goal.target}</p>
                  )}
                </div>

                {/* Editable weightage */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Weightage</p>
                  {goal.approvalStatus === "pending" ? (
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={getEdit(goal._id, "weightage", goal.weightage)}
                      onChange={e => setEdit(goal._id, "weightage", e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="font-medium text-slate-700">{goal.weightage}%</p>
                  )}
                </div>
              </div>

              {goal.description && (
                <p className="text-sm text-slate-500 mb-3 italic">{goal.description}</p>
              )}

              {/* Comment box + action buttons — only for pending goals */}
              {goal.approvalStatus === "pending" && (
                <>
                  <textarea
                    rows={2}
                    placeholder="Add a comment (required to return for rework)..."
                    value={commentMap[goal._id] || ""}
                    onChange={e => setCommentMap(prev => ({ ...prev, [goal._id]: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-400 mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(goal)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                    >
                      Approve Goal
                    </button>
                    <button
                      onClick={() => handleReturn(goal)}
                      className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
                    >
                      Return for Rework
                    </button>
                  </div>
                </>
              )}

              {/* Show manager comment on already-processed goals */}
              {goal.managerComment && goal.approvalStatus !== "pending" && (
                <p className="text-xs text-slate-500 mt-2 italic">
                  Manager note: {goal.managerComment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}