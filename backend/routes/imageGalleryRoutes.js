const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getCategoriesWithImages,
  uploadImage,
  deleteImage,
} = require('../controllers/imageGalleryController');

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all categories with their images
router.get('/', getCategoriesWithImages);

// POST upload image to category
router.post('/upload', upload.single('image'), uploadImage);

// DELETE image by id
router.delete('/image/:id', deleteImage);

module.exports = router;
