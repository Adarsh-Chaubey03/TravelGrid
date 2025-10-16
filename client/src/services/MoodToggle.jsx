// MoodToggle.jsx (JS version to avoid TS JSX lints)
import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Square, Sparkles, Flame, Heart, Leaf, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const songs = [
  { name: 'Nature Calls', src: '/music_tunes/song1.mp3' },
  { name: 'Dandelions', src: '/music_tunes/song2.mp3' },
  { name: 'Raga Hamsadhvani', src: '/music_tunes/song3.mp3' },
  { name: 'Voice of the Forest', src: '/music_tunes/song4.mp3' },
  { name: 'Carol of the Bells', src: '/music_tunes/song5.mp3' },
];

const MOOD_STORAGE_KEY = 'travelgrid:mood';

const moodConfigs = {
  relax: {
    label: 'Relax',
    icon: <Sparkles className="w-4 h-4" />,
    gradientLight: 'from-blue-100/70 via-white/60 to-cyan-100/70',
    gradientDark: 'from-slate-900/80 via-indigo-900/60 to-cyan-900/70',
    particles: 'waves',
    song: { name: 'Nature Calls', src: '/music_tunes/song1.mp3' },
  },
  adventure: {
    label: 'Adventure',
    icon: <Flame className="w-4 h-4" />,
    gradientLight: 'from-amber-100/70 via-white/60 to-pink-100/70',
    gradientDark: 'from-rose-900/80 via-fuchsia-900/60 to-amber-900/70',
    particles: 'sparks',
    song: { name: 'Raga Hamsadhvani', src: '/music_tunes/song3.mp3' },
  },
  romantic: {
    label: 'Romantic',
    icon: <Heart className="w-4 h-4" />,
    gradientLight: 'from-pink-100/70 via-white/60 to-purple-100/70',
    gradientDark: 'from-pink-900/80 via-rose-900/60 to-purple-900/70',
    particles: 'hearts',
    song: { name: 'Dandelions', src: '/music_tunes/song2.mp3' },
  },
  nature: {
    label: 'Nature',
    icon: <Leaf className="w-4 h-4" />,
    gradientLight: 'from-green-100/70 via-white/60 to-emerald-100/70',
    gradientDark: 'from-emerald-900/80 via-teal-900/60 to-lime-900/70',
    particles: 'leaves',
    song: { name: 'Voice of the Forest', src: '/music_tunes/song4.mp3' },
  },
  focus: {
    label: 'Focus',
    icon: <Target className="w-4 h-4" />,
    gradientLight: 'from-zinc-100/70 via-white/60 to-blue-100/70',
    gradientDark: 'from-black/80 via-slate-900/60 to-blue-900/70',
    particles: 'stars',
    song: { name: 'Carol of the Bells', src: '/music_tunes/song5.mp3' },
  },
};

const GradientText = ({ children, animationSpeed = 8 }) => {
  return (
    <div className="animated-gradient-text">
      <div className="text-content" style={{ animationDuration: `${animationSpeed}s` }}>
        {children}
      </div>
    </div>
  );
};

const AudioWave = () => (
  <div className="audio-wave-container">
    <div className="audio-wave">
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.0 },
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -15, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 },
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
};

function MoodToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongName, setCurrentSongName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mood, setMood] = useState(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Load persisted mood on mount, but DO NOT autoplay.
    const stored = localStorage.getItem(MOOD_STORAGE_KEY) || null;
    if (stored && moodConfigs[stored]) {
      setMood(stored);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const playSong = (songSrc, songName) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(songSrc);
    audio.loop = true;
    audio.play();
    audioRef.current = audio;
    setCurrentSong(songSrc);
    setCurrentSongName(songName);
    setIsPlaying(true);
    setMenuOpen(false);
  };

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setCurrentSong(null);
    setCurrentSongName(null);
    setIsPlaying(false);
  };

  const resetMood = () => {
    stopSong();
    setMood(null);
    localStorage.removeItem(MOOD_STORAGE_KEY);
  };

  const applyMood = (key) => {
    const cfg = moodConfigs[key];
    setMood(key);
    handleSongPlay(cfg.song.src, cfg.song.name);
    localStorage.setItem(MOOD_STORAGE_KEY, key);
  };

  const handleSongPlay = (songSrc, songName) => {
    if (currentSong === songSrc && isPlaying) {
      stopSong();
    } else {
      playSong(songSrc, songName);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-end font-sans">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isPlaying) {
            stopSong();
          } else {
            setMenuOpen((v) => !v);
          }
        }}
        className="flex items-center gap-2 px-3 py-2 backdrop-blur-sm border rounded-full transition-all duration-300 shadow-lg relative z-10 text-sm font-medium md:min-w-[140px] justify-center theme-button"
      >
        <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ repeat: isPlaying ? Infinity : 0, duration: 2, ease: 'linear' }}>
          <Music className="w-4 h-4 theme-icon" />
        </motion.div>

        <div className="hidden md:flex items-center gap-1">
          {isPlaying ? (
            <div className="w-16">
              <AudioWave />
            </div>
          ) : (
            <div className="min-w-[80px]">
              <GradientText>Set the Mood!</GradientText>
            </div>
          )}

          <AnimatePresence>
            {isPlaying && (
              <motion.div initial={{ opacity: 0, scale: 0, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0, width: 0 }} className="flex items-center">
                <Square className="w-3 h-3 theme-stop-icon" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isPlaying && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="md:hidden flex items-center">
              <Square className="w-3 h-3 theme-stop-icon" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full right-0 mt-2 z-50 w-64 md:w-72 rounded-2xl border shadow-2xl backdrop-blur-md theme-dropdown-item">
            <div className="p-3 border-b theme-dropdown-item">
              <div className="text-xs font-semibold theme-song-text">Select a mood</div>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
              {Object.entries(moodConfigs).map(([key, cfg]) => (
                <button key={key} onClick={() => applyMood(key)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 theme-dropdown-item ${mood === key ? 'ring-1 ring-pink-400' : ''}`}>
                  <span>{cfg.icon}</span>
                  <span className="text-sm theme-song-text">{cfg.label}</span>
                </button>
              ))}
            </div>
            <div className="px-3 pb-3 flex items-center justify-between gap-2">
              <button onClick={() => setMenuOpen((v) => !v)} className="text-xs px-3 py-2 rounded-lg border theme-dropdown-item">
                Songs
              </button>
              <button onClick={resetMood} className="text-xs px-3 py-2 rounded-lg border theme-dropdown-item">
                Stop Music & Reset
              </button>
            </div>
            <AnimatePresence>
              {menuOpen && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="px-2 pb-3 flex flex-col gap-2">
                  {songs.map((song, index) => (
                    <motion.div key={song.src} variants={itemVariants} custom={index}>
                      <div className="group relative w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-xl backdrop-blur-sm border shadow-lg cursor-pointer transition-all duration-300 theme-dropdown-item" onClick={() => handleSongPlay(song.src, song.name)}>
                        <span className={`text-left text-xs sm:text-sm theme-song-text ${currentSong === song.src && isPlaying ? 'theme-song-playing' : ''}`}>{song.name}</span>
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 theme-play-icon" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mood && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 -z-10 bg-gradient-to-br ${isDarkMode ? moodConfigs[mood].gradientDark : moodConfigs[mood].gradientLight} pointer-events-none transition-colors duration-700`} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mood && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -80 - (i % 5) * 20], x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i % 7) * 8)], opacity: [0, 1, 0] }}
                transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                className={`absolute text-lg select-none ${mood === 'nature' ? 'text-emerald-400' : mood === 'romantic' ? 'text-pink-400' : mood === 'adventure' ? 'text-amber-400' : mood === 'focus' ? 'text-blue-400' : 'text-cyan-400'}`}
                style={{ left: `${(i * 41) % 100}%`, bottom: `${(i * 17) % 100}%` }}
              >
                {mood === 'nature' && '🍃'}
                {mood === 'romantic' && '💖'}
                {mood === 'adventure' && '✨'}
                {mood === 'focus' && '✦'}
                {mood === 'relax' && '〜'}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .theme-button { background-color: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary); }
        .theme-button:hover { background-color: var(--bg-tertiary); }
        .theme-icon { color: var(--accent-primary); }
        .theme-stop-icon { color: var(--error-color); fill: var(--error-color); opacity: 0.8; }
        .theme-dropdown-item { background-color: var(--card-bg); border-color: var(--card-border); }
        .theme-dropdown-item:hover { background-color: var(--bg-tertiary); }
        .theme-song-text { color: var(--text-primary); }
        .theme-song-playing { color: var(--accent-primary); font-weight: 600; }
        .theme-play-icon { color: var(--success-color); fill: var(--success-color); opacity: 0.8; }
        .animated-gradient-text { position: relative; display: flex; max-width: fit-content; font-weight: 500; overflow: hidden; }
        .text-content { display: inline-block; position: relative; background: linear-gradient(to right,#FF0080,#FF5733,#FFC300); background-size: 300% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; animation: gradient linear infinite 8s; font-size: 0.875rem; line-height: 1.25rem; }
        .dark .text-content { background: linear-gradient(to right,#40ffaa,#4079ff,#40ffaa); background-size: 300% 100%; background-clip: text; -webkit-background-clip: text; }
        .audio-wave-container { display: flex; align-items: center; justify-content: center; height: 20px; width: 64px; }
        .audio-wave { display: flex; align-items: end; justify-content: space-between; height: 16px; width: 56px; gap: 1px; }
        .audio-wave .bar { width: 2px; height: 100%; border-radius: 1px; animation: audio-wave 1.5s ease-in-out infinite; transform-origin: bottom; background: linear-gradient(to top,#FF0080,#FF5733,#FFC300); }
        .dark .audio-wave .bar { background: linear-gradient(to top,#40ffaa,#4079ff,#40ffaa); }
        .audio-wave .bar:nth-child(1){animation-delay:0s}.audio-wave .bar:nth-child(2){animation-delay:.12s}.audio-wave .bar:nth-child(3){animation-delay:.24s}.audio-wave .bar:nth-child(4){animation-delay:.36s}.audio-wave .bar:nth-child(5){animation-delay:.48s}.audio-wave .bar:nth-child(6){animation-delay:.36s}.audio-wave .bar:nth-child(7){animation-delay:.24s}.audio-wave .bar:nth-child(8){animation-delay:.12s}.audio-wave .bar:nth-child(9){animation-delay:0s}.audio-wave .bar:nth-child(10){animation-delay:.12s}
        @keyframes audio-wave {0%,100%{transform:scaleY(.3);opacity:.7}25%{transform:scaleY(.8);opacity:.9}50%{transform:scaleY(.4);opacity:.8}75%{transform:scaleY(.9);opacity:1}}
        @keyframes gradient {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>
    </div>
  );
}

export default MoodToggle;


