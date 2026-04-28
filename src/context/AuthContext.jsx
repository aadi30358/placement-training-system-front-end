import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initial state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('pts_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const res = await api.loginUser(credentials);
            setUser(res.data);
            localStorage.setItem('pts_user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const res = await api.registerUser(userData);
            if (res.data && res.data.token) {
                setUser(res.data);
                localStorage.setItem('pts_user', JSON.stringify(res.data));
            }
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendVerificationCode = async (email) => {
        setLoading(true);
        try {
            const res = await api.sendVerificationCode(email);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        try {
            const res = await api.forgotPassword(email);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (otp) => {
        setLoading(true);
        try {
            const res = await api.verifyOtp(otp);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (otp, newPassword) => {
        setLoading(true);
        try {
            const res = await api.resetPassword(otp, newPassword);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pts_user');
    };

    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            if (!user) return;
            const res = await api.updateProfile(user.id, profileData);
            setUser(res.data);
            localStorage.setItem('pts_user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            forgotPassword,
            verifyOtp,
            resetPassword,
            register,
            sendVerificationCode,
            logout,
            updateProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
