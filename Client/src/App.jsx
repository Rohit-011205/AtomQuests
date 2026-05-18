import { React, useState } from 'react'
import './App.css'
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';

function App() {
  const [mode, setMode] = useState("signin");

  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          {/* <Route path="/manager" element={<ManagerDashboard />} /> */}
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        </Route>

      </Routes>
    </>
  );
}

export default App;