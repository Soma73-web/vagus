const multer = require('multer');
const path = require('path');

// Memory storage for BLOB upload
const storage = multer.memoryStorage();

// Only allow specific file types
const fileFilter = (req, file, cb) => {
const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG, and GIF files are allowed'));
  }
};

// Multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
