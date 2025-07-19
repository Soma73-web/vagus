const { Student, Attendance, TestResult } = require("../models");
const bcrypt = require("bcryptjs");

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

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ where: { studentId } });
    if (existingStudent) {
      return res.status(400).json({ error: "Student ID already exists" });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      course,
      batch,
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
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
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
      res
        .status(201)
        .json({
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
  markAttendance,
  addTestResult,
  updateTestResult,
};
