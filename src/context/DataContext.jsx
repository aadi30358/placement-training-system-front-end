import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [students, setStudents] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            try {
                const [jobsRes, appsRes, studentsRes, empRes, offRes] = await Promise.all([
                    api.getJobs(),
                    api.getApplications(),
                    api.getStudents(),
                    api.getEmployers(),
                    api.getOfficers()
                ]);
                setJobs(jobsRes.data || []);
                setApplications(appsRes.data || []);
                setStudents(studentsRes.data || []);
                setEmployers(empRes.data || []);
                setOfficers(offRes.data || []);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (user?.id) {
            api.getUserNotifications(user.id)
                .then(res => setNotifications(res.data || []))
                .catch(err => console.error(err));
        }
    }, [user]);

    const addNotification = async (userId, message, type = 'info') => {
        try {
            const res = await api.createNotification({ userId, message, type });
            if (user && userId === user.id) {
                setNotifications(prev => [res.data, ...prev]);
            }
        } catch (err) { console.error(err); }
    };

    const markNotificationAsRead = async (notifId) => {
        try {
            await api.markNotificationAsRead(notifId);
            setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, readStatus: true } : n));
        } catch (err) { console.error(err); }
    };

    const applyForJob = async (jobId) => {
        if (!user) return false;
        
        // Prevent duplicate - we can check local state
        const alreadyApplied = applications.find(app => (app.jobId === jobId || app.jobId === Number(jobId)) && (app.studentId === user.id || app.studentId === Number(user.id)));
        if (alreadyApplied) return false;

        try {
            const res = await api.createApplication({ jobId, studentId: user.id, status: 'Applied' });
            setApplications(prev => [res.data, ...prev]);
            
            const job = jobs.find(j => j.id === jobId || j.id === Number(jobId));
            if (job) addNotification(user.id, `You applied for ${job.title} at ${job.company}`, 'success');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const getStudentApplications = (studentId) => {
        return applications
            .filter(app => app.studentId === studentId || app.studentId === Number(studentId))
            .map(app => ({
                ...app,
                job: jobs.find(j => j.id === app.jobId)
            }));
    };

    const addJob = async (jobData) => {
        try {
            const res = await api.createJob(jobData);
            setJobs(prev => [res.data, ...prev]);
            addNotification(user?.id, `New job opportunity posted: ${res.data.title}`, 'success');
            return true;
        } catch (err) { console.error(err); return false; }
    };

    const updateJob = async (jobId, data) => {
        try {
            const res = await api.updateJob(jobId, data);
            setJobs(prev => prev.map(j => (j.id === jobId || j.id === Number(jobId)) ? res.data : j));
        } catch (err) { console.error(err); }
    };

    const deleteJob = async (jobId) => {
        try {
            await api.deleteJob(jobId);
            setJobs(prev => prev.filter(j => j.id !== jobId && j.id !== Number(jobId)));
            setApplications(prev => prev.filter(app => app.jobId !== jobId && app.jobId !== Number(jobId)));
        } catch (err) { console.error(err); }
    };

    const updateApplicationStatus = async (appId, newStatus) => {
        try {
            const res = await api.updateApplicationStatus(appId, newStatus);
            setApplications(prev => prev.map(app => {
                if (app.id === appId || app.id === Number(appId)) {
                    const job = jobs.find(j => j.id === app.jobId);
                    addNotification(app.studentId, `Your application for ${job?.title} status changed to ${newStatus}`, 'info');
                    return { ...app, status: res.data.status };
                }
                return app;
            }));
        } catch (err) { console.error(err); }
    };

    const addStudent = async (data) => {
        try {
            const res = await api.createStudent({ ...data, status: data.status || 'Pending' });
            setStudents(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) { console.error(err); }
    };

    const deleteStudent = async (id) => {
        try {
            await api.deleteStudent(id);
            setStudents(prev => prev.filter(s => s.id !== id && s.id !== Number(id)));
        } catch (err) { console.error(err); }
    };

    const updateStudent = async (id, data) => {
        try {
            const res = await api.updateStudent(id, data);
            setStudents(prev => prev.map(s => (s.id === id || s.id === Number(id)) ? res.data : s));
        } catch (err) { console.error(err); }
    };

    const addEmployer = async (data) => {
        try {
            const res = await api.createEmployer(data);
            setEmployers(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) { console.error(err); }
    };

    const deleteEmployer = async (id) => {
        try {
            await api.deleteEmployer(id);
            setEmployers(prev => prev.filter(e => e.id !== id && e.id !== Number(id)));
        } catch (err) { console.error(err); }
    };

    const updateEmployer = async (id, data) => {
        try {
            const res = await api.updateEmployer(id, data);
            setEmployers(prev => prev.map(e => (e.id === id || e.id === Number(id)) ? res.data : e));
        } catch (err) { console.error(err); }
    };

    const addOfficer = async (data) => {
        try {
            const res = await api.createOfficer(data);
            setOfficers(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) { console.error(err); }
    };

    const deleteOfficer = async (id) => {
        try {
            await api.deleteOfficer(id);
            setOfficers(prev => prev.filter(o => o.id !== id && o.id !== Number(id)));
        } catch (err) { console.error(err); }
    };

    const updateOfficer = async (id, data) => {
        try {
            const res = await api.updateOfficer(id, data);
            setOfficers(prev => prev.map(o => (o.id === id || o.id === Number(id)) ? res.data : o));
        } catch (err) { console.error(err); }
    };

    const withdrawApplication = async (appId) => {
        try {
            await api.withdrawApplication(appId);
            const app = applications.find(a => a.id === appId || a.id === Number(appId));
            if (app) {
                const job = jobs.find(j => j.id === app.jobId);
                setApplications(prev => prev.filter(a => a.id !== appId && a.id !== Number(appId)));
                addNotification(app.studentId, `You withdrew your application for ${job?.title}`, 'info');
                return true;
            }
            return false;
        } catch (err) { console.error(err); return false; }
    };

    const value = {
        jobs,
        applications,
        students,
        employers,
        officers,
        notifications,
        applyForJob,
        withdrawApplication,
        getStudentApplications,
        addJob,
        updateJob,
        deleteJob,
        updateApplicationStatus,
        updateStudent,
        deleteStudent,
        addStudent,
        addEmployer,
        deleteEmployer,
        updateEmployer,
        addOfficer,
        deleteOfficer,
        updateOfficer,
        addNotification,
        markNotificationAsRead,
        setJobs,
        setApplications,
        setStudents,
        setEmployers,
        setOfficers
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
