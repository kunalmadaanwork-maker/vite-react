// File 3: OverlayUI.jsx
import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function OverlayUI() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef();

  const copyEmail = async () => {
    await navigator.clipboard.writeText("Kunal.madaan.work@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(() => {
    const cards = gsap.utils.toArray('.bento-card');
    cards.forEach((card) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100px',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* CSS injections for specific animations */}
      <style>{`
        .bento-card { 
            background: rgba(20, 20, 20, 0.6); 
            border: 1px solid rgba(255, 255, 255, 0.05); 
            border-radius: 24px;
            backdrop-filter: blur(20px);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .bento-card:hover { 
            border-color: rgba(45, 212, 191, 0.3); 
            transform: translateY(-2px);
        }
        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
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

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 p-6 md:p-8 pb-24">

        <div className="bento-card p-8 md:p-10 md:col-span-3 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient leading-tight mb-4">
            Techno-Functional Senior BSA
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-8">
            Driving Agile velocity through API integrations, complex SQL data parsing, and <span className="text-teal-400 font-semibold">Enterprise AI workflows.</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold">CSM & CSPO</span>
            <span className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold">IBM Design Thinking</span>
            <span className="px-3 py-1.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">Enterprise AI Strategy</span>
          </div>
        </div>

        <div className="bento-card p-8 md:col-span-1 flex flex-col justify-center">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            Ecosystems <span className="text-zinc-500 text-sm font-normal">(7+ Yrs)</span>
          </h3>
          <ul className="space-y-4 text-sm text-zinc-400 font-medium">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div> Financial Services</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div> Retail & E-Commerce</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div> Healthcare Tech</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div> Insurance Fraud (ML)</li>
          </ul>
        </div>

        <div className="bento-card p-8 md:p-10 md:col-span-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-full bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full md:w-1/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                Enterprise RAG Architecture
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Multi-Stage AI Pipeline</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Engineered a hallucination-free documentation pipeline. Leveraged Enterprise Copilot to extract intent from raw data, feeding it into a custom Amazon Q Knowledge Base fortified with strict guardrails to output highly structured FSDs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <div className="text-xl font-bold text-teal-400">80%</div>
                  <div className="text-xs text-zinc-500 mt-1 uppercase">Structure Match</div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  <div className="text-xl font-bold text-white">70%</div>
                  <div className="text-xs text-zinc-500 mt-1 uppercase">Time Saved</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 bg-black/40 p-6 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex-1 w-full bg-zinc-900 border border-white/10 p-4 rounded-lg text-center z-10">
                <svg className="w-6 h-6 text-zinc-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-xs font-semibold text-white">Enterprise Copilot</p>
                <p className="text-[10px] text-zinc-500 mt-1">Raw Intent Extraction</p>
              </div>

              <div className="hidden md:block w-16 h-1 pipeline-flow rounded-full"></div>

              <div className="flex-1 w-full bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-center relative z-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <svg className="w-6 h-6 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p className="text-xs font-semibold text-blue-100">Amazon Q + Guardrails</p>
                <p className="text-[10px] text-blue-400 mt-1">Knowledge Base Sync</p>
              </div>

              <div className="hidden md:block w-16 h-1 pipeline-flow rounded-full"></div>

              <div className="flex-1 w-full bg-zinc-900 border border-white/10 p-4 rounded-lg text-center z-10">
                <svg className="w-6 h-6 text-teal-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="text-xs font-semibold text-white">Structured FSD</p>
                <p className="text-[10px] text-zinc-500 mt-1">Zero Hallucination</p>
              </div>

            </div>
          </div>
        </div>

        <div className="bento-card p-8 md:col-span-2">
          <h3 className="text-white font-bold text-lg mb-1">Complex Data Parsing</h3>
          <p className="text-teal-400 text-sm font-medium mb-4">Major Canadian Retailer</p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Spearheaded data discrepancy resolution for complex financial logic. Audited SQL database schemas and REST APIs to unblock development teams.
          </p>
        </div>

        <div className="bento-card p-8 md:col-span-2">
          <h3 className="text-white font-bold text-lg mb-1">System Migration</h3>
          <p className="text-blue-400 text-sm font-medium mb-4">Tier-1 North American Bank</p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Directed the end-to-end reporting migration from Business Objects to Tableau. Managed Dev/QA alignment for zero-defect delivery.
          </p>
        </div>

        <div className="bento-card p-4 md:p-6 md:col-span-4 flex items-center justify-between gap-6 border-dashed border-white/10 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">R&D Sandbox: Google Gemma 4</h4>
              <p className="text-zinc-500 text-xs mt-1">Actively evaluating open-weight edge models for offline Agile User Story generation. <a href="gemma-screenshot.png" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">View latest prompt architecture →</a></p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}