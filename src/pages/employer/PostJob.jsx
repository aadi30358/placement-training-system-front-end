import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components/UI';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PostJob = () => {
    const navigate = useNavigate();
    const { addJob } = useData();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'Full-time',
        location: '',
        salary: '',
        deadline: '',
        description: '',
        eligibility: '',
        skills: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const jobData = {
            ...formData,
            company: user?.company || 'Your Company',
        };

        setTimeout(() => {
            const success = addJob(jobData);
            setLoading(false);
            if (success) {
                toast.success('Job posted successfully!');
                navigate('/employer/dashboard');
            } else {
                toast.error('Failed to post job');
            }
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Create Job Posting</h1>
                <p className="text-slate-500">Provide clear details to attract the right candidates.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                label="Job Title"
                                name="title"
                                placeholder="e.g. Senior Frontend Developer"
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700">Job Type</label>
                            <select
                                name="type"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option>Full-time</option>
                                <option>Internship</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                            </select>
                        </div>
                        <Input
                            label="Location"
                            name="location"
                            placeholder="e.g. Remote or City, State"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <Input
                            label="Annual Package (CTC)"
                            name="salary"
                            placeholder="e.g. $100,000"
                            required
                            value={formData.salary}
                            onChange={handleChange}
                        />
                        <Input
                            label="Application Deadline"
                            name="deadline"
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <Card title="Requirements & Details">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                            <textarea
                                name="description"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all h-32 text-sm"
                                placeholder="Describe the role, responsibilities, and team..."
                                required
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <Input
                            label="Eligibility Criteria"
                            name="eligibility"
                            placeholder="e.g. CGPA > 8.0, No backlogs"
                            value={formData.eligibility}
                            onChange={handleChange}
                        />
                        <Input
                            label="Skills Required"
                            name="skills"
                            placeholder="e.g. React, TypeScript, GraphQL"
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button variant="secondary" type="button" onClick={() => navigate('/employer/dashboard')}>Cancel</Button>
                    <Button type="submit" className="px-10 shadow-lg shadow-primary-200" disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Job'}
                    </Button>
                </div>
            </form>
        </div>
    );
};


export default PostJob;
