import React, { useState } from 'react';
import { Building2, Mail, Globe, MapPin, Save, Info, Briefcase, Phone } from 'lucide-react';
import { Card, Button, Input } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const EmployerProfile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        company: user?.company || 'Acme Corp',
        website: user?.website || '',
        industry: user?.industry || 'Technology',
        location: user?.location || 'Remote',
        about: user?.about || 'Leading innovator in web technologies.',
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
            toast.success('Company profile updated!');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
                    <p className="text-slate-500">Update company details for applicants to see.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={handleSave} disabled={loading}>
                    <Save size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="text-center">
                        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                            <Building2 size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{formData.company}</h2>
                        <p className="text-slate-500 text-sm font-medium">{formData.industry}</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-primary-600 text-sm font-bold">
                            <Globe size={16} />
                            <span>{formData.website || 'Add Website'}</span>
                        </div>
                    </Card>

                    <Card title="Recruiter Info">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-sm font-medium">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-sm font-medium">{formData.phone || 'Add Phone'}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card title="Company Information">
                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Input
                                    label="Company Name"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    icon={Building2}
                                />
                            </div>
                            <Input
                                label="Industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                icon={Briefcase}
                            />
                            <Input
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                icon={MapPin}
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Website URL"
                                    name="website"
                                    placeholder="https://company.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                    icon={Globe}
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                                <label className="block text-sm font-medium text-slate-700">About the Company</label>
                                <textarea
                                    name="about"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm bg-slate-50"
                                    value={formData.about}
                                    onChange={handleChange}
                                    placeholder="Tell students about your company and work culture..."
                                />
                            </div>
                        </form>
                    </Card>

                    <Card title="Recruitment Preferences">
                        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Verification Status</p>
                                    <p className="text-xs text-slate-500">Your company is fully verified to post jobs.</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
