import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "VOID_SIGNAL_01",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff"
  },
  {
    id: 2,
    title: "CORRUPT_DATA_STREAM",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "GHOST_IN_SHELL",
    artist: "REPLICANT_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffff00"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-glitch-cyan p-6 relative overflow-hidden">
      {/* Glitch background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.5)_2px,rgba(0,255,255,0.5)_4px)]" />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-6 mb-8 relative z-10">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 border-2 border-glitch-magenta flex items-center justify-center bg-black"
        >
          <Cpu size={32} className="text-glitch-magenta" />
          {isPlaying && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute inset-0 bg-glitch-magenta/20"
            />
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
            >
              <h3 className="text-lg font-pixel text-glitch-cyan truncate mb-1 glitch-text" data-text={currentTrack.title}>
                {currentTrack.title}
              </h3>
              <p className="text-glitch-magenta text-[10px] font-mono tracking-widest uppercase">
                SOURCE: {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="h-4 w-full bg-black border border-glitch-cyan/30 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-glitch-cyan"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
          {/* Progress artifacts */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-px h-full bg-glitch-cyan/20" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Activity size={16} className="text-glitch-magenta animate-pulse" />
          <div className="flex items-center gap-6">
            <button onClick={skipBack} className="text-glitch-cyan hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 border-2 border-glitch-cyan flex items-center justify-center text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button onClick={skipForward} className="text-glitch-cyan hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
          <div className="text-[10px] font-mono text-glitch-magenta">
            {isPlaying ? "STREAMING" : "BUFFERED"}
          </div>
        </div>
      </div>
    </div>
  );
};
