import { React, useState } from 'react'
import './App.css'
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';

import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import EmployeeLayout from './pages/employee/EmployeeLayout.jsx';
import EmployeeGoals from './pages/employee/EmployeeGoals.jsx';
import EmployeeNotifications from './pages/employee/EmployeeNotifications.jsx';
import EmployeeSettings from './pages/employee/EmployeeSettings.jsx';
import AchievementUpdate from './pages/employee/AchievementUpdate.jsx';

import ManagerLayout from './pages/manager/ManagerLayout.jsx';
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx';
import ManagerGoalApproval from './pages/manager/ManagerGoalApproval.jsx';
import ManagerCheckIn from './pages/manager/ManagerCheckIn.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminAuditLog from './pages/admin/AdminAuditLog.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

function App() {
  const [mode, setMode] = useState("signin");

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="goals" element={<EmployeeGoals />} />
          <Route path="notifications" element={<EmployeeNotifications />} />
          <Route path="settings" element={<EmployeeSettings />} />
          <Route path="/employee/achievements" element={<AchievementUpdate />} />
        </Route>

        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="approvals" element={<ManagerGoalApproval />} />
          <Route path="checkins" element={<ManagerCheckIn />} />
        </Route>

        <Route path="/admin" element={
         <AdminLayout />
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="audit" element={<AdminAuditLog />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>


      </Routes >
    </>
  );
}

export default App;