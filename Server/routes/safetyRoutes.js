import express from 'express';
import { 
  getSafetyAlerts, 
  getRiskAssessment, 
  getSafetyProfile, 
  updateSafetyProfile, 
  addTrustedContact, 
  createSafetyAlert, 
  checkInSafety, 
  triggerSOS,
  getSafetyRoute
} from '../controller/safetyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/alerts', getSafetyAlerts);
router.get('/risk-assessment', getRiskAssessment);
router.get('/route', getSafetyRoute);

// Protected routes (require authentication)
router.get('/profile/:userId', protect, getSafetyProfile);
router.put('/profile/:userId', protect, updateSafetyProfile);
router.post('/profile/:userId/contact', protect, addTrustedContact);
router.post('/check-in', protect, checkInSafety);
router.post('/sos', protect, triggerSOS);

// Admin routes (for creating alerts)
router.post('/alerts', protect, createSafetyAlert);

export default router;