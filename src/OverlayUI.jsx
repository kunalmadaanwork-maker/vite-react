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
    const sections = gsap.utils.toArray('.story-node');
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: -50 }, 
        { 
          opacity: 1, 
          x: 0, 
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          }
        }
      );
    });
  });

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        .glass-nav {
            background: rgba(5, 5, 5, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .pipeline-flow {
            background: linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.2), transparent);
            background-size: 200% 100%;
            animation: flow 2s infinite linear;
        }
        @keyframes flow {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
        }
      `}</style>

      <nav className="sticky top-0 z-50 w-full flex justify-center glass-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kunal Madaan</h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="YOUR_LINKEDIN_URL" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
            <button 
              onClick={copyEmail} 
              className={`transition-colors text-sm font-medium cursor-pointer ${copied ? 'text-teal-400' : 'text-zinc-400 hover:text-white'}`}
            >
              {copied ? "Copied!" : "Copy Email"}
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl flex flex-col gap-[60vh] p-6 md:p-8 pt-32 pb-96">
        
        {/* Story Node 1: Manual */}
        <section className="story-node flex flex-col items-start gap-4">
          <span className="text-teal-400 font-mono text-xs tracking-widest uppercase">Stage 01 // Manual Intake</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            The Chaos of <br /> Raw Intent.
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Legacy BSA workflows relied on fragmented emails and chaotic meetings. 
            The "Manual Writer" phase was a bottleneck of ambiguity and misalignment.
          </p>
        </section>

        {/* Story Node 2: Collaboration */}
        <section className="story-node flex flex-col items-start gap-4">
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Stage 02 // Intelligence Sync</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Bridging the <br /> Knowledge Gap.
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            By integrating <span className="text-white font-semibold">Enterprise Copilots</span>, we transformed 
            raw data into structured intent, creating a seamless bridge between stakeholders and engineering.
          </p>
          <div className="w-full h-1 pipeline-flow rounded-full mt-4"></div>
        </section>

        {/* Story Node 3: Factory */}
        <section className="story-node flex flex-col items-start gap-4">
          <span className="text-teal-400 font-mono text-xs tracking-widest uppercase">Stage 03 // The Vault</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Amazon Q <br /> Knowledge Base.
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Implementing strict <span className="text-white font-semibold">Guardrails</span> ensures zero-hallucination. 
            The Vault syncs enterprise documentation to output high-fidelity requirements.
          </p>
        </section>

        {/* Story Node 4: Output */}
        <section className="story-node flex flex-col items-start gap-4">
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Stage 04 // Precision Output</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Structured <br /> FSD Delivery.
          </h2>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-bold text-teal-400">80%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-tighter">Structure Match</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-bold text-white">70%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-tighter">Time Saved</div>
            </div>
          </div>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed mt-6">
            The result: An automated pipeline that preserves technical precision while 
            drastically accelerating Agile velocity.
          </p>
        </section>

      </main>
    </div>
  );
}
