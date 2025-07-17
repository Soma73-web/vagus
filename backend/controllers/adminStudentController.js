const { Student, Attendance, TestResult } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Input validation and sanitization helper
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

// Validate required fields
const validateRequiredFields = (fields, requiredFields) => {
  const missing = requiredFields.filter(
    (field) => !fields[field] || fields[field].toString().trim() === "",
  );
  return missing.length ? missing : null;
};

// Create student account
const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      course,
      batch,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "studentId",
      "firstName",
      "lastName",
      "email",
      "password",
      "course",
      "batch",
    ];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    if (missingFields) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      studentId: sanitizeInput(studentId),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: sanitizeInput(email.toLowerCase()),
      password,
      phone: phone ? sanitizeInput(phone) : null,
      course: sanitizeInput(course),
      batch: sanitizeInput(batch),
      dateOfBirth,
    };

    // Check if student ID already exists
    const existingStudent = await Student.findOne({
      where: {
        studentId: sanitizedData.studentId,
      },
    });
    if (existingStudent) {
      return res.status(400).json({ error: "Student ID already exists" });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({
      where: {
        email: sanitizedData.email,
      },
    });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 12);

    const student = await Student.create({
      studentId: sanitizedData.studentId,
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      email: sanitizedData.email,
      password: hashedPassword,
      phone: sanitizedData.phone,
      dateOfBirth: sanitizedData.dateOfBirth,
      course: sanitizedData.course,
      batch: sanitizedData.batch,
      isActive: true,
    });

    res.status(201).json({
      message: "Student created successfully",
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
    console.error("Create student error:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ["password"] },
      order: [["firstName", "ASC"]],
    });

    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Validate student exists
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Sanitize inputs
    Object.keys(updateData).forEach((key) => {
      if (typeof updateData[key] === "string" && key !== "password") {
        updateData[key] = sanitizeInput(updateData[key]);
      }
    });

    // Hash password if provided
    if (updateData.password) {
      if (updateData.password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Validate email format if email is being updated
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      updateData.email = updateData.email.toLowerCase();

      // Check if email already exists for another student
      const existingEmail = await Student.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: id },
        },
      });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Check if studentId already exists for another student
    if (updateData.studentId) {
      const existingStudentId = await Student.findOne({
        where: {
          studentId: updateData.studentId,
          id: { [Op.ne]: id },
        },
      });
      if (existingStudentId) {
        return res.status(400).json({ error: "Student ID already exists" });
      }
    }

    await Student.update(updateData, { where: { id } });

    const updatedStudent = await Student.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete student permanently
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate student exists
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete related records first (cascade delete)
    await Attendance.destroy({ where: { studentId: student.studentId } });
    await TestResult.destroy({ where: { studentId: student.studentId } });

    // Delete student
    await Student.destroy({ where: { id } });

    res.json({
      message: "Student deleted successfully",
      deletedStudent: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, reason } = req.body;
    const markedBy = req.admin?.username || "admin";

    const attendance = await Attendance.findOne({
      where: { studentId, date },
    });

    if (attendance) {
      await attendance.update({ status, reason, markedBy });
      res.json({ message: "Attendance updated successfully", attendance });
    } else {
      const newAttendance = await Attendance.create({
        studentId,
        date,
        status,
        reason,
        markedBy,
      });
      res.status(201).json({
        message: "Attendance marked successfully",
        attendance: newAttendance,
      });
    }
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

// Add test result
const addTestResult = async (req, res) => {
  try {
    const {
      studentId,
      testNumber,
      testName,
      subject,
      maxMarks,
      obtainedMarks,
      testDate,
      remarks,
    } = req.body;

    const addedBy = req.admin?.username || "admin";
    const percentage = ((obtainedMarks / maxMarks) * 100).toFixed(2);

    // Calculate grade
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    const testResult = await TestResult.create({
      studentId,
      testNumber,
      testName,
      subject,
      maxMarks,
      obtainedMarks,
      percentage,
      grade,
      testDate,
      remarks,
      addedBy,
    });

    res.status(201).json({
      message: "Test result added successfully",
      testResult,
    });
  } catch (error) {
    console.error("Add test result error:", error);
    res.status(500).json({ error: "Failed to add test result" });
  }
};

// Update test result
const updateTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { obtainedMarks, maxMarks, remarks } = req.body;

    const percentage = ((obtainedMarks / maxMarks) * 100).toFixed(2);

    // Calculate grade
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    await TestResult.update(
      {
        obtainedMarks,
        maxMarks,
        percentage,
        grade,
        remarks,
      },
      { where: { id } },
    );

    const updatedResult = await TestResult.findByPk(id);

    res.json({
      message: "Test result updated successfully",
      testResult: updatedResult,
    });
  } catch (error) {
    console.error("Update test result error:", error);
    res.status(500).json({ error: "Failed to update test result" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  markAttendance,
  addTestResult,
  updateTestResult,
};
