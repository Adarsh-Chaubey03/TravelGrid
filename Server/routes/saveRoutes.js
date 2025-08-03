const express = require('express');
const router = express.Router();
const saveController = require('../controller/saveController');
const { verifyJWT } = require('../middleware/auth');

router.post('/save-place', verifyJWT, saveController.savePlace);
router.get('/my-saved-places', verifyJWT, saveController.getSavedPlaces);
router.delete('/delete/:placeId', verifyJWT, saveController.deleteSavedPlace);

module.exports = router;
