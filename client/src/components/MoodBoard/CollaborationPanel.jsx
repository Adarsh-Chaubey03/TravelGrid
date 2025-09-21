import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    MessageCircle,
    Send,
    Video,
    Mic,
    MicOff,
    Phone,
    PhoneOff,
    MoreVertical,
    UserPlus,
    Settings,
    Share2,
    Copy,
    Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CollaborationPanel.css';

const CollaborationPanel = ({
    board,
    isOpen,
    onClose,
    collaborators = [],
    messages = [],
    setMessages,
    onAddMessage,
    onAddCollaborator
}) => {
    const [activeTab, setActiveTab] = useState('chat');
    const [newMessage, setNewMessage] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [showInviteForm, setShowInviteForm] = useState(false);

    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && onAddMessage) {
            onAddMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleCall = () => {
        setIsCallActive(!isCallActive);
        if (!isCallActive) {
            // Start call logic
            console.log('Starting call...');
        } else {
            // End call logic
            console.log('Ending call...');
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        setIsVideoOn(!isVideoOn);
    };

    const handleInvite = () => {
        if (inviteEmail.trim() && onAddCollaborator) {
            onAddCollaborator(inviteEmail, 'viewer');
            setInviteEmail('');
            setShowInviteForm(false);
        }
    };

    const shareBoard = () => {
        const shareData = {
            title: board.title || 'Travel Mood Board',
            text: 'Check out this amazing travel mood board!',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const downloadBoard = () => {
        // Here you would implement board export functionality
        console.log('Downloading board...');
        alert('Board export feature coming soon!');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'chat':
                return (
                    <div className="chat-tab">
                        <div className="messages-container">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.senderId === user?.id ? 'own' : ''} ${message.type}`}
                                >
                                    <div className="message-header">
                                        <span className="sender-name">{message.sender}</span>
                                        <span className="message-time">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="message-content">
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                rows={2}
                            />
                            <button aria-label="Search"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="send-btn"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );

            case 'collaborators':
                return (
                    <div className="collaborators-tab">
                        <div className="collaborators-header">
                            <h4>Active Collaborators</h4>
                            <button aria-label="Search"
                                onClick={() => setShowInviteForm(!showInviteForm)}
                                className="invite-btn"
                            >
                                <UserPlus className="w-4 h-4" />
                                Invite
                            </button>
                        </div>

                        {showInviteForm && (
                            <div className="invite-form">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="invite-input"
                                />
                                <div className="invite-actions">
                                    <button aria-label="Search"
                                        onClick={handleInvite}
                                        disabled={!inviteEmail.trim()}
                                        className="invite-submit-btn"
                                    >
                                        Send Invite
                                    </button>
                                    <button
                                        onClick={() => setShowInviteForm(false)}
                                        className="invite-cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="collaborators-list">
                            {collaborators.map((collaborator) => (
                                <div key={collaborator.id} className="collaborator-item">
                                    <div className="collaborator-avatar">
                                        <img src={collaborator.avatar} alt={collaborator.name} />
                                        <div className={`status-indicator ${collaborator.status}`} />
                                    </div>
                                    <div className="collaborator-info">
                                        <span className="collaborator-name">{collaborator.name}</span>
                                        <span className="collaborator-email">{collaborator.email}</span>
                                    </div>
                                    <div className="collaborator-actions">
                                        <button className="action-btn">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'call':
                return (
                    <div className="call-tab">
                        <div className="call-status">
                            {isCallActive ? (
                                <div className="call-active">
                                    <div className="call-participants">
                                        {collaborators.slice(0, 3).map((collaborator) => (
                                            <div key={collaborator.id} className="call-participant">
                                                <img src={collaborator.avatar} alt={collaborator.name} loading="lazy"  />
                                                <span>{collaborator.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="call-controls">
                                        <button aria-label="Search"
                                            onClick={toggleMute}
                                            className={`control-btn ${isMuted ? 'muted' : ''}`}
                                        >
                                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={toggleVideo}
                                            className={`control-btn ${!isVideoOn ? 'disabled' : ''}`}
                                        >
                                            {isVideoOn ? <Video className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={toggleCall}
                                            className="control-btn end-call"
                                        >
                                            <PhoneOff className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="call-inactive">
                                    <div className="call-placeholder">
                                        <Video className="w-16 h-16 text-gray-400" />
                                        <h4>Start a video call</h4>
                                        <p>Collaborate in real-time with your team</p>
                                        <button aria-label="Search"
                                            onClick={toggleCall}
                                            className="start-call-btn"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Start Call
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="collaboration-panel-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="collaboration-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Panel Header */}
                        <div className="panel-header">
                            <div className="header-content">
                                <h3>Collaboration</h3>
                                <span className="collaborator-count">
                                    {collaborators.length} active
                                </span>
                            </div>
                            <div className="header-actions">
                                <button onClick={shareBoard} className="action-btn" title="Share">
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button onClick={downloadBoard} className="action-btn" title="Download">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button onClick={onClose} className="close-btn">
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Panel Tabs */}
                        <div className="panel-tabs">
                            <button aria-label="Search"
                                onClick={() => setActiveTab('chat')}
                                className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat
                            </button>
                            <button aria-label="Search"
                                onClick={() => setActiveTab('collaborators')}
                                className={`tab-btn ${activeTab === 'collaborators' ? 'active' : ''}`}
                            >
                                <Users className="w-4 h-4" />
                                Team
                            </button>
                            <button
                                onClick={() => setActiveTab('call')}
                                className={`tab-btn ${activeTab === 'call' ? 'active' : ''}`}
                            >
                                <Video className="w-4 h-4" />
                                Call
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {renderTabContent()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CollaborationPanel;
