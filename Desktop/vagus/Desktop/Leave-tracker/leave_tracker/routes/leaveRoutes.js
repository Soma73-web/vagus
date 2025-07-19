const express = require('express');
const router = express.Router();
const Leave = require('../models/leave');

// Apply leave
router.post('/', async (req, res) => {
    try {
        const leave = new Leave(req.body);
        await leave.save();
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: 'Error applying leave' });
    }
});

// Get all leaves
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves' });
    }
});

// Get leaves by employee ID
router.get('/history', async (req, res) => {
    const { employeeId, startDate, endDate } = req.query;

    if (!employeeId || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const leaves = await Leave.find({
            employeeId,
            startDate: { $gte: new Date(startDate) },
            endDate: { $lte: new Date(endDate) }
        });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave history', error: error.message });
    }
});

// Get all leaves for managers
router.get('/department/:departmentId', async (req, res) => {
    try {
        const departmentId = req.params.departmentId;
        const leaves = await Leave.find({ department: departmentId });
        if (leaves.length === 0) {
            return res.status(404).json({ message: 'No leave records found for this department' });
        }
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching leave history by department:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
