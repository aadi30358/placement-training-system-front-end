import React from 'react';
import { Users, Building2, Briefcase, GraduationCap, ArrowUpRight, LayoutDashboard, Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/UI';
import { useData } from '../../context/DataContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

const AdminDashboard = () => {
    const { jobs, students, employers, officers } = useData();

    const chartData = [
        { name: 'CSE', placed: students.filter(s => s.dept === 'CSE' && s.status === 'Placed').length, total: students.filter(s => s.dept === 'CSE').length },
        { name: 'ECE', placed: students.filter(s => s.dept === 'ECE' && s.status === 'Placed').length, total: students.filter(s => s.dept === 'ECE').length },
        { name: 'EEE', placed: students.filter(s => s.dept === 'EEE' && s.status === 'Placed').length, total: students.filter(s => s.dept === 'EEE').length },
        { name: 'MECH', placed: students.filter(s => s.dept === 'MECH' && s.status === 'Placed').length, total: students.filter(s => s.dept === 'MECH').length },
        { name: 'CIVIL', placed: students.filter(s => s.dept === 'CIVIL' && s.status === 'Placed').length, total: students.filter(s => s.dept === 'CIVIL').length },
    ];

    const stats = {
        totalStudents: students.length,
        activeCompanies: employers.length,
        openJobs: jobs.length,
        placedStudents: students.filter(s => s.status === 'Placed').length,
        totalOfficers: officers.length
    };

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">System Operational</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Administration Hub</h1>
                    <p className="text-slate-400 font-bold text-sm mt-2">Real-time placement logistics and university performance.</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <Target className="text-primary-600" size={18} />
                    <span className="text-xs font-black text-slate-900">Placement Target: <span className="text-primary-600">85%</span></span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-900 text-white rounded-2xl">
                            <Users size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Scholars</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalStudents}</p>
                </Card>

                <Card className="hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-primary-600 text-white rounded-2xl">
                            <Building2 size={24} />
                        </div>
                        <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">Verified</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Companies</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.activeCompanies}</p>
                </Card>

                <Card className="hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">Staff</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Officers</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalOfficers}</p>
                </Card>

                <Card className="hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Goal</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secured Placements</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.placedStudents}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Academic Placement pulse" subtitle="Department-wise success ratio shadow-sm">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8faff' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                />
                                <Bar dataKey="placed" fill="#e11d48" radius={[6, 6, 0, 0]} barSize={24} />
                                <Bar dataKey="total" fill="#f1f5f9" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Recruitment Velocity" subtitle="Placement momentum over active cycles shadow-sm overflow-hidden">
                    <div className="h-80 w-full mt-4 relative">
                        {/* Decorative Stripes in Background of Chart */}
                        <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-[0.03] pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="bg-primary-600 h-[100%] w-[2px] absolute origin-bottom rotate-[45deg]" style={{ left: `${i * 10}%` }} />
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }} />
                                <Area type="monotone" dataKey="placed" stroke="#e11d48" strokeWidth={4} fillOpacity={1} fill="url(#colorPlaced)" dot={{ fill: '#e11d48', strokeWidth: 2, r: 4, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
