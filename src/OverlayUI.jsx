import React, { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function OverlayUI({ theme, setTheme }) {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const copyEmail = async () => {
    await navigator.clipboard.writeText("kunal.madaan.work@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textPrimary = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-zinc-400" : "text-slate-800";
  const glassNav = isDark ? "rgba(5, 5, 5, 0.85)" : "rgba(255, 255, 255, 0.85)";
  const glassCard = isDark ? "rgba(10, 10, 10, 0.92)" : "rgba(255, 248, 231, 0.92)";
  const borderLight = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)";

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, { 
        opacity: 1, y: 0, duration: 1, ease: "power3.out", 
        scrollTrigger: { trigger: el, start: 'top 85%' } 
      });
    });
  });

  return (
    <div className="w-full flex flex-col items-center font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Space+Mono:wght@400;700&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .dynamic-nav { background: ${glassNav}; backdrop-filter: blur(20px); border-bottom: 1px solid ${borderLight}; }
        .dynamic-card { background: ${glassCard}; backdrop-filter: blur(50px); border: 1px solid ${borderLight}; transition: all 0.5s ease; }
        .dynamic-card:hover { border-color: rgba(124, 58, 237, 0.4); }
        .cursor-blink::after { content: '_'; animation: blink 1s step-start infinite; color: #7c3aed; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      {/* HEADER [cite: 104-114] */}
      <nav className="fixed top-0 z-50 w-full flex justify-center dynamic-nav pointer-events-auto">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className={`${textPrimary} font-black tracking-tighter text-xl uppercase`}>Kunal Madaan</div>
          <div className="hidden md:flex gap-6 items-center">
            {['identity', 'aijourney', 'horizon', 'builtwith', 'contact'].map((id) => (
              <a key={id} href={`#${id}`} className={`${textSecondary} hover:${textPrimary} transition-colors text-xs font-bold uppercase tracking-widest`}>
                {id.replace('with', ' With AI')}
              </a>
            ))}
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`${textSecondary} hover:${textPrimary} ml-4`}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <a href="/kunal-madaan.pdf" target="_blank" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">Resume</a>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-12 pt-40 pb-60 relative">
        
        {/* IDENTITY [cite: 118-143] */}
        <section id="identity" className="flex flex-col gap-12 mb-[40vh] reveal pointer-events-auto">
          <div className="dynamic-card p-10 md:p-16 rounded-[3rem] flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden">
            <span className="text-violet-400 font-mono text-sm tracking-widest uppercase font-bold">Senior Techno-Functional BSA & AI Architect [cite: 120]</span>
            <h2 className={`text-4xl md:text-5xl font-black ${textPrimary} leading-tight`}>I automate the work<br />that slows enterprises down. [cite: 121]</h2>
            <div className={`flex gap-8 py-4 px-8 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <div className="text-center">
                  <div className="text-3xl font-black text-teal-400">70% [cite: 125]</div>
                  <div className={`${textSecondary} text-[10px] uppercase font-bold`}>FSD Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-violet-400">80%+ [cite: 127]</div>
                  <div className={`${textSecondary} text-[10px] uppercase font-bold`}>Structure Match</div>
                </div>
            </div>
          </div>
        </section>

        {/* AI JOURNEY [cite: 144-158] */}
        <section id="aijourney" className="flex flex-col gap-12 mb-[40vh] reveal pointer-events-auto">
          <div className="dynamic-card p-10 md:p-14 rounded-[3rem] border-violet-500/10">
            <h3 className={`${textPrimary} text-3xl font-black mb-6`}>Multi-Stage AI Pipeline [cite: 145]</h3>
            <p className={`${textSecondary} text-lg leading-relaxed`}>
              Engineered a hallucination-free documentation pipeline at RBC. Leveraged Enterprise Copilot to feed a secure Knowledge Base fortified with strict guardrails[cite: 146, 147].
            </p>
          </div>
        </section>

        {/* HORIZON / AGENTIC WORKFLOWS [cite: 159-177] */}
        <section id="horizon" className="flex flex-col gap-10 mb-[40vh] reveal pointer-events-auto">
           <div className="dynamic-card p-10 md:p-14 rounded-[3rem] border-teal-500/20">
              <span className="text-teal-400 font-bold uppercase text-xs tracking-widest">Agentic Workflow Engineering [cite: 167]</span>
              <h3 className={`${textPrimary} text-3xl font-black mt-4 mb-6`}>AI-Powered Job Hunt Machine [cite: 168]</h3>
              <p className={`${textSecondary} text-lg mb-8`}>Built an n8n pipeline that scores matches and rewrites resume bullets to mirror ROI language while I sleep[cite: 169].</p>
              <div className="flex flex-wrap gap-3">
                {['n8n', 'Claude API', 'ATS Scoring', 'Auto-Prospecting'].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">{t}</span>
                ))}
              </div>
           </div>
        </section>

        {/* BUILT WITH AI / MANIFESTO [cite: 178-209] */}
        <section id="builtwith" className="reveal mb-[20vh] pointer-events-auto">
          <div className="dynamic-card rounded-[3rem] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-teal-400" />
            <div className="p-10 md:p-16">
              <h3 className={`text-4xl font-black ${textPrimary} mb-4`}>I didn't buy this. I built it. [cite: 180]</h3>
              <p className={`${textSecondary} text-sm mb-10`}>The entire codebase was generated by AI—driven by my vision and prompt engineering discipline[cite: 183]. In 2026, this is building[cite: 184].</p>
            </div>
          </div>
        </section>

        {/* CONTACT [cite: 210-215] */}
        <section id="contact" className="reveal flex flex-col items-center text-center gap-10 pointer-events-auto">
          <h2 className={`text-5xl md:text-7xl font-black ${textPrimary} tracking-tight`}>Let's build something<br />that actually scales. [cite: 210]</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <button onClick={copyEmail} className={`p-6 rounded-2xl border transition-all font-bold text-lg dynamic-card ${copied ? 'text-violet-500 border-violet-500' : textPrimary}`}>
              {copied ? "Email Copied!" : "kunal.madaan.work@gmail.com"}
            </button>
            <a href="https://linkedin.com/in/kunal-madaan-bsa/" target="_blank" className="p-6 rounded-2xl bg-white text-black font-bold text-lg">LinkedIn</a>
          </div>
        </section>

      </main>
    </div>
  );
}
