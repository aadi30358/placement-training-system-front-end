import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, GraduationCap, KeyRound, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    // Component State
    const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { forgotPassword, verifyOtp, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            toast.success("OTP sent! Please check your email.");
            setStep(2);
        } catch (err) {
            const errorData = err.response?.data;
            const errMsg = errorData?.message || (typeof errorData === 'string' ? errorData : null) || "Failed to send OTP. Is the server running?";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOtp(otp);
            toast.success("OTP Verified! Enter your new password.");
            setStep(3);
        } catch (err) {
            const errorData = err.response?.data;
            const errMsg = errorData?.message || (typeof errorData === 'string' ? errorData : null) || "Invalid OTP.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        setLoading(true);
        try {
            await resetPassword(otp, newPassword);
            toast.success("Password reset successful! Please login.");
            navigate('/login');
        } catch (err) {
            const errorData = err.response?.data;
            const errMsg = errorData?.message || (typeof errorData === 'string' ? errorData : null) || "Failed to reset password.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <p className="login-institute-name">Placement Training System</p>
                        <p className="login-institute-sub">Account Recovery</p>
                    </div>
                </div>

                <div className="login-divider" />

                <div className="login-card">
                    {step === 1 && (
                        <>
                            <h1 className="login-title">Forgot Password?</h1>
                            <p className="login-subtitle">Enter your email address and we'll send you an OTP.</p>

                            <form onSubmit={handleSendOtp} className="login-form">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail className="input-icon" size={17} />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="yourname@institution.edu"
                                            className="form-input"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? <span className="btn-spinner" /> : "Send OTP"}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h1 className="login-title">Verify OTP</h1>
                            <p className="login-subtitle">Enter the 6-digit OTP sent to {email}</p>

                            <form onSubmit={handleVerifyOtp} className="login-form">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="otp">Enter OTP</label>
                                    <div className="input-wrapper">
                                        <KeyRound className="input-icon" size={17} />
                                        <input
                                            id="otp"
                                            type="text"
                                            placeholder="123456"
                                            className="form-input"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? <span className="btn-spinner" /> : "Verify OTP"}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h1 className="login-title">Reset Password</h1>
                            <p className="login-subtitle">Please enter your new strong password.</p>

                            <form onSubmit={handleResetPassword} className="login-form">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="newPassword">New Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={17} />
                                        <input
                                            id="newPassword"
                                            type="password"
                                            placeholder="New Password"
                                            className="form-input"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={17} />
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
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
                        </>
                    )}

                    <button 
                        type="button" 
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mt-6 mx-auto w-full"
                        onClick={() => navigate('/login')}
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </button>
                </div>

                <p className="login-footer">
                    &copy; {new Date().getFullYear()} Placement Training System &bull; Support: support@university.edu
                </p>
            </div>

            <div className="login-right">
                <div className="login-right-inner">
                    <h2 className="login-right-title">Security First.</h2>
                    <p className="login-right-sub">We take your account security seriously. Use a strong password and never share your credentials with others.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
