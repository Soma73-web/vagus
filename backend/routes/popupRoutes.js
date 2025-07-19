const express = require('express');
const router = express.Router();
const popupController = require('../controllers/popupController');
const upload = require('../middleware/upload');

// Public routes
router.get('/active', popupController.getActivePopup);
router.get('/:id/image', popupController.getPopupImage);

// Admin routes (protected)
router.get('/', popupController.getAllPopups);
router.post('/', upload.single('image'), popupController.createPopup);
router.put('/:id', upload.single('image'), popupController.updatePopup);
router.delete('/:id', popupController.deletePopup);
router.patch('/:id/toggle', popupController.togglePopupStatus);

module.exports = router; 