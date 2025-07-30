const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Create upload directories if they don't exist
const createUploadDirectories = () => {
  const uploadDirs = [
    'uploads',
    'uploads/events',
    'uploads/gallery',
    'uploads/testimonials',
    'uploads/slider',
    'uploads/study-materials',
    'uploads/results',
    'uploads/achievements',
    'uploads/faculty'
  ];
  
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Create directories on startup
createUploadDirectories();

// Sequelize DB connection
const sequelize = require("./config/db");

// Authenticate database connection (safe for production)
sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected to MySQL"))
  .catch((err) => console.error("Sequelize connection error:", err));

// Sync models to reflect schema changes (alter columns as needed)
sequelize
  .sync({ alter: true })
  .then(() => console.log("All models synced (altered)"))
  .catch((err) => console.error("Error syncing models:", err));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiting (safe limits)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Rate limiting for login endpoints (more strict)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: "Too many login attempts, please try again later." }
});
app.use('/api/auth/login', loginLimiter);
app.use('/api/students/login', loginLimiter);

// Analytics tracking middleware
const analyticsController = require("./controllers/analyticsController");
app.use(analyticsController.trackVisit);

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://74.176.208.152:3000",
  "http://localhost:3001",
  "https://vagus.vercel.app",
  "https://vagus-update.vercel.app",
  "https://vagusscience.online",
  "https://www.vagusscience.online",
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
const chatbotRoutes = require("./routes/chatbotRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");
const popupRoutes = require('./routes/popupRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const leadRoutes = require("./routes/lead");

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
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use('/api/popup', popupRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/leads", leadRoutes);

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
  // Log error for debugging
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: "Invalid input data" });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Duplicate entry" });
  }

  // Generic error response (don't expose internal details in production)
  const isProduction = process.env.NODE_ENV === "production";
  res.status(500).json({
    error: isProduction ? "Internal server error" : error.message,
    ...(isProduction ? {} : { stack: error.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
