const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/upload');
const ctrl    = require('../controllers/galleryController');

// CORS middleware for image routes
const imageCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

router.get('/',                ctrl.getAllGalleryItems);

// Handle preflight requests for image routes
router.options('/image/:id', imageCors, (req, res) => {
  res.status(200).end();
});

router.get('/image/:id',       imageCors, ctrl.getGalleryImage);        // inline <img src=…>
router.get('/download/:id',    ctrl.downloadGalleryImage);   // attachment
router.post('/',               upload.single('image'), ctrl.createGalleryItem);
router.put('/:id',             upload.single('image'), ctrl.updateGalleryItem);
router.delete('/:id',          ctrl.deleteGalleryItem);

module.exports = router;
