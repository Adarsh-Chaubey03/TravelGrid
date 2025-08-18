import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Facebook, Instagram, Copy, Check, X } from 'lucide-react';
import './SocialSharing.css';

const SocialSharing = ({ trip, countdownData }) => {
    const [showSharing, setShowSharing] = useState(false);
    const [customMessage, setCustomMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState(null);

    // Generate default message based on countdown data
    const generateDefaultMessage = () => {
        const { destination, country, daysUntil } = countdownData;
        if (daysUntil === 0) {
            return `🎉 Today is the day! I'm finally traveling to ${destination}, ${country}! ✈️ #TravelGrid #Adventure`;
        } else if (daysUntil === 1) {
            return `🚀 Only 1 day until my trip to ${destination}, ${country}! Can't wait! 🌍 #TravelGrid #Countdown`;
        } else if (daysUntil <= 7) {
            return `⏰ ${daysUntil} days until my adventure in ${destination}, ${country}! The excitement is real! 🎯 #TravelGrid #TravelCountdown`;
        } else {
            return `📅 ${daysUntil} days until I explore ${destination}, ${country}! Starting the countdown! 🗺️ #TravelGrid #TravelPlanning`;
        }
    };

    // Initialize custom message
    useState(() => {
        setCustomMessage(generateDefaultMessage());
    });

    const socialPlatforms = [
        {
            name: 'Twitter',
            icon: Twitter,
            color: '#1DA1F2',
            url: 'https://twitter.com/intent/tweet',
            params: {
                text: customMessage,
                hashtags: 'TravelGrid,Travel,Adventure'
            }
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: '#1877F2',
            url: 'https://www.facebook.com/sharer/sharer.php',
            params: {
                u: window.location.href,
                quote: customMessage
            }
        },
        {
            name: 'Instagram',
            icon: Instagram,
            color: '#E4405F',
            url: 'https://www.instagram.com',
            params: {},
            note: 'Copy message to share on Instagram'
        }
    ];

    const handleShare = (platform) => {
        setSelectedPlatform(platform);

        if (platform.name === 'Instagram') {
            // For Instagram, just copy the message
            handleCopyMessage();
            return;
        }

        const params = new URLSearchParams(platform.params);
        const shareUrl = `${platform.url}?${params.toString()}`;

        // Open in new window
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const handleCopyMessage = async () => {
        try {
            await navigator.clipboard.writeText(customMessage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy message:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = customMessage;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleMessageChange = (e) => {
        setCustomMessage(e.target.value);
    };

    const generatePreviewImage = () => {
        // This would typically generate a custom image with countdown data
        // For now, we'll use a placeholder approach
        return {
            url: trip.image || '/public/paris.jpeg', // Use trip image or default
            alt: `Countdown to ${trip.destination}`
        };
    };

    const previewImage = generatePreviewImage();

    return (
        <div className="social-sharing">
            <div className="sharing-header">
                <Share2 className="sharing-icon" />
                <h3>Share Your Excitement</h3>
                <button
                    className="toggle-sharing-btn"
                    onClick={() => setShowSharing(!showSharing)}
                >
                    {showSharing ? <X /> : <Share2 />}
                </button>
            </div>

            {showSharing && (
                <motion.div
                    className="sharing-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Message Customization */}
                    <div className="message-customization">
                        <label htmlFor="custom-message">Customize your message:</label>
                        <textarea
                            id="custom-message"
                            value={customMessage}
                            onChange={handleMessageChange}
                            placeholder="Write your own message..."
                            maxLength={280}
                            rows={3}
                        />
                        <div className="message-info">
                            <span className="char-count">{customMessage.length}/280</span>
                            <button
                                className="reset-message-btn"
                                onClick={() => setCustomMessage(generateDefaultMessage())}
                            >
                                Reset to Default
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="share-preview">
                        <h4>Preview:</h4>
                        <div className="preview-card">
                            <div className="preview-image">
                                <img src={previewImage.url} alt={previewImage.alt} loading="lazy"  />
                                <div className="preview-overlay">
                                    <span className="countdown-preview">
                                        {countdownData.daysUntil === 0
                                            ? "TODAY!"
                                            : `${countdownData.daysUntil} days`
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="preview-text">
                                <p>{customMessage}</p>
                                <div className="preview-meta">
                                    <span className="destination-preview">
                                        {trip.destination}, {trip.country}
                                    </span>
                                    <span className="date-preview">
                                        {new Date(trip.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Platform Buttons */}
                    <div className="social-platforms">
                        <h4>Share on:</h4>
                        <div className="platform-buttons">
                            {socialPlatforms.map((platform) => {
                                const Icon = platform.icon;
                                return (
                                    <motion.button
                                        key={platform.name}
                                        className="platform-btn"
                                        style={{ '--platform-color': platform.color }}
                                        onClick={() => handleShare(platform)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={`Share on ${platform.name}`}
                                    >
                                        <Icon className="platform-icon" />
                                        <span>{platform.name}</span>
                                        {platform.note && (
                                            <span className="platform-note">{platform.note}</span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Copy Message */}
                    <div className="copy-section">
                        <button
                            className={`copy-btn ${copied ? 'copied' : ''}`}
                            onClick={handleCopyMessage}
                        >
                            {copied ? <Check /> : <Copy />}
                            {copied ? 'Copied!' : 'Copy Message'}
                        </button>
                    </div>

                    {/* Share Statistics */}
                    <div className="share-stats">
                        <div className="stat-item">
                            <span className="stat-label">Trip Destination:</span>
                            <span className="stat-value">{trip.destination}, {trip.country}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Days Until Trip:</span>
                            <span className="stat-value">{countdownData.daysUntil}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Trip Duration:</span>
                            <span className="stat-value">{trip.numberOfDays} days</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SocialSharing;
