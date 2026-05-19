import React, { useState } from "react";
import { axiosInstance } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import logo2 from "./logo2.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      setAuth(res.data.user, res.data.token);

      if (res.data.user.role === "employee") navigate("/employee");
      if (res.data.user.role === "manager") navigate("/manager");
      if (res.data.user.role === "admin") navigate("/admin");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 overflow-hidden">

      {/* Left Section: Elevated Glassmorphic Login */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[45%] p-6">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">

          {/* Logo Branding Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-white rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={logo2}
                className="h-32 w-auto object-contain"
                alt="Achievo Logo"
              />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Enter your credentials to manage your goals</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all outline-none shadow-sm placeholder:text-slate-300"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all outline-none shadow-sm placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-semibold text-white bg-slate-900 transition-all duration-500 ease-in-out transform hover:bg-gradient-to-r hover:from-[#10B981] hover:to-[#06B6D4] hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <p className="text-xs text-slate-400">
              Need access?{" "}
              <span 
                onClick={() => navigate("/signup")} 
                className="text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Create New Account
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Visual Experience */}
      <div className="hidden lg:flex flex-1 bg-slate-100 items-center justify-center p-12">
        <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200"
            alt="Luxury Office"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col justify-end p-16 text-white">
            <p className="text-blue-400 font-bold tracking-[0.4em] text-xs uppercase mb-4">Precision Tracking</p>
            <h2 className="text-6xl font-light leading-tight mb-6">Mastering Organizational <br /><span className="font-bold italic">Alignment.</span></h2>
            <div className="flex gap-4">
              <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
              <div className="h-1 w-8 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}