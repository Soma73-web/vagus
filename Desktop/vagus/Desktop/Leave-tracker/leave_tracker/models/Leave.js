const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Planned', 'Unplanned'],
        required: true
    },
    department: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String
    }
});

module.exports = mongoose.model('Leave', leaveSchema);
