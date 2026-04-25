import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';

const App: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      
      {/* Left Column: Decorative / Info */}
      <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 border-r border-cyan-900/50 pr-6">
        <div className="border border-fuchsia-900 p-4 bg-black/50">
          <GlitchText text="SYS.OP_TERMINAL" as="h3" className="text-fuchsia-500 mb-2 border-b border-fuchsia-900 pb-1" />
          <div className="text-xs text-cyan-700 space-y-1 font-mono">
            <p>> INITIALIZING KERNEL...</p>
            <p>> LOADING AUDIO DRIVERS... OK</p>
            <p>> MOUNTING NEURO-LINK... OK</p>
            <p className="text-fuchsia-700 animate-pulse">> WARNING: GLITCH DETECTED</p>
            <p>> AWAITING USER INPUT_</p>
          </div>
        </div>
        
        {/* Random Hex Dump Decorative Element */}
        <div className="flex-1 overflow-hidden opacity-30 text-[10px] text-cyan-800 break-all leading-tight select-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i}>{Math.random().toString(16).substring(2)} </span>
          ))}
        </div>
      </div>

      {/* Center Column: Main Game */}
      <div className="col-span-1 lg:col-span-6 flex flex-col justify-center">
        <SnakeGame />
      </div>

      {/* Right Column: Music Player & Status */}
      <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        <MusicPlayer />
        
        <div className="border border-cyan-900 p-4 bg-black/50 flex-1">
           <h3 className="text-cyan-600 mb-2 border-b border-cyan-900 pb-1 text-sm">SYSTEM_STATUS</h3>
           <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs text-cyan-500 mb-1">
                 <span>CPU_LOAD</span>
                 <span>87%</span>
               </div>
               <div className="w-full h-2 bg-gray-900">
                 <div className="h-full bg-fuchsia-500 w-[87%]"></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs text-cyan-500 mb-1">
                 <span>MEM_ALLOC</span>
                 <span>42%</span>
               </div>
               <div className="w-full h-2 bg-gray-900">
                 <div className="h-full bg-cyan-500 w-[42%]"></div>
               </div>
             </div>
             <div className="mt-8 text-center">
                <div className="inline-block border border-red-900 text-red-500 px-2 py-1 text-xs animate-pulse">
                  CONNECTION UNSTABLE
                </div>
             </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default App;
