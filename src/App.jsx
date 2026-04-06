// File 1: App.jsx
import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D.jsx';
import OverlayUI from './OverlayUI.jsx';
import './index.css'; 

export default function App() {
  return (
    <ReactLenis root>
      {/* 1. Parent wrapper MUST be transparent */}
      <div className="relative min-h-screen w-full bg-transparent text-zinc-300 selection:bg-teal-500/30">
        
        {/* 2. The 3D Canvas (Layer 0 - Base Floor) */}
        {/* We changed -z-50 to z-0 so it doesn't fall behind the HTML body */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <Background3D />
        </div>

        {/* 3. The HTML UI (Layer 10 - Floating Glass) */}
        {/* This sits perfectly on top of the 3D floor */}
        <div className="relative z-10">
            <OverlayUI />
        </div>
        
      </div>
    </ReactLenis>
  );
}
