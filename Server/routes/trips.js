const express = require('express');
const { createTrip, getAllTrips, deleteTrip } = require('../controller/tripsController');
const { verifyJWT } = require('../middleware/auth');

const router = express.Router();

router.post('/trips', verifyJWT, createTrip);
router.get('/trips', verifyJWT, getAllTrips);
router.delete('/trips/:id', verifyJWT, deleteTrip);

module.exports = router;

