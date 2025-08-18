const express = require('express');
const { searchPlaces } = require('../controller/searchController');

const router = express.Router();

router.get('/', searchPlaces);

module.exports = router;