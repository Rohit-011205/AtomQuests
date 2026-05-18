import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="font-bold">Goal Tracker</h1>
        <div className="space-x-4">
          <Link to="/employee">Employee</Link>
          <Link to="/manager">Manager</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4">
        © 2026 Goal Tracker
      </footer>
    </div>
  );
}
