import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Card, Button, Input } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { updateStudent } = useData();
    const [loading, setLoading] = useState(false);

    // Form state matching the backend Database
    const [formData, setFormData] = useState({
        name: user?.name || '',
        dept: user?.dept || 'CSE',
        year: user?.year || '4',
        cgpa: user?.cgpa || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            updateProfile(formData);
            setLoading(false);
            toast.success('Profile saved & synced with campus database!');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {!user?.isProfileComplete && (
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm animate-pulse-subtle">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Finish Setting Up Your Profile</h3>
                        <p className="text-slate-600">Please complete all sections below to verify your account and start applying for placements.</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500">Update your information.</p>
                </div>
                <Button className="flex items-center gap-2 shadow-lg shadow-primary-200" onClick={handleSave} disabled={loading}>
                    <Save size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card title="Student Information">
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Email Address"
                            value={user?.email || 'N/A'}
                            disabled
                        />
                        <Input
                            label="Roll Number"
                            value={user?.roll || 'N/A'}
                            disabled
                        />
                    </form>
                </Card>

                <Card title="Academic Details">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700">Department</label>
                            <select
                                name="dept"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                                value={formData.dept}
                                onChange={handleChange}
                            >
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="IT">IT</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700">Current Year</label>
                            <select
                                name="year"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <Input
                            label="CGPA (Overall)"
                            name="cgpa"
                            type="number"
                            step="0.01"
                            placeholder="8.50"
                            value={formData.cgpa}
                            onChange={handleChange}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
