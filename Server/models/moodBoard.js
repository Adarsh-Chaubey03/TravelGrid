import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'text', 'shape'],
        required: true
    },
    x: {
        type: Number,
        required: true,
        default: 100
    },
    y: {
        type: Number,
        required: true,
        default: 100
    },
    width: {
        type: Number,
        required: true,
        default: 200
    },
    height: {
        type: Number,
        required: true,
        default: 150
    },
    rotation: {
        type: Number,
        default: 0
    },
    zIndex: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#667eea'
    },
    fontSize: {
        type: Number,
        default: 24
    },
    fontFamily: {
        type: String,
        default: 'Inter'
    },
    fontWeight: {
        type: String,
        default: 'normal'
    },
    opacity: {
        type: Number,
        default: 1
    }
});

const collaboratorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['owner', 'editor', 'viewer'],
        default: 'viewer'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['text', 'system', 'image'],
        default: 'text'
    }
});

const moodBoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    elements: [elementSchema],
    colorPalette: [{
        type: String,
        default: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
    }],
    themes: [{
        type: String
    }],
    activities: [{
        type: String
    }],
    accommodations: {
        type: String,
        default: ''
    },
    dining: {
        type: String,
        default: ''
    },
    vibe: {
        type: String,
        default: ''
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    collaborators: [collaboratorSchema],
    messages: [messageSchema],
    settings: {
        gridEnabled: {
            type: Boolean,
            default: true
        },
        snapToGrid: {
            type: Boolean,
            default: false
        },
        gridSize: {
            type: Number,
            default: 20
        }
    },
    metadata: {
        canvasWidth: {
            type: Number,
            default: 1200
        },
        canvasHeight: {
            type: Number,
            default: 800
        },
        zoom: {
            type: Number,
            default: 1
        },
        panX: {
            type: Number,
            default: 0
        },
        panY: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
moodBoardSchema.index({ owner: 1, createdAt: -1 });
moodBoardSchema.index({ 'collaborators.userId': 1 });
moodBoardSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for collaborator count
moodBoardSchema.virtual('collaboratorCount').get(function () {
    return this.collaborators.filter(c => c.status === 'accepted').length;
});

// Method to check if user can edit
moodBoardSchema.methods.canEdit = function (userId) {
    if (this.owner.toString() === userId.toString()) return true;
    const collaborator = this.collaborators.find(c =>
        c.userId.toString() === userId.toString() &&
        c.status === 'accepted' &&
        ['owner', 'editor'].includes(c.role)
    );
    return !!collaborator;
};

// Method to check if user can view
moodBoardSchema.methods.canView = function (userId) {
    if (this.owner.toString() === userId.toString()) return true;
    if (this.isPublic) return true;
    const collaborator = this.collaborators.find(c =>
        c.userId.toString() === userId.toString() &&
        c.status === 'accepted'
    );
    return !!collaborator;
};

export const MoodBoard = mongoose.model('MoodBoard', moodBoardSchema);
