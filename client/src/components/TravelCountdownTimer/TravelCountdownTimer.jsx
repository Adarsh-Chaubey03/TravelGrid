import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Share2, Settings, Bell } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import CountdownTimer from './CountdownTimer';
import DailyTravelTips from './DailyTravelTips';
import SocialSharing from './SocialSharing';
import CountdownSettings from './CountdownSettings';
import './TravelCountdownTimer.css';

const TravelCountdownTimer = ({ trips = [], onTripUpdate }) => {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [userPreferences, setUserPreferences] = useState(() => {
        const saved = localStorage.getItem('countdownPreferences');
        return saved ? JSON.parse(saved) : {
            theme: 'default',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notifications: true,
            socialSharing: true
        };
    });

    // Filter upcoming trips and sort by departure date
    const upcomingTrips = trips
        .filter(trip => trip.startDate && new Date(trip.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    useEffect(() => {
        if (upcomingTrips.length > 0 && !selectedTrip) {
            setSelectedTrip(upcomingTrips[0]);
        }
    }, [upcomingTrips, selectedTrip]);

    useEffect(() => {
        localStorage.setItem('countdownPreferences', JSON.stringify(userPreferences));
    }, [userPreferences]);

    const handleTripSelect = (trip) => {
        setSelectedTrip(trip);
    };

    const handlePreferencesUpdate = (newPreferences) => {
        setUserPreferences(prev => ({ ...prev, ...newPreferences }));
    };

    if (upcomingTrips.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="countdown-container empty-state"
            >
                <div className="empty-state-content">
                    <Calendar className="empty-icon" />
                    <h3>No Upcoming Trips</h3>
                    <p>Plan your next adventure to see the countdown timer in action!</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="countdown-container">
            {/* Trip Selector */}
            <div className="trip-selector">
                <h2 className="section-title">Upcoming Trips</h2>
                <div className="trip-cards">
                    {upcomingTrips.map((trip) => (
                        <motion.div
                            key={trip._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`trip-card ${selectedTrip?._id === trip._id ? 'active' : ''}`}
                            onClick={() => handleTripSelect(trip)}
                        >
                            <MapPin className="trip-icon" />
                            <div className="trip-info">
                                <h4>{trip.destination}</h4>
                                <p>{trip.country}</p>
                                <span className="trip-date">
                                    {format(new Date(trip.startDate), 'MMM dd, yyyy')}
                                </span>
                            </div>
                            <div className="trip-countdown">
                                {formatDistanceToNow(new Date(trip.startDate), { addSuffix: true })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Countdown Display */}
            {selectedTrip && (
                <motion.div
                    key={selectedTrip._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="main-countdown"
                >
                    <div className="countdown-header">
                        <div className="trip-details">
                            <h2 className="destination-title">
                                {selectedTrip.destination}, {selectedTrip.country}
                            </h2>
                            <div className="trip-meta">
                                <span className="trip-duration">
                                    {selectedTrip.numberOfDays} Days
                                </span>
                                <span className="trip-date">
                                    {format(new Date(selectedTrip.startDate), 'EEEE, MMMM dd, yyyy')}
                                </span>
                            </div>
                        </div>
                        <div className="countdown-actions">
                            <button
                                className="action-btn settings-btn"
                                onClick={() => setShowSettings(!showSettings)}
                                title="Countdown Settings"
                            >
                                <Settings />
                            </button>
                            <button
                                className="action-btn notification-btn"
                                title="Notification Settings"
                            >
                                <Bell />
                            </button>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <CountdownTimer
                        targetDate={selectedTrip.startDate}
                        theme={userPreferences.theme}
                        onComplete={() => {
                            // Handle countdown completion
                            console.log('Countdown completed for:', selectedTrip.destination);
                        }}
                    />

                    {/* Daily Travel Tips */}
                    <DailyTravelTips
                        destination={selectedTrip.destination}
                        daysUntilTrip={Math.ceil((new Date(selectedTrip.startDate) - new Date()) / (1000 * 60 * 60 * 24))}
                        interests={selectedTrip.interests}
                    />

                    {/* Social Sharing */}
                    {userPreferences.socialSharing && (
                        <SocialSharing
                            trip={selectedTrip}
                            countdownData={{
                                destination: selectedTrip.destination,
                                country: selectedTrip.country,
                                startDate: selectedTrip.startDate,
                                daysUntil: Math.ceil((new Date(selectedTrip.startDate) - new Date()) / (1000 * 60 * 60 * 24))
                            }}
                        />
                    )}
                </motion.div>
            )}

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <CountdownSettings
                        preferences={userPreferences}
                        onUpdate={handlePreferencesUpdate}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TravelCountdownTimer;
