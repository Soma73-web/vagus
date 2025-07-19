const express = require('express');
const multer = require('multer');
const router = express.Router();
const resultController = require('../controllers/resultController');

// Store uploaded files in memory (as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CORS middleware for image routes
const imageCors = (req, res, next) => {
  console.log(`🌐 CORS middleware for ${req.method} ${req.path}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

// Logging middleware for all routes
router.use((req, res, next) => {
  console.log(`📊 Results API: ${req.method} ${req.path}`);
  next();
});

// Routes
router.get('/', resultController.getAllResults);

// Test route to verify CORS is working
router.get('/test', (req, res) => {
  res.json({ message: 'Results API is working', timestamp: new Date().toISOString() });
});

// Handle preflight requests for image routes
router.options('/:id/image', imageCors, (req, res) => {
  res.status(200).end();
});

// ✅ FIXED: RESTful and matches frontend: /api/results/:id/image
router.get('/:id/image', imageCors, resultController.getResultImage);

router.post('/', upload.single('image'), resultController.createResult);
router.put('/:id', upload.single('image'), resultController.updateResult);
router.delete('/:id', resultController.deleteResult);

module.exports = router;
