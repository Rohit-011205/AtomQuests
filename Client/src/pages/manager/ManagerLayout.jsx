import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquareText, 
  Bell, 
  ShieldCheck
} from "lucide-react"; 
import { useAuthStore } from "../../store/authStore.js";
import logo2 from "../logo2.png";

export default function ManagerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/manager", icon: <LayoutDashboard size={18} /> },
    { name: "Goal Approvals", path: "/manager/approvals", icon: <CheckSquare size={18} /> },
    { name: "Check-in Review", path: "/manager/checkins", icon: <MessageSquareText size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo2}
              className="h-22 bg-white w-auto object-contain"
              alt="Achievo Logo"
            />
          </div>
          <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Manager Portal</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#E6F4F1] text-[#003D32]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#003D32]"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#003D32] flex items-center justify-center text-[#2DD4BF] font-bold shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Manager"}</p>
              <p className="text-[10px] font-bold text-[#00a38d] uppercase tracking-tight">
                {user?.department || "Dept Head"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="p-2 -ml-2 text-gray-600 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(n => n.path === location.pathname)?.name || "Manager Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="hidden sm:block text-sm font-medium text-white bg-[#003D32] px-5 py-2 rounded-full hover:bg-[#005246] transition-colors shadow-sm">
                Team Overview
             </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}