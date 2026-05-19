import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/goals/team")
      .then(res => setGoals(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pending   = goals.filter(g => g.approvalStatus === "pending").length;
  const approved  = goals.filter(g => g.approvalStatus === "approved").length;
  const checkedIn = goals.filter(g => g.achievement !== null && g.achievement !== undefined).length;

  // Group by employee for the table
  const byEmployee = goals.reduce((acc, g) => {
    const id = g.owner._id;
    if (!acc[id]) acc[id] = { name: g.owner.name, department: g.owner.department, goals: [] };
    acc[id].goals.push(g);
    return acc;
  }, {});

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Team Overview</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Pending Approval</p>
          <p className="text-3xl font-black text-amber-500">{pending}</p>
          <Link to="/manager/approvals" className="text-xs text-blue-600 hover:underline mt-2 block">
            Review now →
          </Link>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Approved Goals</p>
          <p className="text-3xl font-black text-green-600">{approved}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Check-ins Done</p>
          <p className="text-3xl font-black text-blue-600">{checkedIn}</p>
          <Link to="/manager/checkins" className="text-xs text-blue-600 hover:underline mt-2 block">
            View check-ins →
          </Link>
        </div>
      </div>

      {/* Team table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-700">Team Members</h2>
        </div>
        {Object.keys(byEmployee).length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No team members found. Make sure employees have your ID set as their managerId.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Goals</th>
                <th className="p-4">Pending</th>
                <th className="p-4">Approved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(byEmployee).map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">{emp.name}</td>
                  <td className="p-4 text-slate-500">{emp.department}</td>
                  <td className="p-4">{emp.goals.length}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-semibold">
                      {emp.goals.filter(g => g.approvalStatus === "pending").length}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-semibold">
                      {emp.goals.filter(g => g.approvalStatus === "approved").length}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}