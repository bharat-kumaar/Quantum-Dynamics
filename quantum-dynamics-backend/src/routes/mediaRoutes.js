const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const mediaController = require('../controllers/mediaController');

// Ye line add karni zaroori thi taaki hum user ko verify kar sakein
const { protect } = require("../middleware/authMiddleware");

// 1. POST Route: File upload karne ke liye
router.post('/upload', protect, upload.any(), mediaController.uploadFile);

// 2. GET Route: Saari files ki list laane ke liye 
router.get('/', protect, mediaController.getMediaAssets);

// 3. GET Route: Kisi ek single file ko direct dekhne/access karne ke liye
router.get('/file/:filename', mediaController.getSingleFile);

// 4. DELETE Route: File ko delete karne ke liye (NEW ADDED)
router.delete('/:id', protect, mediaController.deleteFile);

module.exports = router;