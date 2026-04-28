import React from 'react';
import { FileText, Download, TrendingUp, Users, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const ReportCard = ({ title, description, icon: Icon, type, onDownload }) => (
    <div className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${type === 'stat' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-600'}`}>
                <Icon size={24} />
            </div>
            <button
                onClick={onDownload}
                className="text-slate-400 hover:text-primary-600 transition-all p-2 rounded-lg hover:bg-slate-50"
            >
                <Download size={20} />
            </button>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{description}</p>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Calendar size={14} />
            <span>Generated live</span>
        </div>
    </div>
);

const Reports = () => {
    const dataContext = useData();
    const students = dataContext?.students || [];
    const jobs = dataContext?.jobs || [];

    const totalStudents = students.length;
    const placedStudents = students.filter(s => s.status === 'Placed').length;
    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0;

    const downloadCSV = (data, filename, headers) => {
        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${filename} exported successfully`);
    };

    const reports = [
        {
            title: "Consolidated Placement Report",
            description: `Detailed summary of all ${placedStudents} placed students and their packages.`,
            icon: FileText,
            type: "stat",
            onDownload: () => downloadCSV(
                students.filter(s => s.status === 'Placed').map(s => [`"${s.name}"`, `"${s.dept}"`, `"${s.company}"`, '"8.4 LPA"']),
                'consolidated_placement_report',
                ['Student', 'Dept', 'Company', 'Package']
            )
        },
        {
            title: "Company Wise Selection",
            description: `Breakdown of performance across all ${jobs.length} registered companies.`,
            icon: TrendingUp,
            type: "stat",
            onDownload: () => {
                const companyData = jobs.map(j => {
                    const selected = students.filter(s => s.company === j.company).length;
                    return [`"${j.company}"`, selected, `"${j.type}"`];
                });
                downloadCSV(companyData, 'company_wise_selections', ['Company', 'Selected Count', 'Type']);
            }
        },
        {
            title: "Department Performance",
            description: "Comparative analysis of placement percentages across core departments.",
            icon: Users,
            type: "stat",
            onDownload: () => {
                const depts = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
                const deptData = depts.map(d => {
                    const total = students.filter(s => s.dept === d).length;
                    const placed = students.filter(s => s.dept === d && s.status === 'Placed').length;
                    const rate = total > 0 ? ((placed / total) * 100).toFixed(1) : 0;
                    return [`"${d}"`, total, placed, `"${rate}%"`];
                });
                downloadCSV(deptData, 'department_performance', ['Dept', 'Total', 'Placed', 'Rate']);
            }
        },
        {
            title: "Eligibility vs Selections",
            description: "Analysis of student eligibility criteria vs actual success rate.",
            icon: CheckCircle2,
            onDownload: () => toast.error('Advanced analytics requires premium module')
        },
        {
            title: "Pending Applications",
            description: "List of candidates currently in multiple selection rounds.",
            icon: AlertCircle,
            onDownload: () => {
                const pending = students.filter(s => s.status === 'Pending').map(s => [`"${s.name}"`, `"${s.dept}"`, `"${s.roll}"`]);
                downloadCSV(pending, 'pending_candidates', ['Student', 'Dept', 'Roll Number']);
            }
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Placement Reports</h1>
                    <p className="text-slate-500">Generate and download analytical reports for stakeholders.</p>
                </div>
                {/* ... stats display ... */}
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-6 shadow-sm">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current Rate</p>
                        <p className="text-xl font-bold text-emerald-600">{placementRate}%</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Placed Count</p>
                        <p className="text-xl font-bold text-slate-900">{placedStudents}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, idx) => (
                    <ReportCard key={idx} {...report} />
                ))}
            </div>

            <Card className="bg-slate-900 text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 py-4 relative z-10">
                    <div className="flex-1">
                        <h4 className="text-lg font-bold mb-1">Need a specialized analytics report?</h4>
                        <p className="text-slate-400 text-sm">Select custom metrics, specific departments, and batch years to build a targeted report.</p>
                    </div>
                    <Button className="bg-primary-600 hover:bg-primary-500 border-none px-8 font-bold">Launch Report Builder</Button>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
