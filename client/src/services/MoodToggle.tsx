// MoodToggle.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion';

const songs = [
  { name: "Nature Calls", src: "/music_tunes/song1.mp3" },
  { name: "Dandelions", src: "/music_tunes/song2.mp3" },
  { name: "Raga Hamsadhvani", src: "/music_tunes/song3.mp3" },
  { name: "Voice of the Forest", src: "/music_tunes/song4.mp3" },
  { name: "Carol of the Bells", src: "/music_tunes/song5.mp3" },
];

// GradientText Component
const GradientText: React.FC<{ children: React.ReactNode; animationSpeed?: number }> = ({
  children,
  animationSpeed = 8,
}) => {
  return (
    <div className="animated-gradient-text">
      <div
        className="text-content"
        style={{ animationDuration: `${animationSpeed}s` }}
      >
        {children}
      </div>
    </div>
  );
};

// AudioWave Component for music playing state
const AudioWave: React.FC = () => {
  return (
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
};

const MoodToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [currentSongName, setCurrentSongName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const playSong = (songSrc: string, songName: string) => {
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
    setMenuOpen(false); // Close the menu when song starts playing
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

  const handleSongPlay = (songSrc: string, songName: string) => {
    if (currentSong === songSrc && isPlaying) {
      stopSong();
    } else {
      playSong(songSrc, songName);
    }
  };

  // Staggered animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.0
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};


const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -15,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
};

  return (
    <div ref={containerRef} className="relative flex flex-col items-end font-sans">
      {/* Main Button - Using theme variables */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isPlaying) {
            stopSong();
          } else {
            setMenuOpen(!menuOpen);
          }
        }}
        className="flex items-center gap-2 px-3 py-2 backdrop-blur-sm border rounded-full transition-all duration-300 shadow-lg relative z-10 text-sm font-medium md:min-w-[140px] justify-center theme-button"
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: isPlaying ? Infinity : 0, duration: 2, ease: "linear" }}
        >
          <Music className="w-4 h-4 theme-icon" />
        </motion.div>
        
        {/* Text Content - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex items-center gap-1">
          {/* Conditional: Audio Wave when playing, Gradient Text when not */}
          {isPlaying ? (
            <div className="w-16">
              <AudioWave />
            </div>
          ) : (
            <div className="min-w-[80px]">
              <GradientText>Set the Mood!</GradientText>
            </div>
          )}
          
          {/* Stop Icon inside the button */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0, width: 0 }}
                className="flex items-center"
              >
                <Square className="w-3 h-3 ml-1 theme-stop-icon" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Stop Icon - Only show when playing on mobile */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="md:hidden flex items-center"
            >
              <Square className="w-3 h-3 theme-stop-icon" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Vertical Pop-up Bubbles with Staggered Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-end space-y-2 mt-2 absolute top-full right-0 z-50"
          >
            {songs.map((song, index) => (
              <motion.div
                key={song.src}
                variants={itemVariants}
                custom={index}
              >
                <div
                  className="group relative w-32 sm:w-36 md:w-40 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-full backdrop-blur-sm border shadow-lg cursor-pointer transition-all duration-300 theme-dropdown-item"
                  onClick={() => handleSongPlay(song.src, song.name)}
                >
                  <span
                    className={`text-left text-xs sm:text-sm theme-song-text ${
                      currentSong === song.src && isPlaying ? 'theme-song-playing' : ''
                    }`}
                  >
                    {song.name}
                  </span>
                  {/* Play button only shows on hover */}
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 theme-play-icon" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Text & Audio Wave CSS with Fixed Gradient Colors */}
      <style>
        {`
        .theme-button {
          background-color: var(--bg-secondary);
          border-color: var(--border-primary);
          color: var(--text-primary);
        }
        
        .theme-button:hover {
          background-color: var(--bg-tertiary);
        }
        
        .theme-icon {
          color: var(--accent-primary);
        }
        
        .theme-stop-icon {
          color: var(--error-color);
          fill: var(--error-color);
          opacity: 0.8;
        }
        
        .theme-dropdown-item {
          background-color: var(--card-bg);
          border-color: var(--card-border);
        }
        
        .theme-dropdown-item:hover {
          background-color: var(--bg-tertiary);
        }
        
        .theme-song-text {
          color: var(--text-primary);
        }
        
        .theme-song-playing {
          color: var(--accent-primary);
          font-weight: 600;
        }
        
        .theme-play-icon {
          color: var(--success-color);
          fill: var(--success-color);
          opacity: 0.8;
        }

        .animated-gradient-text {
          position: relative;
          display: flex;
          max-width: fit-content;
          font-weight: 500;
          overflow: hidden;
        }
        
        .text-content {
          display: inline-block;
          position: relative;
          background: linear-gradient(to right, 
            #FF0080, 
            #FF5733, 
            #FFC300
          );
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradient linear infinite 8s;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        
        .dark .text-content {
          background: linear-gradient(to right, 
            #40ffaa, 
            #4079ff, 
            #40ffaa
          );
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        /* Audio Wave Styles - Responsive */
        .audio-wave-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          width: 64px;
        }
        
        .audio-wave {
          display: flex;
          align-items: end;
          justify-content: space-between;
          height: 16px;
          width: 56px;
          gap: 1px;
        }
        
        .audio-wave .bar {
          width: 2px;
          height: 100%;
          border-radius: 1px;
          animation: audio-wave 1.5s ease-in-out infinite;
          transform-origin: bottom;
          background: linear-gradient(to top, 
            #FF0080, 
            #FF5733, 
            #FFC300
          );
        }
        
        .dark .audio-wave .bar {
          background: linear-gradient(to top, 
            #40ffaa, 
            #4079ff, 
            #40ffaa
          );
        }
        
        /* Individual bar animations for wave effect */
        .audio-wave .bar:nth-child(1) { animation-delay: 0.0s; }
        .audio-wave .bar:nth-child(2) { animation-delay: 0.12s; }
        .audio-wave .bar:nth-child(3) { animation-delay: 0.24s; }
        .audio-wave .bar:nth-child(4) { animation-delay: 0.36s; }
        .audio-wave .bar:nth-child(5) { animation-delay: 0.48s; }
        .audio-wave .bar:nth-child(6) { animation-delay: 0.36s; }
        .audio-wave .bar:nth-child(7) { animation-delay: 0.24s; }
        .audio-wave .bar:nth-child(8) { animation-delay: 0.12s; }
        .audio-wave .bar:nth-child(9) { animation-delay: 0.0s; }
        .audio-wave .bar:nth-child(10) { animation-delay: 0.12s; }
        
        @keyframes audio-wave {
          0%, 100% {
            transform: scaleY(0.3);
            opacity: 0.7;
          }
          25% {
            transform: scaleY(0.8);
            opacity: 0.9;
          }
          50% {
            transform: scaleY(0.4);
            opacity: 0.8;
          }
          75% {
            transform: scaleY(0.9);
            opacity: 1;
          }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}
      </style>
    </div>
  );
};

export default MoodToggle;