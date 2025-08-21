import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Clock, Bell, Globe, X, Save, RotateCcw } from 'lucide-react';
import './CountdownSettings.css';

const CountdownSettings = ({ preferences, onUpdate, onClose }) => {
    const [localPreferences, setLocalPreferences] = useState({ ...preferences });
    const [activeTab, setActiveTab] = useState('appearance');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const tabs = [
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'timezone', label: 'Timezone', icon: Globe },
        { id: 'advanced', label: 'Advanced', icon: Settings }
    ];

    const themes = [
        { id: 'default', name: 'Default', preview: 'bg-gradient-to-r from-pink-500 to-purple-600' },
        { id: 'ocean', name: 'Ocean', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
        { id: 'sunset', name: 'Sunset', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
        { id: 'forest', name: 'Forest', preview: 'bg-gradient-to-r from-green-500 to-emerald-500' },
        { id: 'midnight', name: 'Midnight', preview: 'bg-gradient-to-r from-gray-800 to-purple-900' },
        { id: 'custom', name: 'Custom', preview: 'bg-gradient-to-r from-indigo-500 to-pink-500' }
    ];

    const timezones = [
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT/BST)' },
        { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
        { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' }
    ];

    const notificationTypes = [
        { id: 'push', label: 'Push Notifications', description: 'Receive notifications in your browser' },
        { id: 'email', label: 'Email Reminders', description: 'Get email notifications for important milestones' },
        { id: 'sound', label: 'Sound Alerts', description: 'Play sounds for countdown milestones' },
        { id: 'desktop', label: 'Desktop Notifications', description: 'Show desktop notifications' }
    ];

    const handlePreferenceChange = (key, value) => {
        setLocalPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        onUpdate(localPreferences);
        onClose();
    };

    const handleReset = () => {
        const defaultPreferences = {
            theme: 'default',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notifications: true,
            socialSharing: true,
            soundEnabled: false,
            emailNotifications: false,
            pushNotifications: true,
            desktopNotifications: false,
            countdownFormat: 'detailed',
            showProgressBar: true,
            showMotivationalMessages: true,
            autoSwitchTrips: true
        };
        setLocalPreferences(defaultPreferences);
        setShowResetConfirm(false);
    };

    const handleCancel = () => {
        setLocalPreferences({ ...preferences });
        onClose();
    };

    const renderAppearanceTab = () => (
        <div className="settings-tab-content">
            <div className="setting-group">
                <h4>Theme Selection</h4>
                <div className="theme-grid">
                    {themes.map((theme) => (
                        <motion.div
                            key={theme.id}
                            className={`theme-option ${localPreferences.theme === theme.id ? 'selected' : ''}`}
                            onClick={() => handlePreferenceChange('theme', theme.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className={`theme-preview ${theme.preview}`}></div>
                            <span className="theme-name">{theme.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="setting-group">
                <h4>Display Options</h4>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.showProgressBar}
                            onChange={(e) => handlePreferenceChange('showProgressBar', e.target.checked)}
                        />
                        Show Progress Bar
                    </label>
                    <span className="setting-description">Display a visual progress bar showing trip completion</span>
                </div>

                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.showMotivationalMessages}
                            onChange={(e) => handlePreferenceChange('showMotivationalMessages', e.target.checked)}
                        />
                        Show Motivational Messages
                    </label>
                    <span className="setting-description">Display encouraging messages during countdown</span>
                </div>

                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.autoSwitchTrips}
                            onChange={(e) => handlePreferenceChange('autoSwitchTrips', e.target.checked)}
                        />
                        Auto-switch Between Trips
                    </label>
                    <span className="setting-description">Automatically switch to next upcoming trip</span>
                </div>
            </div>

            <div className="setting-group">
                <h4>Countdown Format</h4>
                <div className="setting-item">
                    <select
                        value={localPreferences.countdownFormat}
                        onChange={(e) => handlePreferenceChange('countdownFormat', e.target.value)}
                        className="setting-select"
                    >
                        <option value="detailed">Detailed (Days, Hours, Minutes, Seconds)</option>
                        <option value="compact">Compact (Days, Hours)</option>
                        <option value="simple">Simple (Days only)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="settings-tab-content">
            <div className="setting-group">
                <h4>Notification Types</h4>
                {notificationTypes.map((type) => (
                    <div key={type.id} className="setting-item">
                        <label className="setting-label">
                            <input
                                type="checkbox"
                                checked={localPreferences[`${type.id}Notifications`] || false}
                                onChange={(e) => handlePreferenceChange(`${type.id}Notifications`, e.target.checked)}
                            />
                            {type.label}
                        </label>
                        <span className="setting-description">{type.description}</span>
                    </div>
                ))}
            </div>

            <div className="setting-group">
                <h4>Notification Schedule</h4>
                <div className="setting-item">
                    <label className="setting-label">Remind me at:</label>
                    <div className="notification-schedule">
                        <label className="schedule-option">
                            <input
                                type="checkbox"
                                checked={localPreferences.notify1Week}
                                onChange={(e) => handlePreferenceChange('notify1Week', e.target.checked)}
                            />
                            1 week before
                        </label>
                        <label className="schedule-option">
                            <input
                                type="checkbox"
                                checked={localPreferences.notify1Day}
                                onChange={(e) => handlePreferenceChange('notify1Day', e.target.checked)}
                            />
                            1 day before
                        </label>
                        <label className="schedule-option">
                            <input
                                type="checkbox"
                                checked={localPreferences.notify1Hour}
                                onChange={(e) => handlePreferenceChange('notify1Hour', e.target.checked)}
                            />
                            1 hour before
                        </label>
                    </div>
                </div>
            </div>

            <div className="setting-group">
                <h4>Sound Settings</h4>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.soundEnabled}
                            onChange={(e) => handlePreferenceChange('soundEnabled', e.target.checked)}
                        />
                        Enable Sound Alerts
                    </label>
                    <span className="setting-description">Play sounds for important countdown milestones</span>
                </div>
            </div>
        </div>
    );

    const renderTimezoneTab = () => (
        <div className="settings-tab-content">
            <div className="setting-group">
                <h4>Current Timezone</h4>
                <div className="current-timezone">
                    <Clock className="timezone-icon" />
                    <span className="timezone-display">
                        {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </span>
                </div>
            </div>

            <div className="setting-group">
                <h4>Select Timezone</h4>
                <div className="setting-item">
                    <select
                        value={localPreferences.timezone}
                        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                        className="setting-select timezone-select"
                    >
                        {timezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </select>
                    <span className="setting-description">
                        Choose your preferred timezone for countdown calculations
                    </span>
                </div>
            </div>

            <div className="setting-group">
                <h4>Time Display</h4>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.showLocalTime}
                            onChange={(e) => handlePreferenceChange('showLocalTime', e.target.checked)}
                        />
                        Show Local Time
                    </label>
                    <span className="setting-description">Display destination local time alongside countdown</span>
                </div>
            </div>
        </div>
    );

    const renderAdvancedTab = () => (
        <div className="settings-tab-content">
            <div className="setting-group">
                <h4>Data Management</h4>
                <div className="setting-item">
                    <button
                        className="danger-btn"
                        onClick={() => setShowResetConfirm(true)}
                    >
                        <RotateCcw className="btn-icon" />
                        Reset All Settings
                    </button>
                    <span className="setting-description">
                        Reset all countdown preferences to default values
                    </span>
                </div>
            </div>

            <div className="setting-group">
                <h4>Performance</h4>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.optimizePerformance}
                            onChange={(e) => handlePreferenceChange('optimizePerformance', e.target.checked)}
                        />
                        Optimize Performance
                    </label>
                    <span className="setting-description">
                        Reduce animations and effects for better performance on slower devices
                    </span>
                </div>
            </div>

            <div className="setting-group">
                <h4>Accessibility</h4>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={localPreferences.highContrast}
                            onChange={(e) => handlePreferenceChange('highContrast', e.target.checked)}
                        />
                        High Contrast Mode
                    </label>
                    <span className="setting-description">
                        Enable high contrast colors for better visibility
                    </span>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appearance':
                return renderAppearanceTab();
            case 'notifications':
                return renderNotificationsTab();
            case 'timezone':
                return renderTimezoneTab();
            case 'advanced':
                return renderAdvancedTab();
            default:
                return renderAppearanceTab();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="countdown-settings-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="countdown-settings-modal"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="settings-header">
                        <div className="header-content">
                            <Settings className="header-icon" />
                            <h2>Countdown Settings</h2>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="settings-tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon className="tab-icon" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="settings-content">
                        {renderTabContent()}
                    </div>

                    {/* Footer Actions */}
                    <div className="settings-footer">
                        <button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="save-btn" onClick={handleSave}>
                            <Save className="btn-icon" />
                            Save Changes
                        </button>
                    </div>
                </motion.div>

                {/* Reset Confirmation Modal */}
                <AnimatePresence>
                    {showResetConfirm && (
                        <motion.div
                            className="reset-confirm-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="reset-confirm-modal"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <h3>Reset Settings?</h3>
                                <p>This will reset all countdown preferences to their default values. This action cannot be undone.</p>
                                <div className="confirm-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowResetConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="danger-btn"
                                        onClick={handleReset}
                                    >
                                        Reset All Settings
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};

export default CountdownSettings;
