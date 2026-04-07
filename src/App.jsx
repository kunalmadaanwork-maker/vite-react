// File 1: App.jsx
import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D';
import OverlayUI from './OverlayUI';
import './index.css';

export default function App() {
  return (
    <ReactLenis root>
      {/* Main wrapper is bg-transparent to allow the Canvas background to be the primary visual */}
      <div className="relative min-h-screen w-full bg-transparent text-zinc-300 selection:bg-teal-500/30">
        
        {/* Background Layer: Z-Index 0 */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <Background3D />
        </div>

        {/* UI Layer: Relative Z-Index 10 */}
        <div className="relative z-10">
          <OverlayUI />
        </div>
        
      </div>
    </ReactLenis>
  );
}
