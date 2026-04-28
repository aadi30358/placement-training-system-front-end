import React from 'react';
import { Briefcase, Calendar, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StudentApplications = () => {
    const { getStudentApplications, withdrawApplication } = useData();
    const { user } = useAuth();

    const appliedJobs = getStudentApplications(user?.id);

    const handleWithdraw = (appId, jobTitle) => {
        if (window.confirm(`Are you sure you want to withdraw your application for ${jobTitle}?`)) {
            const success = withdrawApplication(appId);
            if (success) {
                toast.success('Application withdrawn successfully');
            }
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Selected':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Shortlisted':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Rejected':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'Applied':
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Selected':
                return <CheckCircle2 size={16} />;
            case 'Shortlisted':
                return <Clock size={16} />;
            case 'Rejected':
                return <AlertCircle size={16} />;
            case 'Applied':
            default:
                return <Clock size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
                <p className="text-slate-500">View and track the status of all your submitted job applications.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {appliedJobs.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Company & Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date Applied</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {appliedJobs.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{app.job?.title || 'Unknown Role'}</p>
                                                        <p className="text-xs text-slate-500">{app.job?.company || 'Unknown Company'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {app.appliedDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(app.status)}`}>
                                                    {getStatusIcon(app.status)}
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">{app.job?.location || 'Remote'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {app.status === 'Applied' && (
                                                    <button
                                                        onClick={() => handleWithdraw(app.id, app.job?.title)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Withdraw Application"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                                <Button size="sm" variant="secondary" className="ml-2">Details</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">
                            You haven't applied to any jobs yet. Start your journey by exploring available positions.
                        </p>
                        <Button className="mt-6" onClick={() => window.location.href = '/student/jobs'}>
                            Browse Available Jobs
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default StudentApplications;
