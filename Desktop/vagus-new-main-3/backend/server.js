const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const app = express();

// Import security middleware
const {
  xssProtection,
  generalLimiter,
  authLimiter,
  adminLimiter,
  uploadLimiter,
  cspMiddleware,
  securityHeaders,
  sqlInjectionProtection,
  imageCorsMiddleware,
} = require("./middleware/securityMiddleware");

// Sequelize DB connection
const sequelize = require("./config/db");

// Authenticate database connection (safe for production)
sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected to MySQL"))
  .catch((err) => console.error("Sequelize connection error:", err));

// Security Middleware - More permissive for image serving
app.use(
  helmet({
    contentSecurityPolicy: false, // We'll use our custom CSP
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false, // Allow cross-origin resource loading
    crossOriginOpenerPolicy: false, // Allow cross-origin opener
  }),
);
// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Apply security middleware in order, with image routes bypass
app.use(imageCorsMiddleware); // Global CORS for image routes - MUST BE FIRST

// Bypass all security middleware for image routes
app.use((req, res, next) => {
  if (req.path.includes('/image')) {
    console.log(`🚫 Bypassing security middleware for ${req.path}`);
    return next();
  }
  next();
});

app.use(securityHeaders);
app.use(cspMiddleware);
app.use(generalLimiter);
app.use(xssProtection);
app.use(sqlInjectionProtection);

// Trust proxy (important for rate limiting in production)
app.set("trust proxy", 1);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS Configuration - Apply globally first
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://vagus.vercel.app",
  "https://vagus-update.vercel.app",
  "https://vagus-git-main-vagus.vercel.app",
  "https://vagus-git-update-vagus.vercel.app",
];

// Add production domains
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Enhanced CORS configuration for all routes
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // For development, allow all origins
        if (process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Admin-Auth", "X-Requested-With"],
    exposedHeaders: ["Content-Disposition"],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  }),
);

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

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
const popupAnnouncementRoutes = require("./routes/popupAnnouncementRoutes");

// Route Mounting with specific rate limiters (removed duplicate CORS)
app.use("/api/testimonials", adminLimiter, testimonialRoutes);
app.use("/api/downloads", uploadLimiter, downloadRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/auth", authLimiter, adminRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/image-gallery", imageGalleryRoutes);
app.use("/api/students", authLimiter, studentRoutes);
app.use("/api/admin", adminLimiter, adminStudentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/study-materials", adminLimiter, studyMaterialRoutes);
app.use("/api/popup-announcements", popupAnnouncementRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "NEET Academy API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// CORS test route
app.get("/cors-test", (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.json({
    message: "CORS test successful",
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

// Image CORS test route
app.get("/image-cors-test", (req, res) => {
  console.log(`🧪 Image CORS test for ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  
  res.set({
    'Content-Type': 'image/svg+xml',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=31536000',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Opener-Policy': 'unsafe-none',
  });
  
  // Return a simple SVG test image
  const svgImage = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="blue"/>
    <text x="50" y="50" text-anchor="middle" fill="white" font-size="12">CORS OK</text>
  </svg>`;
  
  res.send(svgImage);
});

// Simple image test route
app.get("/simple-image-test", (req, res) => {
  console.log(`🧪 Simple image test for ${req.method} ${req.path}`);
  
  // Set comprehensive CORS headers
  res.set({
    'Content-Type': 'image/png',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Opener-Policy': 'unsafe-none',
    'Cache-Control': 'public, max-age=31536000',
  });
  
  // Return a simple 1x1 transparent PNG
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  res.send(pngBuffer);
});

// Test route that mimics image serving behavior
app.get("/test-image/:id", (req, res) => {
  console.log(`🧪 Test image route for ID: ${req.params.id}`);
  
  // Set the same headers as our image routes
  res.set({
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=31536000',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Opener-Policy': 'unsafe-none',
  });
  
  // Return a simple test image
  res.send(Buffer.from('fake-image-data'));
});

// Test base64 conversion
app.get("/test-base64", async (req, res) => {
  try {
    console.log('🧪 Testing base64 conversion...');
    
    // Test with a simple base64 image
    const testImage = Buffer.from('test-image-data');
    const base64Image = testImage.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;
    
    console.log(`✅ Base64 conversion test: ${base64Image.length} chars`);
    
    res.json({
      success: true,
      originalSize: testImage.length,
      base64Size: base64Image.length,
      dataUrl: dataUrl,
      message: 'Base64 conversion is working'
    });
  } catch (error) {
    console.error('❌ Base64 test error:', error);
    res.status(500).json({ error: 'Base64 test failed' });
  }
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
