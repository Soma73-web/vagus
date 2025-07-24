const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/faculty directory exists
const uploadDir = path.join(__dirname, '../uploads/faculty');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFacultyById);
router.get('/:id/image', facultyController.getFacultyImage);
router.post('/', upload.single('image'), facultyController.createFaculty);
router.put('/:id', upload.single('image'), facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router; 