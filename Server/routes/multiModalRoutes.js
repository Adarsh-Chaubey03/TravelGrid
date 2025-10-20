const express = require('express');
const router = express.Router();
const multiModalController = require('../controller/multiModalController');
const { protect } = require('../middleware/auth');

// Public routes
router.route('/options')
  .get(multiModalController.getTransportOptions);

// Protected routes (require authentication)
router.route('/itinerary')
  .post(protect, multiModalController.getOptimizedItinerary);

router.route('/transport-options')
  .post(protect, multiModalController.createTransportOption)
  .get(protect, multiModalController.getAllTransportOptions);

router.route('/transport-options/:id')
  .put(protect, multiModalController.updateTransportOption)
  .delete(protect, multiModalController.deleteTransportOption);

module.exports = router;