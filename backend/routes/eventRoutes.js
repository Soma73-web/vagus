const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventImage,
} = require("../controllers/eventController");

// Configure multer for memory storage (BLOB)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Simple admin auth middleware
const authenticateAdmin = (req, res, next) => {
  const adminAuth = req.header("Admin-Auth");
  if (adminAuth === "admin-authenticated") {
    req.admin = { username: "admin" };
    next();
  } else {
    res.status(401).json({ error: "Admin access required" });
  }
};

// Public routes
router.get("/", getAllEvents);
router.get("/image/:id", getEventImage);

// Admin routes
router.post("/", authenticateAdmin, upload.single("image"), createEvent);
router.put("/:id", authenticateAdmin, upload.single("image"), updateEvent);
router.delete("/:id", authenticateAdmin, deleteEvent);

module.exports = router;
