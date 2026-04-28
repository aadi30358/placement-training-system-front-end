import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Settings,
    LogOut,
    GraduationCap,
    Building2,
    Bell,
    User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
        }
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

export const Sidebar = ({ role }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = {
        admin: [
            { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
            { to: '/admin/users', icon: Users, label: 'Campus Users' },
            { to: '/admin/profile', icon: User, label: 'My Admin Profile' },
        ],
        student: [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/jobs', icon: Briefcase, label: 'Job Board' },
            { to: '/student/applications', icon: FileText, label: 'My Track' },
            { to: '/student/profile', icon: User, label: 'Placement CV' },
        ],
        employer: [
            { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Stats' },
            { to: '/employer/jobs', icon: Briefcase, label: 'Hiring Posts' },
            { to: '/employer/applicants', icon: Users, label: 'Talent Pool' },
            { to: '/employer/profile', icon: User, label: 'Company Hub' },
        ],
        officer: [
            { to: '/officer/dashboard', icon: LayoutDashboard, label: 'Insights' },
            { to: '/officer/records', icon: FileText, label: 'Student Data' },
            { to: '/officer/reports', icon: Bell, label: 'Placement Pulse' },
            { to: '/officer/profile', icon: User, label: 'Officer Desk' },
        ],
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo-container">
                <div className="sidebar-logo">
                    <GraduationCap size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="sidebar-brand-name">PTS Portal</span>
                    <span className="sidebar-brand-sub">University Edition</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems[role]?.map((item) => (
                    <SidebarItem key={item.to} {...item} />
                ))}
            </nav>

            <div className="sidebar-footer">
                <SidebarItem to="/settings" icon={Settings} label="Settings" />
                <button
                    onClick={handleLogout}
                    className="sidebar-item hover:text-red-600 hover:bg-red-50"
                    style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export const Navbar = ({ role }) => {
    const { user } = useAuth();
    const { notifications, markNotificationAsRead } = useData();
    const [showNotifs, setShowNotifs] = useState(false);

    const userNotifs = notifications.filter(n => n.userId === user?.id);
    const unreadCount = userNotifs.filter(n => !n.read).length;

    return (
        <header className="navbar">
            <div className="navbar-left">
                <span className="navbar-badge">
                    {role} Dashboard
                </span>
            </div>

            <div className="navbar-right">
                <div className="relative">
                    <button
                        className="nav-action-btn"
                        onClick={() => setShowNotifs(!showNotifs)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {showNotifs && (
                        <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 z-50">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                                <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                                <span className="text-[10px] font-bold text-primary-600">{unreadCount} New</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {userNotifs.length > 0 ? userNotifs.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer ${n.read ? 'bg-white border-slate-50 opacity-60' : 'bg-blue-50/50 border-blue-100'}`}
                                        onClick={() => {
                                            markNotificationAsRead(n.id);
                                            setShowNotifs(false);
                                        }}
                                    >
                                        <p className="text-xs font-semibold text-slate-800 leading-snug">{n.message}</p>
                                        <p className="text-[9px] text-slate-400 mt-1">{new Date(n.date).toLocaleTimeString()}</p>
                                    </div>
                                )) : (
                                    <p className="text-center py-6 text-slate-400 text-xs italic">All caught up!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="nav-user-profile">
                    <div className="nav-user-info hidden sm:block">
                        <p className="nav-user-name">{user?.name || 'Academic User'}</p>
                        <span className="nav-user-role">{role}</span>
                    </div>
                    <div className="nav-avatar">
                        <User size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

