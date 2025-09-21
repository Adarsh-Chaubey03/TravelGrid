import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './TravelMoodMusicPlayer.css';

const TravelMoodMusicPlayer = () => {
    const { user, isAuthenticated } = useAuth();
    const [uploadedSongs, setUploadedSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    // Don't render if user is not logged in
    if (!isAuthenticated || !user) {
        return null;
    }

    // Don't render if player is hidden
    if (!isVisible) {
        return (
            <div className="music-player-toggle">
                <button
                    className="show-player-btn"
                    onClick={() => setIsVisible(true)}
                    title="Show Music Player"
                >
                    🎵
                </button>
            </div>
        );
    }

    // Handle file upload
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);

        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const song = {
                    id: Date.now() + Math.random(),
                    name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                    file: file,
                    url: URL.createObjectURL(file),
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                };

                setUploadedSongs(prev => [...prev, song]);

                // Set as current song if it's the first one
                if (uploadedSongs.length === 0) {
                    setCurrentSong(song);
                    setCurrentIndex(0);
                }
            }
        });
    };

    // Play/Pause toggle
    const togglePlay = () => {
        if (!currentSong) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Next song
    const nextSong = () => {
        if (uploadedSongs.length === 0) return;
        const nextIndex = (currentIndex + 1) % uploadedSongs.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(uploadedSongs[nextIndex]);

        if (isPlaying) {
            setTimeout(() => {
                audioRef.current.play();
            }, 100);
        }
    };

    // Previous song
    const previousSong = () => {
        if (uploadedSongs.length === 0) return;
        const prevIndex = currentIndex === 0 ? uploadedSongs.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        setCurrentSong(uploadedSongs[prevIndex]);

        if (isPlaying) {
            setTimeout(() => {
                audioRef.current.play();
            }, 100);
        }
    };

    // Handle time update
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    // Handle seek
    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Handle song end
    const handleSongEnd = () => {
        setIsPlaying(false);
        nextSong();
    };

    // Format time
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Remove song
    const removeSong = (songId) => {
        setUploadedSongs(prev => prev.filter(song => song.id !== songId));

        if (currentSong && currentSong.id === songId) {
            if (uploadedSongs.length > 1) {
                const newIndex = Math.min(currentIndex, uploadedSongs.length - 2);
                setCurrentIndex(newIndex);
                setCurrentSong(uploadedSongs[newIndex]);
            } else {
                setCurrentSong(null);
                setCurrentIndex(0);
                setIsPlaying(false);
            }
        }
    };

    return (
        <div className="travel-music-player">
            <div className="music-player-header">
                <h3>🎵 Song Upload Player</h3>
                <button
                    className="hide-player-btn"
                    onClick={() => setIsVisible(false)}
                    title="Hide Music Player"
                >
                    ✕
                </button>
            </div>

            <div className="music-player-content">
                {/* Upload Section */}
                <div className="upload-section">
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="audio/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        className="upload-btn"
                        onClick={() => fileInputRef.current.click()}
                    >
                        📁 Upload Songs
                    </button>
                    <p className="upload-info">Supports MP3, WAV, OGG, and other audio formats</p>
                </div>

                {/* Current Song Info */}
                {currentSong && (
                    <div className="current-track">
                        <div className="track-art">
                            <div className="art-placeholder">
                                🎵
                            </div>
                        </div>
                        <div className="track-info">
                            <h4>{currentSong.name}</h4>
                            <p>{currentSong.size}</p>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {currentSong && (
                    <div className="progress-container">
                        <span className="time-display">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                        />
                        <span className="time-display">{formatTime(duration)}</span>
                    </div>
                )}

                {/* Audio Controls */}
                <div className="audio-controls">
                    <button onClick={previousSong} className="control-btn" disabled={uploadedSongs.length === 0}>
                        ⏮
                    </button>
                    <button onClick={togglePlay} className="play-btn" disabled={!currentSong}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button onClick={nextSong} className="control-btn" disabled={uploadedSongs.length === 0}>
                        ⏭
                    </button>
                </div>

                {/* Volume Control */}
                <div className="volume-control">
                    <span>🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                    />
                </div>

                {/* Song List */}
                <div className="song-list">
                    <h4>Uploaded Songs ({uploadedSongs.length})</h4>
                    {uploadedSongs.length === 0 ? (
                        <p className="no-songs">No songs uploaded yet. Click "Upload Songs" to get started!</p>
                    ) : (
                        <div className="songs-container">
                            {uploadedSongs.map((song, index) => (
                                <div
                                    key={song.id}
                                    className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setCurrentSong(song);
                                        setCurrentIndex(index);
                                    }}
                                >
                                    <span className="song-number">{index + 1}</span>
                                    <span className="song-name">{song.name}</span>
                                    <span className="song-size">{song.size}</span>
                                    <button
                                        className="remove-song-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSong(song.id);
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hidden Audio Element */}
                {currentSong && (
                    <audio
                        ref={audioRef}
                        src={currentSong.url}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleSongEnd}
                        onLoadedMetadata={handleTimeUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default TravelMoodMusicPlayer;
