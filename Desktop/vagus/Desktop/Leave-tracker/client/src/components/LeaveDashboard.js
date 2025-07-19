import React, { useEffect, useState } from 'react';
import './LeaveDashboard.css';

const LeaveDashboard = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await fetch('/api/leaves');
                const data = await response.json();
                setLeaves(data);
            } catch (error) {
                console.error('Error fetching leave data:', error);
            }
        };

        fetchLeaves();
    }, []);

    return (
        <div className="container">
            <h1>Leave Dashboard</h1>
            {leaves.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((leave) => (
                            <tr key={leave._id}>
                                <td>{leave.employeeId}</td>
                                <td>{leave.department}</td>
                                <td>{leave.leaveType}</td>
                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td>{leave.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No leave records found.</p>
            )}
        </div>
    );
};

export default LeaveDashboard;
