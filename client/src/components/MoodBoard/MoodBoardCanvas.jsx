import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
    Plus,
    Image as ImageIcon,
    Type,
    Palette,
    Trash2,
    Copy,
    Download,
    Eye,
    EyeOff,
    Upload,
    Link,
    Search
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { moodBoardService, collaborationHelpers, imageHelpers } from '../../services/moodBoardService';
import toast from 'react-hot-toast';
import './MoodBoardCanvas.css';

const MoodBoardCanvas = ({ board, setBoard, isCollaborating, onSave, selectedElement, setSelectedElement }) => {

    const [isAddingElement, setIsAddingElement] = useState(false);
    const [elementType, setElementType] = useState('image');
    const [showGrid, setShowGrid] = useState(board?.settings?.gridEnabled ?? true);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [autoSaveTimer, setAutoSaveTimer] = useState(null);

    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const panX = useMotionValue(0);
    const panY = useMotionValue(0);

    // Check if user can edit
    const canEdit = collaborationHelpers.canEdit(board, user?.id);

    useEffect(() => {
        if (board && !board.elements) {
            setBoard({
                ...board,
                elements: []
            });
        }
    }, [board, setBoard]);

    // Update local grid state when board settings change
    useEffect(() => {
        if (board?.settings?.gridEnabled !== undefined) {
            setShowGrid(board.settings.gridEnabled);
        }
    }, [board?.settings?.gridEnabled]);

    // Auto-save functionality
    useEffect(() => {
        if (board?._id && canEdit) {
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }

            const timer = setTimeout(async () => {
                try {
                    await moodBoardService.autoSave(board._id, {
                        elements: board.elements,
                        metadata: {
                            canvasWidth: 1200,
                            canvasHeight: 800,
                            zoom,
                            panX: pan.x,
                            panY: pan.y
                        }
                    });
                } catch (error) {
                    console.error('Auto-save failed:', error);
                }
            }, 2000); // Auto-save after 2 seconds of inactivity

            setAutoSaveTimer(timer);
        }

        return () => {
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
        };
    }, [board?.elements, board?._id, canEdit, zoom, pan]);

    const addElement = useCallback((type, customData = {}) => {
        if (!canEdit) {
            toast.error('You do not have permission to edit this board');
            return;
        }

        const newElement = {
            id: collaborationHelpers.generateElementId(),
            type,
            x: 100 + Math.random() * 200,
            y: 100 + Math.random() * 200,
            width: type === 'image' ? 200 : 150,
            height: type === 'image' ? 150 : 100,
            rotation: 0,
            zIndex: board.elements?.length || 0,
            content: type === 'text' ? 'Add your text here' : '',
            imageUrl: type === 'image' ? (customData.imageUrl || getRandomImage()) : '',
            color: type === 'shape' ? (customData.color || getRandomColor()) : '#667eea',
            fontSize: type === 'text' ? 24 : 16,
            fontFamily: 'Inter',
            fontWeight: 'normal',
            opacity: 1,
            ...customData
        };

        setBoard({
            ...board,
            elements: [...(board.elements || []), newElement]
        });

        setSelectedElement(newElement);
        setIsAddingElement(false);
        setShowImageUpload(false);
        setImageUrl('');
    }, [board, setBoard, canEdit]);

    const getRandomImage = () => {
        const images = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop'
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    const getRandomColor = () => {
        const colors = board.colorPalette || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const updateElement = useCallback((id, updates) => {
        if (!canEdit) return;

        setBoard({
            ...board,
            elements: board.elements.map(el =>
                el.id === id ? { ...el, ...updates } : el
            )
        });
    }, [board, setBoard, canEdit]);

    const deleteElement = useCallback((id) => {
        if (!canEdit) return;

        setBoard({
            ...board,
            elements: board.elements.filter(el => el.id !== id)
        });
        setSelectedElement(null);
    }, [board, setBoard, canEdit]);

    const duplicateElement = useCallback((id) => {
        if (!canEdit) return;

        const element = board.elements.find(el => el.id === id);
        if (element) {
            const duplicated = {
                ...element,
                id: collaborationHelpers.generateElementId(),
                x: element.x + 20,
                y: element.y + 20,
                zIndex: board.elements.length
            };
            setBoard({
                ...board,
                elements: [...board.elements, duplicated]
            });
        }
    }, [board, setBoard, canEdit]);

    const handleElementDrag = useCallback((event, info, elementId) => {
        if (!canEdit) return;

        const { x, y } = info.offset;

        // Snap to grid if enabled
        const gridSize = board.settings?.gridSize || 20;
        const snappedX = board.settings?.snapToGrid ? Math.round(x / gridSize) * gridSize : x;
        const snappedY = board.settings?.snapToGrid ? Math.round(y / gridSize) * gridSize : y;

        // Ensure element stays within canvas bounds
        const maxX = 1200 - (board.elements.find(el => el.id === elementId)?.width || 200);
        const maxY = 800 - (board.elements.find(el => el.id === elementId)?.height || 150);

        const boundedX = Math.max(0, Math.min(snappedX, maxX));
        const boundedY = Math.max(0, Math.min(snappedY, maxY));

        updateElement(elementId, { x: boundedX, y: boundedY });
    }, [canEdit, board.settings, board.elements, updateElement]);

    const handleElementResize = useCallback((elementId, newWidth, newHeight) => {
        if (!canEdit) return;

        // Ensure minimum and maximum sizes
        const minSize = 50;
        const maxSize = 800;
        const width = Math.max(minSize, Math.min(maxSize, newWidth));
        const height = Math.max(minSize, Math.min(maxSize, newHeight));

        updateElement(elementId, { width, height });
    }, [canEdit, updateElement]);

    const handleElementRotate = useCallback((elementId, newRotation) => {
        if (!canEdit) return;
        updateElement(elementId, { rotation: newRotation % 360 });
    }, [canEdit, updateElement]);

    const handleCanvasPan = useCallback((event, info) => {
        const { x, y } = info.offset;
        setPan({ x, y });
    }, []);

    const handleZoom = useCallback((delta) => {
        setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
    }, []);

    const handleImageUpload = useCallback(async () => {
        if (!imageUrl.trim()) {
            toast.error('Please enter an image URL');
            return;
        }

        if (!imageHelpers.isValidImageUrl(imageUrl)) {
            toast.error('Please enter a valid image URL');
            return;
        }

        setIsLoading(true);
        try {
            // Get image dimensions
            const dimensions = await imageHelpers.getImageDimensions(imageUrl);

            addElement('image', {
                imageUrl: imageUrl,
                width: Math.min(dimensions.width, 400),
                height: Math.min(dimensions.height, 300)
            });

            toast.success('Image added successfully!');
            setShowImageUpload(false);
            setImageUrl('');
        } catch (error) {
            toast.error('Failed to load image. Please check the URL.');
        } finally {
            setIsLoading(false);
        }
    }, [imageUrl, addElement]);

    const handleFileUpload = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('File size too large. Please select a smaller image.');
            return;
        }

        setIsLoading(true);
        try {
            // Convert file to data URL for now
            // In production, you'd upload to a cloud service
            const reader = new FileReader();
            reader.onload = (e) => {
                addElement('image', {
                    imageUrl: e.target.result,
                    width: 200,
                    height: 150
                });
                toast.success('Image uploaded successfully!');
                setIsLoading(false);
                setShowImageUpload(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Failed to upload image');
            setIsLoading(false);
        }
    }, [addElement]);

    const renderElement = useCallback((element) => {
        // Skip rendering if element is hidden
        if (element.visible === false) {
            return null;
        }

        const isSelected = selectedElement?._id === element._id || selectedElement?.id === element.id;

        const elementStyle = {
            position: 'absolute',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `rotate(${element.rotation}deg)`,
            zIndex: element.zIndex,
            opacity: element.opacity,
            cursor: isSelected ? 'move' : 'pointer'
        };

        const handleClick = (e) => {
            e.stopPropagation();
            setSelectedElement(element);
        };

        const handleDoubleClick = (e) => {
            e.stopPropagation();
            if (element.type === 'text' && canEdit) {
                // Enable text editing
                const input = document.createElement('input');
                input.value = element.content;
                input.style.cssText = `
                    position: absolute;
                    left: ${element.x}px;
                    top: ${element.y}px;
                    width: ${element.width}px;
                    height: ${element.height}px;
                    border: 2px solid #667eea;
                    background: white;
                    font-size: ${element.fontSize}px;
                    font-family: ${element.fontFamily};
                    font-weight: ${element.fontWeight};
                    padding: 8px;
                    outline: none;
                    z-index: 1000;
                `;

                input.addEventListener('blur', () => {
                    updateElement(element._id || element.id, { content: input.value });
                    input.remove();
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });

                document.body.appendChild(input);
                input.focus();
                input.select();
            }
        };

        switch (element.type) {
            case 'image':
                return (
                    <motion.div
                        key={element._id || element.id}
                        style={elementStyle}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        drag={canEdit}
                        dragMomentum={false}
                        dragElastic={0.1}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setIsDragging(false)}
                        onDrag={(e, info) => handleElementDrag(e, info, element._id || element.id)}
                        className={`canvas-element image-element ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <img
                            src={element.imageUrl}
                            alt="Mood board element"
                            loading="lazy" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200x150?text=Image+Error';
                            }}
                            draggable={false}
                        />
                        {isSelected && canEdit && (
                            <ElementControls
                                element={element}
                                onUpdate={updateElement}
                                onDelete={deleteElement}
                                onDuplicate={duplicateElement}
                            />
                        )}
                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="selection-indicator">
                                <div className="selection-handle top-left" />
                                <div className="selection-handle top-right" />
                                <div className="selection-handle bottom-left" />
                                <div className="selection-handle bottom-right" />
                            </div>
                        )}
                    </motion.div>
                );

            case 'text':
                return (
                    <motion.div
                        key={element._id || element.id}
                        style={elementStyle}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        drag={canEdit}
                        dragMomentum={false}
                        dragElastic={0.1}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setIsDragging(false)}
                        onDrag={(e, info) => handleElementDrag(e, info, element._id || element.id)}
                        className={`canvas-element text-element ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: element.fontSize,
                                fontFamily: element.fontFamily,
                                fontWeight: element.fontWeight,
                                color: element.color,
                                textAlign: 'center',
                                padding: '8px',
                                wordBreak: 'break-word'
                            }}
                        >
                            {element.content}
                        </div>
                        {isSelected && canEdit && (
                            <ElementControls
                                element={element}
                                onUpdate={updateElement}
                                onDelete={deleteElement}
                                onDuplicate={duplicateElement}
                            />
                        )}
                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="selection-indicator">
                                <div className="selection-handle top-left" />
                                <div className="selection-handle top-right" />
                                <div className="selection-handle bottom-left" />
                                <div className="selection-handle bottom-right" />
                            </div>
                        )}
                    </motion.div>
                );

            case 'shape':
                return (
                    <motion.div
                        key={element._id || element.id}
                        style={elementStyle}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        drag={canEdit}
                        dragMomentum={false}
                        dragElastic={0.1}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setIsDragging(false)}
                        onDrag={(e, info) => handleElementDrag(e, info, element._id || element.id)}
                        className={`canvas-element shape-element ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: element.color,
                                borderRadius: '8px'
                            }}
                        />
                        {isSelected && canEdit && (
                            <ElementControls
                                element={element}
                                onUpdate={updateElement}
                                onDelete={deleteElement}
                                onDuplicate={duplicateElement}
                            />
                        )}
                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="selection-indicator">
                                <div className="selection-handle top-left" />
                                <div className="selection-handle top-right" />
                                <div className="selection-handle bottom-left" />
                                <div className="selection-handle bottom-right" />
                            </div>
                        )}
                    </motion.div>
                );

            default:
                return null;
        }
    }, [selectedElement, canEdit, handleElementDrag, updateElement, deleteElement, duplicateElement, isDragging]);

    return (
        <div className="mood-board-canvas-container">
            {/* Canvas Toolbar */}
            <div className="canvas-toolbar">
                <div className="toolbar-left">
                    {canEdit && (
                        <button
                            onClick={() => setIsAddingElement(true)}
                            className="toolbar-btn primary"
                        >
                            <Plus className="w-4 h-4" />
                            Add Element
                        </button>
                    )}

                    {isAddingElement && (
                        <div className="element-type-selector">
                            <button
                                onClick={() => addElement('image')}
                                className="element-type-btn"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Image
                            </button>
                            <button
                                onClick={() => addElement('text')}
                                className="element-type-btn"
                            >
                                <Type className="w-4 h-4" />
                                Text
                            </button>
                            <button
                                onClick={() => addElement('shape')}
                                className="element-type-btn"
                            >
                                <Palette className="w-4 h-4" />
                                Shape
                            </button>
                        </div>
                    )}

                    {canEdit && (
                        <button
                            onClick={() => setShowImageUpload(true)}
                            className="toolbar-btn"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Image
                        </button>
                    )}
                </div>

                <div className="toolbar-right">
                    <button
                        onClick={() => {
                            const newGridEnabled = !showGrid;
                            setShowGrid(newGridEnabled);
                            if (setBoard && board) {
                                setBoard({
                                    ...board,
                                    settings: {
                                        ...board.settings,
                                        gridEnabled: newGridEnabled
                                    }
                                });
                            }
                        }}
                        className={`toolbar-btn ${showGrid ? 'active' : ''}`}
                    >
                        {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        Grid
                    </button>

                    <div className="zoom-controls">
                        <button
                            onClick={() => handleZoom(-0.1)}
                            className="zoom-btn"
                        >
                            -
                        </button>
                        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                        <button
                            onClick={() => handleZoom(0.1)}
                            className="zoom-btn"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Upload Modal */}
            {showImageUpload && (
                <div className="image-upload-modal">
                    <div className="modal-content">
                        <h3>Add Image</h3>
                        <div className="upload-options">
                            <div className="url-input">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="url-input-field"
                                />
                                <button
                                    onClick={handleImageUpload}
                                    disabled={isLoading || !imageUrl.trim()}
                                    className="upload-btn"
                                >
                                    {isLoading ? 'Loading...' : 'Add URL'}
                                </button>
                            </div>

                            <div className="file-upload">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="file-upload-btn"
                                >
                                    <Upload className="w-4 h-4" />
                                    Choose File
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowImageUpload(false)}
                            className="close-modal-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Main Canvas */}
            <div className="canvas-wrapper" ref={canvasRef}>
                <motion.div
                    className="canvas-content"
                    style={{
                        scale: zoom,
                        x: pan.x,
                        y: pan.y
                    }}
                    drag={!isDragging}
                    dragMomentum={false}
                    onDrag={handleCanvasPan}
                >
                    {/* Grid Background */}
                    {showGrid && (
                        <div
                            className="canvas-grid"
                            style={{
                                backgroundSize: `${board?.settings?.gridSize || 20}px ${board?.settings?.gridSize || 20}px`
                            }}
                        />
                    )}

                    {/* Canvas Elements */}
                    {board.elements && board.elements.map(renderElement)}

                    {/* Drop Zone Indicator */}
                    {isAddingElement && (
                        <div className="drop-zone-indicator">
                            <div className="drop-zone-content">
                                <Plus className="w-8 h-8 text-gray-400" />
                                <p>Click to add element</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Element Properties Panel */}
            {selectedElement && canEdit && (
                <div className="element-properties">
                    <h4>Element Properties</h4>

                    <div className="property-group">
                        <label>Size</label>
                        <div className="size-controls">
                            <input
                                type="number"
                                value={selectedElement.width}
                                onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { width: parseInt(e.target.value) })}
                                placeholder="Width"
                                min="50"
                                max="800"
                            />
                            <span>×</span>
                            <input
                                type="number"
                                value={selectedElement.height}
                                onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { height: parseInt(e.target.value) })}
                                placeholder="Height"
                                min="50"
                                max="800"
                            />
                        </div>
                    </div>

                    <div className="property-group">
                        <label>Rotation</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={selectedElement.rotation}
                            onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { rotation: parseInt(e.target.value) })}
                        />
                        <span>{selectedElement.rotation}°</span>
                    </div>

                    <div className="property-group">
                        <label>Opacity</label>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={selectedElement.opacity}
                            onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { opacity: parseFloat(e.target.value) })}
                        />
                        <span>{Math.round(selectedElement.opacity * 100)}%</span>
                    </div>

                    {selectedElement.type === 'text' && (
                        <>
                            <div className="property-group">
                                <label>Font Size</label>
                                <input
                                    type="range"
                                    min="12"
                                    max="72"
                                    value={selectedElement.fontSize}
                                    onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { fontSize: parseInt(e.target.value) })}
                                />
                                <span>{selectedElement.fontSize}px</span>
                            </div>

                            <div className="property-group">
                                <label>Color</label>
                                <input
                                    type="color"
                                    value={selectedElement.color}
                                    onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { color: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {selectedElement.type === 'shape' && (
                        <div className="property-group">
                            <label>Color</label>
                            <input
                                type="color"
                                value={selectedElement.color}
                                onChange={(e) => updateElement(selectedElement._id || selectedElement.id, { color: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="property-actions">
                        <button
                            onClick={() => duplicateElement(selectedElement._id || selectedElement.id)}
                            className="property-btn"
                        >
                            <Copy className="w-4 h-4" />
                            Duplicate
                        </button>
                        <button
                            onClick={() => deleteElement(selectedElement._id || selectedElement.id)}
                            className="property-btn delete"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Element Controls Component
const ElementControls = ({ element, onUpdate, onDelete, onDuplicate }) => {
    return (
        <div className="element-controls">
            <button
                onClick={() => onDuplicate(element._id || element.id)}
                className="control-btn"
                title="Duplicate"
            >
                <Copy className="w-3 h-3" />
            </button>
            <button
                onClick={() => onDelete(element._id || element.id)}
                className="control-btn delete"
                title="Delete"
            >
                <Trash2 className="w-3 h-3" />
            </button>
        </div>
    );
};

export default MoodBoardCanvas;
