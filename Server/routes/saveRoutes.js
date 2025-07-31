const express = require('express');
const router = express.Router();
const { savePlace, getSavedPlaces, deleteSavedPlace } = require('../controller/saveController');
const authenticateUser = require('../middleware/auth');

router.post('/save-place', authenticateUser, savePlace);
router.get('/my-saved-places', authenticateUser, getSavedPlaces);
router.delete('/delete/:placeId', authenticateUser, deleteSavedPlace);

module.exports = router;
