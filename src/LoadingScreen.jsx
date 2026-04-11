import React, { useState, useEffect } from 'react';

const bootLines = [
  { text: "Initializing galaxy core...", check: "✓" },
  { text: "Compiling shader arrays...", check: "✓" },
  { text: "Loading enterprise modules...", check: "✓" },
  { text: "Calibrating RAG pipelines...", check: "✓" },
  { text: "Establishing contact protocols...", check: "✓" },
  { text: "Launch sequence ready.", check: "✓" },
];

export default function LoadingScreen({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (index < bootLines.length) {
      const timer = setTimeout(() => setIndex(prev => prev + 1), 300);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsLaunching(true), 500);
    }
  }, [index]);

  useEffect(() => {
    if (isLaunching) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLaunching, onComplete]);

  const progress = (index / bootLines.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030303] text-white font-mono overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #030303 100%)' }} 
      />

      <div className="relative w-full max-w-md px-6 space-y-8">
        <div className="space-y-3">
          {bootLines.map((line, i) => (
            <div 
              key={i} 
              className={`flex justify-between text-sm transition-all duration-500 ${i <= index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <span className="text-zinc-400">{`> ${line.text}`}</span>
              <span className="text-violet-400 font-bold">{i < index ? line.check : ""}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">System Calibration</span>
            <span className="text-xs text-violet-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #C026D3, #2DD4BF)' }} 
            />
          </div>
        </div>

        {isMobile && (
          <div className="p-4 border border-violet-500/20 bg-violet-500/5 rounded-lg text-left">
            <div className="text-violet-400 text-xs font-bold mb-1">💡 Better on Desktop</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              This site features a live 3D galaxy with interactive gravity disruption. 
              For the full cinematic experience, visit on a desktop.
            </p>
          </div>
        )}

        {isLaunching && (
          <div className="text-center pt-8 animate-bounce">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-teal-400 bg-clip-text text-transparent">
              LAUNCHING ✦
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
