const db = require('../models');
const Faculty = db.Faculty;
const path = require('path');

// Get all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findAll({ order: [['createdAt', 'DESC']] });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
};

// Get faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
};

// Create faculty
exports.createFaculty = async (req, res) => {
  try {
    const { name, subject } = req.body;
    // Input validation
    if (!name || !subject) {
      return res.status(400).json({ error: "Name and subject are required" });
    }
    let photo = null;
    if (req.file) {
      photo = `/uploads/faculty/${req.file.filename}`;
    }
    const faculty = await Faculty.create({ name, subject, photo });
    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create faculty' });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { name, subject } = req.body;
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    let photo = faculty.photo;
    if (req.file) {
      photo = `/uploads/faculty/${req.file.filename}`;
    }
    await faculty.update({ name, subject, photo });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update faculty' });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    await faculty.destroy();
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
}; 