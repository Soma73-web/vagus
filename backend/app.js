const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "http://74.176.208.152:3000",
  "http://localhost:3001",
  "https://vagus.vercel.app",
  "https://vagus-update.vercel.app",
  "https://vagusscience.online",
  "https://www.vagusscience.online",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const sequelize = require("./config/db");
const db = require("./models");

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected to MySQL"))
  .catch((err) => console.error("Unable to connect to DB:", err));

// Sync Models (optional: use { alter: true } or { force: true } for dev)
sequelize
  .sync()
  .then(() => console.log("All models synced"))
  .catch((err) => console.error("Error syncing models:", err));

// Routes
const testimonialRoutes = require("./routes/testimonialRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const resultRoutes = require("./routes/resultRoutes");
const categorizedImageRoutes = require("./routes/categorizedImageRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const popupRoutes = require("./routes/popupRoutes");
const adminRoutes = require("./routes/admin");
const chatbotRoutes = require("./routes/chatbotRoutes");
const analyticsController = require('./controllers/analyticsController');

app.use(analyticsController.trackVisit);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/gallery", categorizedImageRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminStudentRoutes);
app.use("/api/popup", popupRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Root
app.get("/", (req, res) => {
  res.send("NEET Academy API running with Sequelize");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
