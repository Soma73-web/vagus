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
    const { name, subject, education } = req.body;
    // Input validation
    if (!name || !subject || !education) {
      return res.status(400).json({ error: "Name, subject and education are required" });
    }
    let image_data = null;
    let image_type = null;
    if (req.file) {
      image_data = req.file.buffer;
      image_type = req.file.mimetype;
    }
    const faculty = await Faculty.create({ name, subject, education, image_data, image_type });
    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create faculty' });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { name, subject, education } = req.body;
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    let image_data = faculty.image_data;
    let image_type = faculty.image_type;
    if (req.file) {
      image_data = req.file.buffer;
      image_type = req.file.mimetype;
    }
    await faculty.update({ name, subject, education, image_data, image_type });
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

// Stream faculty image
exports.getFacultyImage = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty || !faculty.image_data) return res.status(404).json({ error: 'Image not found' });
    res.set('Content-Type', faculty.image_type || 'image/jpeg');
    res.send(faculty.image_data);
  } catch (err) {
    console.error('Error serving faculty image:', err);
    res.status(500).json({ error: 'Server error serving image' });
  }
}; 