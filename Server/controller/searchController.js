const Place = require('../models/place'); // Make sure you have this model

exports.searchPlaces = async (req, res) => {
  try {
    const { location, category } = req.query;

    // Input validation and sanitization
    if (location && typeof location !== 'string') {
      return res.status(400).json({ message: 'Invalid location parameter' });
    }

    if (category && typeof category !== 'string') {
      return res.status(400).json({ message: 'Invalid category parameter' });
    }

    // Additional length validation to prevent injection attacks
    if (location && location.length > 100) {
      return res.status(400).json({ message: 'Location parameter too long' });
    }

    if (category && category.length > 50) {
      return res.status(400).json({ message: 'Category parameter too long' });
    }

    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    const results = await Place.find(query).limit(20);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};