import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fsad-crub-deployment-nt8q.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('pts_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Jobs
export const getJobs = () => api.get('/jobs');
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Applications
export const getApplications = () => api.get('/applications');
export const getStudentApplications = (studentId) => api.get(`/applications/student/${studentId}`);
export const createApplication = (data) => api.post('/applications', data);
export const updateApplicationStatus = (id, status) => api.put(`/applications/${id}/status`, { status });
export const withdrawApplication = (id) => api.delete(`/applications/${id}`);

// Students
export const getStudents = () => api.get('/students');
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Employers
export const getEmployers = () => api.get('/employers');
export const createEmployer = (data) => api.post('/employers', data);
export const updateEmployer = (id, data) => api.put(`/employers/${id}`, data);
export const deleteEmployer = (id) => api.delete(`/employers/${id}`);

// Officers
export const getOfficers = () => api.get('/officers');
export const createOfficer = (data) => api.post('/officers', data);
export const updateOfficer = (id, data) => api.put(`/officers/${id}`, data);
export const deleteOfficer = (id) => api.delete(`/officers/${id}`);

// Notifications
export const getUserNotifications = (userId) => api.get(`/notifications/user/${userId}`);
export const createNotification = (data) => api.post('/notifications', data);
export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);

// Auth & Users
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const sendVerificationCode = (email) => api.post('/auth/send-verification-code', { email });
export const updateProfile = (id, profileData) => api.put(`/auth/profile/${id}`, profileData);
export const googleLogin = (credential, role) => api.post('/auth/google', { credential, role });
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (otp, newPassword) => api.post('/auth/reset-password', { otp, newPassword });
export const verifyOtp = (otp) => api.post('/auth/verify-otp', { otp });

export default api;
