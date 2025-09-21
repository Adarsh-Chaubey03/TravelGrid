import express from 'express'
const router = express.Router();
import { deleteSavedPlace, getSavedPlaces, savePlace } from '../controller/saveController.js'
import {verifyJWT} from '../middleware/auth.js'

router.post('/save-place', verifyJWT, savePlace);
router.get('/my-saved-places', verifyJWT, getSavedPlaces);
router.delete('/delete/:placeId', verifyJWT, deleteSavedPlace);

export default router
