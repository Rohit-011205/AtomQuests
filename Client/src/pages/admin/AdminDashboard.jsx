import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download, Users, CheckCircle, Clock, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/report/dashboard")
            .then(res => setDashboard(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Approval metrics
    const total = dashboard.length;
    const pending = dashboard.filter(g => g.approvalStatus === "pending").length;
    const approved = dashboard.filter(g => g.approvalStatus === "approved").length;

    // Check-in status
    const completed = dashboard.filter(g => g.status === "Completed").length;

    // Departmental Data
    const deptMap = dashboard.reduce((acc, g) => {
        const d = g.department || "Unknown";
        if (!acc[d]) acc[d] = { dept: d, approved: 0, completed: 0 };
        if (g.approvalStatus === "approved") acc[d].approved++;
        if (g.status === "Completed") acc[d].completed++;
        return acc;
    }, {});

    const chartData = Object.values(deptMap);

    // Lattice Signature Colors
    const LATTICE_GREEN = "#004d3d";
    const LATTICE_MINT = "#e6f2f0";
    const LATTICE_ACCENT = "#24ffbc"; // Bright mint for highlights

    if (loading) return <div className="flex items-center justify-center h-screen text-slate-400 font-medium">Initializing Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto p-8 bg-[#f9fafb] min-h-screen font-sans text-slate-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-3">
                        <LayoutDashboard className="text-[#004d3d]" /> Admin Overview
                    </h1>
                    <p className="text-slate-500 mt-1">Real-time governance for AtomQuest 1.0 cycle [cite: 40]</p>
                </div>
                <Link to="/admin/reports" className="flex items-center gap-2 bg-[#004d3d] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#003d30] transition shadow-sm">
                    <Download size={18} /> Export Completion Report [cite: 42]
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Total Goals", value: total, icon: Users, color: "bg-blue-50 text-blue-700" },
                    { label: "Pending Review", value: pending, icon: Clock, color: "bg-amber-50 text-amber-700" },
                    { label: "Approved Sheets", value: approved, icon: CheckCircle, color: "bg-green-50 text-green-700" },
                    { label: "Goal Completion", value: `${total ? Math.round((completed / total) * 100) : 0}%`, icon: LayoutDashboard, color: "bg-emerald-50 text-[#004d3d]" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Departmental Progress Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Departmental Health [cite: 65]</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="approved" name="Approved" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={30} />
                                <Bar dataKey="completed" name="Completed" fill={LATTICE_GREEN} radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Audit Insights */}
                <div className="bg-[#004d3d] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-medium mb-4 text-[#24ffbc]">Audit Readiness [cite: 44]</h3>
                        <p className="text-emerald-100/80 text-sm mb-6 leading-relaxed">
                            System is logging all goal modifications post-lock. Ensure all Q1 check-ins are finalized by July window[cite: 37, 44].
                        </p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-sm opacity-70">Cycle Window</span>
                                <span className="text-sm font-medium">May - March [cite: 37]</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm opacity-70">UoM Coverage</span>
                                <span className="text-sm font-medium">4 Types Active [cite: 14]</span>
                            </div>
                        </div>
                    </div>
                    {/* Lattice-style organic shape */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#24ffbc] opacity-10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Governance Table */}
            <div className="mt-10 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Completion Dashboard [cite: 43]</h3>
                    <span className="text-xs font-medium text-[#004d3d] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Live Logs</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4 text-left">Employee</th>
                                <th className="px-6 py-4 text-left">Goal Title [cite: 13]</th>
                                <th className="px-6 py-4 text-center">Score [cite: 33]</th>
                                <th className="px-6 py-4 text-center">Status [cite: 29]</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dashboard.slice(0, 5).map((g, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{g.employee}</div>
                                        <div className="text-xs text-slate-400">{g.department}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 italic">{g.title || "No Title Provided"}</td>
                                    <td className="px-6 py-4 text-center font-bold text-[#004d3d]">
                                        {g.progressScore ? `${g.progressScore.toFixed(0)}%` : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter ${
                                            g.status === "Completed" ? "bg-emerald-100 text-[#004d3d]" : "bg-slate-100 text-slate-500"
                                        }`}>
                                            {g.status || "Not Started"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}