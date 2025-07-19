const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const sliderController = require('../controllers/sliderController');

// Routes using controller
router.post('/', upload.single('photo'), sliderController.uploadImage);
router.get('/', sliderController.getAllImageIds);
router.get('/image/:id', sliderController.getImageById);
router.delete('/:id', sliderController.deleteImageById);

module.exports = router;
