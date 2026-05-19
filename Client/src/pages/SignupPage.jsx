import React, { useState } from "react";
import { axiosInstance } from "../services/api.js";
import logo2 from "./logo2.png";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee", department: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register", form);
      alert("Signup successful!");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    // h-screen and overflow-hidden prevent the page from scrolling
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans selection:bg-blue-100 overflow-hidden">

      {/* Left Section: Compact Glassmorphic Signup */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[40%] p-4 z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">

          {/* Logo Branding - Reduced margin */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white rounded-xl flex items-center justify-center mb-2 overflow-hidden">
              <img src={logo2} className="h-32 w-auto object-contain" alt="Achievo Logo" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-slate-900 tracking-tight">Create Account</h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <div className="group">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all outline-none text-sm" />
            </div>

            <div className="group">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="name@company.com"
                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all outline-none text-sm" />
            </div>

            <div className="group">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 outline-none text-sm appearance-none cursor-pointer">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="group">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all outline-none text-sm" />
            </div>

            <div className="department">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 outline-none text-sm appearance-none cursor-pointer"
              >
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>

            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98] mt-4 text-sm">
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
            <p className="text-[11px] text-slate-400">
              Already a member? <span className="text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => window.location.href = "/login"}>Log In</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Fixed Height Experience */}
      <div className="hidden lg:flex flex-1 p-6 h-full">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200"
            className="absolute inset-0 w-full h-full object-cover" alt="Workspace" />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex flex-col justify-end p-12 text-white">
            <h2 className="text-5xl font-light leading-tight mb-4">Precision <br /><span className="font-bold italic">Engineering.</span></h2>
            <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}