import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plane, MapPin, Calendar } from 'lucide-react';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, theme = 'default', onComplete }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [initialTotalSeconds, setInitialTotalSeconds] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
                setTotalSeconds(difference / 1000);

                if (initialTotalSeconds === 0) {
                    setInitialTotalSeconds(difference / 1000);
                }
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setTotalSeconds(0);
                onComplete?.();
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete, initialTotalSeconds]);

    const getProgressPercentage = () => {
        if (initialTotalSeconds === 0) return 0;
        return ((initialTotalSeconds - totalSeconds) / initialTotalSeconds) * 100;
    };

    const getTimeUnitClass = (value, unit) => {
        if (value === 0) return 'time-unit zero';
        if (value <= 1 && unit === 'days') return 'time-unit critical';
        if (value <= 6 && unit === 'hours') return 'time-unit warning';
        return 'time-unit';
    };

    const getThemeClass = () => {
        return `countdown-timer theme-${theme}`;
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    return (
        <motion.div
            className={getThemeClass()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Progress Bar */}
            <div className="countdown-progress">
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
                <span className="progress-text">
                    {Math.round(getProgressPercentage())}% Complete
                </span>
            </div>

            {/* Main Countdown Display */}
            <div className="countdown-display">
                <div className="countdown-header">
                    <Clock className="countdown-icon" />
                    <h3>Countdown to Departure</h3>
                </div>

                <div className="time-units">
                    <motion.div
                        className={getTimeUnitClass(timeLeft.days, 'days')}
                        whileHover={{ scale: 1.05 }}
                        key={`days-${timeLeft.days}`}
                    >
                        <div className="time-value">{formatNumber(timeLeft.days)}</div>
                        <div className="time-label">Days</div>
                    </motion.div>

                    <motion.div
                        className={getTimeUnitClass(timeLeft.hours, 'hours')}
                        whileHover={{ scale: 1.05 }}
                        key={`hours-${timeLeft.hours}`}
                    >
                        <div className="time-value">{formatNumber(timeLeft.hours)}</div>
                        <div className="time-label">Hours</div>
                    </motion.div>

                    <motion.div
                        className={getTimeUnitClass(timeLeft.minutes, 'minutes')}
                        whileHover={{ scale: 1.05 }}
                        key={`minutes-${timeLeft.minutes}`}
                    >
                        <div className="time-value">{formatNumber(timeLeft.minutes)}</div>
                        <div className="time-label">Minutes</div>
                    </motion.div>

                    <motion.div
                        className={getTimeUnitClass(timeLeft.seconds, 'seconds')}
                        whileHover={{ scale: 1.05 }}
                        key={`seconds-${timeLeft.seconds}`}
                    >
                        <div className="time-value">{formatNumber(timeLeft.seconds)}</div>
                        <div className="time-label">Seconds</div>
                    </motion.div>
                </div>

                {/* Trip Info */}
                <div className="trip-info-display">
                    <div className="info-item">
                        <Plane className="info-icon" />
                        <span>Departure: {new Date(targetDate).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                        <MapPin className="info-icon" />
                        <span>Destination: {targetDate}</span>
                    </div>
                </div>

                {/* Motivational Message */}
                {timeLeft.days > 0 && (
                    <motion.div
                        className="motivational-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <p>
                            {timeLeft.days > 7
                                ? "Your adventure awaits! Start planning and get excited!"
                                : timeLeft.days > 1
                                    ? "Almost there! Time to pack your bags!"
                                    : "Tomorrow is the day! Get ready for an amazing journey!"
                            }
                        </p>
                    </motion.div>
                )}

                {/* Critical Countdown Warnings */}
                {timeLeft.days === 0 && timeLeft.hours <= 6 && (
                    <motion.div
                        className="critical-warning"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="warning-icon">⚠️</div>
                        <p>Final hours! Make sure you have everything ready!</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default CountdownTimer;
