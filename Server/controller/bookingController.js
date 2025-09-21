import Booking from '../models/booking.js'
import  {User} from '../models/user.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const addBooking = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { startingDate, endingDate, noOfRooms, noOfPeople, status, destination } = req.body;

  if (!startingDate || !endingDate || !noOfRooms || !noOfPeople || !destination) {
    throw new Error("All fields are required!");
  }

  if (!userId) {
    return res.status(400).json({
      message: "User not authenticated",
      success: false
    });
  }

  const isBookingAvailable = await Booking.findOne({ userId, destination });

  if (!isBookingAvailable) {
    return res.status(400).json({
      message: 'Booking of the destination is already present for the user',
      success: false
    });
  }

  const newBooking = new Booking({
    userId,
    startingDate,
    endingDate,
    noOfRooms,
    noOfPeople,
    destination,
    status: status || "Pending",
  });

  await newBooking.save();

  return res.status(200).json({
    message: "Booking is done successfully!!",
    success: true,
    data: newBooking
  });
});

export const getAllBooking = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({
      message: 'User is not authenticated',
      success: false
    });
  }

  const userBookings = await Booking.find({ userId }).sort({ startingDate: 1 });

  if (!userBookings) {
    return res.status(400).json({
      message: "No booking available for the user",
      success: false
    });
  }

  return res.status(200).json({
    message: "All bookings are fetched!",
    success: true,
    data: userBookings
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({
      message: "User is not authorised",
      success: false
    });
  }

  if (!bookingId) {
    return res.status(400).json({
      message: "Booking id is not provided",
      success: false
    });
  }

  const fetchedBooking = await Booking.findById(bookingId);

  if (!fetchedBooking) {
    return res.status(400).json({
      message: 'Booking is unavailable'
    });
  }

  return res.status(200).json({
    message: "Desired booking fetched successfully!",
    data: fetchedBooking,
    success: true
  });
});

export const editBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({
      message: "Unauthorized access",
      success: false
    });
  }

  if (!bookingId) {
    return res.status(400).json({
      message: "Booking id is required",
      success: false
    });
  }

  const allowedField = ["startingDate", "endingDate", "noOfRooms", "noOfPeople", "status", "destination"];
  const updateFields = {};

  for (let field of allowedField) {
    if (req.body[field] != undefined) {
      updateFields[field] = req.body[field];
    }
  }

  if (Object.keys(updateFields).length == 0) {
    return res.status(400).json({
      message: "No valid field provided for update",
      success: false
    });
  }

  const updatedBooking = await Booking.findOneAndUpdate(
    { _id: bookingId, userId },
    updateFields,
    { new: true }
  );

  if (!updatedBooking) {
    return res.status(400).json({
      message: "Booking is not found or does not belong to the user",
      success: false
    });
  }

  return res.status(200).json({
    message: "Booking updated successfully!!",
    success: true,
    data: updatedBooking
  });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(400).json({
      message: "User is not authorized",
      success: false
    });
  }

  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({
      message: "Booking id is not available",
      success: false
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(400).json({
      message: "Booking not found",
      success: false
    });
  }

  if (booking.userId.toString() != userId) {
    return res.status(400).json({
      message: "Unauthorized to delete this booking",
      success: false
    });
  }

  await booking.deleteOne();

  return res.status(200).json({
    message: "Booking deleted successfully!!",
    success: true,
  });
});

export const rebookBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({
      message: "User is not authorized",
      success: false
    });
  }

  if (!bookingId) {
    return res.status(400).json({
      message: "Booking ID is required",
      success: false
    });
  }

  const originalBooking = await Booking.findById(bookingId);

  if (!originalBooking || originalBooking.userId.toString() !== userId) {
    return res.status(400).json({
      message: "Booking not found or does not belong to the user",
      success: false
    });
  }

  const newBooking = new Booking({
    userId,
    startingDate: originalBooking.startingDate,
    endingDate: originalBooking.endingDate,
    noOfRooms: originalBooking.noOfRooms,
    noOfPeople: originalBooking.noOfPeople,
    destination: originalBooking.destination,
    status: "Pending"
  });

  await newBooking.save();

  return res.status(200).json({
    message: "Rebooking successful! Please verify details and complete the payment.",
    success: true,
    data: newBooking
  });
});
