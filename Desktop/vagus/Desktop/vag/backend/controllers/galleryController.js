const path = require('path');
const GalleryImage = require('../models/GalleryImage');

// GET all gallery items
exports.getAllGalleryItems = async (_req, res) => {
  try {
    const items = await GalleryImage.findAll({ attributes: ['id', 'title'] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET single image inline
exports.getGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryImage.findByPk(id);

    if (!item) return res.status(404).send('Not found');

    res.setHeader('Content-Type', item.image_type);
    res.send(item.image);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET image as download
exports.downloadGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryImage.findByPk(id);

    if (!item) return res.status(404).send('Not found');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${item.title}${path.extname(item.image_type)}"`
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(item.image);
  } catch (err) {
    console.error('Error downloading image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    await GalleryImage.create({
      title,
      image: file.buffer,
      image_type: file.mimetype
    });

    res.status(201).json({ message: 'Gallery item created successfully' });
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const file = req.file;

    const item = await GalleryImage.findByPk(id);
    if (!item) return res.status(404).send('Not found');

    item.title = title || item.title;
    if (file) {
      item.image = file.buffer;
      item.image_type = file.mimetype;
    }

    await item.save();
    res.json({ message: 'Gallery item updated successfully' });
  } catch (err) {
    console.error('Error updating gallery item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryImage.destroy({ where: { id } });

    if (!deleted) return res.status(404).send('Not found');

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
