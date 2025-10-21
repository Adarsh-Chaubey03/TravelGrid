import destinations from '../models/destinations.js'

import { asyncHandler } from '../utils/asyncHandler'

export const estimateBudget = asyncHandler(async (req, res) => {
  const { destination, days, travelers } = req.body;
  const dest = await destinations.findOne({ destination });

  if (!dest) {
    return res.status(404).json({ error: "Destination not found in dataset" });
  }

  const total =
    dest.avgFlight * travelers +
    dest.avgHotelPerNight * days * travelers +
    dest.avgFoodPerDay * days * travelers +
    dest.avgTransportPerDay * days * travelers;

  res.json({
    destination,
    days,
    travelers,
    total,
    perPerson: (total / travelers).toFixed(2),
  });
});
