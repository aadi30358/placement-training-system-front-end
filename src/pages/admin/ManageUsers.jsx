import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, MoreVertical, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button, Input, Card } from '../../components/UI';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const Table = ({ headers, children }) => (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                    {headers.map((header, i) => (
                        <th key={i} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {header}
                        </th>
                    ))}
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
                {children}
            </tbody>
        </table>
    </div>
);

const UserManagement = () => {
    const {
        students, deleteStudent, updateStudent, addStudent,
        employers, deleteEmployer, updateEmployer, addEmployer,
        officers, deleteOfficer, updateOfficer, addOfficer,
        jobs, deleteJob, updateJob
    } = useData();

    const [activeTab, setActiveTab] = useState('Students');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Unified form state for the modal
    const [formData, setFormData] = useState({});

    const tabs = ['Students', 'Employers', 'Officers', 'Jobs'];

    const filteredData = () => {
        const query = searchTerm.toLowerCase();
        switch (activeTab) {
            case 'Students':
                return students.filter(s => s.name.toLowerCase().includes(query) || s.roll?.toLowerCase().includes(query));
            case 'Employers':
                return employers.filter(e => e.company.toLowerCase().includes(query) || e.name.toLowerCase().includes(query));
            case 'Officers':
                return officers.filter(o => o.name.toLowerCase().includes(query));
            case 'Jobs':
                return jobs.filter(j => j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query));
            default:
                return [];
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'Students') addStudent(formData);
            else if (activeTab === 'Employers') addEmployer(formData);
            else if (activeTab === 'Officers') addOfficer(formData);

            toast.success(`${activeTab.slice(0, -1)} added successfully`);
            setIsAddModalOpen(false);
            setFormData({});
        } catch (err) {
            toast.error('Error adding record');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm(`Delete this ${activeTab.slice(0, -1)}?`)) {
            if (activeTab === 'Students') deleteStudent(id);
            else if (activeTab === 'Employers') deleteEmployer(id);
            else if (activeTab === 'Officers') deleteOfficer(id);
            else if (activeTab === 'Jobs') deleteJob(id);
            toast.success('Record deleted');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Placed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
            'Active': 'bg-primary-50 text-primary-700 border-primary-100',
        };
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles['Pending']}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">System Control Center</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage all platform entities and operational data.</p>
                </div>
                {activeTab !== 'Jobs' && (
                    <Button className="flex items-center gap-2" onClick={() => { setFormData({}); setIsAddModalOpen(true); }}>
                        <Plus size={18} />
                        <span>Add {activeTab.slice(0, -1)}</span>
                    </Button>
                )}
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <Card>
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()}...`}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {activeTab === 'Students' && (
                    <Table headers={['ID', 'Student Name', 'Email', 'Roll Number', 'Dept', 'CGPA', 'Status']}>
                        {filteredData().map(s => (
                            <tr key={s.id} className="group hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-slate-400 font-bold text-xs">#{s.id}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                                <td className="px-6 py-4 text-slate-500 text-xs">{s.email || 'N/A'}</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{s.roll}</td>
                                <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black">{s.dept}</span></td>
                                <td className="px-6 py-4 font-bold text-slate-900">{s.cgpa}</td>
                                <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}

                {activeTab === 'Employers' && (
                    <Table headers={['Company', 'HR Name', 'Industry', 'Location', 'Status']}>
                        {filteredData().map(e => (
                            <tr key={e.id} className="group hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{e.company}</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{e.name}</td>
                                <td className="px-6 py-4 font-medium text-slate-600">{e.industry}</td>
                                <td className="px-6 py-4 text-slate-500">{e.location}</td>
                                <td className="px-6 py-4">{getStatusBadge('Active')}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(e.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}

                {activeTab === 'Officers' && (
                    <Table headers={['Officer Name', 'Departments', 'Email', 'Role']}>
                        {filteredData().map(o => (
                            <tr key={o.id} className="group hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{o.name}</td>
                                <td className="px-6 py-4"><div className="flex gap-1">{o.depts?.map(d => <span key={d} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px] font-black">{d}</span>)}</div></td>
                                <td className="px-6 py-4 text-slate-500 uppercase text-[10px] font-black">{o.email}</td>
                                <td className="px-6 py-4 font-medium text-slate-600">{o.role || 'Placement Officer'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(o.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}

                {activeTab === 'Jobs' && (
                    <Table headers={['Job Title', 'Company', 'Applicants', 'Type', 'Deadline']}>
                        {filteredData().map(j => (
                            <tr key={j.id} className="group hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{j.title}</td>
                                <td className="px-6 py-4 font-black text-primary-600 uppercase text-[10px]">{j.company}</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">Recently Active</td>
                                <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black">{j.type}</span></td>
                                <td className="px-6 py-4 text-slate-400 font-bold text-[10px]">{j.deadline}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(j.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>

            {isAddModalOpen && (activeTab === 'Students' || activeTab === 'Employers' || activeTab === 'Officers') && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full" title={`Add New ${activeTab.slice(0, -1)}`}>
                        <form onSubmit={handleAdd} className="space-y-4">
                            {activeTab === 'Students' && (
                                <>
                                    <Input label="Student Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <Input label="Roll Number" required onChange={e => setFormData({ ...formData, roll: e.target.value })} />
                                    <Input label="Department" placeholder="e.g. CSE" onChange={e => setFormData({ ...formData, dept: e.target.value })} />
                                </>
                            )}
                            {activeTab === 'Employers' && (
                                <>
                                    <Input label="Company Name" required onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                    <Input label="HR Lead Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <Input label="Industry" onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                                </>
                            )}
                            {activeTab === 'Officers' && (
                                <>
                                    <Input label="Officer Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <Input label="Official Email" type="email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </>
                            )}
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1 uppercase font-black tracking-widest text-[10px]">Create Account</Button>
                                <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
