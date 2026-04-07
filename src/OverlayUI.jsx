// File 3: OverlayUI.jsx (FINAL VISUAL FIXES)
import React, { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function OverlayUI() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("Kunal.madaan.work@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(() => {
    // Left-aligned nodes (Crestech, Amazon Q Vault)
    gsap.utils.toArray('.node-left').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: -100 }, 
        { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 35%', scrub: 1 } }
      );
    });

    // Right-aligned nodes (NTT DATA ML, Precision FSD)
    gsap.utils.toArray('.node-right').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: 100 }, 
        { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 35%', scrub: 1 } }
      );
    });

    // Standard Fade-Up for grids
    gsap.utils.toArray('.fade-up').forEach((card) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } }
      );
    });
  });

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        .glass-nav { background: rgba(5, 5, 5, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-card { background: rgba(15, 15, 15, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .glass-card:hover { border-color: rgba(45, 212, 191, 0.3); transform: translateY(-2px); transition: all 0.3s ease; }
        .pipeline-flow { background: linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.2), transparent); background-size: 200% 100%; animation: flow 2s infinite linear; }
        @keyframes flow { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
      `}</style>

      <nav className="sticky top-0 z-50 w-full flex justify-center glass-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kunal Madaan</h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
            <button onClick={copyEmail} className={`transition-colors text-sm font-medium ${copied ? 'text-teal-400' : 'text-zinc-400 hover:text-white'}`}>
              {copied ? "Copied!" : "Copy Email"}
            </button>
            {/* PROBLEM 3 FIXED: Using Moon Icon for Dark Theme, aligned on right */}
            <button className="text-zinc-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-8 pt-32 pb-40">
        
        {/* ================= ZONE 1: IDENTITY ================= */}
        <section className="fade-up glass-card w-full p-10 md:p-16 rounded-3xl flex flex-col items-center text-center mb-[40vh] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          {/* PROBLEM 2 FIXED: 'Techno-Functional Architect' text size increased */}
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-lg font-bold tracking-widest uppercase">
            System Architecture & AI Integration
          </div>
          {/* PROBLEM 1 FIXED: Main headline and sub-wording are sharp 'Value' is fully text-white */}
          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8">
            Techno-Functional <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Senior BSA</span>
          </h2>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
            I architect multi-stage AI pipelines and drive enterprise digital transformation. By bridging the critical gap between complex engineering realities and strategic business goals, I ensure data-driven systems scale securely and efficiently.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-zinc-400 text-sm font-semibold selection:text-white">Enterprise RAG</span>
            <span className="px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-zinc-400 text-sm font-semibold selection:text-white">SQL Data Parsing</span>
            <span className="px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-zinc-400 text-sm font-semibold selection:text-white">Agile / CSPO</span>
          </div>
        </section>

        {/* The 3D story sections would be linked and included below as zig-zag nodes... */}

      </main>
    </div>
  );
}
