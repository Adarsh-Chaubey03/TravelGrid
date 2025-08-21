const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const audioUpload = require('../middleware/audioUploadMiddleware');
const {
  getAllMusic,
  getMusicById,
  uploadMusic,
  updateMusic,
  deleteMusic,
  toggleLike,
  incrementPlayCount,
  getMusicStats
} = require('../controller/musicController');

// Public routes (no authentication required)
router.get('/', getAllMusic);
router.get('/stats', getMusicStats);
router.get('/:id', getMusicById);
router.post('/', audioUpload.single('audio'), uploadMusic);
router.post('/:id/play', incrementPlayCount); // Public route to track plays

// Protected routes (require authentication)
router.put('/:id', protect, updateMusic);
router.delete('/:id', protect, deleteMusic);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
