const multer = require('multer');
const path = require('path');

// Memory storage for BLOB upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = file.originalname.toLowerCase().split('.').pop();
  if (!allowedTypes.test(ext)) {
    return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;
