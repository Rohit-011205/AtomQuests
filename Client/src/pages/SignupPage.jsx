// import React, { useState } from "react";
// import { axiosInstance } from "../services/api.js";

// export default function SignupPage() {
//     const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         try {
//             await axiosInstance.post("/auth/register", form);
//             alert("Signup successful! Please login.");
//             window.location.href = "/login";
//         } catch (err) {
//             alert(err.response?.data?.message || "Signup failed");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-red-100 ">
//             <form onSubmit={handleSignup} className="bg-purple-200 p-6 rounded shadow-md w-96 space-y-4">
//                 <h2 className="text-2xl font-bold text-center">Signup</h2>
//                 <input name="name" value={form.name} onChange={handleChange} placeholder="Name"
//                     className="w-full p-2 border rounded" />
//                 <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
//                     className="w-full p-2 border rounded" />
//                 <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password"
//                     className="w-full p-2 border rounded" />
//                 <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
//                     <option value="employee">Employee</option>
//                     <option value="manager">Manager</option>
//                     <option value="admin">Admin</option>
//                 </select>
//                 <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//                     Signup
//                 </button>
//             </form>
//         </div>
//     );
// }




import React, { useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../services/api.js";
import { User, Mail, Lock, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook initialized correctly

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/auth/register", form);
            alert("Registration successful. Proceed to login.");
            
            // ✅ FIX: Use programmatic navigation instead of full page reload
            navigate("/login"); 
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden p-4">
            {/* Ambient Background Glows for "Luxury" feel */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                <div className="bg-[#161b2c]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-8 md:p-12">
                    <header className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 mb-4">
                            <Zap size={28} fill="currentColor" className="opacity-80" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">
                            ATOMQUEST <span className="text-blue-500">1.0</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 font-light tracking-wide">
                            Precision in Performance Tracking
                        </p>
                    </header>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Name Field */}
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Corporate Email"
                                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Secure Password"
                                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                required
                            />
                        </div>

                        {/* Role Selector - Required Personas  */}
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option value="employee" className="bg-[#161b2c]">Employee Role</option>
                                <option value="manager" className="bg-[#161b2c]">Manager (L1)</option>
                                <option value="admin" className="bg-[#161b2c]">Admin / HR</option>
                            </select>
                        </div>

                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "INITIALIZE ACCOUNT"
                            )}
                        </motion.button>
                    </form>

                    {/* ✅ UI FIX: Moved Login Link inside the glassmorphism container */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-slate-400">Already have an account? </span>
                        <button
                            type="button"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline bg-transparent border-none p-0 cursor-pointer"
                            onClick={() => navigate('/login')}
                        >
                            Login here
                        </button>
                    </div>

                    <footer className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-[10px] tracking-[0.3em] text-slate-500 font-bold uppercase">
                            Secured by <span className="text-slate-300">DOGESH AI</span>
                        </p>
                    </footer>
                </div>
            </motion.div>
        </div>
    );
}
