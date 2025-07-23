const db = require('../models');
const Achievement = db.Achievement;
const path = require('path');

// Get all achievements
exports.getAll = async (req, res) => {
  try {
    const achievements = await Achievement.findAll({ order: [['createdAt', 'DESC']] });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

// Get achievement by ID
exports.getById = async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievement' });
  }
};

// Create achievement
exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/achievements/${req.file.filename}`;
    }
    // Input validation
    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }
    const achievement = await Achievement.create({ title, description, image });
    res.status(201).json(achievement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create achievement' });
  }
};

// Update achievement
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    let image = achievement.image;
    if (req.file) {
      image = `/uploads/achievements/${req.file.filename}`;
    }
    await achievement.update({ title, description, image });
    res.json(achievement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update achievement' });
  }
};

// Delete achievement
exports.delete = async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    await achievement.destroy();
    res.json({ message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
}; 