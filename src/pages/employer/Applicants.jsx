import React, { useState } from 'react';
import { Search, Clock, Download } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ApplicantManagement = () => {
    const { jobs, applications, updateApplicationStatus, students } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const companyName = user?.company || 'Your Company';

    // Filter jobs belonging to this company
    const companyJobIds = jobs.filter(j => j.company === companyName).map(j => j.id);

    // Get applications for those jobs and enrich with student data
    const enrichedApps = applications
        .filter(app => companyJobIds.includes(app.jobId))
        .map(app => ({
            ...app,
            job: jobs.find(j => j.id === app.jobId),
            student: students.find(s => s.id === app.studentId)
        }))
        .filter(app => {
            const matchesSearch = app.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.student?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

    const handleStatusChange = (id, newStatus) => {
        updateApplicationStatus(id, newStatus);
        toast.success(`Applicant status updated to ${newStatus}`);
    };

    const handleExport = () => {
        if (enrichedApps.length === 0) {
            toast.error('No applicants to export');
            return;
        }

        const headers = ['Candidate Name', 'Dept', 'Roll Number', 'Applied Role', 'Date', 'Status', 'CGPA'];
        const csvContent = [
            headers.join(','),
            ...enrichedApps.map(app => [
                `"${app.student?.name}"`,
                `"${app.student?.dept}"`,
                `"${app.student?.roll}"`,
                `"${app.job?.title}"`,
                `"${app.appliedDate}"`,
                `"${app.status}"`,
                `"${app.student?.cgpa}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `applicants_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Applicant list exported successfully');
    };

    const handleDownloadResume = (student) => {
        const dummyContent = `Resume for ${student.name}\nRoll: ${student.roll}\nDept: ${student.dept}\nCGPA: ${student.cgpa}\nSkills: ${(student.skills || ['React', 'Node.js', 'Python']).join(', ')}`;
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${student.name.replace(/\s+/g, '_')}_Resume.txt`);
        link.click();
        toast.success(`Downloading ${student.name}'s resume...`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Applicant Tracking</h1>
                    <p className="text-slate-500">Review candidates for recruitment at {companyName}.</p>
                </div>
                <Button variant="secondary" className="flex items-center gap-2 font-bold" onClick={handleExport}>
                    <Download size={18} />
                    <span>Export List</span>
                </Button>
            </div>

            <Card>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name or job title..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-600"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">New</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Selected">Selected</option>
                        </select>
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {enrichedApps.length > 0 ? enrichedApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-50 rounded-lg border border-primary-100 flex items-center justify-center font-bold text-primary-600">
                                                {app.student?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{app.student?.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{app.student?.dept} • {app.student?.roll}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 min-w-[180px]">
                                        <p className="text-sm font-bold text-slate-800">{app.job?.title || 'Unknown Role'}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{app.appliedDate}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">CGPA</p>
                                                <p className="text-sm font-bold text-slate-700">{app.student?.cgpa || 'N/A'}</p>
                                            </div>
                                            <Button size="sm" variant="secondary" className="h-7 text-[10px] px-2" onClick={() => setSelectedStudent(app.student)}>
                                                Profile
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            app.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-slate-50 text-slate-700 border-slate-100 font-medium'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none hover:border-primary-300 transition-all shadow-sm cursor-pointer"
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                        >
                                            <option value="Applied">Pending</option>
                                            <option value="Shortlisted">Shortlist</option>
                                            <option value="Rejected">Reject</option>
                                            <option value="Selected">Select</option>
                                        </select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                        No applicants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Candidate Profile Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full animate-in zoom-in-95 duration-200" title="Candidate Profile">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 py-4 border-b border-slate-100">
                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-2xl">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h3>
                                    <p className="text-slate-500">{selectedStudent.dept} | Batch of 2024</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Academic CGPA</p>
                                    <p className="text-lg font-bold text-slate-900">{selectedStudent.cgpa}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Roll Number</p>
                                    <p className="text-lg font-bold text-slate-900">{selectedStudent.roll}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900 mb-2">Technical Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedStudent.skills || ['React', 'Node.js', 'Python']).map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-3">
                                <Button className="flex-1" onClick={() => handleDownloadResume(selectedStudent)}>Download Resume</Button>
                                <Button variant="secondary" onClick={() => setSelectedStudent(null)}>Close</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};


export default ApplicantManagement;
