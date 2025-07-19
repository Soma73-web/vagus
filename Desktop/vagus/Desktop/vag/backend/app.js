const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://vagus.vercel.app'],
  credentials: true,
}));

// Database connection
const sequelize = require('./config/sequelize');

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Sequelize connected to MySQL'))
  .catch((err) => console.error('Unable to connect to DB:', err));

// Sync Models (optional: use { alter: true } or { force: true } for dev)
sequelize.sync()
  .then(() => console.log('All models synced'))
  .catch((err) => console.error('Error syncing models:', err));

// Routes
const testimonialRoutes = require('./routes/testimonialRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const resultRoutes = require('./routes/resultRoutes');
const categorizedImageRoutes = require('./routes/categorizedImageRoutes');

app.use('/api/testimonials', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/gallery', categorizedImageRoutes);

// Root
app.get('/', (req, res) => {
  res.send('NEET Academy API running with Sequelize');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
