// File 1: App.jsx
import React, { useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D';
import OverlayUI from './OverlayUI';
import './index.css';

export default function App() {
  // THE THEME ENGINE: Defaults to 'dark'
  const [theme, setTheme] = useState('dark');

  return (
    <ReactLenis root>
      {/* The background wrapper smoothly transitions between Deep Space (black) 
        and Clean Enterprise (slate-50) over 700ms 
      */}
      <div className={`relative min-h-screen w-full transition-colors duration-700 selection:bg-violet-500/30 ${theme === 'dark' ? 'bg-[#030303]' : 'bg-slate-50'}`}>
        
        {/* Background Layer: Z-Index 0 */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <Background3D theme={theme} />
        </div>

        {/* UI Layer: Relative Z-Index 10 */}
        <div className="relative z-10">
          <OverlayUI theme={theme} setTheme={setTheme} />
        </div>
        
      </div>
    </ReactLenis>
  );
}
