// File 3: OverlayUI.jsx
import React, { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// 1. Receive theme props from App.jsx
export default function OverlayUI({ theme, setTheme }) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const copyEmail = async () => {
    await navigator.clipboard.writeText("Kunal.madaan.work@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  useGSAP(() => {
    gsap.utils.toArray('.node-left').forEach((section) => {
      gsap.fromTo(section, { opacity: 0, x: -100 }, { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 35%', scrub: 1 } });
    });
    gsap.utils.toArray('.node-right').forEach((section) => {
      gsap.fromTo(section, { opacity: 0, x: 100 }, { opacity: 1, x: 0, scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 35%', scrub: 1 } });
    });
    gsap.utils.toArray('.fade-up').forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
    });
  });

  // Dynamic Tailwind Classes based on Theme
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-slate-600";
  const glassNav = isDark ? "rgba(5, 5, 5, 0.7)" : "rgba(255, 255, 255, 0.7)";
  const glassCard = isDark ? "rgba(15, 15, 15, 0.4)" : "rgba(255, 255, 255, 0.6)";
  const borderLight = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 100px; }
        .dynamic-nav { background: ${glassNav}; backdrop-filter: blur(15px); border-bottom: 1px solid ${borderLight}; transition: all 0.7s ease; }
        .dynamic-card { background: ${glassCard}; backdrop-filter: blur(20px); border: 1px solid ${borderLight}; transition: all 0.7s ease; }
        .dynamic-card:hover { border-color: rgba(124, 58, 237, 0.4); transform: translateY(-5px); }
      `}</style>

      {/* HEADER */}
      <nav className="fixed top-0 z-50 w-full flex justify-center dynamic-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className={`${textPrimary} font-bold tracking-tighter text-xl transition-colors duration-700`}>Kunal Madaan</div>
          <div className="flex gap-6 items-center">
            {['Identity', 'Journey', 'Archive', 'Horizon'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`hidden md:block ${textSecondary} hover:${textPrimary} transition-colors text-xs font-medium uppercase tracking-widest`}>
                {item}
              </a>
            ))}
            
            {/* THEME TOGGLE BUTTON */}
            <button onClick={toggleTheme} className={`${textSecondary} hover:${textPrimary} transition-colors ml-4`}>
              {isDark ? (
                /* Sun Icon (Click to go Light) */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                /* Moon Icon (Click to go Dark) */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-12 pt-40 pb-60 overflow-hidden">
        
        {/* IDENTITY */}
        <section id="identity" className="fade-up flex flex-col items-center text-center gap-6 mb-[40vh] mt-10">
          <span className="text-violet-500 font-mono text-sm md:text-base tracking-widest uppercase font-bold">Techno-Functional Architect</span>
          <h2 className={`text-5xl md:text-7xl font-bold ${textPrimary} leading-tight transition-colors duration-700`}>
            Bridging Data <br /> To Enterprise Value.
          </h2>
          <p className={`${textSecondary} text-lg md:text-xl max-w-2xl leading-relaxed transition-colors duration-700`}>
            7+ years of experience across Tier-1 Financial Institutions and Retailers, transforming complex technical ambiguity into precision roadmaps.
          </p>
        </section>

        {/* JOURNEY */}
        <section id="journey" className="flex flex-col gap-[30vh] mb-[40vh] w-full relative">
          <div className="node-left self-start w-full md:w-[45%] dynamic-card p-10 rounded-3xl">
            <span className="text-violet-500 font-mono text-xs tracking-widest uppercase font-bold">Stage 01</span>
            <h3 className={`${textPrimary} font-bold text-3xl mt-2 mb-4 transition-colors duration-700`}>Manual Intake</h3>
            <p className={`${textSecondary} leading-relaxed transition-colors duration-700`}>The bottleneck of legacy BSA work. Fragmented requirements and raw stakeholder intent parsed through traditional SDLC frameworks.</p>
          </div>

          <div className="node-right self-end w-full md:w-[45%] dynamic-card p-10 rounded-3xl md:text-right">
            <span className="text-magenta-500 font-mono text-xs tracking-widest uppercase font-bold">Stage 02</span>
            <h3 className={`${textPrimary} font-bold text-3xl mt-2 mb-4 transition-colors duration-700`}>Copilot Sync</h3>
            <p className={`${textSecondary} leading-relaxed transition-colors duration-700`}>Transitioning to Agentic workflows. Using Enterprise LLMs to extract structured logic from raw data streams in real-time.</p>
          </div>

          <div className="node-left self-start w-full md:w-[45%] dynamic-card p-10 rounded-3xl">
            <span className="text-violet-500 font-mono text-xs tracking-widest uppercase font-bold">Stage 03</span>
            <h3 className={`${textPrimary} font-bold text-3xl mt-2 mb-4 transition-colors duration-700`}>The Vault</h3>
            <p className={`${textSecondary} leading-relaxed transition-colors duration-700`}>Implementing Amazon Q Knowledge Bases with strict governance. Secure, RAG-based intelligence for high-stakes financial environments.</p>
          </div>

          <div className="node-right self-end w-full md:w-[45%] dynamic-card p-10 rounded-3xl md:text-right">
            <span className="text-magenta-500 font-mono text-xs tracking-widest uppercase font-bold">Stage 04</span>
            <h3 className={`${textPrimary} font-bold text-3xl mt-2 mb-4 transition-colors duration-700`}>Precision FSD</h3>
            <p className={`${textSecondary} leading-relaxed transition-colors duration-700`}>The final frontier: 80% structure match and 70% time reduction in producing functional specifications ready for dev.</p>
          </div>
        </section>

        {/* ARCHIVE */}
        <section id="archive" className="fade-up flex flex-col items-start gap-8 mb-[40vh]">
          <span className="text-violet-500 font-mono text-xs tracking-widest uppercase font-bold">Impact Archive</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="p-10 rounded-3xl dynamic-card group">
              <h4 className={`${textPrimary} font-bold text-2xl mb-3 group-hover:text-violet-500 transition-colors duration-700`}>NTT DATA ML POC</h4>
              <p className={`${textSecondary} text-base leading-relaxed transition-colors duration-700`}>Engineered the functional blueprint for an ML-driven fraud detection system in insurance.</p>
            </div>
            <div className="p-10 rounded-3xl dynamic-card group">
              <h4 className={`${textPrimary} font-bold text-2xl mb-3 group-hover:text-magenta-500 transition-colors duration-700`}>Tableau Migration</h4>
              <p className={`${textSecondary} text-base leading-relaxed transition-colors duration-700`}>Directed end-to-end reporting migration from Business Objects for a Tier-1 North American Bank.</p>
            </div>
          </div>
        </section>

        {/* HORIZON */}
        <section id="horizon" className={`fade-up dynamic-card p-12 rounded-3xl text-center mb-[40vh] border-dashed ${isDark ? 'border-violet-500/20' : 'border-violet-500/40'}`}>
          <h3 className={`text-3xl font-bold ${textPrimary} mb-6 transition-colors duration-700`}>Technical Horizon</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase">Google Gemma 4</span>
            <span className="px-5 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-600 dark:text-magenta-400 text-xs font-bold uppercase">n8n Automation</span>
          </div>
          <p className={`${textSecondary} text-lg max-w-2xl mx-auto italic transition-colors duration-700`}>
            "Currently evaluating agentic workflows for autonomous Agile User Story generation. Testing edge-model latency for offline enterprise deployments."
          </p>
        </section>

        {/* CONTACT */}
        <section className="fade-up flex flex-col items-center text-center gap-10">
          <div className="px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
            [STATUS: Leading AI Transformation]
          </div>
          <h2 className={`text-4xl md:text-6xl font-bold ${textPrimary} transition-colors duration-700`}>Ready for the next <br /> frontier?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-4">
            <a href="#" className={`p-6 rounded-2xl dynamic-card ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-900/5'} transition-all ${textPrimary} font-bold text-lg`}>
              LinkedIn
            </a>
            <button onClick={copyEmail} className={`p-6 rounded-2xl border transition-all font-bold text-lg ${copied ? 'bg-violet-500/20 border-violet-500 text-violet-600 dark:text-violet-400' : `dynamic-card border-transparent ${textPrimary} ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-900/5'}`}`}>
              {copied ? "Copied Email!" : "Copy Email"}
            </button>
            <a href="#" className={`p-6 rounded-2xl ${isDark ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.1)]'} transition-all font-bold text-lg`}>
              Full Resume
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
