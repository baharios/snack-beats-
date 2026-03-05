import React, { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { ShieldAlert, Terminal, Binary, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-glitch-black text-glitch-cyan font-mono selection:bg-glitch-magenta selection:text-black relative overflow-hidden">
      {/* Glitch Overlays */}
      <div className="noise-overlay" />
      <div className="scanline" />
      
      {/* CRT Vignette */}
      <div className="fixed inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <main className="relative z-10 container mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Cryptic Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 border-b-2 border-glitch-cyan/30 pb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="p-2 border-2 border-glitch-magenta"
            >
              <ShieldAlert className="text-glitch-magenta" size={28} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-pixel tracking-widest uppercase glitch-text" data-text="VOID_RUNNER_OS">
                VOID_RUNNER_OS
              </h1>
              <p className="text-[10px] text-glitch-magenta tracking-[0.4em] uppercase">
                KERNEL_STATUS: <span className="animate-pulse">COMPROMISED</span> // {systemTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-glitch-magenta uppercase tracking-widest">DATA_HARVEST</p>
              <motion.p 
                key={score}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-pixel"
              >
                {score.toString().padStart(6, '0')}
              </motion.p>
            </div>
            <div className="h-12 w-px bg-glitch-cyan/20" />
            <div className="text-right">
              <p className="text-[10px] text-glitch-magenta uppercase tracking-widest">PEAK_EFFICIENCY</p>
              <p className="text-3xl font-pixel text-glitch-magenta">
                {highScore.toString().padStart(6, '0')}
              </p>
            </div>
          </div>
        </header>

        {/* Machine Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: System Logs */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <div className="p-4 border border-glitch-cyan/30 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-glitch-cyan/20 pb-2">
                <Terminal size={14} />
                <h2 className="text-[10px] font-bold uppercase tracking-widest">SYS_LOGS</h2>
              </div>
              <div className="space-y-2 text-[9px] font-mono text-glitch-cyan/60 uppercase">
                <p className="text-glitch-magenta">[OK] HANDSHAKE_ESTABLISHED</p>
                <p>[OK] RHYTHM_BUFFER_LOADED</p>
                <p className="text-glitch-magenta">[WARN] ENTROPY_LEVELS_RISING</p>
                <p>[OK] SNAKE_PROTOCOL_V1_INIT</p>
                <p className="animate-pulse">_WAITING_FOR_USER_INPUT...</p>
              </div>
            </div>

            <div className="p-4 border border-glitch-magenta/30 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-glitch-magenta/20 pb-2">
                <Binary size={14} className="text-glitch-magenta" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-glitch-magenta">INPUT_MAP</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-glitch-cyan/40 uppercase">
                <div className="p-1 border border-glitch-cyan/10">DIR_UP</div>
                <div className="p-1 border border-glitch-cyan/10 text-right">ARROW_U</div>
                <div className="p-1 border border-glitch-cyan/10">DIR_DOWN</div>
                <div className="p-1 border border-glitch-cyan/10 text-right">ARROW_D</div>
                <div className="p-1 border border-glitch-cyan/10">HALT_EXEC</div>
                <div className="p-1 border border-glitch-cyan/10 text-right">SPACE</div>
              </div>
            </div>
          </div>

          {/* Center: Execution Core */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative p-2 border-4 border-glitch-cyan bg-black shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <SnakeGame onScoreChange={handleScoreChange} />
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-glitch-magenta" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-glitch-magenta" />
            </div>
            <p className="mt-4 text-glitch-magenta text-[10px] font-mono uppercase tracking-[0.8em] animate-pulse">
              EXECUTION_IN_PROGRESS
            </p>
          </div>

          {/* Right: Audio Processor */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end order-3">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Database className="text-glitch-magenta" size={16} />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-glitch-magenta">AUDIO_PROC</h2>
              </div>
              <MusicPlayer />
              
              <div className="mt-6 p-4 border border-glitch-cyan/20 text-[9px] font-mono text-glitch-cyan/40 leading-relaxed">
                <p>NOTICE: AUDIO_OUTPUT_MAY_CONTAIN_SUB_FREQUENCIES_HARMFUL_TO_ORGANIC_LIFE. PROCEED_WITH_CAUTION.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: System Metadata */}
        <footer className="mt-auto pt-6 border-t border-glitch-cyan/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-glitch-cyan/30 uppercase tracking-[0.3em]">
          <p>BUILD_HASH: 0x7F2A9C1D // NODE_V22.14.0</p>
          <div className="flex gap-8">
            <span className="hover:text-glitch-magenta cursor-crosshair transition-colors">DECRYPT_LICENSE</span>
            <span className="hover:text-glitch-magenta cursor-crosshair transition-colors">VOID_ACCESS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
