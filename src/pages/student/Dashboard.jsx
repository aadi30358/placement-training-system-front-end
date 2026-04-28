import React, { useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, Clock, ArrowRight, Search, MapPin, Sparkles } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { jobs, getStudentApplications, students } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const myStudentData = useMemo(() => {
        return students.find(s => s.email === user?.email) || { id: user?.id, name: user?.name, email: user?.email, dept: 'N/A' };
    }, [students, user]);

    const appliedJobs = useMemo(() => {
        return getStudentApplications(user?.id);
    }, [user, getStudentApplications]);

    const stats = useMemo(() => {
        return {
            applied: appliedJobs.length,
            shortlisted: appliedJobs.filter(a => a.status === 'Shortlisted').length,
            offers: appliedJobs.filter(a => a.status === 'Selected').length,
        };
    }, [appliedJobs]);

    const profileCompletion = useMemo(() => {
        const fields = ['phone', 'dob', 'skills', 'resumeUrl', 'class10', 'class12'];
        const completed = fields.filter(f => !!user?.[f]).length;
        return Math.round((completed / fields.length) * 100);
    }, [user]);

    return (
        <div className="space-y-10 pb-10">
            {/* Hero Section: Job Finder Style */}
            <div className="relative bg-[#f8faff] rounded-[2rem] p-8 md:p-14 overflow-hidden border border-slate-100">
                {/* Decorative Stripes */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-primary-600 h-[2px] w-[200%] absolute origin-left rotate-[-45deg]"
                            style={{ top: `${i * 30}px`, left: '-50%' }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-white text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-primary-50">New Opportunities</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        Find the most <br />
                        <span className="text-primary-600 underline decoration-primary-200 underline-offset-8">exciting</span> startup jobs
                    </h1>

                    <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-primary-900/5 group border border-slate-100">
                        <div className="flex-1 flex items-center gap-3 px-4 w-full">
                            <Search className="text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Job title or keywords..."
                                className="w-full py-3 outline-none text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="hidden md:block w-[1px] h-8 bg-slate-100 mx-2"></div>
                        <div className="flex-1 flex items-center gap-3 px-4 w-full">
                            <MapPin className="text-slate-400" size={20} />
                            <select className="w-full py-3 bg-transparent outline-none text-slate-600 font-bold">
                                <option>Location (All)</option>
                                <option>Remote</option>
                                <option>On-site</option>
                            </select>
                        </div>
                        <Button
                            className="w-full md:w-auto px-10 py-4 rounded-xl shadow-lg shadow-primary-500/20"
                            onClick={() => navigate('/student/jobs')}
                        >
                            Find Job
                        </Button>
                    </div>

                    <div className="flex items-center gap-6 mt-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 capitalize">U{i}</div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-500">
                            <span className="text-slate-900">4,500+</span> companies are hiring this week
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                                <Briefcase size={20} />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Applied</p>
                            <p className="text-3xl font-black text-slate-900">{stats.applied}</p>
                        </Card>
                        <Card className="hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                <CheckCircle2 size={20} />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Success</p>
                            <p className="text-3xl font-black text-slate-900">{stats.shortlisted + stats.offers}</p>
                        </Card>
                        <Card className="hover:scale-[1.02] transition-transform">
                            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4">
                                <Clock size={20} />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                            <p className="text-3xl font-black text-slate-900">{stats.applied - (stats.shortlisted + stats.offers)}</p>
                        </Card>
                    </div>

                    <Card title="Track Your Progress" subtitle="Latest status from recruitment partners">
                        <div className="space-y-4">
                            {appliedJobs.length > 0 ? appliedJobs.slice(0, 5).map((app) => (
                                <div key={app.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:bg-[#f8faff] hover:border-primary-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 font-black text-sm uppercase">
                                                {app.job?.company?.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase text-sm tracking-tight">{app.job?.title || 'Unknown Role'}</h4>
                                            <p className="text-xs text-slate-400 font-bold mt-0.5">{app.job?.company || 'Unknown Company'} • {app.appliedDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                app.status === 'Shortlisted' ? 'bg-primary-50 text-primary-700 border-primary-100' :
                                                    app.status === 'Rejected' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                                                        'bg-white text-slate-900 border-slate-100'
                                            }`}>
                                            {app.status}
                                        </span>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 font-bold mb-4">You haven't applied to any jobs yet.</p>
                                    <Button variant="secondary" onClick={() => navigate('/student/jobs')}>Check Open Jobs</Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Quick Apply" subtitle="Recent openings shadow-sm">
                        <div className="space-y-5">
                            {jobs.slice(0, 3).map((job) => {
                                const hasApplied = appliedJobs.some(app => app.jobId === job.id);
                                return (
                                    <div key={job.id} className="p-5 rounded-2xl border border-slate-100 hover:border-primary-100 hover:bg-[#f8faff] transition-all group">
                                        <h4 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors text-sm uppercase mb-1">{job.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">{job.company}</p>

                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <span className="text-xs font-black text-slate-900">{job.salary}</span>
                                            {hasApplied ? (
                                                <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5">
                                                    <CheckCircle2 size={12} /> Applied
                                                </span>
                                            ) : (
                                                <button
                                                    className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 underline underline-offset-4"
                                                    onClick={() => navigate('/student/jobs')}
                                                >
                                                    View Details
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card title="Your Profile" subtitle="Completion score shadow-sm">
                        <div className="flex items-center justify-center h-40 relative mb-4">
                            {/* SVG Ring Progress */}
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                                <circle
                                    className="text-primary-600 transition-all duration-1000"
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 58}
                                    strokeDashoffset={2 * Math.PI * 58 * (1 - profileCompletion / 100)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58" cx="64" cy="64"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-900 leading-none">{profileCompletion}%</span>
                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">Ready</span>
                            </div>
                        </div>
                        <Button className="w-full py-4 text-xs font-black uppercase" onClick={() => navigate('/student/profile')}>
                            Refine My Resume
                        </Button>
                    </Card>

                    <Card title="My Database Record" subtitle="Current registered details shadow-sm">
                        <div className="w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-4 py-4 text-slate-500 font-bold">#{myStudentData.id}</td>
                                        <td className="px-4 py-4 font-bold text-slate-900">{myStudentData.name}</td>
                                        <td className="px-4 py-4 text-slate-500 text-xs">{myStudentData.email}</td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px] font-black uppercase tracking-widest">
                                                {myStudentData.dept || user?.dept || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
