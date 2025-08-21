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
  try {
    const userId = req.user._id;
    const placeId = req.params.placeId;

    await User.findByIdAndUpdate(userId, {
      $pull: { savedPlaces: { placeId } },
    });

    res.status(200).json({ message: 'Saved place removed successfully' });
  } catch (error) {
    console.error('Delete Saved Place Error:', error);
    res.status(500).json({ message: 'Failed to delete saved place' });
  }
};


module.exports = { savePlace, getSavedPlaces, deleteSavedPlace };
