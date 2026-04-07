// File 1: App.jsx
import React, { useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Analytics } from '@vercel/analytics/react';
import Background3D from './Background3D';
import OverlayUI from './OverlayUI';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ReactLenis root>
      {/* THE FIX: Light mode background is now purely Cosmic Latte (#FFF8E7) */}
      <div className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-1000 selection:bg-violet-500/30 ${theme === 'dark' ? 'bg-[#030303]' : 'bg-[#FFF8E7]'}`}>
        
        {/* Background Layer: Z-Index 0 */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <Background3D theme={theme} />
        </div>

        {/* UI Layer: Relative Z-Index 10 */}
        <div className="relative z-10 w-full">
          <OverlayUI theme={theme} setTheme={setTheme} />
        </div>
        
      </div>
      <Analytics />
    </ReactLenis>
  );
}
