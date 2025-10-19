import express from 'express';
import { 
  generateDeviceId,
  registerDevice,
  getSyncStatus,
  syncData,
  getConflicts,
  resolveConflict,
  getAuditTrail
} from '../controller/syncController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/generate-device-id', generateDeviceId);

// Protected routes
router.post('/register-device', protect, registerDevice);
router.get('/status', protect, getSyncStatus);
router.post('/sync', protect, syncData);
router.get('/conflicts', protect, getConflicts);
router.post('/resolve-conflict', protect, resolveConflict);
router.get('/audit-trail', protect, getAuditTrail);

export default router;