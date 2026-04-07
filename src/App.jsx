// File 1: App.jsx
import React, { useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D';
import OverlayUI from './OverlayUI';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ReactLenis root>
      {/* THE FIX: Added overflow-x-hidden to lock horizontal scrolling */}
      <div className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-700 selection:bg-violet-500/30 ${theme === 'dark' ? 'bg-[#030303]' : 'bg-slate-50'}`}>
        
        {/* Background Layer: Z-Index 0 */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <Background3D theme={theme} />
        </div>

        {/* THE FIX: Added w-full to ensure the UI layer stretches perfectly to the edges */}
        <div className="relative z-10 w-full">
          <OverlayUI theme={theme} setTheme={setTheme} />
        </div>
        
      </div>
    </ReactLenis>
  );
}
