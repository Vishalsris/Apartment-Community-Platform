const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type. Must be JPG/PNG up to 2MB.' });
  }
  
  // Return the absolute or relative path for DB storage
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: filePath });
});

module.exports = router;
