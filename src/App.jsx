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
    document.body.style.backgroundColor = theme === 'dark' ? '#030303' : '#FFF8E7';
    document.body.style.margin = '0';
    document.body.style.overflowX = 'hidden';
  }, [theme]);

  return (
    <>
      {/* Loader stays in DOM but is handled via internal state/onComplete */}
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      
      <ReactLenis root>
        <div
          className={`relative min-h-screen w-full overflow-x-hidden transition-all duration-1000 selection:bg-violet-500/30 ${
            theme === 'dark' ? 'bg-[#030303]' : 'bg-[#FFF8E7]'
          }`}
          style={{ 
            opacity: isLoaded ? 1 : 0, 
            visibility: isLoaded ? 'visible' : 'hidden',
            transition: 'opacity 1s ease-in-out, visibility 1s' 
          }}
        >
          <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
            <Background3D theme={theme} />
          </div>

          <div className="relative z-10 w-full">
            <OverlayUI theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </ReactLenis>
    </>
  );
}
