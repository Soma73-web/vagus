const express = require("express");
const router = express.Router();
const {
  getActivePopup,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
  togglePopupStatus,
} = require("../controllers/popupAnnouncementController");

// Enhanced admin auth middleware with rate limiting
const adminAttempts = new Map();

const authenticateAdmin = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();

  // Rate limiting: max 100 requests per minute
  if (!adminAttempts.has(clientIp)) {
    adminAttempts.set(clientIp, { count: 0, firstAttempt: currentTime });
  }

  const attempts = adminAttempts.get(clientIp);
  if (currentTime - attempts.firstAttempt > 60000) {
    // Reset after 1 minute
    attempts.count = 0;
    attempts.firstAttempt = currentTime;
  }

  if (attempts.count > 100) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again later." });
  }

  attempts.count++;

  const adminAuth = req.header("Admin-Auth");
  if (adminAuth === "admin-authenticated") {
    req.admin = { username: "admin", ip: clientIp };
    next();
  } else {
    res.status(401).json({ error: "Admin access required" });
  }
};

// Public route - get active popup for homepage
router.get("/active", getActivePopup);

// Admin routes
router.get("/", authenticateAdmin, getAllPopups);
router.post("/", authenticateAdmin, createPopup);
router.put("/:id", authenticateAdmin, updatePopup);
router.delete("/:id", authenticateAdmin, deletePopup);
router.patch("/:id/toggle", authenticateAdmin, togglePopupStatus);

module.exports = router;
