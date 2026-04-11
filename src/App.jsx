import React, { useState, useEffect } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D';
import LoadingScreen from './LoadingScreen';
import OverlayUI from './OverlayUI';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#030303' : '#FFF8E7'; [cite: 4]
  }, [theme]);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />} [cite: 5]
      
      <ReactLenis root>
        <div
          className={`relative min-h-screen w-full overflow-x-hidden selection:bg-violet-500/30 ${
            theme === 'dark' ? 'bg-[#030303]' : 'bg-[#FFF8E7]'
          }`}
          style={{ opacity: isLoaded ? [cite_start]1 : 0, transition: 'opacity 0.8s ease-in-out' }} [cite: 6]
        >
          <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
            <Background3D theme={theme} /> [cite: 6]
          </div>

          {/* FIX: pointer-events-none allows galaxy hover interaction while UI stays visible */}
          <div className="relative z-10 w-full pointer-events-none"> 
            <OverlayUI theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </ReactLenis>
    </>
  );
}
