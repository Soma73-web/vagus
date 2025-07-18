const { Student, Attendance, TestResult } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { studentLoginSchema } = require("../validators/schemas");
const { Op } = require("sequelize");

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>"'&]/g, (match) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "&": "&amp;",
    };
    return entities[match];
  });
};

// Student login with enhanced security
const loginStudent = async (req, res) => {
  try {
    // Validate input using Joi schema
    const { error, value } = studentLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const { studentId, password } = value;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Sanitize inputs
    const sanitizedStudentId = sanitizeInput(studentId);

    // Rate limiting check
    const attemptKey = `${clientIp}-${sanitizedStudentId}`;
    const currentTime = Date.now();

    if (loginAttempts.has(attemptKey)) {
      const attempts = loginAttempts.get(attemptKey);
      if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        if (currentTime - attempts.lastAttempt < LOCKOUT_TIME) {
          const remainingTime = Math.ceil(
            (LOCKOUT_TIME - (currentTime - attempts.lastAttempt)) / 60000,
          );
          return res.status(429).json({
            error: `Account temporarily locked. Try again in ${remainingTime} minutes.`,
          });
        } else {
          // Reset attempts after lockout period
          loginAttempts.delete(attemptKey);
        }
      }
    }

    // Find student with parameterized query to prevent SQL injection
    const student = await Student.findOne({
      where: {
        studentId: {
          [Op.eq]: sanitizedStudentId,
        },
      },
      attributes: [
        "id",
        "studentId",
        "firstName",
        "lastName",
        "email",
        "password",
        "course",
        "batch",
        "isActive",
      ],
    });

    // Check if student exists
    if (!student) {
      // Track failed attempt
      const attempts = loginAttempts.get(attemptKey) || {
        count: 0,
        lastAttempt: 0,
      };
      attempts.count++;
      attempts.lastAttempt = currentTime;
      loginAttempts.set(attemptKey, attempts);

      return res.status(401).json({ error: "Invalid student ID or password" });
    }

    // Check if student is active
    if (!student.isActive) {
      return res.status(403).json({
        error:
          "Your account has been deactivated. Please contact the administrator.",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      // Track failed attempt
      const attempts = loginAttempts.get(attemptKey) || {
        count: 0,
        lastAttempt: 0,
      };
      attempts.count++;
      attempts.lastAttempt = currentTime;
      loginAttempts.set(attemptKey, attempts);

      return res.status(401).json({ error: "Invalid student ID or password" });
    }

    // Clear failed attempts on successful login
    loginAttempts.delete(attemptKey);

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res
        .status(500)
        .json({ error: "Authentication configuration error" });
    }

    const token = jwt.sign(
      {
        id: student.id,
        studentId: student.studentId,
        type: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Update last login timestamp
    await student.update({
      lastLoginAt: new Date(),
      lastLoginIp: clientIp,
    });

    res.json({
      message: "Login successful",
      token,
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        course: student.course,
        batch: student.batch,
        isActive: student.isActive,
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get student attendance
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    const whereClause = { studentId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      whereClause.date = {
        [require("sequelize").Op.between]: [startDate, endDate],
      };
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      order: [["date", "ASC"]],
    });

    res.json(attendance);
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

// Get student test results
const getStudentTestResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { testNumber } = req.query;

    const whereClause = { studentId };
    if (testNumber) {
      whereClause.testNumber = testNumber;
    }

    const testResults = await TestResult.findAll({
      where: whereClause,
      order: [["testDate", "DESC"]],
    });

    res.json(testResults);
  } catch (error) {
    console.error("Get test results error:", error);
    res.status(500).json({ error: "Failed to fetch test results" });
  }
};

// Get available test numbers for a student
const getAvailableTests = async (req, res) => {
  try {
    const { studentId } = req.params;

    const tests = await TestResult.findAll({
      where: { studentId },
      attributes: ["testNumber", "testName"],
      group: ["testNumber", "testName"],
      order: [["testNumber", "ASC"]],
    });

    res.json(tests);
  } catch (error) {
    console.error("Get available tests error:", error);
    res.status(500).json({ error: "Failed to fetch available tests" });
  }
};

module.exports = {
  loginStudent,
  getStudentAttendance,
  getStudentTestResults,
  getAvailableTests,
};
