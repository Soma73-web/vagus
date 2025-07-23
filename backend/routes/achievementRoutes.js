const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/achievements directory exists
const uploadDir = path.join(__dirname, '../uploads/achievements');
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

router.get('/', achievementController.getAll);
router.get('/:id', achievementController.getById);
router.post('/', upload.single('image'), achievementController.create);
router.put('/:id', upload.single('image'), achievementController.update);
router.delete('/:id', achievementController.delete);

module.exports = router; 