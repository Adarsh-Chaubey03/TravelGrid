const express = require('express');
const router = express.Router();
const { savePlace, getSavedPlaces, deleteSavedPlace } = require('../controller/saveController');
const { verifyJWT } = require('../middleware/auth');

router.post('/save-place', verifyJWT, savePlace);
router.get('/my-saved-places', verifyJWT, getSavedPlaces);
router.delete('/delete/:placeId', verifyJWT, deleteSavedPlace);

module.exports = router;
