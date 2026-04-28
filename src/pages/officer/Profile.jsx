import React, { useState } from 'react';
import { User, Mail, GraduationCap, Save, MapPin, Phone, Hash, ShieldCheck } from 'lucide-react';
import { Card, Button, Input } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const OfficerProfile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        officeLocation: user?.officeLocation || 'Placement Cell, Block A',
        phone: user?.phone || '',
        ext: user?.ext || '4521',
        depts: user?.depts || ['CSE', 'ECE', 'EEE'],
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
            updateOfficer(user?.id, formData);
            setLoading(false);
            toast.success('Officer profile updated!');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Officer Profile</h1>
                    <p className="text-slate-500">Manage your academic profile and department oversight.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={handleSave} disabled={loading}>
                    <Save size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="text-center">
                        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                            <User size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
                        <p className="text-slate-500 text-sm font-medium">Placement Officer</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Active Status</span>
                        </div>
                    </Card>

                    <Card title="Department Oversight">
                        <div className="flex flex-wrap gap-2">
                            {formData.depts.map(dept => (
                                <span key={dept} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                                    {dept}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card title="Official Information">
                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={User}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Input
                                    label="Official Email"
                                    value={user?.email || 'officer@college.edu'}
                                    disabled
                                    icon={Mail}
                                />
                            </div>
                            <Input
                                label="Office Location"
                                name="officeLocation"
                                value={formData.officeLocation}
                                onChange={handleChange}
                                icon={MapPin}
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={Phone}
                            />
                            <Input
                                label="Extension Number"
                                name="ext"
                                value={formData.ext}
                                onChange={handleChange}
                                icon={Hash}
                            />
                        </form>
                    </Card>

                    <Card title="Security & Access">
                        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Management Level: 2</p>
                                <p className="text-xs text-slate-500">Authorized to moderate jobs and view student records.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OfficerProfile;
