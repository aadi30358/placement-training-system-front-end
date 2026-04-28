import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Users, CheckCircle2, Clock, ExternalLink, Zap, Target } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const { jobs, applications, students } = useData();
    const { user } = useAuth();

    const companyName = user?.company || 'Your Company';

    const postedJobs = jobs.filter(j => j.company === companyName);
    const companyApplications = applications.filter(app => postedJobs.some(j => j.id === app.jobId));

    const stats = {
        activeJobs: postedJobs.length,
        totalApplicants: companyApplications.length,
        shortlisted: companyApplications.filter(app => app.status === 'Shortlisted' || app.status === 'Selected').length
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Hero */}
            <div className="relative bg-slate-900 rounded-[2rem] p-10 md:p-14 overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute right-0 top-0 h-full w-1/4 opacity-[0.05] pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="bg-white h-[2px] w-[200%] absolute origin-left rotate-[-45deg]" style={{ top: `${i * 40}px`, left: '-50%' }} />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Verified Partner</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4">
                            {companyName} <br />
                            <span className="text-primary-500">Recruitment Hub</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-sm">Managing campus talent acquisitions and placement records.</p>
                    </div>
                    <Button
                        className="flex items-center gap-3 px-10 py-5 rounded-2xl shadow-xl shadow-primary-900/40 text-sm font-black uppercase tracking-widest translate-y-0 hover:-translate-y-1 transition-all"
                        onClick={() => navigate('/employer/jobs')}
                    >
                        <Plus size={20} />
                        <span>Create Job Post</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group cursor-pointer hover:border-primary-100 transition-all" onClick={() => navigate('/employer/jobs')}>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                            <Zap size={24} />
                        </div>
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-widest">Active</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Campaigns</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.activeJobs}</p>
                </Card>

                <Card className="group cursor-pointer hover:border-slate-300 transition-all border-dashed" onClick={() => navigate('/employer/applicants')}>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-900 text-white rounded-2xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Applicants</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalApplicants}</p>
                </Card>

                <Card className="group cursor-pointer hover:border-emerald-100 transition-all" onClick={() => navigate('/employer/applicants')}>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <Target size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest underline decoration-2 underline-offset-4">Top Talent</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Candidates</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.shortlisted}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Open Positions" subtitle="Active job listings on campus portal shadow-sm overflow-hidden relative">
                    {/* Decorative Stripes */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-primary-600 h-[2px] w-[200%] absolute origin-left rotate-[-45deg]" style={{ top: `${i * 20}px`, left: '-50%' }} />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {postedJobs.length > 0 ? postedJobs.map(job => {
                            const jobApps = companyApplications.filter(app => app.jobId === job.id);
                            return (
                                <div key={job.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:bg-[#f8faff] hover:border-primary-100 transition-all cursor-pointer" onClick={() => navigate('/employer/applicants')}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Briefcase className="text-primary-600" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase text-sm tracking-tight">{job.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.location} • {job.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900 leading-none">{jobApps.length}</p>
                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">Applied</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                            <ExternalLink size={16} />
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-10">
                                <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mb-4">No active hiring posts</p>
                                <Button variant="secondary" size="sm" onClick={() => navigate('/employer/jobs')}>Post Your First Job</Button>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Talent Pipeline" subtitle="Recent applicant activity pulse shadow-sm">
                    <div className="space-y-4">
                        {companyApplications.length > 0 ? companyApplications.slice(0, 5).map(app => {
                            const job = postedJobs.find(j => j.id === app.jobId);
                            const student = students.find(s => s.id === app.studentId);
                            return (
                                <div key={app.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f8faff] transition-all border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm font-black text-primary-600 uppercase text-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        {student?.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 truncate">
                                            <span className="text-primary-600 uppercase">{student?.name}</span>
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate mt-0.5">Applied for {job?.title}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">{app.appliedDate}</span>
                                        <Button size="sm" variant="secondary" className="px-4 py-2 text-[10px] font-black uppercase tracking-widest scale-90 opacity-0 group-hover:opacity-100 transition-all border-slate-200" onClick={() => navigate('/employer/applicants')}>
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-20">
                                    <Clock size={32} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Awaiting new applicants</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EmployerDashboard;
