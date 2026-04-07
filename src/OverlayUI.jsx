// File 3: OverlayUI.jsx
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
    // 1. ZIG-ZAG LEFT ANIMATION
    gsap.utils.toArray('.node-left').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: -100 }, 
        { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 35%', scrub: 1 } }
      );
    });

    // 2. ZIG-ZAG RIGHT ANIMATION
    gsap.utils.toArray('.node-right').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: 100 }, 
        { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 35%', scrub: 1 } }
      );
    });

    // 3. STANDARD FADE UP
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
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 100px; }
        .glass-nav { background: rgba(5, 5, 5, 0.7); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-card { background: rgba(15, 15, 15, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.4s ease; }
        .glass-card:hover { border-color: rgba(124, 58, 237, 0.4); transform: translateY(-5px); }
      `}</style>

      {/* HEADER: Fixed Name & Moon Icon */}
      <nav className="fixed top-0 z-50 w-full flex justify-center glass-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className="text-white font-bold tracking-tighter text-xl">Kunal Madaan</div>
          <div className="flex gap-6 items-center">
            {['Identity', 'Journey', 'Archive', 'Horizon'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hidden md:block text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest">
                {item}
              </a>
            ))}
            <button className="text-zinc-400 hover:text-white transition-colors ml-4">
              {/* Moon Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-12 pt-40 pb-60 overflow-hidden">
        
        {/* IDENTITY: Big Subtitle, Bright Solid Text */}
        <section id="identity" className="fade-up flex flex-col items-center text-center gap-6 mb-[40vh] mt-10">
          <span className="text-violet-400 font-mono text-sm md:text-base tracking-widest uppercase">Techno-Functional Architect</span>
          <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Bridging Data <br /> To Enterprise Value.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            7+ years of experience across Tier-1 Financial Institutions and Retailers, transforming complex technical ambiguity into precision roadmaps.
          </p>
        </section>

        {/* JOURNEY: The True Zig-Zag Layout */}
        <section id="journey" className="flex flex-col gap-[30vh] mb-[40vh] w-full relative">
          
          <div className="node-left self-start w-full md:w-[45%] glass-card p-10 rounded-3xl">
            <span className="text-violet-500 font-mono text-xs tracking-widest uppercase">Stage 01</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">Manual Intake</h3>
            <p className="text-zinc-400 leading-relaxed">The bottleneck of legacy BSA work. Fragmented requirements and raw stakeholder intent parsed through traditional SDLC frameworks.</p>
          </div>

          <div className="node-right self-end w-full md:w-[45%] glass-card p-10 rounded-3xl md:text-right">
            <span className="text-magenta-500 font-mono text-xs tracking-widest uppercase">Stage 02</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">Copilot Sync</h3>
            <p className="text-zinc-400 leading-relaxed">Transitioning to Agentic workflows. Using Enterprise LLMs to extract structured logic from raw data streams in real-time.</p>
          </div>

          <div className="node-left self-start w-full md:w-[45%] glass-card p-10 rounded-3xl">
            <span className="text-violet-500 font-mono text-xs tracking-widest uppercase">Stage 03</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">The Vault</h3>
            <p className="text-zinc-400 leading-relaxed">Implementing Amazon Q Knowledge Bases with strict governance. Secure, RAG-based intelligence for high-stakes financial environments.</p>
          </div>

          <div className="node-right self-end w-full md:w-[45%] glass-card p-10 rounded-3xl md:text-right">
            <span className="text-magenta-500 font-mono text-xs tracking-widest uppercase">Stage 04</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">Precision FSD</h3>
            <p className="text-zinc-400 leading-relaxed">The final frontier: 80% structure match and 70% time reduction in producing functional specifications ready for dev.</p>
          </div>
        </section>

        {/* ARCHIVE */}
        <section id="archive" className="fade-up flex flex-col items-start gap-8 mb-[40vh]">
          <span className="text-violet-400 font-mono text-xs tracking-widest uppercase">Impact Archive</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="p-10 rounded-3xl glass-card group">
              <h4 className="text-white font-bold text-2xl mb-3 group-hover:text-violet-400 transition-colors">NTT DATA ML POC</h4>
              <p className="text-zinc-400 text-base leading-relaxed">Engineered the functional blueprint for an ML-driven fraud detection system in insurance.</p>
            </div>
            <div className="p-10 rounded-3xl glass-card group">
              <h4 className="text-white font-bold text-2xl mb-3 group-hover:text-magenta-400 transition-colors">Tableau Migration</h4>
              <p className="text-zinc-400 text-base leading-relaxed">Directed end-to-end reporting migration from Business Objects for a Tier-1 North American Bank.</p>
            </div>
          </div>
        </section>

        {/* HORIZON */}
        <section id="horizon" className="fade-up glass-card p-12 rounded-3xl text-center mb-[40vh] border-dashed border-violet-500/20">
          <h3 className="text-3xl font-bold text-white mb-6">Technical Horizon</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase">Google Gemma 4</span>
            <span className="px-5 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-400 text-xs font-bold uppercase">n8n Automation</span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto italic">
            "Currently evaluating agentic workflows for autonomous Agile User Story generation. Testing edge-model latency for offline enterprise deployments."
          </p>
        </section>

        {/* CONTACT */}
        <section className="fade-up flex flex-col items-center text-center gap-10">
          <div className="px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
            [STATUS: Leading AI Transformation]
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white">Ready for the next <br /> frontier?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-4">
            <a href="#" className="p-6 rounded-2xl glass-card hover:bg-white/5 transition-all text-white font-bold text-lg">
              LinkedIn
            </a>
            <button onClick={copyEmail} className={`p-6 rounded-2xl border transition-all font-bold text-lg ${copied ? 'bg-violet-500/20 border-violet-500 text-violet-400' : 'glass-card border-transparent text-white hover:bg-white/5'}`}>
              {copied ? "Copied Email!" : "Copy Email"}
            </button>
            <a href="#" className="p-6 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Full Resume
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
