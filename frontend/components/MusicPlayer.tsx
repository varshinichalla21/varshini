import React, { useState, useRef, useEffect } from 'react';
import { AUDIO_TRACKS } from '../constants';
import { GlitchText } from './GlitchText';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = AUDIO_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="border-2 border-fuchsia-500 p-4 bg-black/80 shadow-[0_0_15px_rgba(255,0,255,0.3)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 text-[10px] text-fuchsia-900 opacity-50 select-none pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>{Math.random().toString(16).substring(2, 10).toUpperCase()}</div>
        ))}
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-end border-b border-cyan-500/50 pb-2">
          <GlitchText text="AUDIO_SUBSYSTEM" as="h2" className="text-xl text-cyan-400 tracking-widest" />
          <span className="text-xs text-fuchsia-400 animate-pulse">
            {isPlaying ? 'STATUS: ACTIVE' : 'STATUS: STANDBY'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-cyan-600">CURRENT_TRACK:</span>
          <div className="text-lg text-fuchsia-300 truncate">
            > {currentTrack.title}
          </div>
          <div className="w-full h-1 bg-gray-800 mt-2 relative">
             {/* Fake progress bar for aesthetic */}
            <div className={`absolute top-0 left-0 h-full bg-cyan-500 ${isPlaying ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`} style={{ width: isPlaying ? '45%' : '0%' }}></div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <button
              onClick={prevTrack}
              className="px-3 py-1 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 hover:text-white transition-colors text-sm"
            >
              [ &lt;&lt; ]
            </button>
            <button
              onClick={togglePlay}
              className="px-4 py-1 border border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-900 hover:text-white transition-colors text-sm font-bold"
            >
              {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
            </button>
            <button
              onClick={nextTrack}
              className="px-3 py-1 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 hover:text-white transition-colors text-sm"
            >
              [ &gt;&gt; ]
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-cyan-500">
            <span>VOL:</span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-fuchsia-500"
            />
          </div>
        </div>

        <div className="text-[10px] text-cyan-700 mt-2 flex justify-between">
          <span>SEQ: {String(currentTrackIndex + 1).padStart(2, '0')} / {String(AUDIO_TRACKS.length).padStart(2, '0')}</span>
          <span>DUR: {currentTrack.duration}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
};
