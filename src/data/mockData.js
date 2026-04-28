export const STUDENTS = [
    { id: 1, name: 'John Doe', roll: '20CS001', dept: 'CSE', year: 4, cgpa: 8.5, status: 'Placed', company: 'Google' },
    { id: 2, name: 'Jane Smith', roll: '20CS002', dept: 'CSE', year: 4, cgpa: 9.1, status: 'Not Placed', company: null },
    { id: 3, name: 'Alex Johnson', roll: '20EC001', dept: 'ECE', year: 3, cgpa: 7.8, status: 'Pending', company: null },
];

export const JOBS = [
    { id: 1, title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$150,000', type: 'Full-time', deadline: '2026-03-31', eligibility: 'CGPA > 8.0' },
    { id: 2, title: 'Product Manager', company: 'Microsoft', location: 'Redmond, WA', salary: '$140,000', type: 'Full-time', deadline: '2026-04-15', eligibility: 'All departments' },
];

export const APPLICATIONS = [
    { id: 1, jobId: 1, studentId: 1, status: 'Selected', appliedDate: '2026-02-10' },
    { id: 2, jobId: 2, studentId: 2, status: 'Shortlisted', appliedDate: '2026-02-15' },
];

export const STATS = {
    totalStudents: 1250,
    activeCompanies: 45,
    openJobs: 120,
    placedStudents: 850
};
