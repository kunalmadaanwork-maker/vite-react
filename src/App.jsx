// File 1: App.jsx
import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Background3D from './Background3D';
import OverlayUI from './OverlayUI';
import './index.css';

export default function App() {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen w-full bg-[#050505] text-zinc-300 selection:bg-teal-500/30">
        {/* 3D Journey Layer - Fixed background, deep z-index */}
        <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none">
          <Background3D />
        </div>

        {/* UI Overlay Layer - Transparent background to see 3D scene */}
        <div className="relative z-10 bg-transparent">
          <OverlayUI />
        </div>
      </div>
    </ReactLenis>
  );
}
