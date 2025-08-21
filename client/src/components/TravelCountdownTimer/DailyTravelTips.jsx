import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Calendar, MapPin, Clock, Star } from 'lucide-react';
import './DailyTravelTips.css';

const DailyTravelTips = ({ destination, daysUntilTrip, interests = [] }) => {
    const [currentTip, setCurrentTip] = useState(null);
    const [tipIndex, setTipIndex] = useState(0);
    const [showAllTips, setShowAllTips] = useState(false);

    // Comprehensive travel tips database
    const travelTipsDatabase = {
        general: [
            {
                id: 'general-1',
                category: 'Planning',
                tip: 'Start packing at least 3 days before departure to avoid last-minute stress',
                icon: '📦',
                priority: 'high'
            },
            {
                id: 'general-2',
                category: 'Documents',
                tip: 'Make digital copies of all important documents and store them securely',
                icon: '📱',
                priority: 'high'
            },
            {
                id: 'general-3',
                category: 'Health',
                tip: 'Check if you need any vaccinations for your destination',
                icon: '💉',
                priority: 'medium'
            },
            {
                id: 'general-4',
                category: 'Money',
                tip: 'Notify your bank about international travel to avoid card blocks',
                icon: '💳',
                priority: 'medium'
            },
            {
                id: 'general-5',
                category: 'Insurance',
                tip: 'Ensure your travel insurance covers all planned activities',
                icon: '🛡️',
                priority: 'high'
            }
        ],
        destination: {
            'Paris': [
                {
                    id: 'paris-1',
                    category: 'Culture',
                    tip: 'Visit the Louvre on Wednesday and Friday evenings for fewer crowds',
                    icon: '🎨',
                    priority: 'medium'
                },
                {
                    id: 'paris-2',
                    category: 'Food',
                    tip: 'Try local bakeries for authentic croissants and baguettes',
                    icon: '🥐',
                    priority: 'high'
                },
                {
                    id: 'paris-3',
                    category: 'Transport',
                    tip: 'Get a Paris Visite card for unlimited metro and bus travel',
                    icon: '🚇',
                    priority: 'medium'
                }
            ],
            'Tokyo': [
                {
                    id: 'tokyo-1',
                    category: 'Culture',
                    tip: 'Visit temples early morning to avoid crowds and experience tranquility',
                    icon: '⛩️',
                    priority: 'high'
                },
                {
                    id: 'tokyo-2',
                    category: 'Food',
                    tip: 'Try ramen at local shops - they often have the best flavors',
                    icon: '🍜',
                    priority: 'high'
                },
                {
                    id: 'tokyo-3',
                    category: 'Transport',
                    tip: 'Get a Suica or Pasmo card for convenient public transportation',
                    icon: '🚅',
                    priority: 'high'
                }
            ],
            'New York': [
                {
                    id: 'nyc-1',
                    category: 'Culture',
                    tip: 'Visit museums on free admission days to save money',
                    icon: '🏛️',
                    priority: 'medium'
                },
                {
                    id: 'nyc-2',
                    category: 'Food',
                    tip: 'Try food trucks and local delis for authentic NYC flavors',
                    icon: '🌭',
                    priority: 'medium'
                },
                {
                    id: 'nyc-3',
                    category: 'Transport',
                    tip: 'Get a MetroCard for subway and bus access throughout the city',
                    icon: '🚇',
                    priority: 'high'
                }
            ]
        },
        timeBased: {
            '7+': [
                {
                    id: 'time-7plus-1',
                    category: 'Planning',
                    tip: 'Research and book popular attractions in advance',
                    icon: '🎫',
                    priority: 'medium'
                },
                {
                    id: 'time-7plus-2',
                    category: 'Accommodation',
                    tip: 'Book your accommodation early for better rates and availability',
                    icon: '🏨',
                    priority: 'high'
                }
            ],
            '3-6': [
                {
                    id: 'time-3-6-1',
                    category: 'Packing',
                    tip: 'Start organizing your luggage and check weather forecasts',
                    icon: '🌤️',
                    priority: 'medium'
                },
                {
                    id: 'time-3-6-2',
                    category: 'Transport',
                    tip: 'Confirm all transportation bookings and check-in times',
                    icon: '✈️',
                    priority: 'high'
                }
            ],
            '1-2': [
                {
                    id: 'time-1-2-1',
                    category: 'Final Prep',
                    tip: 'Double-check all documents and pack essential items',
                    icon: '✅',
                    priority: 'high'
                },
                {
                    id: 'time-1-2-2',
                    category: 'Charging',
                    tip: 'Charge all electronic devices and pack chargers',
                    icon: '🔌',
                    priority: 'high'
                }
            ],
            '0': [
                {
                    id: 'time-0-1',
                    category: 'Departure',
                    tip: 'Arrive at the airport/station 2-3 hours before departure',
                    icon: '🛫',
                    priority: 'critical'
                },
                {
                    id: 'time-0-2',
                    category: 'Final Check',
                    tip: 'Ensure you have all necessary items and documents',
                    icon: '🎒',
                    priority: 'critical'
                }
            ]
        }
    };

    const getRelevantTips = () => {
        let tips = [...travelTipsDatabase.general];

        // Add destination-specific tips
        if (destination && travelTipsDatabase.destination[destination]) {
            tips = [...tips, ...travelTipsDatabase.destination[destination]];
        }

        // Add time-based tips
        let timeCategory = '7+';
        if (daysUntilTrip <= 0) timeCategory = '0';
        else if (daysUntilTrip <= 2) timeCategory = '1-2';
        else if (daysUntilTrip <= 6) timeCategory = '3-6';

        if (travelTipsDatabase.timeBased[timeCategory]) {
            tips = [...tips, ...travelTipsDatabase.timeBased[timeCategory]];
        }

        // Add interest-based tips if available
        if (interests && interests.length > 0) {
            const interestTips = interests.map(interest => ({
                id: `interest-${interest}`,
                category: 'Personal Interest',
                tip: `Don't forget to explore ${interest.toLowerCase()} opportunities in ${destination}`,
                icon: '⭐',
                priority: 'medium'
            }));
            tips = [...tips, ...interestTips];
        }

        return tips;
    };

    const tips = getRelevantTips();

    useEffect(() => {
        if (tips.length > 0) {
            setCurrentTip(tips[0]);
        }
    }, [destination, daysUntilTrip, interests]);

    useEffect(() => {
        if (tips.length > 0) {
            const interval = setInterval(() => {
                setTipIndex(prev => (prev + 1) % tips.length);
                setCurrentTip(tips[tipIndex]);
            }, 8000); // Change tip every 8 seconds

            return () => clearInterval(interval);
        }
    }, [tips, tipIndex]);

    const handleTipChange = (direction) => {
        if (direction === 'next') {
            setTipIndex(prev => (prev + 1) % tips.length);
        } else {
            setTipIndex(prev => (prev - 1 + tips.length) % tips.length);
        }
        setCurrentTip(tips[tipIndex]);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'priority-critical';
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    if (!currentTip) return null;

    return (
        <div className="daily-travel-tips">
            <div className="tips-header">
                <Lightbulb className="tips-icon" />
                <h3>Daily Travel Tips</h3>
                <button
                    className="show-all-btn"
                    onClick={() => setShowAllTips(!showAllTips)}
                >
                    {showAllTips ? 'Show Current' : 'Show All'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!showAllTips ? (
                    <motion.div
                        key={currentTip.id}
                        className="current-tip"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="tip-content">
                            <div className="tip-icon">{currentTip.icon}</div>
                            <div className="tip-text">
                                <p className="tip-message">{currentTip.tip}</p>
                                <div className="tip-meta">
                                    <span className={`tip-category ${getPriorityColor(currentTip.priority)}`}>
                                        {currentTip.category}
                                    </span>
                                    <span className="tip-priority">{currentTip.priority}</span>
                                </div>
                            </div>
                        </div>

                        <div className="tip-navigation">
                            <button
                                className="nav-btn prev"
                                onClick={() => handleTipChange('prev')}
                                title="Previous Tip"
                            >
                                ←
                            </button>
                            <span className="tip-counter">
                                {tipIndex + 1} / {tips.length}
                            </span>
                            <button
                                className="nav-btn next"
                                onClick={() => handleTipChange('next')}
                                title="Next Tip"
                            >
                                →
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="all-tips"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="tips-grid">
                            {tips.map((tip, index) => (
                                <motion.div
                                    key={tip.id}
                                    className={`tip-card ${getPriorityColor(tip.priority)}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="tip-card-header">
                                        <span className="tip-card-icon">{tip.icon}</span>
                                        <span className={`tip-card-category ${getPriorityColor(tip.priority)}`}>
                                            {tip.category}
                                        </span>
                                    </div>
                                    <p className="tip-card-text">{tip.tip}</p>
                                    <div className="tip-card-footer">
                                        <span className="tip-card-priority">{tip.priority}</span>
                                        {index === tipIndex && <Star className="current-indicator" />}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Time-based reminder */}
            <div className="time-reminder">
                <Clock className="reminder-icon" />
                <span>
                    {daysUntilTrip > 0
                        ? `${daysUntilTrip} day${daysUntilTrip > 1 ? 's' : ''} until your trip to ${destination}!`
                        : `Today is the day! Have a fantastic trip to ${destination}!`
                    }
                </span>
            </div>
        </div>
    );
};

export default DailyTravelTips;
