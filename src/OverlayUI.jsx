import React, { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function OverlayUI({ theme, setTheme }) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const copyEmail = async () => {
    await navigator.clipboard.writeText("kunal.madaan.work@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-slate-600";
  const glassNav = isDark ? "rgba(5, 5, 5, 0.85)" : "rgba(255, 255, 255, 0.85)";
  const glassCard = isDark ? "rgba(10, 10, 10, 0.9)" : "rgba(255, 248, 231, 0.95)";
  const borderLight = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";

  useGSAP(() => {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, scrollTrigger: { trigger: el, start: 'top 90%', scrub: 1 } });
    });
  });

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 100px; }
        .dynamic-nav { background: ${glassNav}; backdrop-filter: blur(20px); border-bottom: 1px solid ${borderLight}; transition: all 0.7s ease; }
        .dynamic-card { background: ${glassCard}; backdrop-filter: blur(50px); border: 1px solid ${borderLight}; transition: all 0.7s ease; }
        .dynamic-card:hover { border-color: rgba(124, 58, 237, 0.4); }
        .cursor-blink::after { content: '_'; animation: blink 1s step-start infinite; color: #7c3aed; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      {/* HEADER */}
      <nav className="fixed top-0 z-50 w-full flex justify-center dynamic-nav">
        <div className="w-full max-w-6xl flex justify-between items-center py-4 px-6 md:px-8">
          <div className={`${textPrimary} font-bold tracking-tighter text-xl uppercase`}>Kunal Madaan</div>
          <div className="flex gap-6 items-center">
            {['Identity', 'AI Journey', 'Archive', 'Horizon'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className={`hidden md:block ${textSecondary} hover:${textPrimary} transition-colors text-xs font-bold uppercase tracking-widest`}>
                {item}
              </a>
            ))}
            <a href="/kunal-madaan.pdf" target="_blank" className="hidden lg:block bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20">Resume</a>
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`${textSecondary} hover:${textPrimary} transition-colors ml-2`}>
              {isDark ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl flex flex-col px-6 md:px-12 pt-40 pb-60">
        
        {/* SECTION 1: IDENTITY */}
        <section id="identity" className="flex flex-col gap-12 mb-[40vh]">
          <div className="flex flex-col items-center text-center gap-6">
            <span className={`${isDark ? 'text-violet-400' : 'text-violet-600'} font-mono text-sm tracking-widest uppercase font-bold`}>Senior Techno-Functional BSA</span>
            <h2 className={`text-5xl md:text-7xl font-bold ${textPrimary} leading-tight`}>Bridging Data To Enterprise Value.</h2>
            <p className={`${textSecondary} text-lg max-w-2xl leading-relaxed`}>
              7+ years of experience bridging enterprise architecture and Agile delivery. Certified Scrum Master (CSM®) and Product Owner (CSPO®).
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <span className={`px-4 py-1.5 rounded-full border ${isDark ? 'border-white/10 text-zinc-400' : 'border-black/5 text-slate-600'} text-[10px] font-bold uppercase`}>CSM® & CSPO®</span>
              <span className={`px-4 py-1.5 rounded-full border ${isDark ? 'border-white/10 text-zinc-400' : 'border-black/5 text-slate-600'} text-[10px] font-bold uppercase`}>GenAI Foundations</span>
              <span className={`px-4 py-1.5 rounded-full border ${isDark ? 'border-white/10 text-zinc-400' : 'border-black/5 text-slate-600'} text-[10px] font-bold uppercase`}>Design Thinking</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dynamic-card p-8 rounded-3xl">
              <span className="text-violet-500 font-mono text-[10px] font-bold uppercase tracking-widest">Dec 2023 — Present</span>
              <h3 className={`${textPrimary} text-xl font-bold mt-2`}>Epsilon</h3>
              <p className={`${textSecondary} text-sm mt-4 leading-relaxed`}>
                Driving transformation for **Tier-1 Financial Leaders** and **Global Retailers**, specializing in AI pipelines and deep-dive data audits.
              </p>
            </div>
            <div className="dynamic-card p-8 rounded-3xl">
              <span className="text-violet-500 font-mono text-[10px] font-bold uppercase tracking-widest">Nov 2021 — Oct 2023</span>
              <h3 className={`${textPrimary} text-xl font-bold mt-2`}>NTT Data</h3>
              <p className={`${textSecondary} text-sm mt-4 leading-relaxed`}>
                Engineered an ML-driven Fraud Detection POC, translating complex insurance workflows into predictive data models.
              </p>
            </div>
            <div className="dynamic-card p-8 rounded-3xl">
              <span className="text-violet-500 font-mono text-[10px] font-bold uppercase tracking-widest">Aug 2018 — May 2021</span>
              <h3 className={`${textPrimary} text-xl font-bold mt-2`}>Crestech Systems</h3>
              <p className={`${textSecondary} text-sm mt-4 leading-relaxed`}>
                Directed end-to-end QA for **Major Insurance product streams**, ensuring 100% data integrity across mobile and web platforms.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI JOURNEY */}
        <section id="aijourney" className="flex flex-col gap-[20vh] mb-[40vh]">
          
          <div className="w-full dynamic-card p-10 md:p-14 rounded-[3rem] reveal border-violet-500/10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <span className="bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Enterprise RAG Architecture</span>
                <h3 className={`${textPrimary} text-3xl font-bold mt-4 mb-4 tracking-tight`}>Multi-Stage AI Pipeline</h3>
                <p className={`${textSecondary} text-base leading-relaxed mb-6`}>
                  Engineered a hallucination-free documentation pipeline. Leveraged Enterprise Copilot to feed a secure Knowledge Base fortified with strict guardrails.
                </p>
                <div className="flex gap-8">
                  <div>
                    <div className="text-teal-400 text-3xl font-black">80%</div>
                    <div className={`${textSecondary} text-[10px] uppercase font-bold`}>Structure Match</div>
                  </div>
                  <div>
                    <div className="text-violet-400 text-3xl font-black">70%</div>
                    <div className={`${textSecondary} text-[10px] uppercase font-bold`}>Time Saved</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full flex items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-center min-w-[110px]">
                  <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 text-[10px] font-mono">&gt;_</div>
                  <span className={`text-[11px] ${isDark ? 'text-white' : 'text-slate-800'} font-black uppercase`}>Copilot</span>
                  <span className="text-[8px] text-zinc-500 font-bold uppercase">Intent Extraction</span>
                </div>
                <div className="h-px w-4 bg-teal-500/30" />
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center min-w-[130px]">
                  <div className="w-7 h-7 rounded bg-violet-600 flex items-center justify-center text-white text-[10px] font-mono font-bold">Q</div>
                  <span className={`text-[11px] ${isDark ? 'text-white' : 'text-slate-800'} font-black uppercase`}>Knowledge Base</span>
                  <span className="text-[8px] text-violet-400 font-bold uppercase tracking-tighter">Sync & Guardrails</span>
                </div>
                <div className="h-px w-4 bg-teal-500/30" />
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-center min-w-[110px]">
                  <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-teal-400 text-[10px] font-mono font-bold">FSD</div>
                  <span className={`text-[11px] ${isDark ? 'text-white' : 'text-slate-800'} font-black uppercase`}>Structured</span>
                  <span className="text-[8px] text-teal-600 font-bold uppercase">Zero Hallucination</span>
                </div>
              </div>
            </div>
          </div>

          <div className="node-right self-end w-full md:w-[48%] dynamic-card p-10 rounded-3xl md:text-right group relative overflow-hidden reveal">
            <div className="group-hover:opacity-0 transition-opacity duration-300">
              <span className="text-magenta-500 font-mono text-xs font-bold uppercase tracking-widest">Insurance ML POC</span>
              <h3 className={`${textPrimary} text-3xl font-bold mt-2 mb-4`}>Claims Fraud MVP</h3>
              <p className={`${textSecondary} leading-relaxed`}>Automated manual fraud detection by mapping high-risk indicators to predictive model architectures.</p>
            </div>
            
            <div className="absolute inset-0 bg-magenta-900/95 backdrop-blur-3xl p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center text-white text-left">
              <h4 className="font-bold mb-2 font-mono text-xs uppercase tracking-widest text-magenta-300">PnC Insurance Logic:</h4>
              <p className="text-xs leading-relaxed">Collaborated with Data Science teams to feature-engineer indicators for anomaly detection models.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: HORIZON */}
        <section id="horizon" className={`reveal dynamic-card p-12 rounded-3xl text-center mb-[40vh] border-dashed ${isDark ? 'border-violet-500/20' : 'border-violet-500/40'}`}>
          <h3 className={`text-3xl font-bold ${textPrimary} mb-6`}>Generative AI R&D Sandbox</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="group relative">
              <span className="px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-500 text-xs font-bold uppercase cursor-help transition-all hover:bg-violet-500/20">Gemma 4 31B IT</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 h-40 bg-black/95 rounded-xl border border-violet-500/40 opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex items-center justify-center text-[10px] text-zinc-300 p-4 leading-relaxed">
                Evaluating open-weight models for secure, offline documentation workflows without cloud data leakage.
              </div>
            </div>
            <div className="group relative">
              {/* FIXED: Exact 1:1 structural copy of Gemma 4 button, just swapped to magenta */}
              <span className="px-5 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/30 text-magenta-500 text-xs font-bold uppercase cursor-help transition-all hover:bg-magenta-500/20">n8n Automation</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 h-40 bg-black/95 rounded-xl border border-magenta-500/40 opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex items-center justify-center text-[10px] text-zinc-300 p-4 leading-relaxed">
                Prototyping automated data-parsing pipelines to replace manual SQL reconciliation tasks.
              </div>
            </div>
          </div>
          <p className={`${textSecondary} text-lg max-w-2xl mx-auto italic font-mono text-sm cursor-blink`}>
            "Converting unstructured whiteboard notes into standardized BDD User Stories".
          </p>
        </section>

        {/* SECTION 4: CONTACT */}
        <section className="reveal flex flex-col items-center text-center gap-10">
          <h2 className={`text-4xl md:text-6xl font-bold ${textPrimary}`}>Ready for the next frontier?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-4">
            <a href="https://www.linkedin.com/in/kunal-madaan-bsa/" target="_blank" rel="noreferrer" className={`p-6 rounded-2xl dynamic-card hover:bg-violet-500/5 transition-all ${textPrimary} font-bold text-lg`}>LinkedIn</a>
            <button onClick={copyEmail} className={`p-6 rounded-2xl border transition-all font-bold text-lg ${copied ? 'bg-violet-500/20 border-violet-500 text-violet-400' : `dynamic-card border-transparent ${textPrimary}`}`}>
              {copied ? "Copied Email!" : "Copy Email"}
            </button>
            <a href="/kunal-madaan.pdf" target="_blank" rel="noreferrer" className={`p-6 rounded-2xl ${isDark ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-slate-900 text-white shadow-[0_0_30px_rgba(0,0,0,0.1)]'} font-bold text-lg`}>Full Resume</a>
          </div>
        </section>

      </main>
    </div>
  );
}
