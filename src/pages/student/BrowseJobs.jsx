import React, { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, Calendar, Briefcase, Filter, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input } from '../../components/UI';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BrowseJobs = () => {
    const { jobs, applyForJob, applications } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [salaryRange, setSalaryRange] = useState('All');

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);

            let matchesSalary = true;
            if (salaryRange !== 'All') {
                const salaryValue = parseInt(job.salary.replace(/[^0-9]/g, ''));
                if (salaryRange === '$0 - $50k') matchesSalary = salaryValue <= 50000;
                else if (salaryRange === '$50k - $100k') matchesSalary = salaryValue > 50000 && salaryValue <= 100000;
                else if (salaryRange === '$100k+') matchesSalary = salaryValue > 100000;
            }

            return matchesSearch && matchesType && matchesSalary;
        });
    }, [jobs, searchTerm, selectedTypes, salaryRange]);

    const handleTypeToggle = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleApply = (jobId, title) => {
        const success = applyForJob(jobId);
        if (success) {
            toast.success(`Application submitted for ${title}!`);
        } else {
            toast.error(`You have already applied for ${title}`);
        }
    };

    const hasApplied = (jobId) => {
        return applications.some(app => app.jobId === jobId && app.studentId === user?.id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Explore Opportunities</h1>
                    <p className="text-slate-500">Find the perfect role for your career start.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-64 space-y-6">
                    <Card title="Filters">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Job Type</label>
                                <div className="space-y-2">
                                    {['Full-time', 'Internship', 'Contract'].map(type => (
                                        <label key={type} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                checked={selectedTypes.includes(type)}
                                                onChange={() => handleTypeToggle(type)}
                                            />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Salary Range</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                                    value={salaryRange}
                                    onChange={(e) => setSalaryRange(e.target.value)}
                                >
                                    <option>All</option>
                                    <option>$0 - $50k</option>
                                    <option>$50k - $100k</option>
                                    <option>$100k+</option>
                                </select>
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full text-xs"
                                onClick={() => {
                                    setSelectedTypes([]);
                                    setSalaryRange('All');
                                    setSearchTerm('');
                                }}
                            >
                                Reset All
                            </Button>
                        </div>
                    </Card>
                </aside>

                <div className="flex-1 space-y-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search job title, company or keywords..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                            <Card key={job.id} className="group hover:border-primary-200 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                        <Briefcase className="text-slate-400 group-hover:text-primary-600" size={24} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {job.postedAt && (new Date() - new Date(job.postedAt)) < 24 * 60 * 60 * 1000 && (
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                New
                                            </span>
                                        )}
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">
                                            {job.type}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                                    {job.title}
                                </h3>
                                <p className="text-slate-600 font-medium mb-4">{job.company}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin size={14} />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <DollarSign size={14} />
                                        <span>{job.salary}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Calendar size={14} />
                                        <span>Deadline: {job.deadline}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium">Eligible: {job.eligibility}</span>
                                    {hasApplied(job.id) ? (
                                        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                                            <CheckCircle2 size={16} />
                                            <span>Applied</span>
                                        </div>
                                    ) : (
                                        <Button size="sm" onClick={() => handleApply(job.id, job.title)}>Apply Now</Button>
                                    )}
                                </div>
                            </Card>
                        )) : (
                            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
                                <p className="text-slate-400 font-medium">No jobs found matching your criteria.</p>
                                <Button
                                    variant="secondary"
                                    className="mt-4"
                                    onClick={() => {
                                        setSelectedTypes([]);
                                        setSalaryRange('All');
                                        setSearchTerm('');
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseJobs;
