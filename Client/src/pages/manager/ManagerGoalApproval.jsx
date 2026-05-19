import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";
import { 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Filter, 
  User, 
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function ManagerGoalApproval() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMap, setEditMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
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
      alert("Please add a comment explaining what needs to be changed.");
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
      draft: "bg-gray-100 text-gray-600",
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-emerald-100 text-emerald-700",
    };
    return `text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 gap-2">
      <div className="w-5 h-5 border-2 border-[#2DD4BF] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium italic">Loading team goals...</span>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Review & Approvals</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage and refine team performance targets.</p>
        </div>
        
        <div className="inline-flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {["pending", "approved", "all"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 uppercase tracking-wide ${
                filter === f
                  ? "bg-[#003D32] text-white shadow-md shadow-emerald-900/20"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
             <Filter size={24} />
          </div>
          <p className="text-slate-400 text-sm font-medium italic truncate">No {filter !== 'all' ? filter : ''} goals found for review.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayed.map(goal => (
            <div key={goal._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 lg:p-8">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#003D32] font-bold shadow-inner">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{goal.title}</h3>
                    <p className="text-xs font-bold text-[#00a38d] mt-1 uppercase tracking-tight">
                      {goal.owner?.name} <span className="text-slate-300 mx-1">•</span> {goal.owner?.department}
                    </p>
                  </div>
                </div>
                <span className={statusBadge(goal.approvalStatus)}>
                  {goal.approvalStatus}
                </span>
              </div>

              {/* Editable Goal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-[#F8FAFB] rounded-2xl border border-slate-50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Thrust Area</p>
                  <p className="text-sm font-bold text-slate-700">{goal.thrustArea || "General Performance"}</p>
                </div>

                <div className="p-4 bg-[#F8FAFB] rounded-2xl border border-slate-50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Unit of Measure</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{goal.uom}</p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${goal.approvalStatus === "pending" ? 'bg-white border-emerald-100 ring-2 ring-emerald-50/50' : 'bg-[#F8FAFB] border-slate-50'}`}>
                  <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest mb-2">Target Value</p>
                  {goal.approvalStatus === "pending" ? (
                    <input
                      type={goal.uom === "timeline" ? "date" : "number"}
                      value={getEdit(goal._id, "target", goal.target)}
                      onChange={e => setEdit(goal._id, "target", e.target.value)}
                      className="w-full text-sm font-black bg-transparent text-slate-800 outline-none focus:text-[#00a38d]"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{goal.target}</p>
                  )}
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${goal.approvalStatus === "pending" ? 'bg-white border-emerald-100 ring-2 ring-emerald-50/50' : 'bg-[#F8FAFB] border-slate-50'}`}>
                  <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest mb-2">Weightage (%)</p>
                  {goal.approvalStatus === "pending" ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number" min={10} max={100}
                        value={getEdit(goal._id, "weightage", goal.weightage)}
                        onChange={e => setEdit(goal._id, "weightage", e.target.value)}
                        className="w-full text-sm font-black bg-transparent text-slate-800 outline-none focus:text-[#00a38d]"
                      />
                      <span className="text-slate-300 font-bold">%</span>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{goal.weightage}%</p>
                  )}
                </div>
              </div>

              {goal.description && (
                <div className="flex gap-3 mb-8 px-4">
                   <Clock size={16} className="text-slate-300 shrink-0 mt-0.5" />
                   <p className="text-sm text-slate-500 italic leading-relaxed">{goal.description}</p>
                </div>
              )}

              {/* Interaction Logic */}
              {goal.approvalStatus === "pending" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <textarea
                    rows={2}
                    placeholder="Provide feedback or refinement notes here..."
                    value={commentMap[goal._id] || ""}
                    onChange={e => setCommentMap(prev => ({ ...prev, [goal._id]: e.target.value }))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#2DD4BF]/20 transition-all placeholder:text-slate-300"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleApprove(goal)}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#003D32] text-[#2DD4BF] py-3.5 rounded-2xl text-sm font-black hover:bg-[#005246] transition-all shadow-lg shadow-emerald-900/10"
                    >
                      <CheckCircle2 size={18} />
                      Approve & Lock Goal
                    </button>
                    <button
                      onClick={() => handleReturn(goal)}
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-50 text-amber-700 border border-amber-100 py-3.5 rounded-2xl text-sm font-bold hover:bg-amber-100 transition-all"
                    >
                      <RotateCcw size={18} />
                      Return for Rework
                    </button>
                  </div>
                </div>
              )}

              {/* Status Note */}
              {goal.managerComment && goal.approvalStatus !== "pending" && (
                <div className={`mt-6 p-4 rounded-2xl flex items-start gap-3 border ${goal.approvalStatus === 'approved' ? 'bg-emerald-50/30 border-emerald-50' : 'bg-slate-50 border-slate-100'}`}>
                  {goal.approvalStatus === 'approved' ? <CheckCircle size={16} className="text-emerald-500 mt-0.5" /> : <AlertCircle size={16} className="text-slate-400 mt-0.5" />}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Note</p>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{goal.managerComment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}