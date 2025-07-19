const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Sequelize DB connection
const sequelize = require("./config/db");

// Authenticate database connection (safe for production)
sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected to MySQL"))
  .catch((err) => console.error("Sequelize connection error:", err));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://vagus.vercel.app",
  "https://vagus-update.vercel.app",
];

// Add production domains
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Admin-Auth"],
  }),
);

// Route Imports
const testimonialRoutes = require("./routes/testimonialRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/admin");
const sliderRoutes = require("./routes/sliderRoutes");
const imageGalleryRoutes = require("./routes/imageGalleryRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");

// Route Mounting
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/image-gallery", imageGalleryRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminStudentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/study-materials", studyMaterialRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "NEET Academy API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
