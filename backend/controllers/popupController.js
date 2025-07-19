const Popup = require('../models/Popup');

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

// Get all popups (admin)
const getAllPopups = async (req, res) => {
  try {
    const popups = await Popup.findAll({
      attributes: { exclude: ['imageData'] }, // Don't send BLOB data in list
      order: [['createdAt', 'DESC']]
    });

    res.json(popups);
  } catch (error) {
    console.error('Error fetching popups:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create popup (admin)
const createPopup = async (req, res) => {
  try {
    const { title, speaker, affiliation, description, displayDelay } = req.body;
    const imageFile = req.file;

    const popupData = {
      title,
      speaker,
      affiliation,
      description,
      displayDelay: displayDelay || 5
    };

    if (imageFile) {
      popupData.imageData = imageFile.buffer;
      popupData.imageMimeType = imageFile.mimetype;
    }

    const popup = await Popup.create(popupData);
    
    // Return popup without BLOB data
    const { imageData, ...popupResponse } = popup.toJSON();
    res.status(201).json(popupResponse);
  } catch (error) {
    console.error('Error creating popup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update popup (admin)
const updatePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, speaker, affiliation, description, displayDelay, isActive } = req.body;
    const imageFile = req.file;

    const popup = await Popup.findByPk(id);
    if (!popup) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    const updateData = {
      title,
      speaker,
      affiliation,
      description,
      displayDelay,
      isActive
    };

    if (imageFile) {
      updateData.imageData = imageFile.buffer;
      updateData.imageMimeType = imageFile.mimetype;
    }

    await popup.update(updateData);
    
    // Return popup without BLOB data
    const { imageData, ...popupResponse } = popup.toJSON();
    res.json(popupResponse);
  } catch (error) {
    console.error('Error updating popup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete popup (admin)
const deletePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findByPk(id);
    
    if (!popup) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    await popup.destroy();
    res.json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error('Error deleting popup:', error);
    res.status(500).json({ message: 'Server error' });
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