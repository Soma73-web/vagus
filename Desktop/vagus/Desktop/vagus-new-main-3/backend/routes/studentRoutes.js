const express = require("express");
const router = express.Router();
const {
  loginStudent,
  getStudentAttendance,
  getStudentTestResults,
  getAvailableTests,
} = require("../controllers/studentController");

// Student authentication middleware
const authenticateStudent = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
    );
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Public routes
router.post("/login", loginStudent);

// Protected routes
router.get("/:studentId/attendance", authenticateStudent, getStudentAttendance);
router.get(
  "/:studentId/test-results",
  authenticateStudent,
  getStudentTestResults,
);
router.get(
  "/:studentId/available-tests",
  authenticateStudent,
  getAvailableTests,
);

module.exports = router;
