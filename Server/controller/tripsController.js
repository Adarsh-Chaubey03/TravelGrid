import {Trip} from '../models/trips.js'
import {User} from '../models/user.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import crypto from 'crypto';

// POST /api/trips - Save a trip
export const createTrip = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const trip = new Trip({
    ...req.body,
    userId,
  });

  await trip.save();

  // ✅ Link trip to the user's plannedTrips array
  await User.findByIdAndUpdate(userId, {
    $push: { plannedTrips: trip._id },
  });

  res.status(201).json({ message: 'Trip saved successfully', trip });
});

// GET /api/trips - Get trips only for logged-in user
export const getAllTrips = asyncHandler(async (req, res) => {
  const userId = req.user._id; // ✅ Logged-in user
  const trips = await Trip.find({ userId }).sort({ _id: -1 }); // ✅ Only this user's trips
  res.status(200).json(trips);
});

// DELETE /api/trips/:id - Delete only if user owns the trip
export const deleteTrip = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tripId = req.params.id;

  const deletedTrip = await Trip.findOneAndDelete({ _id: tripId, userId });

  if (!deletedTrip) {
    return res.status(404).json({ message: 'Trip not found or not authorized' });
  }

  // ✅ Remove reference from User
  await User.findByIdAndUpdate(userId, {
    $pull: { plannedTrips: tripId },
  });

  res.status(200).json({ message: 'Trip deleted successfully' });
});

// Enable collaboration for a trip
export const enableCollaboration = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tripId = req.params.id;
  
  // Check if user owns the trip
  const trip = await Trip.findOne({ _id: tripId, userId });
  
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found or not authorized' });
  }
  
  // Generate a unique collaboration token
  const collaborationToken = crypto.randomBytes(20).toString('hex');
  
  // Update trip to enable collaboration
  const updatedTrip = await Trip.findByIdAndUpdate(
    tripId,
    {
      isCollaborative: true,
      collaborationToken,
      $push: {
        collaborators: {
          userId: userId,
          role: 'owner'
        }
      }
    },
    { new: true }
  );
  
  res.status(200).json({
    message: 'Collaboration enabled successfully',
    trip: updatedTrip,
    collaborationToken
  });
});

// Join a collaborative trip
export const joinCollaborativeTrip = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { collaborationToken } = req.body;
  
  // Find trip by collaboration token
  const trip = await Trip.findOne({ collaborationToken });
  
  if (!trip) {
    return res.status(404).json({ message: 'Collaborative trip not found' });
  }
  
  // Check if user is already a collaborator
  const isCollaborator = trip.collaborators.some(
    collaborator => collaborator.userId.toString() === userId.toString()
  );
  
  if (isCollaborator) {
    return res.status(200).json({
      message: 'Already a collaborator',
      trip
    });
  }
  
  // Add user as collaborator
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip._id,
    {
      $push: {
        collaborators: {
          userId: userId,
          role: 'editor'
        }
      }
    },
    { new: true }
  ).populate('collaborators.userId', 'username email');
  
  // Add trip to user's planned trips if not already there
  await User.findByIdAndUpdate(userId, {
    $addToSet: { plannedTrips: trip._id }
  });
  
  res.status(200).json({
    message: 'Joined collaborative trip successfully',
    trip: updatedTrip
  });
});

// Get collaborative trip details
export const getCollaborativeTrip = asyncHandler(async (req, res) => {
  const { collaborationToken } = req.params;
  
  // Find trip by collaboration token and populate collaborators
  const trip = await Trip.findOne({ collaborationToken })
    .populate('collaborators.userId', 'username email');
  
  if (!trip) {
    return res.status(404).json({ message: 'Collaborative trip not found' });
  }
  
  res.status(200).json(trip);
});

// Update collaborative trip
export const updateCollaborativeTrip = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { collaborationToken } = req.params;
  const updates = req.body;
  
  // Find trip by collaboration token
  const trip = await Trip.findOne({ collaborationToken });
  
  if (!trip) {
    return res.status(404).json({ message: 'Collaborative trip not found' });
  }
  
  // Check if user is a collaborator
  const isCollaborator = trip.collaborators.some(
    collaborator => collaborator.userId.toString() === userId.toString()
  );
  
  if (!isCollaborator) {
    return res.status(403).json({ message: 'Not authorized to edit this trip' });
  }
  
  // Update trip
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip._id,
    { ...updates },
    { new: true }
  );
  
  res.status(200).json({
    message: 'Trip updated successfully',
    trip: updatedTrip
  });
});