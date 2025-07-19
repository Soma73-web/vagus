const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Sequelize DB connection
const sequelize = require('./config/db');
sequelize.authenticate()
  .then(() => console.log('Sequelize connected to MySQL'))
  .catch(err => console.error('Sequelize connection error:', err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://vagus.vercel.app'],
  credentials: true,
}));

// Route Imports
const testimonialRoutes = require('./routes/testimonialRoutes');
const downloadRoutes    = require('./routes/downloadRoutes');
const galleryRoutes     = require('./routes/galleryRoutes');
const resultRoutes      = require('./routes/resultRoutes');
const adminRoutes       = require('./routes/admin');
const sliderRoutes      = require('./routes/sliderRoutes'); 
const imageGalleryRoutes = require('./routes/imageGalleryRoutes'); // <-- Add this

// Route Mounting
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/downloads',    downloadRoutes);
app.use('/api/gallery',      galleryRoutes);
app.use('/api/results',      resultRoutes);
app.use('/api/auth',         adminRoutes);
app.use('/api/slider',       sliderRoutes); 
app.use('/api/image-gallery', imageGalleryRoutes); // <-- Add this


// Default route
app.get('/', (req, res) => {
  res.send('NEET Academy API is running');
});

// Sync Sequelize models (Optional)
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
