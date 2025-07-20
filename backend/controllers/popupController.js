const db = require('../models');
const Popup = db.Popup;

// Get active popup
const getActivePopup = async (req, res) => {
  try {
    const popup = await Popup.findOne({
      where: { isActive: true },
      attributes: { exclude: ['imageData'] } // Don't send BLOB data in list
    });

    if (!popup) {
      return res.status(404).json({ message: 'No active popup found' });
    }

    res.json(popup);
  } catch (error) {
    console.error('Error fetching popup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get popup image
const getPopupImage = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findByPk(id);

    if (!popup || !popup.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', popup.imageMimeType || 'image/jpeg');
    res.send(popup.imageData);
  } catch (error) {
    console.error('Error fetching popup image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllPopups = async (req, res) => {
  try {
    const popups = await Popup.findAll();
    res.json(popups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPopup = async (req, res) => {
  try {
    const { title, message, isActive } = req.body;
    const popup = await Popup.create({ title, message, isActive });
    res.status(201).json(popup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, isActive } = req.body;
    const popup = await Popup.findByPk(id);
    if (!popup) return res.status(404).json({ error: 'Popup not found' });
    await popup.update({ title, message, isActive });
    res.json(popup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findByPk(id);
    if (!popup) return res.status(404).json({ error: 'Popup not found' });
    await popup.destroy();
    res.json({ message: 'Popup deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle popup status (admin)
const togglePopupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findByPk(id);
    
    if (!popup) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    popup.isActive = !popup.isActive;
    await popup.save();
    
    const { imageData, ...popupResponse } = popup.toJSON();
    res.json(popupResponse);
  } catch (error) {
    console.error('Error toggling popup status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getActivePopup,
  getPopupImage,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
  togglePopupStatus
}; 