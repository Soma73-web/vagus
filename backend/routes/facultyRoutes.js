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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFacultyById);
router.post('/', upload.single('photo'), facultyController.createFaculty);
router.put('/:id', upload.single('photo'), facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router; 