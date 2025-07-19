import React, { useState } from 'react';
import axios from 'axios';

const ApplyLeave = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [department, setDepartment] = useState('');
    const [leaveType, setLeaveType] = useState('Planned');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/leaves', { employeeId, department, leaveType, startDate, endDate, reason });
            setMessage('Leave applied successfully.');
        } catch (error) {
            setMessage('An error occurred while applying for leave.');
        }
    };

    return (
        <div>
            <h1>Apply for Leave</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Employee ID"
                    required
                />
                <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department"
                    required
                />
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                    <option value="Planned">Planned</option>
                    <option value="Unplanned">Unplanned</option>
                </select>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason"
                    required
                />
                <button type="submit">Submit Leave</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ApplyLeave;
