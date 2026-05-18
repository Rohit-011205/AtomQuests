import React, { useState } from "react";
import { axiosInstance } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      setAuth(res.data.user, res.data.token);
      alert("Login successful!");
      if (res.data.user.role === "employee") window.location.href = "/employee";
      if (res.data.user.role === "manager") window.location.href = "/manager";
      if (res.data.user.role === "admin") window.location.href = "/admin";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="w-full p-2 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
          className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
