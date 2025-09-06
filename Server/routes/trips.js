import express from 'express';
import { createTrip, getAllTrips, deleteTrip } from '../controller/tripsController.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/trips', verifyJWT, createTrip);
router.get('/trips', verifyJWT, getAllTrips);
router.delete('/trips/:id', verifyJWT, deleteTrip);

export default router;