// File 1: App.jsx
import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D.jsx';
import OverlayUI from './OverlayUI.jsx';
import './index.css'; 

export default function App() {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen w-full bg-transparent text-zinc-300 selection:bg-teal-500/30">
        
        {/* Layer 1: WebGL Background (Deepest Layer) */}
        <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none">
          <Background3D />
        </div>

        {/* Layer 2: HTML UI (Floating Glass Layer) */}
        <div className="relative z-10">
            <OverlayUI />
        </div>
        
      </div>
    </ReactLenis>
  );
}
