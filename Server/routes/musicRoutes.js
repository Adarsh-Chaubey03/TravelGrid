import express from 'express'
const router = express.Router();
// const { protect } = require('../middleware/auth');
import {verifyJWT} from '../middleware/auth.js'
import { audioUpload } from '../middleware/audioUploadMiddleware.js'
import { deleteMusic, getAllMusic, getMusicById, getMusicStats, incrementPlayCount, toggleLike, updateMusic, uploadMusic } from '../controller/musicController.js'

// Public routes (no authentication required)
router.get('/', getAllMusic);
router.get('/stats', getMusicStats);
router.get('/:id', getMusicById);
router.post('/', audioUpload.single('audio'), uploadMusic);
router.post('/:id/play', incrementPlayCount); // Public route to track plays

// Protected routes (require authentication)
router.put('/:id', verifyJWT, updateMusic);
router.delete('/:id', verifyJWT, deleteMusic);
router.post('/:id/like', verifyJWT, toggleLike);

export default router
