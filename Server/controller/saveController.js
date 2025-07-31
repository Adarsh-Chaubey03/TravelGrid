const User = require('../models/user');

const savePlace = async (req, res) => {
    const userId = req.user.id;
    const { placeId, name, description, image } = req.body;

    try {
        const user = await User.findById(userId);

        const alreadySaved = user.savedPlaces.some(
            (place) => place.placeId.toString() === placeId
        );

        if (alreadySaved) {
            return res.status(400).json({ message: 'Place already saved' });
        }

        user.savedPlaces.push({ placeId, name, description, image });
        await user.save();

        res.status(200).json({ message: 'Place saved successfully' });
    } catch (error) {
        console.error('Save Place Error:', error.message);
        res.status(500).json({ message: 'Server error while saving place' });
    }
};

const getSavedPlaces = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({ savedPlaces: user.savedPlaces });
    } catch (error) {
        console.error('Fetch Saved Places Error:', error.message);
        res.status(500).json({ message: 'Server error while fetching saved places' });
    }
};

const deleteSavedPlace = async (req, res) => {
    const userId = req.user.id;
    const placeIdToDelete = req.params.placeId;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const originalLength = user.savedPlaces.length;

        // Filter out the place by string-based placeId
        user.savedPlaces = user.savedPlaces.filter(
            (place) => place.placeId !== placeIdToDelete
        );

        if (user.savedPlaces.length === originalLength) {
            return res.status(404).json({ message: 'Place not found in saved places' });
        }

        await user.save();

        res.status(200).json({ message: 'Place removed from saved list' });
    } catch (err) {
        console.error('Delete Save Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { savePlace, getSavedPlaces, deleteSavedPlace };
