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
      gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  });

  return (
    <div className="w-full flex flex-col items-center font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        section { scroll-margin-top: 100px; }
        .dynamic-nav { background: ${glassNav}; backdrop-filter: blur(20px); border-bottom: 1px solid ${borderLight}; transition: all 0.7s ease; }
        .dynamic-card { background: ${glassCard}; backdrop-filter: blur(50px); border: 1px solid ${borderLight}; transition: all 0.7s ease; }
        .dynamic-card:hover { border-color: rgba(124, 58, 237, 0.4); }
        .cursor-blink::after { content: '_'; animation: blink 1s step-start infinite; color: #7c3aed; }
        @keyframes blink { 50% { opacity: 0; } }
        .metric-glow { text-shadow: 0 0 30px currentColor; }
      `}</style>

      {/* HEADER */}
      <nav className="fixed top-0 z-50 w-full flex justify-center dynamic-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className={`${textPrimary} font-black tracking-tighter text-xl uppercase`}>Kunal Madaan</div>
          <div className="hidden md:flex gap-6 items-center">
            {[
              { label: 'Identity', id: 'identity' },
              { label: 'AI Journey', id: 'aijourney' },
              { label: 'Horizon', id: 'horizon' },
              { label: 'Built With AI', id: 'builtwith' },
              { label: 'Contact', id: 'contact' },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className={`${textSecondary} hover:${textPrimary} transition-colors text-xs font-bold uppercase tracking-widest`}>
                {item.label}
              </a>
            ))}
            <a href="/kunal-madaan.pdf" target="_blank" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20">Resume</a>
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`${textSecondary} hover:${textPrimary} transition-colors ml-2`}>
              {isDark ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
          </div>
        <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`${textSecondary}`}>
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${textPrimary}`}>
              {isMenuOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 ${isDark ? 'bg-[#030303]/95' : 'bg-[#FFF8E7]/95'} backdrop-blur-3xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-10'}`}>
        {[
          { label: 'Identity', id: 'identity' },
          { label: 'AI Journey', id: 'aijourney' },
          { label: 'Horizon', id: 'horizon' },
          { label: 'Built With AI', id: 'builtwith' },
          { label: 'Contact', id: 'contact' },
        ].map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={() => setIsMenuOpen(false)} className={`${textPrimary} text-2xl font-black uppercase tracking-widest`}>
            {item.label}
          </a>
        ))}
        <a href="/kunal-madaan.pdf" target="_blank" className="bg-violet-600 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest mt-4">Full Resume</a>
      </div>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-12 pt-40 pb-60 relative">

        {/* SECTION 1: IDENTITY */}
        <section id="identity" className="flex flex-col gap-12 mb-[40vh] reveal relative">

          {/* HERO CARD - Responsive padding and radius */}
          <div className="dynamic-card p-6 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] flex flex-col items-center text-center gap-6 w-full max-w-5xl mx-auto shadow-2xl relative overflow-hidden border-violet-500/20">
            <div className={`absolute inset-0 opacity-20 pointer-events-none ${isDark ? 'bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10' : 'bg-gradient-to-br from-violet-400/5 to-fuchsia-400/5'}`} />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <span className={`${isDark ? 'text-violet-400' : 'text-violet-700'} font-mono text-base md:text-lg tracking-widest uppercase font-bold`}>Senior Techno-Functional BSA & AI Architect</span>

              {/* FIX 1: Break-words and text scaling */}
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${textPrimary} leading-tight tracking-tight break-words max-w-full px-2`}>
                I automate the work<br />that slows enterprises down.
              </h2>

              <p className={`${textSecondary} text-base sm:text-lg md:text-xl max-w-full md:max-w-2xl leading-relaxed break-words px-2`}>
                7+ years bridging legacy enterprise complexity and modern GenAI delivery. Certified Scrum Master (CSM®) and Product Owner (CSPO®) across Banking, Retail, Healthcare, and Insurance.
              </p>

              {/* FIX 2: Fluid Metrics Bar */}
              <div className={`flex flex-wrap md:flex-nowrap justify-center gap-4 sm:gap-6 md:gap-8 mt-2 px-4 sm:px-6 md:px-8 py-4 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
                <div className="text-center w-full sm:w-auto">
                  <div className={`text-3xl font-black metric-glow ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>70%</div>
                  <div className={`${textSecondary} text-[10px] uppercase font-bold mt-1 tracking-widest`}>FSD Time Saved</div>
                </div>
                
                <div className={`hidden sm:block w-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                
                <div className="text-center w-[40%] sm:w-auto">
                  <div className={`text-3xl font-black metric-glow ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>80%+</div>
                  <div className={`${textSecondary} text-[10px] uppercase font-bold mt-1 tracking-widest`}>Structure Match</div>
                </div>
                
                <div className={`hidden sm:block w-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                
                <div className="text-center w-[40%] sm:w-auto">
                  <div className={`text-3xl font-black metric-glow ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}>7+</div>
                  <div className={`${textSecondary} text-[10px] uppercase font-bold mt-1 tracking-widest`}>Years Enterprise</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <span className={`px-5 py-2.5 rounded-xl border ${isDark ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-violet-600/40 bg-violet-600/15 text-violet-900'} text-xs font-bold tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.1)]`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> CSM® & CSPO®
                </span>
                <span className={`px-5 py-2.5 rounded-xl border ${isDark ? 'border-zinc-500/30 bg-white/5 text-zinc-300' : 'border-slate-500/40 bg-slate-900/10 text-slate-900'} text-xs font-bold tracking-widest flex items-center gap-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> GenAI Foundations
                </span>
                <span className={`px-5 py-2.5 rounded-xl border ${isDark ? 'border-teal-500/30 bg-teal-500/10 text-teal-300' : 'border-teal-600/40 bg-teal-600/15 text-teal-900'} text-xs font-bold tracking-widest flex items-center gap-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> RAG Architect
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="dynamic-card p-8 rounded-3xl flex flex-col gap-3">
              <span className="text-violet-500 font-mono text-xs font-bold uppercase tracking-widest">Dec 2023 — Present</span>
              <h3 className={`${textPrimary} text-2xl font-black`}>Epsilon</h3>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                Driving AI transformation for <strong>Tier-1 Financial Leaders</strong> and <strong>Global Retailers</strong> — specializing in RAG pipelines and deep SQL data audits.
              </p>
              <div className={`mt-auto pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <span className={`text-teal-500 font-black text-lg`}>70%</span>
                <span className={`${textSecondary} text-xs font-bold uppercase ml-2`}>FSD turnaround cut</span>
              </div>
            </div>
            <div className="dynamic-card p-8 rounded-3xl flex flex-col gap-3">
              <span className="text-violet-500 font-mono text-xs font-bold uppercase tracking-widest">Nov 2021 — Oct 2023</span>
              <h3 className={`${textPrimary} text-2xl font-black`}>NTT Data</h3>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                Engineered an <strong>ML Fraud Detection POC</strong> and owned the full requirements lifecycle for <strong>US Healthcare</strong> radiology systems.
              </p>
              <div className={`mt-auto pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <span className={`text-fuchsia-500 font-black text-lg`}>2</span>
                <span className={`${textSecondary} text-xs font-bold uppercase ml-2`}>Enterprise domains</span>
              </div>
            </div>
            <div className="dynamic-card p-8 rounded-3xl flex flex-col gap-3">
              <span className="text-violet-500 font-mono text-xs font-bold uppercase tracking-widest">Aug 2018 — May 2021</span>
              <h3 className={`${textPrimary} text-2xl font-black`}>Crestech Systems</h3>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                Directed end-to-end QA for <strong>Max Life Insurance</strong> product streams, ensuring <strong>100% data integrity</strong> across mobile and web platforms.
              </p>
              <div className={`mt-auto pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <span className={`text-violet-500 font-black text-lg`}>100%</span>
                <span className={`${textSecondary} text-xs font-bold uppercase ml-2`}>Release integrity</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI JOURNEY */}
        <section id="aijourney" className="flex flex-col gap-[20vh] mb-[40vh]">
          <div className="w-full dynamic-card p-10 md:p-14 rounded-[3rem] reveal border-violet-500/10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-600/15 text-violet-800'}`}>Enterprise RAG Architecture</span>
                <h3 className={`${textPrimary} text-3xl font-black mt-6 mb-4 tracking-tight`}>Multi-Stage AI Pipeline</h3>
                <p className={`${textSecondary} text-lg leading-relaxed mb-6`}>
                  Engineered a hallucination-free documentation pipeline at RBC. Leveraged Enterprise Copilot to feed a secure Knowledge Base fortified with strict guardrails — turning a 6-day manual process into a 2-day automated one.
                </p>
                <div className="flex gap-8">
                  <div>
                    <div className={`text-teal-500 text-4xl font-black metric-glow`}>80%</div>
                    <div className={`${textSecondary} text-xs uppercase font-bold mt-1`}>Structure Match</div>
                  </div>
                  <div>
                    <div className={`text-violet-500 text-4xl font-black metric-glow`}>70%</div>
                    <div className={`${textSecondary} text-xs uppercase font-bold mt-1`}>Time Saved</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-mono">&gt;_</div>
                  <span className={`text-xs ${isDark ? 'text-white' : 'text-slate-800'} font-black uppercase tracking-wider`}>Copilot</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Intent Extract</span>
                </div>
                <div className="h-6 w-px md:h-px md:w-6 bg-teal-500/30" />
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center min-w-[140px]">
                  <div className="w-8 h-8 rounded bg-violet-600 flex items-center justify-center text-white text-xs font-mono font-bold">Q</div>
                  <span className={`text-xs ${isDark ? 'text-white' : 'text-slate-800'} font-black uppercase tracking-wider`}>Knowledge Base</span>
                  <span className="text-[10px] text-violet-500 font-bold uppercase tracking-tighter">Guardrails</span>
                </div>
                <div className="h-6 w-px md:h-px md:w-6 bg-teal-500/30" />
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-teal-400 text-xs font-mono font-bold">FSD</div>
                  <span className={`text-xs ${isDark ? 'text-white' : 'text-slate-800'} font-black uppercase tracking-wider`}>Structured</span>
                  <span className="text-[10px] text-teal-600 font-bold uppercase">Accurate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="node-right self-end w-full md:w-[50%] dynamic-card p-10 rounded-3xl md:text-right group relative overflow-hidden reveal">
            <div className="group-hover:opacity-0 transition-opacity duration-300">
              <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}>Insurance ML POC</span>
              <h3 className={`${textPrimary} text-4xl font-black mt-2 mb-4`}>Claims Fraud MVP</h3>
              <p className={`${textSecondary} text-lg leading-relaxed`}>Automated manual fraud detection by mapping high-risk indicators to predictive model architectures.</p>
            </div>
            <div className="absolute inset-0 bg-fuchsia-900/95 backdrop-blur-3xl p-10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center text-white text-left">
              <h4 className="font-bold mb-3 font-mono text-sm uppercase tracking-widest text-fuchsia-300">PnC Insurance Logic:</h4>
              <p className="text-base leading-relaxed">Collaborated with Data Science teams to feature-engineer complex indicators for anomaly detection models.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: HORIZON */}
        <section id="horizon" className="flex flex-col gap-10 mb-[40vh]">

          <div className={`reveal dynamic-card p-12 rounded-3xl text-center border-dashed ${isDark ? 'border-violet-500/20' : 'border-violet-500/40'}`}>
            <h3 className={`text-3xl font-black ${textPrimary} mb-8`}>Generative AI R&D Sandbox</h3>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="group relative">
                <span className={`px-6 py-3 rounded-full border text-sm font-bold uppercase cursor-help transition-all ${isDark ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20' : 'bg-violet-600/15 border-violet-600/40 text-violet-800 hover:bg-violet-600/25'}`}>Gemma 4 31B IT</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 h-40 bg-black/95 rounded-xl border border-violet-500/40 opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex items-center justify-center text-xs text-zinc-300 p-6 leading-relaxed shadow-xl z-10">
                  Evaluating open-weight models for secure, offline documentation workflows without cloud data leakage.
                </div>
              </div>
              <div className="group relative">
                <span className={`px-6 py-3 rounded-full border text-sm font-bold uppercase cursor-help transition-all ${isDark ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/20' : 'bg-fuchsia-600/15 border-fuchsia-600/40 text-fuchsia-800 hover:bg-fuchsia-600/25'}`}>Local LLM Parity</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 h-40 bg-black/95 rounded-xl border border-fuchsia-500/40 opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex items-center justify-center text-xs text-zinc-300 p-6 leading-relaxed shadow-xl z-10">
                  Achieving Enterprise Copilot parity on local hardware — zero API cost, zero data leakage risk.
                </div>
              </div>
            </div>
            <p className={`${textSecondary} text-xl max-w-2xl mx-auto italic font-mono cursor-blink`}>
              "Converting unstructured whiteboard notes into standardized BDD User Stories".
            </p>
          </div>

          <div className="reveal dynamic-card p-10 md:p-14 rounded-[3rem] border-teal-500/20 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className={`absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br ${isDark ? 'from-teal-500/20 to-violet-500/10' : 'from-teal-400/10 to-violet-400/5'}`} />

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-600/15 text-teal-800'}`}>Agentic Workflow Engineering</span>
                <h3 className={`${textPrimary} text-3xl font-black mt-6 mb-4 tracking-tight`}>AI-Powered Job Hunt Machine</h3>
                <p className={`${textSecondary} text-lg leading-relaxed mb-6`}>
                  I don't just work in AI — I use AI to get my next role. Built an end-to-end n8n pipeline: feed it a job description, and while I sleep, it scores the match, rewrites my resume bullets to mirror the role's exact ROI language, and surfaces the hiring manager's contact.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['n8n', 'Claude API', 'Webhook Triggers', 'ATS Scoring', 'Auto-Prospecting'].map((tag) => (
                    <span key={tag} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' : 'bg-teal-600/10 border border-teal-600/20 text-teal-800'}`}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Pipeline visual */}
              <div className="flex-1 w-full flex flex-col gap-3">
                {[
                  { step: '01', label: 'Job Description', sub: 'Webhook ingestion', color: 'violet' },
                  { step: '02', label: 'ATS Match Score', sub: 'Claude API scoring', color: 'fuchsia' },
                  { step: '03', label: 'Resume Rewrite', sub: 'Dynamic bullet points', color: 'teal' },
                  { step: '04', label: 'Hiring Manager', sub: 'Auto-prospecting', color: 'teal' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-black/5 border border-black/5'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-xs flex-shrink-0 ${
                      item.color === 'violet' ? (isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-500/15 text-violet-700') :
                      item.color === 'fuchsia' ? (isDark ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-fuchsia-500/15 text-fuchsia-700') :
                      (isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-500/15 text-teal-700')
                    }`}>{item.step}</div>
                    <div>
                      <div className={`${textPrimary} font-black text-sm`}>{item.label}</div>
                      <div className={`${textSecondary} text-xs font-bold uppercase tracking-wider`}>{item.sub}</div>
                    </div>
                    {i < 3 && <div className={`ml-auto w-px h-6 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: HOW THIS WAS BUILT — Maker's Manifesto */}
        <section id="builtwith" className="reveal mb-[20vh]">
          <div className="dynamic-card rounded-[3rem] overflow-hidden relative">
            <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-teal-400" />

            <div className="p-10 md:p-16">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                <div>
                  <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>Transparency Log</span>
                  <h3 className={`text-4xl md:text-5xl font-black ${textPrimary} mt-3 tracking-tight leading-tight`}>I didn't buy this.<br />I built it.</h3>
                </div>
                <p className={`${textSecondary} text-base max-w-sm leading-relaxed md:text-right`}>
                  No hand-written code. No template. No shortcuts. Here's the exact workflow — honest, start to finish.
                </p>
              </div>

              {/* Honest context line */}
              <p className={`${textSecondary} text-sm leading-relaxed mb-10 max-w-3xl px-1`}>
                The entire codebase was generated by AI. What I brought was the <strong>vision, the architecture decisions, the prompt engineering discipline, and the relentless iteration</strong> to debug, refine, and enhance until the output matched my standard. In 2026, that is building.
              </p>

              {/* Pipeline flow — horizontal on desktop */}
              <div className="flex flex-col md:flex-row items-stretch gap-3 mb-10">
                {[
                  { step: '01', color: 'violet', label: 'Vision → Gemini', detail: 'I described the full product — scroll-driven 3D universe, glassmorphism UI, dark/light theming, each section\'s purpose. Gemini\'s job: translate my vision into a precision prompt for Gemma 4.' },
                  { step: '02', color: 'fuchsia', label: 'Gemini → Gemma 4', detail: 'Gemini crafted an optimized, technically detailed prompt. Gemma 4 31B IT — running locally on my machine — generated the full React + Three.js + GSAP codebase from that prompt.' },
                  { step: '03', color: 'teal', label: 'Debug → Iterate', detail: 'First output had bugs. I diagnosed each one, rewrote my prompts with more precise constraints, and re-ran. Multiple cycles. This is where most people give up. I didn\'t.' },
                  { step: '04', color: 'zinc', label: 'Enhance → Ship', detail: 'Once stable, I drove UI enhancement rounds — every visual upgrade, every interaction improvement was my idea. GitHub push → Vercel auto-deploy. Zero local setup, zero drama.' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-3">
                    <div className={`p-6 rounded-2xl flex flex-col gap-3 h-full ${
                      item.color === 'violet' ? (isDark ? 'bg-violet-500/5 border border-violet-500/15' : 'bg-violet-500/5 border border-violet-500/20') :
                      item.color === 'fuchsia' ? (isDark ? 'bg-fuchsia-500/5 border border-fuchsia-500/15' : 'bg-fuchsia-500/5 border border-fuchsia-500/20') :
                      item.color === 'teal' ? (isDark ? 'bg-teal-500/5 border border-teal-500/15' : 'bg-teal-500/5 border border-teal-500/20') :
                      (isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10')
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.color === 'violet' ? (isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-500/15 text-violet-700') :
                          item.color === 'fuchsia' ? (isDark ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-fuchsia-500/15 text-fuchsia-700') :
                          item.color === 'teal' ? (isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-500/15 text-teal-700') :
                          (isDark ? 'bg-white/10 text-zinc-400' : 'bg-black/10 text-slate-600')
                        }`}>{item.step}</span>
                        <span className={`${textPrimary} font-black text-sm`}>{item.label}</span>
                      </div>
                      <p className={`${textSecondary} text-xs leading-relaxed`}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What this proves callout */}
              <div className={`rounded-2xl p-6 mb-10 ${isDark ? 'bg-violet-500/5 border border-violet-500/15' : 'bg-violet-500/5 border border-violet-500/20'}`}>
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>Why this matters to you as a hiring manager</span>
                <p className={`${textSecondary} text-sm leading-relaxed mt-3`}>
                  This is exactly the skill set driving enterprise AI adoption right now. The ability to <strong>define a complex outcome, engineer precise prompts to achieve it, and iterate through failure until it works</strong> — that's not a hobbyist's workflow. That's a production mindset applied to a new toolchain. Every enterprise buying GitHub Copilot, Amazon Q, or Gemini for Workspace needs people who can do this at scale.
                </p>
              </div>

              {/* Bottom manifesto + tags */}
              <div className={`border-t pt-8 ${isDark ? 'border-white/10' : 'border-black/10'} flex flex-col md:flex-row items-center justify-between gap-4`}>
                <p className={`font-mono text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'} leading-relaxed max-w-lg italic`}>
                  "The best engineers in 2026 don't write every line. They know exactly what every line should do."
                </p>
                <div className="flex gap-3 flex-wrap justify-center md:justify-end">
                  {['Gemini', 'Gemma 4 31B', 'Prompt Engineering', 'React', 'Three.js', 'GSAP', 'Vite', 'GitHub', 'Vercel'].map((tag) => (
                    <span key={tag} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-white/5 border border-white/10 text-zinc-400' : 'bg-black/5 border border-black/10 text-slate-600'}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

       // ... keep existing imports and styles ...

{/* SECTION 4: CONTACT - FIXED GLASS BOX */}
<section id="contact" className="reveal flex flex-col items-center justify-center">
  <div className={`dynamic-card p-8 md:p-16 rounded-[3rem] flex flex-col items-center text-center gap-10 w-full max-w-5xl mx-auto shadow-2xl`}>
    <h2 className={`text-5xl md:text-7xl font-black ${textPrimary} tracking-tight`}>
      Let's build something<br />that actually scales.
    </h2>
    <p className={`${textSecondary} text-lg max-w-xl`}>
      Open to Senior BSA, AI Product Owner, and GenAI Consultant roles. Based in Bengaluru — open to remote.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-2">
      <a href="https://www.linkedin.com/in/kunal-madaan-bsa/" target="_blank" rel="noreferrer" className={`p-6 rounded-2xl dynamic-card hover:bg-violet-500/5 transition-all ${textPrimary} font-bold text-lg`}>
        LinkedIn
      </a>
      <button onClick={copyEmail} className={`p-6 rounded-2xl border transition-all font-bold text-lg ${copied ? 'bg-violet-500/20 border-violet-500 text-violet-500' : `dynamic-card border-transparent ${textPrimary}`}`}>
        {copied ? "Copied Email!" : "Copy Email"}
      </button>
      <a href="/kunal-madaan.pdf" target="_blank" rel="noreferrer" className={`p-6 rounded-2xl ${isDark ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-zinc-200' : 'bg-slate-900 text-white shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:bg-slate-800'} transition-all font-bold text-lg`}>
        Full Resume
      </a>
    </div>
  </div>
</section>

      </main>
    </div>
  );
}
