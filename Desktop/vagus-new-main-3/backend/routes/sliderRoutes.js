const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const sliderController = require('../controllers/sliderController');

// CORS middleware for image routes
const imageCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

// Routes using controller
router.post('/', upload.single('photo'), sliderController.uploadImage);
router.get('/', sliderController.getAllImageIds);

// Handle preflight requests for image routes
router.options('/image/:id', imageCors, (req, res) => {
  res.status(200).end();
});

router.get('/image/:id', imageCors, sliderController.getImageById);
router.delete('/:id', sliderController.deleteImageById);

module.exports = router;
