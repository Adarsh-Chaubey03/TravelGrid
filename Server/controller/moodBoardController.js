const MoodBoard = require('../models/moodBoard');
const User = require('../models/user');

// Create a new mood board
const createMoodBoard = async (req, res) => {
    try {
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

        // Populate owner details
        await savedBoard.populate('owner', 'name email picture');

        res.status(201).json({
            success: true,
            message: 'Mood board created successfully',
            data: savedBoard
        });
    } catch (error) {
        console.error('Error creating mood board:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create mood board',
            error: error.message
        });
    }
};

// Get all mood boards for a user (owned + collaborated)
const getUserMoodBoards = async (req, res) => {
    try {
        console.log('moodBoardController: getUserMoodBoards called');
        console.log('moodBoardController: User from request:', req.user);

        const userId = req.user.id;
        console.log('moodBoardController: User ID from request:', userId);

        console.log('moodBoardController: Searching for boards owned by or collaborated with user:', userId);
        const boards = await MoodBoard.find({
            $or: [
                { owner: userId },
                { 'collaborators.userId': userId, 'collaborators.status': 'accepted' }
            ]
        })
            .populate('owner', 'name email picture')
            .populate('collaborators.userId', 'name email picture')
            .sort({ updatedAt: -1 });

        console.log('moodBoardController: Found boards:', boards.length);

        res.status(200).json({
            success: true,
            data: boards
        });
    } catch (error) {
        console.error('moodBoardController: Error fetching mood boards:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mood boards',
            error: error.message
        });
    }
};

// Get a specific mood board by ID
const getMoodBoardById = async (req, res) => {
    try {
        console.log('moodBoardController: getMoodBoardById called with params:', req.params);
        console.log('moodBoardController: User from request:', req.user);

        const { id } = req.params;
        const userId = req.user.id;

        console.log('moodBoardController: Looking for board with ID:', id);
        console.log('moodBoardController: User ID from request:', userId);

        const board = await MoodBoard.findById(id)
            .populate('owner', 'name email picture')
            .populate('collaborators.userId', 'name email picture');

        console.log('moodBoardController: Board found:', board ? 'Yes' : 'No');

        if (!board) {
            console.log('moodBoardController: Board not found, returning 404');
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Check if user can view this board
        console.log('moodBoardController: Checking if user can view board');
        if (!board.canView(userId)) {
            console.log('moodBoardController: User cannot view board, returning 403');
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        console.log('moodBoardController: User can view board, returning success');
        res.status(200).json({
            success: true,
            data: board
        });
    } catch (error) {
        console.error('moodBoardController: Error fetching mood board:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mood board',
            error: error.message
        });
    }
};

// Update mood board elements and properties
const updateMoodBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const { elements, title, description, colorPalette, themes, activities, accommodations, dining, vibe, settings, metadata } = req.body;
        const userId = req.user.id;

        const board = await MoodBoard.findById(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Check if user can edit this board
        if (!board.canEdit(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update fields
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

        const updatedBoard = await MoodBoard.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('owner', 'name email picture')
            .populate('collaborators.userId', 'name email picture');

        res.status(200).json({
            success: true,
            message: 'Mood board updated successfully',
            data: updatedBoard
        });
    } catch (error) {
        console.error('Error updating mood board:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update mood board',
            error: error.message
        });
    }
};

// Delete a mood board
const deleteMoodBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const board = await MoodBoard.findById(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Only owner can delete
        if (board.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the owner can delete this mood board'
            });
        }

        await MoodBoard.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Mood board deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting mood board:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete mood board',
            error: error.message
        });
    }
};

// Add collaborator to mood board
const addCollaborator = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role = 'viewer' } = req.body;
        const userId = req.user.id;

        const board = await MoodBoard.findById(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Check if user can edit this board
        if (!board.canEdit(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if collaborator already exists
        const existingCollaborator = board.collaborators.find(c => c.email === email);
        if (existingCollaborator) {
            return res.status(400).json({
                success: false,
                message: 'User is already a collaborator'
            });
        }

        // Find user by email
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add collaborator
        board.collaborators.push({
            userId: userToAdd._id,
            email: userToAdd.email,
            name: userToAdd.name || userToAdd.email.split('@')[0],
            avatar: userToAdd.picture || '',
            role,
            status: 'pending'
        });

        await board.save();

        // Add system message
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
    } catch (error) {
        console.error('Error adding collaborator:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add collaborator',
            error: error.message
        });
    }
};

// Update collaborator status (accept/decline invitation)
const updateCollaboratorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const board = await MoodBoard.findById(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Find collaborator
        const collaborator = board.collaborators.find(c => c.userId.toString() === userId);
        if (!collaborator) {
            return res.status(404).json({
                success: false,
                message: 'Collaborator not found'
            });
        }

        // Update status
        collaborator.status = status;

        // Add system message
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
    } catch (error) {
        console.error('Error updating collaborator status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update collaborator status',
            error: error.message
        });
    }
};

// Remove collaborator from mood board
const removeCollaborator = async (req, res) => {
    try {
        const { id, collaboratorId } = req.params;
        const userId = req.user.id;

        const board = await MoodBoard.findById(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Check if user can edit this board
        if (!board.canEdit(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Remove collaborator
        board.collaborators = board.collaborators.filter(c => c.userId.toString() !== collaboratorId);

        // Add system message
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
    } catch (error) {
        console.error('Error removing collaborator:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove collaborator',
            error: error.message
        });
    }
};

// Add message to mood board
const addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, type = 'text' } = req.body;
        const userId = req.user.id;

        const board = await MoodBoard.findById(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Mood board not found'
            });
        }

        // Check if user can view this board
        if (!board.canView(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Add message
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
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add message',
            error: error.message
        });
    }
};

// Get public mood boards
const getPublicMoodBoards = async (req, res) => {
    try {
        const boards = await MoodBoard.find({ isPublic: true })
            .populate('owner', 'name email picture')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            data: boards
        });
    } catch (error) {
        console.error('Error fetching public mood boards:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch public mood boards',
            error: error.message
        });
    }
};

module.exports = {
    createMoodBoard,
    getUserMoodBoards,
    getMoodBoardById,
    updateMoodBoard,
    deleteMoodBoard,
    addCollaborator,
    updateCollaboratorStatus,
    removeCollaborator,
    addMessage,
    getPublicMoodBoards
};
