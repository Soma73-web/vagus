const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const leaveRoutes = require('./routes/leaveRoutes');


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://naik:naik@cluster0.3udc2.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.use('/api/leaves', leaveRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
