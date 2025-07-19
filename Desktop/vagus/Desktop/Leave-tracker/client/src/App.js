import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ApplyLeave from './components/ApplyLeave';
import LeaveDashboard from './components/LeaveDashboard';
import LeaveHistoryByID from './components/LeaveHistoryByID'; // Updated component import
import ManagerLeaveHistory from './components/ManagerLeaveHistory';
import './styles/App.css';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Apply Leave</Link></li>
                        <li><Link to="/dashboard">Leave Dashboard</Link></li>
                        <li><Link to="/leave/1">Leave History by ID</Link></li> {/* Example URL */}
                        <li><Link to="/manager-history">Manager Leave History</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<ApplyLeave />} />
                    <Route path="/dashboard" element={<LeaveDashboard />} />
                    <Route path="/leave/:employeeId" element={<LeaveHistoryByID />} /> {/* Updated route */}
                    <Route path="/manager-history" element={<ManagerLeaveHistory />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
