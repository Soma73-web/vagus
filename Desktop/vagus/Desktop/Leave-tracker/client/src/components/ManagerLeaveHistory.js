import React, { useState } from 'react';
import axios from 'axios';
import './ManagerLeaveHistory.css';

const ManagerLeaveHistory = () => {
    const [department, setDepartment] = useState('');
    const [leaves, setLeaves] = useState([]);

    const handleFetchByDepartment = async () => {
        if (department) {
            try {
                const response = await axios.get(`/api/leaves/department/${department}`);
                setLeaves(response.data);
            } catch (error) {
                console.error('Error fetching leave history by department:', error);
            }
        }
    };

    return (
        <div>
            <h1>Manager Leave History</h1>
            <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department"
            />
            <button onClick={handleFetchByDepartment}>Fetch Leave History</button>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Department</th>
                        <th className='planned'>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody className='leave-history'>
                    {leaves.map((leave, index) => (
                        <tr key={index}>
                            <td>{leave.employeeId}</td>
                            <td>{leave.department}</td>
                            <td className={leave.leaveType.toLowerCase()}>{leave.leaveType}</td>
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

export default ManagerLeaveHistory;
