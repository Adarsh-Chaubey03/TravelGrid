import {MoodBoard} from '../models/moodBoard.js'
import {User} from '../models/user.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Create a new mood board
export const createMoodBoard = asyncHandler(async (req, res) => {
  const { title, description, colorPalette, themes, activities, accommodations, dining, vibe } = req.body;

  const newMoodBoard = new MoodBoard({
    title: title || 'Untitled Mood Board',
    description: description || '',
    owner: req.user.id,
    colorPalette: colorPalette || ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
    themes: themes || [],
    activities: activities || [],
    accommodations: accommodations || '',
    dining: dining || '',
    vibe: vibe || '',
    elements: [],
    collaborators: [{
      userId: req.user.id,
      email: req.user.email,
      name: req.user.name || req.user.email.split('@')[0],
      avatar: req.user.picture || '',
      role: 'owner',
      status: 'accepted'
    }]
  });

  const savedBoard = await newMoodBoard.save();
  await savedBoard.populate('owner', 'name email picture');

  res.status(201).json({
    success: true,
    message: 'Mood board created successfully',
    data: savedBoard
  });
});

// Get all mood boards for a user (owned + collaborated)
export const getUserMoodBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const boards = await MoodBoard.find({
    $or: [
      { owner: userId },
      { 'collaborators.userId': userId, 'collaborators.status': 'accepted' }
    ]
  })
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: boards
  });
});

// Get a specific mood board by ID
export const getMoodBoardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id)
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture');

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Mood board not found'
    });
  }

  if (!board.canView(userId)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: board
  });
});

// Update mood board elements and properties
export const updateMoodBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { elements, title, description, colorPalette, themes, activities, accommodations, dining, vibe, settings, metadata } = req.body;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Mood board not found' });
  }

  if (!board.canEdit(userId)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const updateData = {};
  if (elements !== undefined) updateData.elements = elements;
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (colorPalette !== undefined) updateData.colorPalette = colorPalette;
  if (themes !== undefined) updateData.themes = themes;
  if (activities !== undefined) updateData.activities = activities;
  if (accommodations !== undefined) updateData.accommodations = accommodations;
  if (dining !== undefined) updateData.dining = dining;
  if (vibe !== undefined) updateData.vibe = vibe;
  if (settings !== undefined) updateData.settings = settings;
  if (metadata !== undefined) updateData.metadata = metadata;

  const updatedBoard = await MoodBoard.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  })
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture');

  res.status(200).json({
    success: true,
    message: 'Mood board updated successfully',
    data: updatedBoard
  });
});

// Delete a mood board
export const deleteMoodBoard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Mood board not found' });
  }

  if (board.owner.toString() !== userId) {
    return res.status(403).json({ success: false, message: 'Only the owner can delete this mood board' });
  }

  await MoodBoard.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Mood board deleted successfully'
  });
});

// Add collaborator to mood board
export const addCollaborator = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, role = 'viewer' } = req.body;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Mood board not found' });
  }

  if (!board.canEdit(userId)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const existingCollaborator = board.collaborators.find(c => c.email === email);
  if (existingCollaborator) {
    return res.status(400).json({ success: false, message: 'User is already a collaborator' });
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  board.collaborators.push({
    userId: userToAdd._id,
    email: userToAdd.email,
    name: userToAdd.name || userToAdd.email.split('@')[0],
    avatar: userToAdd.picture || '',
    role,
    status: 'pending'
  });

  board.messages.push({
    senderId: userToAdd._id,
    senderName: 'System',
    text: `Invitation sent to ${email}`,
    type: 'system'
  });

  await board.save();

  const updatedBoard = await MoodBoard.findById(id)
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture');

  res.status(200).json({
    success: true,
    message: 'Collaborator added successfully',
    data: updatedBoard
  });
});

// Update collaborator status
export const updateCollaboratorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Mood board not found' });
  }

  const collaborator = board.collaborators.find(c => c.userId.toString() === userId);
  if (!collaborator) {
    return res.status(404).json({ success: false, message: 'Collaborator not found' });
  }

  collaborator.status = status;

  const statusText = status === 'accepted' ? 'joined the board' : 'declined the invitation';
  board.messages.push({
    senderId: userId,
    senderName: 'System',
    text: `${collaborator.name} ${statusText}`,
    type: 'system'
  });

  await board.save();

  const updatedBoard = await MoodBoard.findById(id)
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture');

  res.status(200).json({
    success: true,
    message: 'Collaborator status updated successfully',
    data: updatedBoard
  });
});

// Remove collaborator
export const removeCollaborator = asyncHandler(async (req, res) => {
  const { id, collaboratorId } = req.params;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Mood board not found' });
  }

  if (!board.canEdit(userId)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  board.collaborators = board.collaborators.filter(c => c.userId.toString() !== collaboratorId);

  board.messages.push({
    senderId: userId,
    senderName: 'System',
    text: 'A collaborator was removed from the board',
    type: 'system'
  });

  await board.save();

  const updatedBoard = await MoodBoard.findById(id)
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture');

  res.status(200).json({
    success: true,
    message: 'Collaborator removed successfully',
    data: updatedBoard
  });
});

// Add message
export const addMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text, type = 'text' } = req.body;
  const userId = req.user.id;

  const board = await MoodBoard.findById(id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Mood board not found' });
  }

  if (!board.canView(userId)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const message = {
    senderId: userId,
    senderName: req.user.name || req.user.email.split('@')[0],
    text,
    type
  };

  board.messages.push(message);
  await board.save();

  const updatedBoard = await MoodBoard.findById(id)
    .populate('owner', 'name email picture')
    .populate('collaborators.userId', 'name email picture');

  res.status(200).json({
    success: true,
    message: 'Message added successfully',
    data: updatedBoard
  });
});

// Get public mood boards
export const getPublicMoodBoards = asyncHandler(async (req, res) => {
  const boards = await MoodBoard.find({ isPublic: true })
    .populate('owner', 'name email picture')
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    data: boards
  });
});