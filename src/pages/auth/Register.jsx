import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, GraduationCap, Building2, User } from 'lucide-react';
import { Button, Input, Card } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [role, setRole] = useState('student');
    const navigate = useNavigate();
    const { register: authRegister, sendVerificationCode } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        rollNumber: '',
        companyName: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
        adminSecret: '',
        officerSecret: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            return toast.error("Please enter your email first");
        }
        if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
            return toast.error("Please enter a valid Gmail address (@gmail.com)");
        }
        setLoading(true);
        try {
            await sendVerificationCode(formData.email);
            toast.success("Verification code sent to your email!");
            setStep(2);
        } catch (err) {
            console.error("Send Code Error: ", err);
            const errorMsg = err.response?.data?.message ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                err.message ||
                "Failed to send code.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
            return toast.error("Please enter a valid Gmail address (@gmail.com)");
        }
        if (!formData.verificationCode) {
            return toast.error("Verification code is required");
        }
        setLoading(true);
        try {
            const userData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                role: role,
                roll: role === 'student' ? formData.rollNumber : undefined,
                company: role === 'employer' ? formData.companyName : null,
                isProfileComplete: false,
                isNewUser: true,
                verificationCode: formData.verificationCode,
                adminSecret: role === 'admin' ? formData.adminSecret : undefined,
                officerSecret: role === 'officer' ? formData.officerSecret : undefined
            };
            const result = await authRegister(userData);
            toast.success('Registration and Login successful!');
            navigate(`/${result.role}/dashboard`);
        } catch (err) {
            console.error("Registration Error: ", err);
            const errorMsg = err.response?.data?.message ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                err.message ||
                "Registration failed.";
            toast.error(errorMsg);
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
                        <p className="login-institute-sub">Create New Account</p>
                    </div>
                </div>

                <div className="login-divider" />

                <div className="login-card">
                    <h1 className="login-title">Join the Portal</h1>
                    <p className="login-subtitle">Start your professional journey today</p>

                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label className="form-label">I am a...</label>
                            <div className="role-tabs">
                                {['student', 'officer', 'employer', 'admin'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`role-tab ${role === r ? 'role-tab-active' : ''}`}
                                        onClick={() => setRole(r)}
                                    >
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                placeholder="John"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                placeholder="Doe"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={loading || step === 2}
                                style={{ padding: "0.6rem 1rem", backgroundColor: step === 2 ? "#10b981" : "#2563eb", color: "white", borderRadius: "0.375rem", fontWeight: "500", border: "none", cursor: (loading || step === 2) ? "not-allowed" : "pointer", height: "42px", marginBottom: "1rem", opacity: (loading || step === 2) ? 0.7 : 1 }}
                            >
                                {step === 2 ? "Code Sent" : "Send OTP"}
                            </button>
                        </div>

                        {step === 2 && (
                            <div style={{ marginBottom: "10px" }}>
                                <Input
                                    label="Verification Code"
                                    type="text"
                                    name="verificationCode"
                                    placeholder="Enter 6-digit code sent to email"
                                    required
                                    value={formData.verificationCode}
                                    onChange={handleChange}
                                    maxLength="6"
                                />
                            </div>
                        )}

                        {role === 'student' && (
                            <Input
                                label="Roll Number"
                                name="rollNumber"
                                placeholder="20CS001"
                                required
                                value={formData.rollNumber}
                                onChange={handleChange}
                            />
                        )}

                        {role === 'employer' && (
                            <Input
                                label="Company Name"
                                name="companyName"
                                placeholder="Acme Inc."
                                required
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        )}

                        {role === 'admin' && (
                            <Input
                                label="Admin Secret"
                                type="password"
                                name="adminSecret"
                                placeholder="Secret Key Required"
                                required
                                value={formData.adminSecret}
                                onChange={handleChange}
                            />
                        )}

                        {role === 'officer' && (
                            <Input
                                label="Officer Secret"
                                type="password"
                                name="officerSecret"
                                placeholder="Secret Key Required"
                                required
                                value={formData.officerSecret}
                                onChange={handleChange}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <Input
                                label="Confirm"
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? <span className="btn-spinner" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="login-register-text">
                        Already have an account?{' '}
                        <Link to="/login" className="login-register-link">Sign In</Link>
                    </p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-right-inner">
                    <h2 className="login-right-title">Unlock Your Potential.</h2>
                    <p className="login-right-sub">Join thousands of students and hundreds of employers already on the platform.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;


