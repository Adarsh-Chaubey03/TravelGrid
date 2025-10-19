import express from 'express'
import { 
  createTrip, 
  deleteTrip, 
  getAllTrips, 
  enableCollaboration, 
  joinCollaborativeTrip, 
  getCollaborativeTrip, 
  updateCollaborativeTrip 
} from '../controller/tripsController.js'
import {verifyJWT} from '../middleware/auth.js'

const router = express.Router();

router.post('/trips', verifyJWT, createTrip);
router.get('/trips', verifyJWT, getAllTrips);
router.delete('/trips/:id', verifyJWT, deleteTrip);

// Collaborative trip routes
router.post('/trips/:id/collaboration', verifyJWT, enableCollaboration);
router.post('/trips/collaborative/join', verifyJWT, joinCollaborativeTrip);
router.get('/trips/collaborative/:collaborationToken', getCollaborativeTrip);
router.put('/trips/collaborative/:collaborationToken', verifyJWT, updateCollaborativeTrip);

export default router