const GalleryCategory = require('../models/GalleryCategory');
const ImageGalleryItem = require('../models/ImageGalleryItem');

exports.getCategoriesWithImages = async (req, res) => {
  try {
    const categories = await GalleryCategory.findAll({
      include: [{ model: ImageGalleryItem, as: 'images' }],
      order: [['id', 'ASC']],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching gallery' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) return res.status(400).json({ message: 'Category ID is required' });
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageData = `data:${mimeType};base64,${base64Image}`;

    const newImage = await ImageGalleryItem.create({
      categoryId,
      image: imageData,
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: 'Server error deleting image' });
  }
};
