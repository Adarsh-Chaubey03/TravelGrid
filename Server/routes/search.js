import express from 'express'
import { searchPlaces } from '../controller/searchController.js'

const router = express.Router();

router.get('/', searchPlaces);

export default router