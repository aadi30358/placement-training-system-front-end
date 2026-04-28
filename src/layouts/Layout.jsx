import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, Navbar } from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Layout = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar role={user.role} />
            <Navbar role={user.role} />
            <main className="ml-64 pt-24 px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
