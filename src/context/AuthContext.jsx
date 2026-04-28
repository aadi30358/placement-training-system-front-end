import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initial state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('pts_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (credentials) => {
        try {
            const res = await api.loginUser(credentials);
            setUser(res.data);
            localStorage.setItem('pts_user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const register = async (userData) => {
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
        }
    };

    const sendVerificationCode = async (email) => {
        try {
            const res = await api.sendVerificationCode(email);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pts_user');
    };

    const updateProfile = async (profileData) => {
        try {
            if (!user) return;
            const res = await api.updateProfile(user.id, profileData);
            setUser(res.data);
            localStorage.setItem('pts_user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, forgotPassword, verifyOtp, resetPassword, register, sendVerificationCode, logout, updateProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
