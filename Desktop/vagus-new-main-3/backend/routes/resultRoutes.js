const express = require('express');
const multer = require('multer');
const router = express.Router();
const resultController = require('../controllers/resultController');

// Store uploaded files in memory (as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', resultController.getAllResults);

// ✅ FIXED: RESTful and matches frontend: /api/results/:id/image
router.get('/:id/image', resultController.getResultImage);

router.post('/', upload.single('image'), resultController.createResult);
router.put('/:id', upload.single('image'), resultController.updateResult);
router.delete('/:id', resultController.deleteResult);

module.exports = router;
