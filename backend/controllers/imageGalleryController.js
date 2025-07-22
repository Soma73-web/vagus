const { GalleryCategory, ImageGalleryItem } = require('../models'); // ✅ Correct import

exports.getCategoriesWithImages = async (req, res) => {
  try {
    const categories = await GalleryCategory.findAll({
      include: [{ model: ImageGalleryItem, as: 'images' }],
      order: [['id', 'ASC']],
    });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories with images:', err);
    res.status(500).json({ message: 'Server error fetching gallery' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { category_id } = req.body;
    if (!category_id) return res.status(400).json({ message: 'Category ID is required' });
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageData = `data:${mimeType};base64,${base64Image}`;

    const newImage = await ImageGalleryItem.create({
      category_id,
      image_url: imageData,
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ message: 'Server error uploading image' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ImageGalleryItem.findByPk(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: 'Server error deleting image' });
  }
};
