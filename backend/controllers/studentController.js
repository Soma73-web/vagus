const { Student, Attendance, TestResult } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student login
const loginStudent = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const student = await Student.findOne({
      where: { studentId, isActive: true },
    });

    if (!student) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student.id, studentId: student.studentId },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" },
    );

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
