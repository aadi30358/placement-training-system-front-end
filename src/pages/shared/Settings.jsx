import React, { useState } from 'react';
import { Bell, Lock, Shield, User, Eye, EyeOff, Moon, Sun, Monitor } from 'lucide-react';
import { Card, Button, Input } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [notifications, setNotifications] = useState({
        jobAlerts: true,
        applicationStatus: true,
        placementNews: false,
        emailDigest: true
    });

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveSecurity = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Security settings updated!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and security settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <nav className="space-y-1">
                        {['General', 'Security', 'Notifications', 'Appearance'].map((tab) => (
                            <button
                                key={tab}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'General'
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card title="Account Security">
                        <form onSubmit={handleSaveSecurity} className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Current Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Min. 8 characters"
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="Re-type new password"
                            />
                            <div className="pt-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card title="Notification Preferences">
                        <div className="space-y-4">
                            {[
                                { key: 'jobAlerts', label: 'Job Alerts', desc: 'Get notified when new jobs match your profile.' },
                                { key: 'applicationStatus', label: 'Application Status', desc: 'Notifications on status changes of your applications.' },
                                { key: 'placementNews', label: 'Placement News', desc: 'Monthly newsletter and college placement updates.' },
                                { key: 'emailDigest', label: 'Email Digest', desc: 'Weekly summary of your activity.' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="pr-4">
                                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(item.key)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications[item.key] ? 'bg-primary-600' : 'bg-slate-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Danger Zone">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <h4 className="text-sm font-bold text-red-900 mb-1">Deactivate Account</h4>
                            <p className="text-xs text-red-700 mb-4">
                                Once you deactivate your account, you will lose access to all your applications and records. This action is irreversible.
                            </p>
                            <Button variant="secondary" className="bg-white text-red-600 border-red-200 hover:bg-red-50 text-xs">
                                Deactivate Account
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
