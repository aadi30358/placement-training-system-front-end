import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            toast.success("Password reset successful! Please login.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="login-page">
                <div className="login-left">
                    <p className="text-red-500 font-bold">Invalid or missing reset token.</p>
                    <button onClick={() => navigate('/login')} className="submit-btn mt-4">Back to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <p className="login-institute-name">Placement Training System</p>
                        <p className="login-institute-sub">Update Password</p>
                    </div>
                </div>

                <div className="login-divider" />

                <div className="login-card">
                    <h1 className="login-title">Reset Your Password</h1>
                    <p className="login-subtitle">Please enter your new password below.</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={17} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="form-input"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="input-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={17} />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="form-input"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? <span className="btn-spinner" /> : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <div className="login-right-inner">
                    <h2 className="login-right-title">Password Strength.</h2>
                    <p className="login-right-sub">Make sure your new password is at least 8 characters long and contains symbols or numbers for better security.</p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
