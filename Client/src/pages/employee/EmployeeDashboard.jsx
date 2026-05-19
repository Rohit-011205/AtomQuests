import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";
import { Link } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  ArrowRight,
  ClipboardList
} from "lucide-react";

export default function EmployeeDashboard() {
    const [goals, setGoals]     = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/goals")
            .then(res => setGoals(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const totalWeight   = goals.reduce((sum, g) => sum + Number(g.weightage || 0), 0);
    const pending       = goals.filter(g => g.approvalStatus === "pending").length;
    const approved      = goals.filter(g => g.approvalStatus === "approved").length;
    const returned      = goals.filter(g => g.approvalStatus === "draft" && g.managerComment);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2DD4BF]"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#003D32]">Performance Hub</h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium">Track your goals and professional growth.</p>
                </div>
                <Link 
                    to="/employee/goals" 
                    className="inline-flex items-center gap-2 bg-[#003D32] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#005246] transition-all shadow-md shadow-emerald-900/10"
                >
                    Update Goal Sheet <ArrowRight size={16} />
                </Link>
            </div>

            {/* Returned goals alert */}
            {returned.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-4">
                    <div className="bg-red-100 p-2 rounded-lg h-fit">
                        <AlertCircle className="text-red-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-900">
                           Action Required: {returned.length} goal{returned.length > 1 ? "s" : ""} returned for rework
                        </p>
                        <div className="grid gap-3 mt-3">
                            {returned.map(g => (
                                <div key={g._id} className="p-3 bg-white/60 border border-red-100 rounded-xl">
                                    <p className="text-sm font-semibold text-gray-800">{g.title}</p>
                                    <p className="text-xs text-red-700 mt-1 italic">
                                        “{g.managerComment}”
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Weightage */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-50 p-3 rounded-2xl text-[#2DD4BF]">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target 100%</span>
                    </div>
                    <h2 className="text-gray-500 text-sm font-semibold">Total Weightage</h2>
                    <p className="text-4xl font-bold text-[#003D32] mt-1">{totalWeight}%</p>
                    <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-[#A7F3D0] to-[#2DD4BF] h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(totalWeight, 100)}%` }} 
                        />
                    </div>
                </div>

                {/* Approval Status */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-500 w-fit mb-4">
                        {approved > 0 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <h2 className="text-gray-500 text-sm font-semibold">Status</h2>
                    <p className={`text-3xl font-bold mt-1 ${
                        approved > 0 ? "text-emerald-600" : pending > 0 ? "text-amber-500" : "text-gray-400"
                    }`}>
                        {approved > 0 ? `${approved} Approved` : pending > 0 ? "Pending Approval" : "Draft Mode"}
                    </p>
                </div>

                {/* Task List/Action Required */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group">
                    <div className="bg-purple-50 p-3 rounded-2xl text-purple-500 w-fit mb-4">
                        <ClipboardList size={20} />
                    </div>
                    <h2 className="text-gray-500 text-sm font-semibold">Active Tasks</h2>
                    <p className="text-3xl font-bold text-[#003D32] mt-1">
                        {returned.length > 0 ? `${returned.length} To Review` : "All Clear"}
                    </p>
                </div>
            </div>

            {/* Goals Table Area */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-bold text-[#003D32] text-lg">My Goals</h2>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                        Current Period
                    </span>
                </div>
                
                {goals.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Target className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Your goal sheet is currently empty.</p>
                        <Link to="/employee/goals" className="text-[#2DD4BF] text-sm font-bold hover:underline mt-2 inline-block">
                            Start creating goals
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F9FAFB] text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">Goal Description</th>
                                    <th className="px-6 py-4 text-center">Weight</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Manager's Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {goals.map(g => (
                                    <tr key={g._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5 font-semibold text-[#003D32]">
                                            {g.title}
                                        </td>
                                        <td className="px-6 py-5 text-center font-medium text-gray-600">
                                            {g.weightage}%
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${
                                                g.approvalStatus === "approved" ? "bg-emerald-50 text-emerald-700" :
                                                g.approvalStatus === "pending"  ? "bg-amber-50 text-amber-700" :
                                                g.managerComment                ? "bg-red-50 text-red-700" :
                                                "bg-gray-100 text-gray-500"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                    g.approvalStatus === "approved" ? "bg-emerald-500" :
                                                    g.approvalStatus === "pending" ? "bg-amber-500" : "bg-red-500"
                                                }`}></span>
                                                {g.approvalStatus === "draft" && g.managerComment ? "Returned" : g.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs text-gray-500 italic max-w-xs truncate group-hover:whitespace-normal">
                                                {g.managerComment || "No feedback yet"}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}