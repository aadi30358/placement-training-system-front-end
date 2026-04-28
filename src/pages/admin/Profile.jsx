import React, { useState } from 'react';
import { User, Mail, Shield, Save, Briefcase, Hash } from 'lucide-react';
import { Card, Button, Input } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminProfile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || 'System Admin',
        employeeId: user?.employeeId || 'ADM-2024-001',
        dept: user?.dept || 'Administration',
        phone: user?.phone || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            updateProfile(formData);
            setLoading(false);
            toast.success('Admin profile updated!');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Profile</h1>
                    <p className="text-slate-500">Manage your administrative credentials and personal info.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={handleSave} disabled={loading}>
                    <Save size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center h-fit">
                    <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                        <Shield size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
                    <p className="text-slate-500 text-sm font-medium">Administrator</p>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Super Admin</span>
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card title="Personnel Information">
                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                label="Employee ID"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                icon={Hash}
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Administrative Email"
                                    value={user?.email || 'admin@college.edu'}
                                    disabled
                                    icon={Mail}
                                />
                            </div>
                            <Input
                                label="Department"
                                name="dept"
                                value={formData.dept}
                                onChange={handleChange}
                                icon={Briefcase}
                            />
                            <Input
                                label="Contact Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </form>
                    </Card>

                    <Card title="System Permissions">
                        <div className="space-y-3">
                            {[
                                'Manage User Accounts',
                                'Approve Company Registrations',
                                'Access All Recruitment Reports',
                                'Override Placement Status'
                            ].map((perm) => (
                                <div key={perm} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm font-medium text-slate-700">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    {perm}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
