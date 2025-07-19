import React, { useState } from 'react';
import axios from 'axios';
import './LeaveHistoryByID.css'; // Import CSS file

const LeaveHistoryByID = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/leaves/history`, {
                params: { employeeId, startDate, endDate }
            });
            setLeaves(response.data);
        } catch (err) {
            setError('An error occurred while fetching leave history.');
            console.error(err);
        }
    };

    return (
        <div className="leave-history">
            <h2>Leave History by Employee ID</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Employee ID:
                    <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Get Leave History</button>
            </form>
            {error && <p className="error">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Leave Type</th>
                        <th>Department</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map((leave) => (
                        <tr key={leave._id}>
                            <td>{leave.employeeId}</td>
                            <td className={leave.leaveType.toLowerCase()}>{leave.leaveType}</td>
                            <td>{leave.department}</td>
                            <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td>{leave.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveHistoryByID;
