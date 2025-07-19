const { Slider } = require('../models');

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const newSlider = await Slider.create({
      photo: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({ id: newSlider.id, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Get all slider images with base64 data
exports.getAllImageIds = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      attributes: ['id', 'photo', 'mimeType'],
      order: [['id', 'ASC']],
    });
    
    // Convert blob images to base64
    const slidersWithBase64 = sliders.map(slider => {
      const sliderData = slider.toJSON();
      if (sliderData.photo) {
        const base64Image = sliderData.photo.toString('base64');
        sliderData.photo = `data:${sliderData.mimeType || 'image/jpeg'};base64,${base64Image}`;
      }
      return sliderData;
    });
    
    res.json(slidersWithBase64);
  } catch (error) {
    console.error('Fetch slider images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Get slider image by ID
exports.getImageById = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Set CORS headers for image responses
    res.set({
      'Content-Type': slider.mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });
    
    res.send(slider.photo);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

// Delete slider image by ID
exports.deleteImageById = async (req, res) => {
  try {
    const deleted = await Slider.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
