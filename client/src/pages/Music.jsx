import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Music, Upload, Play, Pause, SkipBack, SkipForward, Volume2, X, Heart, Search } from 'lucide-react';
import musicService from '../services/musicService';
import toast from 'react-hot-toast';

const MusicPage = () => {
    const { user, isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();

    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [selectedType, setSelectedType] = useState('all');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadData, setUploadData] = useState({
        title: '',
        artist: '',
        type: 'romantic',
        file: null
    });

    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    const musicTypes = [
        { value: 'all', label: 'All Songs', icon: '🎵' },
        { value: 'romantic', label: 'Romantic', icon: '💕' },
        { value: 'energetic', label: 'Energetic', icon: '⚡' },
        { value: 'relaxing', label: 'Relaxing', icon: '😌' },
        { value: 'adventure', label: 'Adventure', icon: '🗺️' },
        { value: 'party', label: 'Party', icon: '🎉' },
        { value: 'workout', label: 'Workout', icon: '💪' },
        { value: 'sleep', label: 'Sleep', icon: '😴' }
    ];

    // Fetch songs from API
    useEffect(() => {
        fetchSongs();
    }, [selectedType, searchQuery]);

    const fetchSongs = async () => {
        try {
            setIsLoading(true);
            const response = await musicService.getAllMusic(selectedType, 1, 50, searchQuery);
            if (response.success) {
                setSongs(response.data);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            toast.error('Failed to load songs');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSongs = songs;

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setUploadData(prev => ({ ...prev, file }));
        } else {
            toast.error('Please select a valid audio file');
        }
    };

    const handleUpload = async () => {
        if (!uploadData.title || !uploadData.artist || !uploadData.file) {
            toast.error('Please fill all fields and select a file');
            return;
        }

        // No authentication required for music uploads

        try {
            setIsLoading(true);

            // Get audio duration
            const duration = await musicService.getAudioDuration(uploadData.file);

            // Create form data
            const formData = musicService.createUploadFormData(
                uploadData.title,
                uploadData.artist,
                uploadData.type,
                uploadData.file
            );

            // Upload music without authentication
            const response = await musicService.uploadMusic(formData);

            if (response.success) {
                toast.success('Music uploaded successfully!');
                setSongs(prev => [response.data, ...prev]);
                setUploadData({ title: '', artist: '', type: 'romantic', file: null });
                setShowUploadForm(false);

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Error uploading music:', error);
            toast.error(error.message || 'Failed to upload music');
        } finally {
            setIsLoading(false);
        }
    };

    const playSong = async (song) => {
        try {
            setCurrentSong(song);
            setIsPlaying(true);

            // Increment play count
            await musicService.incrementPlayCount(song._id);

            if (audioRef.current) {
                console.log('Setting audio src to:', song.fileUrl);
                console.log('Full song object:', song);
                audioRef.current.src = song.fileUrl;

                // Add error handling for audio loading
                audioRef.current.addEventListener('error', (e) => {
                    console.error('Audio error:', e);
                    console.error('Audio error details:', audioRef.current.error);
                    console.error('Audio src:', audioRef.current.src);
                });

                audioRef.current.addEventListener('loadstart', () => {
                    console.log('Audio loading started');
                });

                audioRef.current.addEventListener('canplay', () => {
                    console.log('Audio can play');
                });

                audioRef.current.play();
            }
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const togglePlay = () => {
        if (currentSong) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        }
    };

    const nextSong = () => {
        if (currentSong) {
            const currentIndex = filteredSongs.findIndex(s => s._id === currentSong._id);
            const nextIndex = (currentIndex + 1) % filteredSongs.length;
            playSong(filteredSongs[nextIndex]);
        }
    };

    const previousSong = () => {
        if (currentSong) {
            const currentIndex = filteredSongs.findIndex(s => s._id === currentSong._id);
            const prevIndex = currentIndex === 0 ? filteredSongs.length - 1 : currentIndex - 1;
            playSong(filteredSongs[prevIndex]);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = e.target.value;
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const removeSong = async (songId) => {
        if (!isAuthenticated) {
            toast.error('Please login to remove songs');
            return;
        }

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            await musicService.deleteMusic(songId, token);

            setSongs(prev => prev.filter(s => s._id !== songId));

            if (currentSong?._id === songId) {
                setIsPlaying(false);
                setCurrentSong(null);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                }
            }

            toast.success('Song removed successfully');
        } catch (error) {
            console.error('Error removing song:', error);
            toast.error(error.message || 'Failed to remove song');
        }
    };

    const handleLike = async (songId) => {
        if (!isAuthenticated) {
            toast.error('Please login to like songs');
            return;
        }

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const response = await musicService.toggleLike(songId, token);

            if (response.success) {
                // Update the song in the list
                setSongs(prev => prev.map(song =>
                    song._id === songId
                        ? { ...song, likes: response.data.likes }
                        : song
                ));

                toast.success(response.message);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error(error.message || 'Failed to like song');
        }
    };

    return (
        <div className={`min-h-screen`}>
            {/* Hero Section */}
            <div className={`relative overflow-hidden`}>
                <div className="absolute inset-0 bg-pink-100"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-8">
                        <div className={`p-4 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-pink-900/70'} backdrop-blur-sm`}>
                            <Music className="w-16 h-16 text-pink-200" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-900 to-blue-800 bg-clip-text text-transparent">
                        Travel Music Hub
                    </h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Discover and share music for every travel mood. From romantic sunsets to adventurous hikes,
                        find the perfect soundtrack for your journey.
                    </p>
                    <button
                        onClick={() => setShowUploadForm(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-3 mx-auto"
                    >
                        <Upload className="w-6 h-6" />
                        Share Your Music
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for songs or artists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 
  focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all 
  ${isDarkMode
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-pink-50 border-pink-300 text-pink-900 placeholder-pink-400'
  }`}


                        />
                    </div>
                </div>

                {/* Type Filter */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Mood</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {musicTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setSelectedType(type.value)}
                                className={`px-6 py-3 cursor-pointer rounded-full font-medium transition-all transform hover:scale-105 ${selectedType === type.value
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : isDarkMode
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                    }`}
                            >
                                <span className="mr-2">{type.icon}</span>
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Music Player */}
                {currentSong && (
                    <div className={`mb-8 p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                                <Music className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{currentSong.title}</h3>
                                <p className="text-gray-500">{currentSong.artist}</p>
                                <p className="text-sm text-gray-400">Type: {currentSong.type}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mb-4">
                            <button
                                onClick={previousSong}
                                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                <SkipBack className="w-6 h-6" />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-110"
                            >
                                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                            </button>
                            <button
                                onClick={nextSong}
                                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                <SkipForward className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-3 justify-center">
                            <Volume2 className="w-5 h-5 text-gray-500" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading songs...</p>
                    </div>
                )}

                {/* Songs List */}
                {!isLoading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredSongs.map((song) => (
                            <div
                                key={song._id}
                                className={`p-6 rounded-2xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                                    } ${currentSong?._id === song._id ? 'ring-2 ring-purple-500' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                                        <Music className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleLike(song._id)}
                                            className={`p-2 rounded-full transition-colors ${song.likes?.includes(user?._id)
                                                ? 'bg-red-100 text-red-500'
                                                : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${song.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
                                        </button>
                                        {isAuthenticated && (song.addedBy === user?._id || user?.role === 'admin') && (
                                            <button
                                                onClick={() => removeSong(song._id)}
                                                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{song.title}</h3>
                                <p className="text-gray-500 mb-2">{song.artist}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${song.type === 'romantic' ? 'bg-pink-100 text-pink-800' :
                                        song.type === 'energetic' ? 'bg-yellow-100 text-yellow-800' :
                                            song.type === 'relaxing' ? 'bg-blue-100 text-blue-800' :
                                                song.type === 'adventure' ? 'bg-green-100 text-green-800' :
                                                    song.type === 'party' ? 'bg-purple-100 text-purple-800' :
                                                        song.type === 'workout' ? 'bg-orange-100 text-orange-800' :
                                                            song.type === 'sleep' ? 'bg-indigo-100 text-indigo-800' :
                                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {musicTypes.find(t => t.value === song.type)?.icon} {song.type}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                    <span>{song.duration}</span>
                                    <span>Added by {song.addedByUsername}</span>
                                </div>

                                <button
                                    onClick={() => playSong(song)}
                                    className={`w-full py-3 rounded-xl font-medium transition-all ${currentSong?._id === song._id
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                        : isDarkMode
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {currentSong?._id === song._id && isPlaying ? 'Now Playing' : 'Play'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredSongs.length === 0 && (
                    <div className="text-center py-12">
                        <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">No songs found</h3>
                        <p className="text-gray-400">Be the first to add a song for this mood!</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Share Your Music</h3>
                            <button
                                onClick={() => setShowUploadForm(false)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Song Title</label>
                                <input
                                    type="text"
                                    value={uploadData.title}
                                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter song title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Artist</label>
                                <input
                                    type="text"
                                    value={uploadData.artist}
                                    onChange={(e) => setUploadData(prev => ({ ...prev, artist: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter artist name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Music Type</label>
                                <select
                                    value={uploadData.type}
                                    onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    {musicTypes.slice(1).map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Audio File</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Supported formats: MP3, WAV, AAC, OGG, M4A, FLAC (Max 50MB)</p>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Uploading...' : 'Upload Song'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextSong}
                onError={() => {
                    setIsPlaying(false);
                    toast.error('Error playing song');
                }}
            />

            {/* Custom Slider Styles */}
            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
        }
      `}</style>
        </div>
    );
};

export default MusicPage;
