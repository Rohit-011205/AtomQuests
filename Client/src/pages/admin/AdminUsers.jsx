import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api.js";

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [saving, setSaving]   = useState({});
  const [assignMap, setAssignMap] = useState({}); // { userId: managerId }

  const fetchUsers = () => {
    setLoading(true);
    axiosInstance.get("/auth/users")
      .then(res => {
        setUsers(res.data);
        // Pre-fill assignMap with existing managerId values
        const map = {};
        res.data.forEach(u => { if (u.managerId) map[u._id] = u.managerId; });
        setAssignMap(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const managers = users.filter(u => u.role === "manager");

  const handleAssign = async (employeeId) => {
    setSaving(prev => ({ ...prev, [employeeId]: true }));
    try {
      await axiosInstance.put(`/auth/users/${employeeId}/assign-manager`, {
        managerId: assignMap[employeeId] || null,
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setSaving(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.department || "").toLowerCase().includes(search.toLowerCase())
  );

  const employees = filtered.filter(u => u.role === "employee");
  const otherUsers = filtered.filter(u => u.role !== "employee");

  const roleBadge = (role) => {
    const map = {
      employee: "bg-blue-50 text-blue-700",
      manager:  "bg-purple-50 text-purple-700",
      admin:    "bg-red-50 text-red-700",
    };
    return `text-xs font-bold px-2 py-0.5 rounded ${map[role] || "bg-slate-100 text-slate-600"}`;
  };

  const getManagerName = (managerId) => {
    const m = managers.find(m => m._id === managerId);
    return m ? m.name : "—";
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, department…"
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-72 focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Manager assignment section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">Assign Managers to Employees</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Employees sign up without a manager. Assign them here.
          </p>
        </div>

        {employees.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">No employees found.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-400 bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Current Manager</th>
                <th className="p-4">Assign Manager</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(u => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-4 text-slate-500">{u.department || "—"}</td>
                  <td className="p-4 text-slate-600">
                    {u.managerId
                      ? <span className="text-green-700 font-medium">{getManagerName(u.managerId)}</span>
                      : <span className="text-amber-600 italic text-xs">Not assigned</span>
                    }
                  </td>
                  <td className="p-4">
                    {managers.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No managers registered yet</span>
                    ) : (
                      <select
                        value={assignMap[u._id] || ""}
                        onChange={e => setAssignMap(prev => ({ ...prev, [u._id]: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white"
                      >
                        <option value="">— Unassign —</option>
                        {managers.map(m => (
                          <option key={m._id} value={m._id}>
                            {m.name} ({m.department || "No dept"})
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleAssign(u._id)}
                      disabled={saving[u._id] || managers.length === 0}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {saving[u._id] ? "Saving…" : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All users overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">All Users</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-slate-400 bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(u => (
              <tr key={u._id} className="hover:bg-slate-50">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-slate-500">{u.email}</td>
                <td className="p-4"><span className={roleBadge(u.role)}>{u.role}</span></td>
                <td className="p-4 text-slate-500">{u.department || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}