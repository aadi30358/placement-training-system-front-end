import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Briefcase, GraduationCap, TrendingUp, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie
} from 'recharts';

const OfficerDashboard = () => {
    const navigate = useNavigate();
    const { students, jobs, applications } = useData();

    const stats = {
        totalStudents: students.length,
        placedCount: students.filter(s => s.status === 'Placed').length,
        ongoingJobs: jobs.length,
        newApplications: applications.filter(app => app.status === 'Applied').length
    };

    const placementRate = Math.round((stats.placedCount / stats.totalStudents) * 100);

    const deptStats = [
        { name: 'CSE', placed: students.filter(s => s.dept === 'CSE' && s.status === 'Placed').length },
        { name: 'ECE', placed: students.filter(s => s.dept === 'ECE' && s.status === 'Placed').length },
        { name: 'EEE', placed: students.filter(s => s.dept === 'EEE' && s.status === 'Placed').length },
        { name: 'MECH', placed: students.filter(s => s.dept === 'MECH' && s.status === 'Placed').length },
        { name: 'CIVIL', placed: students.filter(s => s.dept === 'CIVIL' && s.status === 'Placed').length },
    ];

    const COLORS = ['#e11d48', '#101828', '#6366f1', '#14b8a6', '#f59e0b'];

    const upcomingDrives = useMemo(() => {
        return jobs
            .slice(0, 3)
            .map(job => {
                const date = new Date(job.postedAt || Date.now());
                date.setDate(date.getDate() + 7); // Mocking future date
                return {
                    company: job.company,
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    time: '10:00 AM',
                    status: 'Confirmed'
                };
            });
    }, [jobs]);

    const nextDrive = upcomingDrives[0] || { company: 'TBD', date: 'Upcoming' };

    return (
        <div className="space-y-10 pb-10">
            {/* Officer Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-ping capitalize"></span>
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Active Recruitment Cycle 2024</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Officer Insights</h1>
                    <p className="text-slate-400 font-bold text-sm mt-3">Monitoring campus placement trajectory and department logistics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right mr-4 hidden md:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Next Major Drive</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{nextDrive.company} <span className="text-primary-600">({nextDrive.date})</span></p>
                    </div>
                    <Button variant="secondary" className="px-6 py-4 rounded-2xl border-slate-200" onClick={() => navigate('/officer/reports')}>
                        <FileText size={18} className="mr-2" />
                        <span className="text-xs font-black uppercase tracking-widest">Analytics Hub</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:scale-[1.02] transition-transform relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-600/5 group-hover:bg-primary-600 group-hover:text-white transition-all rounded-bl-[2rem] flex items-center justify-center p-4">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placement Pulse</p>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{placementRate}%</p>
                    <div className="mt-4 flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase">On Track</span>
                    </div>
                </Card>

                <Card className="hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Scholars</p>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{stats.totalStudents}</p>
                    <div className="mt-4 p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Verified Profiles</span>
                        <span className="text-[10px] font-black text-slate-900">100%</span>
                    </div>
                </Card>

                <Card className="hover:scale-[1.02] transition-transform relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 group-hover:bg-indigo-600 group-hover:text-white transition-all rounded-bl-[2rem] flex items-center justify-center p-4">
                        <Briefcase size={20} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Drives</p>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{stats.ongoingJobs}</p>
                    <div className="mt-4 flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-primary-600 rounded-full"></div>
                        <span className="text-[9px] font-black text-primary-600 uppercase">{stats.ongoingJobs} Live Now</span>
                    </div>
                </Card>

                <Card className="hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Awaiting Vetting</p>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{stats.newApplications}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 w-1/3"></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase">Pending Review</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2" title="Departmental Velocity" subtitle="Placement distribution across academic wings shadow-sm">
                    <div className="h-80 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} width={60} />
                                <Tooltip
                                    cursor={{ fill: '#f8faff' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="placed" fill="#e11d48" radius={[0, 4, 4, 0]} barSize={20}>
                                    {deptStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Recruitment Calendar" subtitle="Upcoming drive pipeline shadow-sm">
                    <div className="space-y-4">
                        {upcomingDrives.length > 0 ? upcomingDrives.map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-[#f8faff] transition-all group cursor-pointer">
                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex flex-col items-center justify-center shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all text-slate-400">
                                    <span className="text-[8px] font-black uppercase leading-none">{event.date.split(' ')[0]}</span>
                                    <span className="text-sm font-black leading-tight mt-0.5">{event.date.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{event.company}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{event.time} • Online Drive</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${event.status === 'Confirmed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300 animate-pulse'}`}></div>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-slate-400 font-bold text-[10px] uppercase tracking-widest">No upcoming drives</p>
                        )}
                        <Button variant="secondary" className="w-full mt-2 py-4 border-slate-200 text-[10px] font-black uppercase tracking-widest group" onClick={() => navigate('/officer/records')}>
                            Manage Records <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OfficerDashboard;
