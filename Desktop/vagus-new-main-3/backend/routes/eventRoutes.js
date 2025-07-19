const express = require("express");
const router = express.Router();
const eventsUpload = require("../middleware/eventsUpload");
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventImage,
} = require("../controllers/eventController");

// CORS middleware for image routes
const imageCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

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

// Handle preflight requests for image routes
router.options("/image/:id", imageCors, (req, res) => {
  res.status(200).end();
});

router.get("/image/:id", imageCors, getEventImage);

// Admin routes
router.post("/", authenticateAdmin, eventsUpload.single("image"), createEvent);
router.put(
  "/:id",
  authenticateAdmin,
  eventsUpload.single("image"),
  updateEvent,
);
router.delete("/:id", authenticateAdmin, deleteEvent);

module.exports = router;
