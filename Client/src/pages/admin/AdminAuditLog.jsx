import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";

export default function AdminAuditLog() {
  const [goals, setGoals]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [logs, setLogs]         = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [unlocking, setUnlocking]     = useState(false);

  useEffect(() => {
    axiosInstance.get("/goals/report")
      .then(res => setGoals(res.data))
      .catch(console.error);
  }, []);

  const fetchLogs = async (goal) => {
    setSelected(goal);
    setLogs([]);
    setLoadingLogs(true);
    try {
      const res = await axiosInstance.get(`/report/${goal._id}/audit`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleUnlock = async (goal) => {
    if (!window.confirm(`Unlock "${goal.title}"? The employee will be able to edit it again.`)) return;
    setUnlocking(true);
    try {
      await axiosInstance.put(`/goals/${goal._id}/unlock`);
      // Refresh goal list
      const res = await axiosInstance.get("/goals/report");
      setGoals(res.data);
      setSelected(prev => res.data.find(g => g._id === prev?._id) || null);
      alert("Goal unlocked successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Unlock failed");
    } finally {
      setUnlocking(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Audit Logs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal selector */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h2 className="font-bold text-slate-700 text-sm">Select a goal to inspect</h2>
          </div>
          <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {goals.length === 0 && (
              <li className="p-4 text-sm text-slate-400">No goals found.</li>
            )}
            {goals.map(goal => (
              <li
                key={goal._id}
                onClick={() => fetchLogs(goal)}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition ${
                  selected?._id === goal._id ? "bg-blue-50 border-l-2 border-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{goal.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {goal.owner?.name} · {goal.owner?.department}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      goal.approvalStatus === "approved" ? "bg-green-50 text-green-700" :
                      goal.approvalStatus === "pending"  ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {goal.approvalStatus || goal.status}
                    </span>
                    {goal.lockedAt && (
                      <span className="text-xs text-slate-400">
                        Locked {formatDate(goal.lockedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Audit log panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-700 text-sm">
              {selected ? `Log: ${selected.title}` : "Select a goal →"}
            </h2>
            {selected?.lockedAt && (
              <button
                onClick={() => handleUnlock(selected)}
                disabled={unlocking}
                className="text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
              >
                {unlocking ? "Unlocking…" : "Unlock Goal"}
              </button>
            )}
          </div>

          {!selected && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Click a goal on the left to view its change history.
            </div>
          )}

          {selected && loadingLogs && (
            <div className="p-6 text-sm text-slate-400">Loading logs…</div>
          )}

          {selected && !loadingLogs && logs.length === 0 && (
            <div className="p-6 text-sm text-slate-400 text-center">
              No changes recorded for this goal yet.
            </div>
          )}

          {selected && !loadingLogs && logs.length > 0 && (
            <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {[...logs].reverse().map((log, i) => (
                <li key={i} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {log.changedBy?.name || "Unknown"}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        ({log.changedBy?.role})
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(log.changedAt)}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Changed <span className="font-semibold text-slate-700">{log.field}</span>
                    {" "}from{" "}
                    <span className="bg-red-50 text-red-700 px-1 rounded">
                      {log.oldValue || "—"}
                    </span>
                    {" "}to{" "}
                    <span className="bg-green-50 text-green-700 px-1 rounded">
                      {log.newValue}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}