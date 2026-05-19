import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";

export default function AdminReports() {
  const [goals, setGoals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    axiosInstance.get("/report/dashboard")
      .then(res => setGoals(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axiosInstance.get("/report/achievement", {
        responseType: "blob",
      });
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", "achievement_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const deptSummary = goals.reduce((acc, g) => {
    const d = g.department || "Unknown";
    if (!acc[d]) acc[d] = { total: 0, checkedIn: 0 };
    acc[d].total++;
    if (g.achievement !== null && g.achievement !== undefined) acc[d].checkedIn++;
    return acc;
  }, {});

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Achievement Report</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {exporting ? "Exporting…" : "Download CSV"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">Check-in Completion by Department</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-slate-400 bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-3">Department</th>
              <th className="p-3">Total Goals</th>
              <th className="p-3">Check-ins Done</th>
              <th className="p-3">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(deptSummary).map(([dept, data]) => {
              const rate = Math.round((data.checkedIn / data.total) * 100);
              return (
                <tr key={dept} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{dept}</td>
                  <td className="p-3">{data.total}</td>
                  <td className="p-3">{data.checkedIn}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-10 text-right">
                        {rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Full goal table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">Planned vs Actual — All Employees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3">Target</th>
                <th className="p-3">Achievement</th>
                <th className="p-3">Progress Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {goals.map((g, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{g.employee}</td>
                  <td className="p-3 text-slate-500">{g.department}</td>
                  <td className="p-3">{g.target ?? "—"}</td>
                  <td className="p-3">{g.achievement ?? <span className="text-slate-400 italic">Not entered</span>}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(g.progressScore || 0, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-blue-700">
                        {g.progressScore ? g.progressScore.toFixed(1) + "%" : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      g.status === "Completed" ? "bg-green-50 text-green-700" :
                      g.status === "On Track"  ? "bg-blue-50 text-blue-700"  :
                      "bg-slate-100 text-slate-500"
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