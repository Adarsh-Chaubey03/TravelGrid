import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    Users,
    Share2,
    Download,
    Plus,
    Sparkles,
    Heart,
    MessageCircle,
    Eye,
    Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import MoodBoardCanvas from './MoodBoardCanvas';
import MoodBoardSidebar from './MoodBoardSidebar';
import CollaborationPanel from './CollaborationPanel';
import AIGenerator from './AIGenerator';
import { moodBoardService } from '../../services/moodBoardService';
import toast from 'react-hot-toast';
import './MoodBoard.css';

const MoodBoard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentBoard, setCurrentBoard] = useState(null);
    const [isCollaborating, setIsCollaborating] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);

    const { isDarkMode } = useTheme();
    const { isAuthenticated, user } = useAuth();
    const sidebarRef = useRef(null);

    // Debug effect to track when the component first mounts
    useEffect(() => {
        console.log('MoodBoard: Component mounted with initial state:', {
            isAuthenticated,
            user: user ? 'Present' : 'Missing',
            boardsCount: boards.length,
            currentBoard: currentBoard ? `ID: ${currentBoard._id}` : 'null',
            isLoading
        });
    }, []); // Empty dependency array means this runs only once on mount

    // Debug effect to track authentication changes
    useEffect(() => {
        console.log('MoodBoard: Authentication state changed:', { isAuthenticated, user: user ? 'Present' : 'Missing' });
    }, [isAuthenticated, user]);

    // Debug effect to track component re-renders
    useEffect(() => {
        console.log('MoodBoard: Component re-rendered with state:', {
            isAuthenticated,
            user: user ? 'Present' : 'Missing',
            boardsCount: boards.length,
            currentBoard: currentBoard ? `ID: ${currentBoard._id}` : 'null',
            isLoading
        });
    });

    useEffect(() => {
        // Load user's existing mood boards
        console.log('useEffect for authentication triggered - isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
            console.log('User is authenticated, calling loadUserBoards');
            loadUserBoards();
        } else {
            console.log('User is not authenticated, not loading boards');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Load collaborators and messages when a board is opened
        console.log('useEffect triggered - currentBoard changed:', currentBoard);
        if (currentBoard && currentBoard._id) {
            console.log('Calling loadBoardData for board ID:', currentBoard._id);
            loadBoardData();
        } else {
            console.log('No currentBoard or currentBoard._id, not calling loadBoardData');
        }
    }, [currentBoard?._id]);

    // Debug effect to track currentBoard changes
    useEffect(() => {
        console.log('MoodBoard: currentBoard state changed:', {
            currentBoard: currentBoard ? `ID: ${currentBoard._id}, Title: ${currentBoard.title}` : 'null'
        });
    }, [currentBoard]);

    useEffect(() => {
        // Track when boards state changes
        console.log('Boards state changed:', {
            count: boards.length,
            boards: boards.map(b => ({ id: b._id, title: b.title }))
        });

        // Auto-select the first board if no board is currently selected and boards exist
        if (boards.length > 0 && !currentBoard) {
            console.log('Auto-selecting first board:', boards[0]);
            setCurrentBoard(boards[0]);
        }
    }, [boards, currentBoard]);

    const loadUserBoards = async () => {
        try {
            console.log('loadUserBoards: Starting to load user mood boards');
            setIsLoading(true);
            const response = await moodBoardService.getUserMoodBoards();
            console.log('getUserMoodBoards response:', response);
            if (response.success) {
                console.log('Setting boards:', response.data);
                setBoards(response.data);
                console.log('Number of boards loaded:', response.data.length);
            } else {
                console.error('getUserMoodBoards returned success: false:', response);
            }
        } catch (error) {
            console.error('Error loading boards:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            toast.error('Failed to load mood boards');
        } finally {
            setIsLoading(false);
            console.log('loadUserBoards: Finished loading');
        }
    };

    const loadBoardData = async () => {
        console.log('loadBoardData called with currentBoard:', currentBoard);
        if (!currentBoard?._id) {
            console.log('No currentBoard._id, returning early');
            return;
        }

        try {
            console.log('Attempting to load board data for ID:', currentBoard._id);
            // Load board details with collaborators and messages
            const response = await moodBoardService.getMoodBoardById(currentBoard._id);
            console.log('getMoodBoardById response:', response);
            if (response.success) {
                const boardData = response.data;
                setCurrentBoard(boardData);
                setCollaborators(boardData.collaborators || []);
                setMessages(boardData.messages || []);
                console.log('Board data loaded successfully');
            } else {
                console.error('getMoodBoardById returned success: false:', response);
            }
        } catch (error) {
            console.error('Error loading board data:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            toast.error('Failed to load board data');
        }
    };

    const createNewBoard = async () => {
        try {
            const newBoardData = {
                title: "New Travel Mood Board",
                description: "Start creating your travel inspiration board",
                themes: ["Travel", "Adventure"],
                activities: ["Sightseeing", "Photography"],
                colorPalette: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
            };

            const response = await moodBoardService.createMoodBoard(newBoardData);
            if (response.success) {
                const newBoard = response.data;
                setCurrentBoard(newBoard);
                setBoards(prev => [newBoard, ...prev]);
                setIsOpen(true);
                toast.success('New mood board created!');
            }
        } catch (error) {
            console.error('Error creating board:', error);
            toast.error('Failed to create new board');
        }
    };

    const openBoard = (board) => {
        console.log('openBoard called with board:', board);
        setCurrentBoard(board);
        setSelectedBoard(board);
        setIsOpen(true);
        console.log('Board opened, currentBoard set to:', board);
    };

    const toggleCollaboration = () => {
        setIsCollaborating(!isCollaborating);
    };

    const handleSaveBoard = async () => {
        if (currentBoard && currentBoard._id) {
            try {
                const updateData = {
                    title: currentBoard.title,
                    description: currentBoard.description,
                    elements: currentBoard.elements,
                    settings: currentBoard.settings,
                    metadata: currentBoard.metadata
                };

                const response = await moodBoardService.updateMoodBoard(currentBoard._id, updateData);
                if (response.success) {
                    setCurrentBoard(response.data);
                    setBoards(prev =>
                        prev.map(board =>
                            board._id === currentBoard._id ? response.data : board
                        )
                    );
                    toast.success("Mood board saved successfully!");
                }
            } catch (error) {
                console.error('Error saving board:', error);
                toast.error('Failed to save mood board');
            }
        }
    };

    const handleShareBoard = async () => {
        if (currentBoard) {
            try {
                const shareUrl = `${window.location.origin}/moodboard/${currentBoard._id}`;
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Share link copied to clipboard!");
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                toast.error('Failed to copy share link');
            }
        }
    };

    const handleDeleteBoard = async (boardId) => {
        if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
            try {
                const response = await moodBoardService.deleteMoodBoard(boardId);
                if (response.success) {
                    setBoards(prev => prev.filter(board => board._id !== boardId));
                    if (currentBoard?._id === boardId) {
                        setIsOpen(false);
                        setCurrentBoard(null);
                    }
                    toast.success('Mood board deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting board:', error);
                toast.error('Failed to delete mood board');
            }
        }
    };

    const handleAddCollaborator = async (email, role = 'viewer') => {
        if (!currentBoard?._id) return;

        try {
            const response = await moodBoardService.addCollaborator(currentBoard._id, { email, role });
            if (response.success) {
                setCurrentBoard(response.data);
                setCollaborators(response.data.collaborators);
                setMessages(response.data.messages);
                toast.success(`Invitation sent to ${email}`);
            }
        } catch (error) {
            console.error('Error adding collaborator:', error);
            toast.error('Failed to add collaborator');
        }
    };

    const handleAddMessage = async (text) => {
        if (!currentBoard?._id || !text.trim()) return;

        try {
            const response = await moodBoardService.addMessage(currentBoard._id, { text });
            if (response.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Error adding message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleExportBoard = async (format = 'png', quality = 90) => {
        if (!currentBoard?._id) return;

        try {
            const response = await moodBoardService.exportMoodBoard(currentBoard._id, format, quality);
            if (response.success) {
                // Handle download
                const link = document.createElement('a');
                link.href = response.data.downloadUrl;
                link.download = `${currentBoard.title || 'moodboard'}.${format}`;
                link.click();
                toast.success('Board exported successfully!');
            }
        } catch (error) {
            console.error('Error exporting board:', error);
            toast.error('Failed to export board');
        }
    };

    // Show loading state while auth is being determined
    if (isAuthenticated === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Palette className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Sign in to create mood boards</h3>
                    <p className="text-gray-500">Create beautiful travel inspiration boards with AI</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mood-board-container">
            {/* Main Dashboard View */}
            {!isOpen && (
                <div className="mood-board-dashboard">
                    <div className="dashboard-header">
                        <div className="header-content">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Travel Mood Boards
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                                Create, collaborate, and get inspired with AI-powered travel planning
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={createNewBoard}
                            className="create-board-btn"
                            disabled={isLoading}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {isLoading ? 'Creating...' : 'Create New Board'}
                        </motion.button>
                    </div>

                    {/* AI Generator Section */}
                    <div className="ai-generator-section">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setShowAIGenerator(true)}
                            className="ai-generator-btn"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate with AI
                        </motion.button>
                    </div>

                    {/* Existing Boards Grid */}
                    <div className="boards-grid">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading your mood boards...</p>
                            </div>
                        ) : !boards || boards.length === 0 ? (
                            <div className="text-center py-12">
                                <Palette className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-semibold mb-2">No mood boards yet</h3>
                                <p className="text-gray-500">Create your first travel mood board to get started!</p>
                            </div>
                        ) : (
                            boards.map((board) => (
                                <motion.div
                                    key={board._id || board.id}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => openBoard(board)}
                                    className="board-card"
                                >
                                    <div className="board-thumbnail">
                                        <img src={board.elements?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'} alt={board.title} loading="lazy"  />
                                        <div className="board-overlay">
                                            <div className="overlay-actions">
                                                <button className="action-btn">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="action-btn">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                                <button className="action-btn">
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="board-info">
                                        <h3 className="board-title">{board.title}</h3>
                                        <div className="board-meta">
                                            <span className="board-theme">{board.themes?.[0] || 'Travel'}</span>
                                            <span className="board-collaborators">
                                                <Users className="w-4 h-4 mr-1" />
                                                {board.collaborators?.length || 1}
                                            </span>
                                        </div>
                                        <p className="board-date">
                                            {board.updatedAt
                                                ? new Date(board.updatedAt).toLocaleDateString()
                                                : board.createdAt
                                                    ? new Date(board.createdAt).toLocaleDateString()
                                                    : 'Recently'
                                            }
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Mood Board Editor */}
            <AnimatePresence>
                {isOpen && currentBoard && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="mood-board-editor"
                    >
                        {/* Editor Header */}
                        <div className="editor-header">
                            <div className="header-left">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="back-btn"
                                >
                                    ← Back to Dashboard
                                </button>
                                <input
                                    type="text"
                                    value={currentBoard?.title || ''}
                                    onChange={(e) => setCurrentBoard({
                                        ...currentBoard,
                                        title: e.target.value
                                    })}
                                    className="board-title-input"
                                />
                            </div>
                            <div className="header-actions">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleCollaboration}
                                    className={`collab-btn ${isCollaborating ? 'active' : ''}`}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    {isCollaborating ? 'Collaborating' : 'Collaborate'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleShareBoard}
                                    className="share-btn"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSaveBoard}
                                    className="save-btn"
                                >
                                    Save
                                </motion.button>
                            </div>
                        </div>

                        {/* Main Editor Content */}
                        <div className="editor-content">
                            {/* Left Sidebar */}
                            <MoodBoardSidebar
                                ref={sidebarRef}
                                currentBoard={currentBoard}
                                setCurrentBoard={setCurrentBoard}
                                boards={boards}
                                selectedElement={selectedElement}
                                setSelectedElement={setSelectedElement}
                                onAIGenerate={() => setShowAIGenerator(true)}
                                onSave={handleSaveBoard}
                                onExport={handleExportBoard}
                                onShare={handleShareBoard}
                                onCollaborate={toggleCollaboration}
                                isCollaborating={isCollaborating}
                                collaborators={collaborators}
                                onToggleCollaboration={toggleCollaboration}
                                onOpenBoard={openBoard}
                                onNewBoard={createNewBoard}
                                onDeleteBoard={handleDeleteBoard}
                            />

                            {/* Main Canvas */}
                            <div className="canvas-container">
                                <MoodBoardCanvas
                                    board={currentBoard}
                                    setBoard={setCurrentBoard}
                                    isCollaborating={isCollaborating}
                                    selectedElement={selectedElement}
                                    setSelectedElement={setSelectedElement}
                                />
                            </div>

                            {/* Right Collaboration Panel */}
                            {isCollaborating && (
                                <CollaborationPanel
                                    board={currentBoard}
                                    collaborators={collaborators}
                                    setCollaborators={setCollaborators}
                                    messages={messages}
                                    setMessages={setMessages}
                                    onAddMessage={handleAddMessage}
                                    onAddCollaborator={handleAddCollaborator}
                                    isOpen={isCollaborating}
                                    onClose={() => setIsCollaborating(false)}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Generator Modal */}
            <AnimatePresence>
                {showAIGenerator && (
                    <AIGenerator
                        onClose={() => setShowAIGenerator(false)}
                        onGenerate={async (generatedBoard) => {
                            try {
                                // Save the AI-generated board to backend
                                const response = await moodBoardService.createMoodBoard(generatedBoard);
                                if (response.success) {
                                    const savedBoard = response.data;
                                    setCurrentBoard(savedBoard);
                                    setBoards(prev => [savedBoard, ...prev]);
                                    setShowAIGenerator(false);
                                    setIsOpen(true);
                                    toast.success('AI-generated board created successfully!');
                                }
                            } catch (error) {
                                console.error('Error saving AI-generated board:', error);
                                toast.error('Failed to save AI-generated board');
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MoodBoard;
