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
    // Left-aligned nodes slide in from the left
    gsap.utils.toArray('.node-left').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: -100 }, 
        { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 1 } }
      );
    });

    // Right-aligned nodes slide in from the right
    gsap.utils.toArray('.node-right').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, x: 100 }, 
        { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 1 } }
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
        .glass-card {
            background: rgba(15, 15, 15, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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

      {/* Expanded max-width so the left/right layout has room to breathe */}
      <main className="w-full max-w-6xl flex flex-col gap-[60vh] p-6 md:p-8 pt-40 pb-96">
        
        {/* Story Node 1: Manual (Left Aligned) */}
        <section className="node-left glass-card self-start w-full md:w-[45%] p-8 md:p-10 rounded-3xl flex flex-col items-start gap-4">
          <span className="text-teal-400 font-mono text-xs tracking-widest uppercase">Stage 01 // Manual Intake</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            The Chaos of <br /> Raw Intent.
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
            Legacy BSA workflows relied on fragmented emails and chaotic meetings. 
            The "Manual Writer" phase was a bottleneck of ambiguity and misalignment.
          </p>
        </section>

        {/* Story Node 2: Collaboration (Right Aligned) */}
        <section className="node-right glass-card self-end w-full md:w-[45%] p-8 md:p-10 rounded-3xl flex flex-col items-end text-right gap-4">
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Stage 02 // Intelligence Sync</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Bridging the <br /> Knowledge Gap.
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
            By integrating <span className="text-white font-semibold">Enterprise Copilots</span>, we transformed 
            raw data into structured intent, creating a seamless bridge between stakeholders and engineering.
          </p>
          <div className="w-full h-1 pipeline-flow rounded-full mt-4"></div>
        </section>

        {/* Story Node 3: Factory (Left Aligned) */}
        <section className="node-left glass-card self-start w-full md:w-[45%] p-8 md:p-10 rounded-3xl flex flex-col items-start gap-4">
          <span className="text-teal-400 font-mono text-xs tracking-widest uppercase">Stage 03 // The Vault</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Amazon Q <br /> Knowledge Base.
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
            Implementing strict <span className="text-white font-semibold">Guardrails</span> ensures zero-hallucination. 
            The Vault syncs enterprise documentation to output high-fidelity requirements.
          </p>
        </section>

        {/* Story Node 4: Output (Right Aligned) */}
        <section className="node-right glass-card self-end w-full md:w-[45%] p-8 md:p-10 rounded-3xl flex flex-col items-end text-right gap-4">
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Stage 04 // Precision Output</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Structured <br /> FSD Delivery.
          </h2>
          <div className="flex gap-4 md:gap-6 mt-4 justify-end w-full">
            <div className="p-4 md:p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
              <div className="text-2xl md:text-3xl font-bold text-teal-400">80%</div>
              <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1">Structure Match</div>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">70%</div>
              <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1">Time Saved</div>
            </div>
          </div>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed mt-4">
            The result: An automated pipeline that preserves technical precision while 
            drastically accelerating Agile velocity.
          </p>
        </section>

      </main>
    </div>
  );
}
