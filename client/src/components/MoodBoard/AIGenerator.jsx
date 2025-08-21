import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Sparkles,
    Palette,
    MapPin,
    DollarSign,
    Users,
    Calendar,
    Loader2,
    Wand2,
    Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './AIGenerator.css';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const AIGenerator = ({ onClose, onGenerate }) => {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        destination: '',
        budget: 'medium',
        style: 'adventure',
        duration: '1 week',
        companions: 'solo',
        interests: [],
        mood: 'energetic'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedBoard, setGeneratedBoard] = useState(null);
    const [error, setError] = useState('');

    const { isDarkMode } = useTheme();
    const formRef = useRef(null);

    const budgetOptions = [
        { value: 'budget', label: 'Budget', icon: '💰', description: 'Affordable options' },
        { value: 'medium', label: 'Medium', icon: '💎', description: 'Balanced luxury' },
        { value: 'luxury', label: 'Luxury', icon: '👑', description: 'Premium experience' }
    ];

    const styleOptions = [
        { value: 'adventure', label: 'Adventure', icon: '🏔️', description: 'Thrilling experiences' },
        { value: 'relaxation', label: 'Relaxation', icon: '🧘', description: 'Peaceful retreat' },
        { value: 'cultural', label: 'Cultural', icon: '🏛️', description: 'Heritage & history' },
        { value: 'romantic', label: 'Romantic', icon: '💕', description: 'Intimate moments' },
        { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Kid-friendly fun' },
        { value: 'urban', label: 'Urban', icon: '🏙️', description: 'City exploration' }
    ];

    const durationOptions = [
        { value: '3 days', label: '3 Days' },
        { value: '1 week', label: '1 Week' },
        { value: '2 weeks', label: '2 Weeks' },
        { value: '1 month', label: '1 Month' }
    ];

    const companionOptions = [
        { value: 'solo', label: 'Solo', icon: '🧍' },
        { value: 'couple', label: 'Couple', icon: '👫' },
        { value: 'friends', label: 'Friends', icon: '👥' },
        { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' }
    ];

    const moodOptions = [
        { value: 'energetic', label: 'Energetic', color: '#FF6B6B' },
        { value: 'calm', label: 'Calm', color: '#4ECDC4' },
        { value: 'romantic', label: 'Romantic', color: '#FF69B4' },
        { value: 'mysterious', label: 'Mysterious', color: '#9B59B6' },
        { value: 'vibrant', label: 'Vibrant', color: '#F1C40F' },
        { value: 'serene', label: 'Serene', color: '#3498DB' }
    ];

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleInterestToggle = (interest) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const generateMoodBoard = async () => {
        setIsGenerating(true);
        setError('');

        try {
            // Create AI prompt for mood board generation
            const prompt = createAIPrompt(preferences);

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse AI response and create mood board
            const board = parseAIResponse(text, preferences);
            setGeneratedBoard(board);
            setStep(3);
        } catch (err) {
            console.error("AI Generation error:", err);
            setError("Failed to generate mood board. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const createAIPrompt = (prefs) => {
        return `Create a detailed travel mood board for a ${prefs.style} trip to ${prefs.destination || 'an amazing destination'} with a ${prefs.budget} budget for ${prefs.duration}. 

Traveler Profile:
- Style: ${prefs.style}
- Budget: ${prefs.budget}
- Duration: ${prefs.duration}
- Companions: ${prefs.companions}
- Mood: ${prefs.mood}
- Interests: ${prefs.interests.join(', ')}

Please provide:
1. A creative title for the mood board
2. A color palette (5-6 hex colors)
3. 3-4 main themes/concepts
4. 5-6 specific activities or experiences
5. 3-4 accommodation suggestions
6. 2-3 dining recommendations
7. A brief description of the overall vibe

Format the response as JSON with these exact keys: title, colorPalette, themes, activities, accommodations, dining, description, vibe.`;
    };

    const parseAIResponse = (text, prefs) => {
        try {
            // Extract JSON from AI response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    id: Date.now(),
                    title: parsed.title || `Amazing ${prefs.style} Trip`,
                    theme: prefs.style,
                    colorPalette: parsed.colorPalette || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
                    destination: prefs.destination || 'Amazing Destination',
                    budget: prefs.budget,
                    duration: prefs.duration,
                    companions: prefs.companions,
                    mood: prefs.mood,
                    interests: prefs.interests,
                    themes: parsed.themes || [],
                    activities: parsed.activities || [],
                    accommodations: parsed.accommodations || [],
                    dining: parsed.dining || [],
                    description: parsed.description || '',
                    vibe: parsed.vibe || '',
                    collaborators: [],
                    lastModified: new Date(),
                    elements: [],
                    isNew: true,
                    aiGenerated: true
                };
            }
        } catch (err) {
            console.error("Failed to parse AI response:", err);
        }

        // Fallback mood board
        return createFallbackBoard(prefs);
    };

    const createFallbackBoard = (prefs) => {
        return {
            id: Date.now(),
            title: `Amazing ${prefs.style} Trip to ${prefs.destination || 'Wonderful Destination'}`,
            theme: prefs.style,
            colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
            destination: prefs.destination || 'Amazing Destination',
            budget: prefs.budget,
            duration: prefs.duration,
            companions: prefs.companions,
            mood: prefs.mood,
            interests: prefs.interests,
            themes: ['Adventure', 'Discovery', 'Memories'],
            activities: ['Explore local culture', 'Try new foods', 'Take amazing photos'],
            accommodations: ['Comfortable hotel', 'Local guesthouse'],
            dining: ['Local restaurants', 'Street food'],
            description: `A ${prefs.style} journey filled with ${prefs.mood} moments`,
            vibe: 'Exciting and memorable',
            collaborators: [],
            lastModified: new Date(),
            elements: [],
            isNew: true,
            aiGenerated: true
        };
    };

    const handleNext = () => {
        if (step === 1 && !preferences.destination) {
            setError('Please enter a destination');
            return;
        }
        if (step === 2) {
            generateMoodBoard();
            return;
        }
        setStep(step + 1);
        setError('');
    };

    const handleBack = () => {
        setStep(step - 1);
        setError('');
    };

    const handleUseBoard = () => {
        if (generatedBoard) {
            onGenerate(generatedBoard);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ai-generator-overlay"
        >
            <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="ai-generator-modal"
            >
                {/* Header */}
                <div className="modal-header">
                    <div className="header-content">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        <h2>AI Travel Mood Board Generator</h2>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Preferences</span>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Generate</span>
                    </div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Preview</span>
                    </div>
                </div>

                {/* Step 1: Preferences */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="step-content"
                    >
                        <div className="preferences-form">
                            <div className="form-group">
                                <label>
                                    <MapPin className="w-5 h-5" />
                                    Where do you want to go?
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Paris, Bali, New York..."
                                    value={preferences.destination}
                                    onChange={(e) => handlePreferenceChange('destination', e.target.value)}
                                    className="destination-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <DollarSign className="w-5 h-5" />
                                    What's your budget?
                                </label>
                                <div className="options-grid">
                                    {budgetOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handlePreferenceChange('budget', option.value)}
                                            className={`option-btn ${preferences.budget === option.value ? 'selected' : ''}`}
                                        >
                                            <span className="option-icon">{option.icon}</span>
                                            <span className="option-label">{option.label}</span>
                                            <span className="option-description">{option.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <Palette className="w-5 h-5" />
                                    What's your travel style?
                                </label>
                                <div className="options-grid">
                                    {styleOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handlePreferenceChange('style', option.value)}
                                            className={`option-btn ${preferences.style === option.value ? 'selected' : ''}`}
                                        >
                                            <span className="option-icon">{option.icon}</span>
                                            <span className="option-label">{option.label}</span>
                                            <span className="option-description">{option.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <Calendar className="w-5 h-5" />
                                        How long?
                                    </label>
                                    <select
                                        value={preferences.duration}
                                        onChange={(e) => handlePreferenceChange('duration', e.target.value)}
                                        className="select-input"
                                    >
                                        {durationOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <Users className="w-5 h-5" />
                                        Who's coming?
                                    </label>
                                    <select
                                        value={preferences.companions}
                                        onChange={(e) => handlePreferenceChange('companions', e.target.value)}
                                        className="select-input"
                                    >
                                        {companionOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.icon} {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>What interests you most?</label>
                                <div className="interests-grid">
                                    {['Culture', 'Food', 'Nature', 'Adventure', 'Relaxation', 'Photography', 'Shopping', 'History'].map((interest) => (
                                        <button
                                            key={interest}
                                            onClick={() => handleInterestToggle(interest.toLowerCase())}
                                            className={`interest-btn ${preferences.interests.includes(interest.toLowerCase()) ? 'selected' : ''}`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>What's your mood?</label>
                                <div className="mood-grid">
                                    {moodOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handlePreferenceChange('mood', option.value)}
                                            className={`mood-btn ${preferences.mood === option.value ? 'selected' : ''}`}
                                            style={{ '--mood-color': option.color }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Generation */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="step-content"
                    >
                        <div className="generation-step">
                            <div className="generation-header">
                                <Wand2 className="w-16 h-16 text-purple-500 mb-4" />
                                <h3>Creating Your Perfect Mood Board</h3>
                                <p>Our AI is analyzing your preferences and crafting a personalized travel experience...</p>
                            </div>

                            <div className="preferences-summary">
                                <h4>Your Preferences:</h4>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Destination:</span>
                                        <span className="summary-value">{preferences.destination || 'Anywhere amazing'}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Style:</span>
                                        <span className="summary-value">{preferences.style}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Budget:</span>
                                        <span className="summary-value">{preferences.budget}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Duration:</span>
                                        <span className="summary-value">{preferences.duration}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Companions:</span>
                                        <span className="summary-value">{preferences.companions}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Mood:</span>
                                        <span className="summary-value">{preferences.mood}</span>
                                    </div>
                                </div>
                            </div>

                            {isGenerating && (
                                <div className="generation-status">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                    <p>Generating your personalized mood board...</p>
                                </div>
                            )}

                            {error && (
                                <div className="error-message">
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Preview */}
                {step === 3 && generatedBoard && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="step-content"
                    >
                        <div className="preview-step">
                            <div className="board-preview">
                                <h3>{generatedBoard.title}</h3>

                                <div className="color-palette">
                                    <h4>Color Palette</h4>
                                    <div className="colors-grid">
                                        {generatedBoard.colorPalette.map((color, index) => (
                                            <div
                                                key={index}
                                                className="color-swatch"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="board-details">
                                    <div className="detail-section">
                                        <h4>Themes</h4>
                                        <div className="tags-grid">
                                            {generatedBoard.themes.map((theme, index) => (
                                                <span key={index} className="tag">{theme}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Activities</h4>
                                        <div className="tags-grid">
                                            {generatedBoard.activities.map((activity, index) => (
                                                <span key={index} className="tag">{activity}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Accommodations</h4>
                                        <div className="tags-grid">
                                            {generatedBoard.accommodations.map((acc, index) => (
                                                <span key={index} className="tag">{acc}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Dining</h4>
                                        <div className="tags-grid">
                                            {generatedBoard.dining.map((dining, index) => (
                                                <span key={index} className="tag">{dining}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="board-description">
                                    <h4>Description</h4>
                                    <p>{generatedBoard.description}</p>
                                </div>

                                <div className="board-vibe">
                                    <h4>Overall Vibe</h4>
                                    <p className="vibe-text">{generatedBoard.vibe}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="error-display">
                        <p>{error}</p>
                    </div>
                )}

                {/* Navigation */}
                <div className="modal-navigation">
                    {step > 1 && (
                        <button onClick={handleBack} className="nav-btn secondary">
                            Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button onClick={handleNext} className="nav-btn primary">
                            {step === 2 ? 'Generate Mood Board' : 'Next'}
                        </button>
                    ) : (
                        <button onClick={handleUseBoard} className="nav-btn primary">
                            Use This Mood Board
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AIGenerator;

