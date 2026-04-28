import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const PlacementRecords = () => {
    const { students, jobs } = useData();

    const [filterDept, setFilterDept] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(s => {
        const matchesDept = filterDept === 'All' || s.dept === filterDept;
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.company && s.company.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesDept && matchesSearch;
    });

    const handleDownload = () => {
        if (filteredStudents.length === 0) {
            toast.error('No records to export');
            return;
        }

        const headers = ['Student Name', 'Roll Number', 'Department', 'Status', 'Company', 'Package'];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(s => {
                const job = jobs.find(j => j.company === s.company);
                return [
                    `"${s.name}"`,
                    `"${s.roll}"`,
                    `"${s.dept}"`,
                    `"${s.status}"`,
                    `"${s.company || 'N/A'}"`,
                    `"${job?.salary || (s.company ? '8.4 LPA' : 'N/A')}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `placement_records_${filterDept}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Placement records exported successfully');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Placement Records</h1>
                    <p className="text-slate-500">Comprehensive database of student placements across departments.</p>
                </div>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                    <Download size={18} />
                    <span>Export Records</span>
                </Button>
            </div>

            <Card>
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search student or company..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-600"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                        </select>
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dept</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batch</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{student.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{student.roll}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-600">{student.dept}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">Class of 2024</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${student.status === 'Placed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            student.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.company ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-primary-50 rounded flex items-center justify-center text-[10px] font-bold text-primary-600">
                                                    {student.company[0]}
                                                </div>
                                                <span className="text-sm font-bold text-slate-800">{student.company}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                        {student.company ? (jobs.find(j => j.company === student.company)?.salary || '8.4 LPA') : '—'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PlacementRecords;
