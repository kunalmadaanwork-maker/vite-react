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
    // Smoother reveal for cards
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, y: 0, 
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1
          } 
        }
      );
    });
  });

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 100px; }
        .glass-card {
            background: rgba(15, 15, 15, 0.4);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.4s ease;
        }
        .glass-card:hover {
            border-color: rgba(124, 58, 237, 0.4);
            transform: translateY(-5px);
        }
        .text-glow-purple { text-shadow: 0 0 20px rgba(124, 58, 237, 0.5); }
      `}</style>

      {/* Header Fix: Name + Icon + Alignment */}
      <nav className="fixed top-0 z-50 w-full flex justify-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-6xl flex justify-between items-center py-5 px-8">
          <div className="text-white font-bold tracking-tighter text-xl">KUNAL MADAAN</div>
          <div className="flex gap-10 items-center">
            {['Identity', 'Journey', 'Archive', 'Horizon'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
                {item}
              </a>
            ))}
            {/* Real Theme Toggle Icon (Sun) */}
            <button className="text-zinc-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-12 pt-40 pb-60">
        
        {/* Section 1: Centered Identity */}
        <section id="identity" className="reveal flex flex-col items-center text-center gap-6 mb-[40vh]">
          <span className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-2">Techno-Functional Architect</span>
          <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Bridging Data <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-magenta-500">To Enterprise Value.</span>
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed mt-4">
            7+ years of experience across Tier-1 Financial Institutions and Retailers, transforming complex technical ambiguity into precision roadmaps.
          </p>
        </section>

        {/* Section 2: ZIG-ZAG JOURNEY */}
        <section id="journey" className="flex flex-col gap-[30vh] mb-[40vh]">
          <div className="reveal self-start w-full md:w-[45%] glass-card p-10 rounded-[2rem]">
            <span className="text-violet-500 font-mono text-[10px] tracking-widest uppercase">Stage 01</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">Manual Intake</h3>
            <p className="text-zinc-400 leading-relaxed">The bottleneck of legacy BSA work. Fragmented requirements and raw stakeholder intent parsed through traditional SDLC frameworks.</p>
          </div>

          <div className="reveal self-end w-full md:w-[45%] glass-card p-10 rounded-[2rem] text-right">
            <span className="text-magenta-500 font-mono text-[10px] tracking-widest uppercase">Stage 02</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">Copilot Sync</h3>
            <p className="text-zinc-400 leading-relaxed">Transitioning to Agentic workflows. Using Enterprise LLMs to extract structured logic from raw data streams in real-time.</p>
          </div>

          <div className="reveal self-start w-full md:w-[45%] glass-card p-10 rounded-[2rem]">
            <span className="text-violet-500 font-mono text-[10px] tracking-widest uppercase">Stage 03</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">The Vault</h3>
            <p className="text-zinc-400 leading-relaxed">Implementing Amazon Q Knowledge Bases with strict governance. Secure, RAG-based intelligence for high-stakes financial environments.</p>
          </div>

          <div className="reveal self-end w-full md:w-[45%] glass-card p-10 rounded-[2rem] text-right">
            <span className="text-magenta-500 font-mono text-[10px] tracking-widest uppercase">Stage 04</span>
            <h3 className="text-white font-bold text-3xl mt-2 mb-4">Precision FSD</h3>
            <p className="text-zinc-400 leading-relaxed">The final frontier: 80% structure match and 70% time reduction in producing functional specifications ready for dev.</p>
          </div>
        </section>

        {/* Section 3: Alternating Archive */}
        <section id="archive" className="flex flex-col gap-10 mb-[40vh]">
          <div className="reveal glass-card p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
                <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">Migration Lead</h4>
                <h3 className="text-white font-bold text-4xl mb-4">Tableau Modernization</h3>
                <p className="text-zinc-400 text-lg">Directed the global reporting shift from Business Objects for a Tier-1 Bank, ensuring zero-defect data integrity across multiple DB schemas.</p>
            </div>
            <div className="text-5xl font-black text-white/5 select-none">MIGRATE</div>
          </div>

          <div className="reveal glass-card p-12 rounded-[2.5rem] flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1 text-right">
                <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">Technical POC</h4>
                <h3 className="text-white font-bold text-4xl mb-4">Fraud ML Blueprint</h3>
                <p className="text-zinc-400 text-lg">Engineered the functional architecture for a Python-based Fraud Detection system at NTT DATA, leveraging ML logic for insurance claims.</p>
            </div>
            <div className="text-5xl font-black text-white/5 select-none">INNOVATE</div>
          </div>
        </section>

        {/* Section 4: Horizon (Centered Focus) */}
        <section id="horizon" className="reveal glass-card p-16 rounded-[3rem] text-center mb-[40vh] border-dashed border-violet-500/20">
          <h3 className="text-4xl font-bold text-white mb-6">Technical Horizon</h3>
          <div className="flex justify-center gap-4 mb-8">
            <span className="px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase">Gemma 4 R&D</span>
            <span className="px-5 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-400 text-xs font-bold uppercase">n8n Automation</span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto italic">
            "Currently evaluating agentic workflows for autonomous Agile User Story generation. Testing edge-model latency for offline enterprise deployments."
          </p>
        </section>

        {/* Contact Hub */}
        <section className="reveal flex flex-col items-center text-center gap-10">
          <div className="px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
            [ STATUS: Leading AI Transformation ]
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Ready to Architect <br /> the Future?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mt-6">
            <a href="#" className="p-8 rounded-3xl glass-card text-white font-bold text-lg">LinkedIn</a>
            <button onClick={copyEmail} className="p-8 rounded-3xl glass-card text-white font-bold text-lg">{copied ? "Copied!" : "Email"}</button>
            <a href="#" className="p-8 rounded-3xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">Resume</a>
          </div>
        </section>
      </main>
    </div>
  );
}
