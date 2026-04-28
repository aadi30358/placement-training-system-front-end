import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/ManageUsers';
import AdminProfile from './pages/admin/Profile';

import StudentDashboard from './pages/student/Dashboard';
import BrowseJobs from './pages/student/BrowseJobs';
import StudentApplications from './pages/student/Applications';
import Profile from './pages/student/Profile';
import Settings from './pages/shared/Settings';

import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import ApplicantManagement from './pages/employer/Applicants';
import EmployerProfile from './pages/employer/Profile';

import OfficerDashboard from './pages/officer/Dashboard';
import PlacementRecords from './pages/officer/Records';
import Reports from './pages/officer/Reports';
import OfficerProfile from './pages/officer/Profile';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route element={<Layout allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Student Routes */}
      <Route element={<Layout allowedRoles={['student']} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<BrowseJobs />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/profile" element={<Profile />} />
      </Route>

      {/* Employer Routes */}
      <Route element={<Layout allowedRoles={['employer']} />}>
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<PostJob />} />
        <Route path="/employer/applicants" element={<ApplicantManagement />} />
        <Route path="/employer/profile" element={<EmployerProfile />} />
      </Route>

      {/* Placement Officer Routes */}
      <Route element={<Layout allowedRoles={['officer']} />}>
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/records" element={<PlacementRecords />} />
        <Route path="/officer/reports" element={<Reports />} />
        <Route path="/officer/profile" element={<OfficerProfile />} />
      </Route>

      <Route path="/settings" element={<Layout />}>
        <Route index element={<Settings />} />
      </Route>

      <Route path="/unauthorized" element={<div className="h-screen flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest">Unauthorized Access</div>} />
      <Route path="*" element={<div className="h-screen flex items-center justify-center">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
