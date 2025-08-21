import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Search,
    Heart,
    Download,
    Share2,
    Settings,
    Palette,
    Image as ImageIcon,
    Type,
    Shapes,
    Layers,
    Grid3X3,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Users,
    MessageCircle,
    Video,
    Plus,
    FolderOpen,
    Save,
    Trash2,
    Edit3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './MoodBoardSidebar.css';

const MoodBoardSidebar = ({
    currentBoard,
    setCurrentBoard,
    boards = [],
    selectedElement,
    setSelectedElement,
    onSave,
    onExport,
    onShare,
    onCollaborate,
    isCollaborating,
    collaborators = [],
    onToggleCollaboration,
    onOpenBoard,
    onNewBoard,
    onDeleteBoard
}) => {
    const [activeSection, setActiveSection] = useState('boards');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewBoardForm, setShowNewBoardForm] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [editingBoard, setEditingBoard] = useState(null);
    const [activeTool, setActiveTool] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#667eea');
    const [selectedFont, setSelectedFont] = useState('Inter');
    const [selectedShape, setSelectedShape] = useState('rectangle');

    const { isDarkMode } = useTheme();

    // Use boards from parent component instead of mock data
    const savedBoards = boards || [];

    const handleNewBoard = () => {
        if (newBoardName.trim()) {
            // Use the parent component's createNewBoard function
            onNewBoard();
            setNewBoardName('');
            setShowNewBoardForm(false);
        }
    };

    const handleEditBoard = (board) => {
        setEditingBoard(board);
        setNewBoardName(board.title);
        setShowNewBoardForm(true);
    };

    const handleUpdateBoard = () => {
        if (editingBoard && newBoardName.trim()) {
            const updatedBoard = {
                ...editingBoard,
                title: newBoardName,
                lastModified: new Date().toISOString().split('T')[0]
            };

            // Update the board in the current state
            if (setCurrentBoard) {
                setCurrentBoard(updatedBoard);
            }

            setNewBoardName('');
            setShowNewBoardForm(false);
            setEditingBoard(null);
        }
    };

    const handleDeleteBoard = (boardId) => {
        if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
            if (onDeleteBoard) {
                onDeleteBoard(boardId);
            }
        }
    };

    const filteredBoards = savedBoards.filter(board =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToolAction = (tool) => {
        setActiveTool(activeTool === tool ? null : tool);
    };

    const applyToolToElement = (property, value) => {
        if (selectedElement && setCurrentBoard && currentBoard) {
            const updatedElements = currentBoard.elements.map(element =>
                element._id === selectedElement._id || element.id === selectedElement.id
                    ? { ...element, [property]: value }
                    : element
            );

            setCurrentBoard({
                ...currentBoard,
                elements: updatedElements
            });

            // Update the selected element state
            setSelectedElement(prev => prev ? { ...prev, [property]: value } : null);
        }
    };

    const renderToolPanel = () => {
        switch (activeTool) {
            case 'colorPalette':
                return (
                    <div className="color-palette-panel">
                        <h4>Color Palette</h4>
                        <div className="color-grid">
                            {['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#38f9d7', '#fa709a'].map(color => (
                                <div
                                    key={color}
                                    className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        if (selectedElement) {
                                            applyToolToElement('color', color);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => {
                                const color = e.target.value;
                                setSelectedColor(color);
                                if (selectedElement) {
                                    applyToolToElement('color', color);
                                }
                            }}
                            className="color-picker"
                        />
                        {selectedElement && (
                            <button
                                onClick={() => applyToolToElement('color', selectedColor)}
                                className="apply-color-btn"
                                disabled={!selectedElement}
                            >
                                Apply to Selected Element
                            </button>
                        )}
                    </div>
                );

            case 'imageLibrary':
                return (
                    <div className="image-library-panel">
                        <h4>Image Library</h4>
                        <div className="image-search">
                            <input
                                type="text"
                                placeholder="Search images..."
                                className="search-input"
                            />
                        </div>
                        <div className="image-categories">
                            <button className="category-btn">Nature</button>
                            <button className="category-btn">Cities</button>
                            <button className="category-btn">Beaches</button>
                            <button className="category-btn">Mountains</button>
                        </div>
                        <div className="sample-images">
                            <h5>Sample Images</h5>
                            <div className="image-grid">
                                {[
                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
                                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
                                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
                                    'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200&h=150&fit=crop',
                                    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=150&fit=crop',
                                    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=150&fit=crop'
                                ].map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className="sample-image-item"
                                        onClick={() => {
                                            if (currentBoard && setCurrentBoard) {
                                                const newElement = {
                                                    id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                                    type: 'image',
                                                    x: 100 + Math.random() * 200,
                                                    y: 100 + Math.random() * 200,
                                                    width: 200,
                                                    height: 150,
                                                    rotation: 0,
                                                    zIndex: currentBoard.elements?.length || 0,
                                                    imageUrl: imageUrl,
                                                    opacity: 1
                                                };

                                                setCurrentBoard({
                                                    ...currentBoard,
                                                    elements: [...(currentBoard.elements || []), newElement]
                                                });
                                            }
                                        }}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Sample ${index + 1}`}
                                            loading="lazy" 
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/200x150?text=Image+Error';
                                            }}
                                        />
                                        <div className="image-overlay">
                                            <span>Click to Add</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'typography':
                return (
                    <div className="typography-panel">
                        <h4>Typography</h4>
                        <select
                            value={selectedFont}
                            onChange={(e) => {
                                const font = e.target.value;
                                setSelectedFont(font);
                                if (selectedElement) {
                                    applyToolToElement('fontFamily', font);
                                }
                            }}
                            className="font-selector"
                        >
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Lato">Lato</option>
                            <option value="Poppins">Poppins</option>
                        </select>
                        <div className="font-size-control">
                            <label>Font Size</label>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                value={selectedElement?.fontSize || 24}
                                onChange={(e) => {
                                    const size = parseInt(e.target.value);
                                    if (selectedElement) {
                                        applyToolToElement('fontSize', size);
                                    }
                                }}
                                className="size-slider"
                            />
                            <span>{selectedElement?.fontSize || 24}px</span>
                        </div>
                        {selectedElement && (
                            <button
                                onClick={() => {
                                    applyToolToElement('fontFamily', selectedFont);
                                    applyToolToElement('fontSize', selectedElement.fontSize || 24);
                                }}
                                className="apply-font-btn"
                                disabled={!selectedElement}
                            >
                                Apply to Selected Element
                            </button>
                        )}
                    </div>
                );

            case 'shapes':
                return (
                    <div className="shapes-panel">
                        <h4>Shapes</h4>
                        <div className="shape-grid">
                            {['rectangle', 'circle', 'triangle', 'star', 'heart'].map(shape => (
                                <div
                                    key={shape}
                                    className={`shape-item ${selectedShape === shape ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedShape(shape);
                                        if (selectedElement) {
                                            applyToolToElement('shapeType', shape);
                                        }
                                    }}
                                >
                                    <div className={`shape ${shape}`} />
                                    <span>{shape}</span>
                                </div>
                            ))}
                        </div>
                        {selectedElement && (
                            <button
                                onClick={() => applyToolToElement('shapeType', selectedShape)}
                                className="apply-shape-btn"
                                disabled={!selectedElement}
                            >
                                Apply to Selected Element
                            </button>
                        )}
                    </div>
                );

            case 'layers':
                return (
                    <div className="layers-panel">
                        <h4>Layers</h4>
                        <div className="layers-list">
                            {currentBoard?.elements?.map((element, index) => (
                                <div key={element._id || element.id} className="layer-item">
                                    <span className="layer-name">{element.type}</span>
                                    <div className="layer-controls">
                                        <button
                                            className="layer-btn"
                                            onClick={() => {
                                                if (index > 0 && currentBoard && setCurrentBoard) {
                                                    const newElements = [...currentBoard.elements];
                                                    [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
                                                    setCurrentBoard({
                                                        ...currentBoard,
                                                        elements: newElements
                                                    });
                                                }
                                            }}
                                            disabled={index === 0}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="layer-btn"
                                            onClick={() => {
                                                if (index < currentBoard.elements.length - 1 && currentBoard && setCurrentBoard) {
                                                    const newElements = [...currentBoard.elements];
                                                    [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
                                                    setCurrentBoard({
                                                        ...currentBoard,
                                                        elements: newElements
                                                    });
                                                }
                                            }}
                                            disabled={index === currentBoard.elements.length - 1}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            className={`layer-btn ${element.visible !== false ? 'visible' : 'hidden'}`}
                                            onClick={() => {
                                                if (currentBoard && setCurrentBoard) {
                                                    const newElements = currentBoard.elements.map((el, i) =>
                                                        i === index ? { ...el, visible: el.visible !== false ? false : true } : el
                                                    );
                                                    setCurrentBoard({
                                                        ...currentBoard,
                                                        elements: newElements
                                                    });
                                                }
                                            }}
                                            title={element.visible !== false ? 'Hide' : 'Show'}
                                        >
                                            {element.visible !== false ? '👁' : '👁‍🗨'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'grid':
                return (
                    <div className="grid-panel">
                        <h4>Grid Settings</h4>
                        <div className="grid-controls">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentBoard?.settings?.gridEnabled || false}
                                    onChange={(e) => {
                                        if (setCurrentBoard) {
                                            setCurrentBoard({
                                                ...currentBoard,
                                                settings: {
                                                    ...currentBoard?.settings,
                                                    gridEnabled: e.target.checked
                                                }
                                            });
                                        }
                                    }}
                                />
                                Enable Grid
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentBoard?.settings?.snapToGrid || false}
                                    onChange={(e) => {
                                        if (setCurrentBoard) {
                                            setCurrentBoard({
                                                ...currentBoard,
                                                settings: {
                                                    ...currentBoard?.settings,
                                                    snapToGrid: e.target.checked
                                                }
                                            });
                                        }
                                    }}
                                />
                                Snap to Grid
                            </label>
                            <div className="grid-size-control">
                                <label>Grid Size: {currentBoard?.settings?.gridSize || 20}px</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    value={currentBoard?.settings?.gridSize || 20}
                                    onChange={(e) => {
                                        if (setCurrentBoard) {
                                            setCurrentBoard({
                                                ...currentBoard,
                                                settings: {
                                                    ...currentBoard?.settings,
                                                    gridSize: parseInt(e.target.value)
                                                }
                                            });
                                        }
                                    }}
                                    className="grid-size-slider"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'boards':
                return (
                    <div className="sidebar-section-content">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search boards..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <div className="boards-list">
                            {filteredBoards.map((board) => (
                                <div key={board._id} className="board-item">
                                    <div className="board-thumbnail">
                                        <img
                                            src={board.thumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=100&fit=crop'}
                                            alt={board.title}

                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=100&fit=crop';
                                            }}
                                        />
                                        <div className="board-overlay">
                                            <button
                                                onClick={() => onOpenBoard(board)}
                                                className="overlay-btn open"
                                                title="Open Board"
                                            >
                                                <FolderOpen className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditBoard(board)}
                                                className="overlay-btn edit"
                                                title="Edit Board"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBoard(board._id)}
                                                className="overlay-btn delete"
                                                title="Delete Board"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="board-info">
                                        <h4 className="board-title">{board.title}</h4>
                                        <div className="board-meta">
                                            <span className="last-modified">
                                                {board.lastModified || board.updatedAt || 'Recently'}
                                            </span>
                                            <div className="board-status">
                                                {board.isPublic ? (
                                                    <Unlock className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <Lock className="w-3 h-3 text-gray-500" />
                                                )}
                                                <span className="collaborator-count">
                                                    {board.collaborators?.length || board.collaborators || 1} {(board.collaborators?.length || board.collaborators || 1) === 1 ? 'person' : 'people'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showNewBoardForm && (
                            <div className="new-board-form">
                                <input
                                    type="text"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    placeholder="Enter board name..."
                                    className="new-board-input"
                                    autoFocus
                                />
                                <div className="form-actions">
                                    <button
                                        onClick={editingBoard ? handleUpdateBoard : handleNewBoard}
                                        className="form-btn primary"
                                    >
                                        {editingBoard ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNewBoardForm(false);
                                            setEditingBoard(null);
                                            setNewBoardName('');
                                        }}
                                        className="form-btn secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowNewBoardForm(true)}
                            className="new-board-btn"
                        >
                            <Plus className="w-4 h-4" />
                            New Board
                        </button>
                    </div>
                );

            case 'tools':
                return (
                    <div className="sidebar-section-content">
                        <div className="tools-grid">
                            <div
                                className="tool-item"
                                onClick={() => handleToolAction('colorPalette')}
                            >
                                <Palette className="tool-icon" />
                                <span>Color Palette</span>
                            </div>
                            <div
                                className="tool-item"
                                onClick={() => handleToolAction('imageLibrary')}
                            >
                                <ImageIcon className="tool-icon" />
                                <span>Image Library</span>
                            </div>
                            <div
                                className="tool-item"
                                onClick={() => handleToolAction('typography')}
                            >
                                <Type className="tool-icon" />
                                <span>Typography</span>
                            </div>
                            <div
                                className="tool-item"
                                onClick={() => handleToolAction('shapes')}
                            >
                                <Shapes className="tool-icon" />
                                <span>Shapes</span>
                            </div>
                            <div
                                className="tool-item"
                                onClick={() => handleToolAction('layers')}
                            >
                                <Layers className="tool-icon" />
                                <span>Layers</span>
                            </div>
                            <div
                                className="tool-item"
                                onClick={() => handleToolAction('grid')}
                            >
                                <Grid3X3 className="tool-icon" />
                                <span>Grid</span>
                            </div>
                        </div>

                        {/* Tool-specific panels */}
                        {activeTool && (
                            <div className="tool-panel">
                                {renderToolPanel()}
                            </div>
                        )}
                    </div>
                );

            case 'collaboration':
                return (
                    <div className="sidebar-section-content">
                        <div className="collaboration-status">
                            <div className="status-header">
                                <h4>Collaboration</h4>
                                <button
                                    onClick={onToggleCollaboration}
                                    className={`toggle-btn ${isCollaborating ? 'active' : ''}`}
                                >
                                    {isCollaborating ? 'Disable' : 'Enable'}
                                </button>
                            </div>

                            {isCollaborating && (
                                <div className="collaborators-preview">
                                    <h5>Active Collaborators</h5>
                                    <div className="collaborators-list">
                                        {collaborators.map((collaborator) => (
                                            <div key={collaborator.id} className="collaborator-preview">
                                                <img src={collaborator.avatar} alt={collaborator.name} loading="lazy"  />
                                                <span>{collaborator.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={onCollaborate}
                                        className="collaborate-btn"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Open Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'export':
                return (
                    <div className="sidebar-section-content">
                        <div className="export-options">
                            <h4>Export Options</h4>

                            <div className="export-option">
                                <h5>Image Format</h5>
                                <div className="format-buttons">
                                    <button className="format-btn active">PNG</button>
                                    <button className="format-btn">JPG</button>
                                    <button className="format-btn">SVG</button>
                                </div>
                            </div>

                            <div className="export-option">
                                <h5>Resolution</h5>
                                <div className="resolution-buttons">
                                    <button className="resolution-btn active">HD (1920x1080)</button>
                                    <button className="resolution-btn">4K (3840x2160)</button>
                                    <button className="resolution-btn">Custom</button>
                                </div>
                            </div>

                            <div className="export-option">
                                <h5>Quality</h5>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    defaultValue="90"
                                    className="quality-slider"
                                />
                                <span className="quality-value">90%</span>
                            </div>

                            <button
                                onClick={onExport}
                                className="export-btn"
                            >
                                <Download className="w-4 h-4" />
                                Export Board
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mood-board-sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <h3>Mood Board</h3>
                <button className="close-sidebar-btn">×</button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="sidebar-nav">
                <button
                    onClick={() => setActiveSection('boards')}
                    className={`nav-btn ${activeSection === 'boards' ? 'active' : ''}`}
                >
                    <Home className="w-4 h-4" />
                    <span>My Boards</span>
                </button>

                <button
                    onClick={() => setActiveSection('tools')}
                    className={`nav-btn ${activeSection === 'tools' ? 'active' : ''}`}
                >
                    <Palette className="w-4 h-4" />
                    <span>Tools</span>
                </button>

                <button
                    onClick={() => setActiveSection('collaboration')}
                    className={`nav-btn ${activeSection === 'collaboration' ? 'active' : ''}`}
                >
                    <Users className="w-4 h-4" />
                    <span>Collaboration</span>
                </button>

                <button
                    onClick={() => setActiveSection('export')}
                    className={`nav-btn ${activeSection === 'export' ? 'active' : ''}`}
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
            </nav>

            {/* Section Content */}
            <div className="sidebar-content">
                {renderSectionContent()}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button onClick={onSave} className="quick-action-btn" title="Save">
                    <Save className="w-4 h-4" />
                </button>
                <button onClick={onShare} className="quick-action-btn" title="Share">
                    <Share2 className="w-4 h-4" />
                </button>
                <button onClick={onCollaborate} className="quick-action-btn" title="Collaborate">
                    <MessageCircle className="w-4 h-4" />
                </button>
                <button className="quick-action-btn" title="Settings">
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default MoodBoardSidebar;

