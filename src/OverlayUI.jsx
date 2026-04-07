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
    const nodes = gsap.utils.toArray('.story-node');
    nodes.forEach((node) => {
      gsap.fromTo(node, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          scrollTrigger: {
            trigger: node,
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
            background: rgba(5, 5, 5, 0.7);
            backdrop-filter: blur(15px);
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

      {/* FIX 4: Name restored, FIX 3: Moon icon added */}
      <nav className="sticky top-0 z-50 w-full flex justify-center glass-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className="text-white font-bold tracking-tighter text-xl">Kunal Madaan</div>
          <div className="flex gap-6 items-center">
            {['Identity', 'Journey', 'Archive', 'Horizon'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hidden md:block text-zinc-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest">
                {item}
              </a>
            ))}
            <button className="text-zinc-400 hover:text-white transition-colors ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl flex flex-col gap-[70vh] p-6 md:p-8 pt-40 pb-96">
        
        {/* FIX 1 & 2: Centered Layout, Larger Subtitle, Solid White Headline */}
        <section id="identity" className="story-node flex flex-col items-center text-center gap-6 mt-10">
          <span className="text-teal-400 font-mono text-sm md:text-base tracking-widest uppercase">Techno-Functional Architect</span>
          <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Bridging Data <br /> To Enterprise Value.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            7+ years of experience across Tier-1 Financial Institutions and Retailers, transforming complex technical ambiguity into precision roadmaps.
          </p>
        </section>

        {/* Section 2: Signature Journey (AI Factory) */}
        <section id="journey" className="story-node flex flex-col items-start gap-12">
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">The AI FSD Factory</span>
          <div className="flex flex-col gap-20 w-full">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-white font-bold text-xl mb-2">01. Manual Intake</h3>
                <p className="text-zinc-400 text-sm">Fragmented requirements and raw stakeholder intent. The bottleneck of legacy BSA work.</p>
              </div>
              <div className="hidden md:block w-12 h-px bg-teal-500/30 mt-10" />
              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-white font-bold text-xl mb-2">02. Copilot Sync</h3>
                <p className="text-zinc-400 text-sm">Leveraging Enterprise LLMs to extract structured intent from raw data streams.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-8 items-start">
              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-white font-bold text-xl mb-2">03. The Vault</h3>
                <p className="text-zinc-400 text-sm">Amazon Q Knowledge Base with strict guardrails for a Tier-1 Financial Institution.</p>
              </div>
              <div className="hidden md:block w-12 h-px bg-teal-500/30 mt-10" />
              <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-white font-bold text-xl mb-2">04. Precision Output</h3>
                <p className="text-zinc-400 text-sm">80% structure match and 70% time saved on FSD generation.</p>
              </div>
            </div>
          </div>
          <div className="w-full h-1 pipeline-flow rounded-full" />
        </section>

        {/* Section 3: Impact Archive */}
        <section id="archive" className="story-node flex flex-col items-start gap-8">
          <span className="text-teal-400 font-mono text-xs tracking-widest uppercase">Impact Archive</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-teal-500/30 transition-colors group">
              <h4 className="text-white font-bold text-xl mb-2 group-hover:text-teal-400 transition-colors">NTT DATA ML POC</h4>
              <p className="text-zinc-400 text-sm">Engineered the functional blueprint for an ML-driven fraud detection system in insurance.</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
              <h4 className="text-white font-bold text-xl mb-2 group-hover:text-blue-400 transition-colors">Tableau Migration</h4>
              <p className="text-zinc-400 text-sm">Directed end-to-end reporting migration from Business Objects for a Tier-1 North American Bank.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Technical Horizon */}
        <section id="horizon" className="story-node flex flex-col items-start gap-6">
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Technical Horizon</span>
          <div className="p-10 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 w-full">
            <h3 className="text-2xl font-bold text-white mb-4">R&D Sandbox</h3>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">Google Gemma 4</div>
              <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">n8n Automation</div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono">Agentic Workflows</div>
            </div>
            <p className="text-zinc-500 text-sm mt-6 max-w-xl italic">
              Currently evaluating open-weight edge models for offline Agile User Story generation.
            </p>
          </div>
        </section>

        {/* Section 5: Contact Hub */}
        <section className="story-node flex flex-col items-center text-center gap-10">
          <div className="px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            [STATUS: Currently Leading AI Transformation]
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white">Ready for the next <br /> frontier?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            <a href="YOUR_LINKEDIN_URL" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium">
              LinkedIn
            </a>
            <button 
              onClick={copyEmail} 
              className={`p-6 rounded-2xl border transition-all font-medium ${copied ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              {copied ? "Copied Email!" : "Copy Email"}
            </button>
            <a href="RESUME_LINK" className="p-6 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-bold">
              Full Case Study
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
