import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, Navbar } from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Layout = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="btn-spinner" style={{ width: '40px', height: '40px', borderColor: '#2563eb', borderTopColor: 'transparent' }} />
        </div>
    );

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
