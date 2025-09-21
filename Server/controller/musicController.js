import {Music} from '../models/music.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Get all music with optional type filter
export const getAllMusic = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 20, search } = req.query;

  // Input validation and sanitization for query parameters
  if (type && typeof type !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid type parameter'
    });
  }

  if (search && typeof search !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid search parameter'
    });
  }

  // Validate and sanitize numeric parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page parameter'
    });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid limit parameter (must be 1-100)'
    });
  }

  // Length validation to prevent injection attacks
  if (type && type.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Type parameter too long'
    });
  }

  if (search && search.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Search parameter too long'
    });
  }

  let query = { isActive: true };

  // Filter by type if specified
  if (type && type !== 'all') {
    query.type = type;
  }

  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [music, total] = await Promise.all([
    Music.find(query)
      .sort({ addedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('addedBy', 'username'),
    Music.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: music,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  });
});

// Get music by ID
export const getMusicById = asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id)
    .populate('addedBy', 'username')
    .populate('likes', 'username');

  if (!music) {
    return res.status(404).json({
      success: false,
      message: 'Music not found'
    });
  }

  res.status(200).json({
    success: true,
    data: music
  });
});

// Upload new music (public - no authentication required)
export const uploadMusic = asyncHandler(async (req, res) => {
  const { title, artist, type, duration } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Audio file is required'
    });
  }

  const fileUrl = `/uploads/audio/${req.file.filename}`;
  console.log('File upload details:');
  console.log('req.file.filename:', req.file.filename);
  console.log('req.file.path:', req.file.path);
  console.log('Generated fileUrl:', fileUrl);

  const musicData = {
    title,
    artist,
    type,
    duration: duration || "0:00",
    fileUrl: fileUrl,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    addedBy: req.user?._id || null,
    addedByUsername: req.user?.username || req.user?.email || 'Anonymous User'
  };

  const music = await Music.create(musicData);

  res.status(201).json({
    success: true,
    message: 'Music uploaded successfully',
    data: music
  });
});

// Update music
export const updateMusic = asyncHandler(async (req, res) => {
  const { title, artist, type, duration } = req.body;

  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: 'Music not found'
    });
  }

  // Check if user owns the music or is admin
  if (music.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this music'
    });
  }

  const updatedMusic = await Music.findByIdAndUpdate(
    req.params.id,
    { title, artist, type, duration },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Music updated successfully',
    data: updatedMusic
  });
});

// Delete music
export const deleteMusic = asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: 'Music not found'
    });
  }

  // Check if user owns the music or is admin
  if (music.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this music'
    });
  }

  await Music.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Music deleted successfully'
  });
});

// Like/Unlike music
export const toggleLike = asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: 'Music not found'
    });
  }

  const likeIndex = music.likes.indexOf(req.user._id);

  if (likeIndex > -1) {
    // Unlike
    music.likes.splice(likeIndex, 1);
  } else {
    // Like
    music.likes.push(req.user._id);
  }

  await music.save();

  res.status(200).json({
    success: true,
    message: likeIndex > -1 ? 'Music unliked' : 'Music liked',
    data: {
      likes: music.likes.length,
      isLiked: likeIndex === -1
    }
  });
});

// Increment play count
export const incrementPlayCount = asyncHandler(async (req, res) => {
  const music = await Music.findByIdAndUpdate(
    req.params.id,
    { $inc: { playCount: 1 } },
    { new: true }
  );

  if (!music) {
    return res.status(404).json({
      success: false,
      message: 'Music not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { playCount: music.playCount }
  });
});

// Get music statistics
export const getMusicStats = asyncHandler(async (req, res) => {
  const stats = await Music.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalPlays: { $sum: '$playCount' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const totalMusic = await Music.countDocuments({ isActive: true });
  const totalPlays = await Music.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: '$playCount' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats,
      totalMusic,
      totalPlays: totalPlays[0]?.total || 0
    }
  });
});
