'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Shield, ShieldCheck, ShieldAlert, Brain, Activity, Eye, Globe, 
  FileText, Users, Zap, ArrowRight, ChevronDown, BarChart3, Lock, 
  Wifi, Smartphone, Chrome, Bot, AlertTriangle, TrendingUp, Search,
  Upload, MessageSquare, Download, Layers, ShieldCheck as Verified, TextCursorInput, Terminal, ExternalLink
} from 'lucide-react';
import { PLATFORM_STATS } from '@/lib/data';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ScrollReveal';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import AuthModal from '@/components/AuthModal';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

const features = [
  { icon: Brain, title: 'Agentic AI Analysis', desc: '5 specialized AI agents work together to classify, analyze, and explain scam threats in real-time.', color: 'cyan' as const, badge: 'Agentic Core' },
  { icon: Shield, title: 'Real-Time Protection', desc: 'Instant scam detection for URLs, messages, calls, and files with live threat intelligence feeds.', color: 'emerald' as const, badge: 'Live Defense' },
  { icon: Eye, title: 'Evidence Automation', desc: 'Automated OCR, metadata extraction, and evidence timeline creation for police-ready reports.', color: 'purple' as const, badge: 'Auto-Extract' },
  { icon: Users, title: 'Community Intelligence', desc: 'Crowdsourced scam reports with voting, clustering, and trend detection by community members.', color: 'amber' as const, badge: 'Collective Intel' },
  { icon: FileText, title: 'AI Report Generation', desc: 'Auto-generated FIR-ready reports with technical indicators, timelines, and evidence summaries.', color: 'purple' as const, badge: 'FIR Generator' },
  { icon: Globe, title: 'Threat Intelligence', desc: 'Aggregated threat feeds from multiple sources with domain, IP, and wallet reputation scoring.', color: 'cyan' as const, badge: 'Global Sync' },
];

const demoFlow = [
  { step: 1, icon: Search, title: 'Scan Suspicious Activity', desc: 'Paste suspicious URLs, SMS texts, or upload screenshots of chat conversations.' },
  { step: 2, icon: Bot, title: 'Multi-Agent Deconstruction', desc: 'Specialized AI agents dissect the text, inspect links, check registry history, and score intent.' },
  { step: 3, icon: AlertTriangle, title: 'Explainable Verdict', desc: 'Get an interactive risk score with transparent reasoning, explaining EXACTLY why it is a scam.' },
  { step: 4, icon: Download, title: 'FIR-Ready PDF Export', desc: 'Generate a court-ready evidence bundle with dates, timestamps, technical headers, and logs.' },
];

// Marquee Threat Feed Data
const recentScams = [
  { target: 'yono-sbi-secure.in', type: 'Phishing', severity: 'Critical', score: 98 },
  { target: 'free-lottery-gift.com', type: 'Lottery Scam', severity: 'High', score: 85 },
  { target: '+91 98452 10294', type: 'WhatsApp Scam', severity: 'Critical', score: 95 },
  { target: '0x742d35Cc6634C... (Crypto)', type: 'Wallet Drainer', severity: 'Critical', score: 99 },
  { target: 'amazon-giftcard-deals.vip', type: 'Phishing', severity: 'High', score: 89 },
  { target: '+91 88029 38172', type: 'FedEx Parcel Scam', severity: 'High', score: 92 },
  { target: 'icici-kyc-verify.net', type: 'Phishing', severity: 'Critical', score: 97 }
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check if middleware redirected us here to sign in
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auth') === 'true') {
        setIsAuthModalOpen(true);
        // Clean the URL so refreshing doesn't keep opening it
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* 3D Cyber Globe/Shield Canvas (Phase 2 Hero Element) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <ThreeScene />
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent font-black">RakshaNet</span> Shield
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-pink-400 transition-colors font-medium text-sm tracking-wide">FEATURES</a>
            <a href="#pipeline" className="text-slate-400 hover:text-pink-400 transition-colors font-medium text-sm tracking-wide">AI PIPELINE</a>
            <a href="#demo" className="text-slate-400 hover:text-pink-400 transition-colors font-medium text-sm tracking-wide">WORKFLOW</a>
            <a href="#stats" className="text-slate-400 hover:text-pink-400 transition-colors font-medium text-sm tracking-wide">STATS</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAuthModalOpen(true)} className="glass-panel text-sm px-4 py-2 border border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all text-slate-300 rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Sign In
            </button>
            <Link href="/report" className="relative group overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 p-[1px] hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all">
              <span className="relative block rounded-[7px] bg-black/80 px-4 py-2 text-sm font-semibold text-pink-300 transition-colors group-hover:bg-transparent group-hover:text-white">
                Report Scam
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-16 overflow-hidden z-10">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 text-left space-y-8">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="text-xs text-pink-300 tracking-wider font-semibold uppercase">RakshaNet Multi-Agent Autonomous Guard</span>
            </div>
            
            {/* Main title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] font-display">
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent">Holographic</span>
              <br />
              <span className="text-slate-100">Cyber Defense</span>
              <br />
              <span className="text-slate-400 text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide">For Every Indian Citizen.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Defend yourself against complex cyber fraud with real-time multi-agent explainable AI, automated police-ready evidence files, and live crowd-sourced fraud threat feeds.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/report" className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(236,72,153,0.35)] transition-all transform hover:-translate-y-0.5 group">
                <Upload className="w-5 h-5 text-pink-100" />
                Analyze Scam Link/File
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-8 py-4 rounded-xl border border-white/10 hover:border-pink-500/30 bg-white/5 hover:bg-pink-500/5 text-slate-200 font-semibold tracking-wide flex items-center gap-2 transition-all">
                <BarChart3 className="w-5 h-5 text-pink-400" />
                Command Center
              </Link>
              <Link href="/assistant" className="px-8 py-4 rounded-xl border border-rose-500/30 hover:border-rose-400/50 bg-rose-950/10 hover:bg-rose-900/10 text-rose-300 font-semibold tracking-wide flex items-center gap-2 transition-all">
                <MessageSquare className="w-5 h-5 text-rose-400" />
                AI Agent Chat
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* Live Stats Floating Hologram (Fades into stats counter) */}
            <GlassCard glowColor="cyan" tiltIntensity={15} className="w-full max-w-sm bg-black/45 border-white/10 relative p-8 pt-10">
              <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl bg-pink-500 px-4 py-1.5 text-black text-2xs font-extrabold uppercase tracking-widest shadow-[-5px_5px_15px_rgba(236,72,153,0.2)]">
                LIVE METRICS
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Scams Blocked & Identified</span>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div>
                    <div className="text-3xl font-extrabold text-pink-400 tracking-tight">
                      <AnimatedCounter end={PLATFORM_STATS.scamsToday} simulateLive />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Reported Today</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                      <AnimatedCounter end={PLATFORM_STATS.totalScamsDetected} simulateLive />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Total Intercepts</div>
                  </div>
                </div>

                <hr className="border-white/5" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-extrabold text-rose-400 tracking-tight">
                      <AnimatedCounter end={PLATFORM_STATS.usersProtected} simulateLive />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Citizens Protected</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                      <AnimatedCounter end={97.6} decimals={1} suffix="%" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Model Accuracy</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-shimmer" style={{ width: '97.6%' }} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                    <span>Target Verification Node</span>
                    <span className="text-pink-400 font-semibold">Active & Encrypted</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="w-full flex justify-center items-center pt-16">
          <a href="#ticker" className="flex flex-col items-center gap-2 text-slate-500 hover:text-pink-400 transition-colors">
            <span className="text-2xs font-extrabold uppercase tracking-widest">SCROLL FOR SCAM THREAT MAP</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Live Threat Ticker (Marquee ticker for visual wow factor) */}
      <section id="ticker" className="relative py-6 bg-pink-950/20 border-y border-white/5 overflow-hidden z-10 backdrop-blur-md">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-12 text-sm font-semibold tracking-wider text-slate-300">
            {recentScams.map((scam, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-slate-400 font-mono">{scam.target}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950/50 border border-red-500/20 text-red-400 font-bold uppercase">{scam.type}</span>
                <span className="text-pink-400 font-bold">Risk: {scam.score}%</span>
              </div>
            ))}
          </div>
          {/* Duplicate to create infinite loop */}
          <div className="flex items-center gap-12 text-sm font-semibold tracking-wider text-slate-300 ml-12">
            {recentScams.map((scam, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-slate-400 font-mono">{scam.target}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950/50 border border-red-500/20 text-red-400 font-bold uppercase">{scam.type}</span>
                <span className="text-pink-400 font-bold">Risk: {scam.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20 space-y-4">
            <ScrollReveal variant="up">
              <span className="text-2xs font-extrabold uppercase text-pink-400 tracking-widest">PLATFORM ABILITIES</span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mt-2">
                Unified <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent">Cyber shield</span> Stack
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Autonomously orchestrated deep scanning agents designed to keep digital threat landscapes clean, traceable, and reportable.
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <ScrollReveal key={i} variant="scale" delay={i * 80}>
                <GlassCard glowColor={feat.color} className="h-full bg-black/35 hover:bg-black/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-pink-950/40 border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                        <feat.icon className="w-7 h-7 text-pink-400" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-widest">{feat.badge}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{feat.desc}</p>
                  </div>
                  
                  <Link href="/dashboard" className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-pink-400 group-hover:text-pink-300 transition-colors cursor-pointer">
                    <span>Inspect Security Parameters</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline Visualization Section */}
      <section id="pipeline" className="relative py-32 px-6 bg-black/40 border-y border-white/5 z-10 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20 space-y-4">
            <ScrollReveal variant="up">
              <span className="text-2xs font-extrabold uppercase text-pink-400 tracking-widest">SYSTEM ARCHITECTURE</span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mt-2">
                Multi-Agent <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">AI Pipeline</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                See how a submitted threat is parsed, dissected, verified, and mapped through our specialized autonomous neural matrix.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="up" className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
              {[
                { step: '01', name: 'Intake Agent', role: 'Data Extraction', icon: TextCursorInput, color: 'from-pink-500 to-rose-400', desc: 'Parses raw text, URLs, file properties, and executes highly optimized OCR on screenshots.' },
                { step: '02', name: 'NLP Scrutinizer', role: 'Structural Intent', icon: Brain, color: 'from-teal-400 to-emerald-500', desc: 'Runs deep intent extraction, checking language urgency, cognitive pressure patterns, and blackmail indicators.' },
                { step: '03', name: 'Threat Engine', role: 'Digital Reputation', icon: Globe, color: 'from-emerald-500 to-indigo-500', desc: 'Probes domain WHOIS logs, active DNS nameservers, SSL validation rings, and crypto wallet blacklists.' },
                { step: '04', name: 'Verdict Synthesizer', role: 'Risk Fuser', icon: Layers, color: 'from-indigo-500 to-purple-500', desc: 'Correlates evidence from all other active agents to assign a consolidated threat rating out of 100.' },
                { step: '05', name: 'Legal Compiler', role: 'FIR Generator', icon: FileText, color: 'from-purple-500 to-pink-500', desc: 'Compiles technical indicators and evidence logs into a court-admissible, police-ready FIR report bundle.' },
              ].map((agent, index) => {
                const glowColor = index % 2 === 0 ? 'cyan' : 'purple';
                return (
                  <div key={index} className="relative group h-full">
                    <GlassCard glowColor={glowColor as any} interactive={true} className="h-full p-6 bg-black/35 hover:bg-black/45 border-white/10 relative overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(236,72,153,0.05)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] flex flex-col justify-between">
                      {/* Gradient top bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${agent.color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className="font-mono text-3xl font-black text-white/5 group-hover:text-pink-500/20 transition-colors">{agent.step}</span>
                          <div className="w-12 h-12 rounded-xl bg-pink-950/30 border border-pink-500/20 flex items-center justify-center shadow-inner-glow transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <agent.icon className="w-6 h-6 text-pink-400" />
                          </div>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">{agent.name}</h4>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 mb-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                          <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-widest">{agent.role}</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">{agent.desc}</p>
                      </div>
                    </GlassCard>
                    
                    {/* Connector arrow for larger screens */}
                    {index < 4 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-pink-500/40">
                        <ArrowRight className="w-6 h-6 animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works (Timeline section with interactive steps) */}
      <section id="demo" className="relative py-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-24 space-y-4">
            <ScrollReveal variant="up">
              <span className="text-2xs font-extrabold uppercase text-pink-400 tracking-widest">SYSTEM WORKFLOW</span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mt-2">
                How <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">RakshaNet</span> Operates
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Secure validation loops designed to map digital scams from discovery to technical police complaints in under 30 seconds.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative">
            {/* Interactive Timeline line */}
            <div className="hidden md:block absolute left-[5%] top-10 bottom-10 w-[2px] bg-gradient-to-b from-pink-500/80 via-rose-500/50 to-transparent" />
            
            {/* Timeline Items */}
            <div className="md:col-span-12 space-y-12">
              {demoFlow.map((item, i) => (
                <ScrollReveal key={i} variant="left" delay={i * 100}>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative group cursor-pointer"
                    onMouseEnter={() => setActiveStep(i)}
                  >
                    {/* Circle Node */}
                    <div className="hidden md:flex md:col-span-1 justify-center relative">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono font-bold text-xs transition-all z-20 ${
                        activeStep === i 
                          ? 'bg-pink-500 border-pink-400 text-black shadow-[0_0_15px_rgba(236,72,153,0.6)] scale-110' 
                          : 'bg-black border-white/20 text-slate-400 group-hover:border-pink-500/50'
                      }`}>
                        {item.step}
                      </div>
                    </div>

                    {/* Content Glass Panel */}
                    <div className="md:col-span-11">
                      <GlassCard 
                        glowColor={activeStep === i ? 'cyan' : 'none'} 
                        interactive={false}
                        className={`transition-all duration-300 p-8 ${
                          activeStep === i 
                            ? 'bg-black/55 border-pink-500/30' 
                            : 'bg-black/25 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeStep === i ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-slate-400'}`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <h3 className={`text-xl font-bold transition-colors ${activeStep === i ? 'text-pink-300' : 'text-slate-200'}`}>{item.title}</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{item.desc}</p>
                      </GlassCard>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Statistics Overview & Live Research */}
      <section id="stats" className="relative py-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <ScrollReveal variant="up">
              <span className="text-2xs font-extrabold uppercase text-pink-400 tracking-widest">LIVE RESEARCH DISPLAY</span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mt-2">
                Present <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Threat Cases</span> (YTD)
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Real-time metrics and live autonomous agent research streams aggregated across the national grid.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="up">
            <GlassCard glowColor="purple" className="relative p-0 bg-black/45 border-white/10 overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.1)] rounded-3xl">
              {/* background vector line glows */}
              <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/15 blur-[100px] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 relative z-10">
                
                {/* Left Side: Stats Grid */}
                <div className="p-12 lg:p-16 grid grid-cols-1 sm:grid-cols-2 gap-12 text-center sm:text-left">
                  <div className="space-y-2">
                    <span className="text-2xs font-extrabold uppercase text-pink-400 tracking-wider flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" /> LIVE PRESENT CASES
                    </span>
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                      <AnimatedCounter end={PLATFORM_STATS.totalScamsDetected} simulateLive />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Scam reports processed and classified this year.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-2xs font-extrabold uppercase text-emerald-400 tracking-wider flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> RECOVERED & DEFENDED
                    </span>
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                      ₹<AnimatedCounter end={12.4} decimals={1} suffix="Cr" simulateLive />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Estimated digital capital saved from immediate vulnerabilities.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-2xs font-extrabold uppercase text-rose-400 tracking-wider flex items-center justify-center sm:justify-start gap-2">
                      COMMUNITY DEFENDERS
                    </span>
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                      <AnimatedCounter end={PLATFORM_STATS.communityMembers} simulateLive />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Indian cyber warriors contributing footprints daily.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-2xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center justify-center sm:justify-start gap-2">
                      HEURISTIC CONFIDENCE
                    </span>
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                      <AnimatedCounter end={PLATFORM_STATS.aiAccuracy} suffix="%" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Verified classification success score under load.</p>
                  </div>
                </div>

                {/* Right Side: Live Computer Research Display */}
                <div className="p-8 lg:p-12 bg-black/60 relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-pink-400" />
                      <h3 className="font-mono text-sm font-bold text-pink-300">live_research.exe</h3>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                    </div>
                  </div>

                  <div className="bg-[#0a0508] border border-pink-500/20 rounded-xl p-5 font-mono text-xs text-pink-400/80 shadow-inner overflow-hidden h-[240px] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent h-[150%] animate-scan pointer-events-none" />
                    
                    <div className="space-y-3 opacity-90 animate-marquee-up flex flex-col">
                      <p><span className="text-emerald-400">[SYSTEM]</span> Connecting to global cyber telemetry...</p>
                      <p><span className="text-slate-400">0x742d...</span> <span className="text-red-400">Analyzing suspicious domain: free-gift-india.com</span></p>
                      <p><span className="text-amber-400">[NLP AGENT]</span> Extracting urgency intent from raw SMS...</p>
                      <p><span className="text-slate-400">0x881f...</span> Pattern matched with known Job Scam signature (98%)</p>
                      <p><span className="text-indigo-400">[THREAT ENGINE]</span> Blacklisting IP cluster 182.xx.xx.xx</p>
                      <p><span className="text-emerald-400">[SYSTEM]</span> Successfully blocked 412 attacks in the last hour.</p>
                      <p><span className="text-slate-400">0x11ab...</span> <span className="text-red-400">Detecting abnormal crypto wallet routing...</span></p>
                      <p><span className="text-amber-400">[VERDICT]</span> High Risk. Flagging for FIR Generation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Cyber Multi-layer Protection Platform Info */}
      <section id="protection" className="relative py-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <ScrollReveal variant="up">
              <span className="text-2xs font-extrabold uppercase text-pink-400 tracking-widest">DEPLOYMENT CHANNELS</span>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mt-2">
                Multi-Channel <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Guard Rings</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                RakshaNet Shield lives in the places where digital fraud is most dangerous. Deploying layers on browser, desktop, and mobile.
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Browser Extension */}
            <ScrollReveal variant="left" delay={0}>
              <GlassCard glowColor="cyan" className="h-full text-center p-8 bg-black/35 hover:bg-black/55 transition-all">
                <div className="w-20 h-20 rounded-3xl bg-pink-950/40 border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                  <Chrome className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Browser Shield</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">Injects live phishing intercept hooks directly into browser runtimes, warning citizens BEFORE credentials leak.</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  STABLE EXTENSION ACTIVE
                </div>
              </GlassCard>
            </ScrollReveal>
            
            {/* AI Command Center */}
            <ScrollReveal variant="scale" delay={100}>
              <GlassCard glowColor="purple" className="h-full text-center p-8 bg-black/45 border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                <div className="w-20 h-20 rounded-3xl bg-indigo-950/40 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                  <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">AI Command Suite</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">Access advanced trace analysis, cross-examinations, live multi-agent AI pipeline graphs, and community voting pages.</p>
                <Link href="/dashboard" className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 font-bold text-sm tracking-wide inline-flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  Launch Suite <ArrowRight className="w-4 h-4" />
                </Link>
              </GlassCard>
            </ScrollReveal>
            
            {/* Mobile App */}
            <ScrollReveal variant="right" delay={200}>
              <GlassCard glowColor="amber" className="h-full text-center p-8 bg-black/35 hover:bg-black/55 transition-all">
                <div className="w-20 h-20 rounded-3xl bg-amber-950/40 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                  <Smartphone className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Mobile Guard</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">Intercepts fraudulent SMS links, filters incoming caller profiles, and maps active phishing towers around the device.</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  CLOSED BETA 2026
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call To Action (High impact neon-shrouded panel) */}
      <section className="relative py-32 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal variant="scale">
            <GlassCard glowColor="cyan" className="relative p-16 bg-gradient-to-b from-pink-950/30 to-rose-950/20 border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] rounded-3xl">
              <div className="w-20 h-20 rounded-full bg-pink-950/40 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)] flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-pink-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-6">
                Defend Your <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Digital Frontier</span> Today
              </h2>
              <p className="text-slate-300 text-base mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of Indian cyber defenders reporting daily, securing assets, and deploying collective AI threat signatures to stop scams.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/report" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all">
                  <ShieldAlert className="w-5 h-5 text-pink-200" />
                  Report Instant Incident
                </Link>
                <Link href="/community" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-pink-500/5 text-slate-200 font-semibold tracking-wide flex items-center justify-center gap-2 transition-all">
                  <Users className="w-5 h-5 text-pink-400" />
                  Join Crowd Forum
                </Link>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16 px-6 z-10 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-pink-400" />
                <span className="font-bold font-display bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">RakshaNet Shield</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Advanced autonomous multi-agent cyber defense intelligence and unified community protection index for Digital India.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xs tracking-widest text-slate-200 uppercase">SYSTEM COMPASS</h4>
              <div className="space-y-3 text-xs text-slate-400">
                <Link href="/dashboard" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">Incident Command</Link>
                <Link href="/report" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">Submit Telemetry</Link>
                <Link href="/community" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">Defenders Exchange</Link>
                <Link href="/analytics" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">Macro Analytics</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xs tracking-widest text-slate-200 uppercase">TELEMETRY RING</h4>
              <div className="space-y-3 text-xs text-slate-400">
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">
                  Chrome Shield Agent <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">
                  Android Sandbox APK <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <Link href="/assistant" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">Agentic AI Chat</Link>
                <Link href="/threats" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">Signature Sync</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-xs tracking-widest text-slate-200 uppercase">EXTERNAL INTEL</h4>
              <div className="space-y-3 text-xs text-slate-400">
                <a href="https://cyberbriefing.info" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">
                  Telemetry API Schema <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">
                  Indian Cyber Guide <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <a href="https://nciipc.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 font-semibold text-pink-400 hover:translate-x-1 transition-all">
                  NCIIPC Official Portal <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all">
                  Platform Keys <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-500">© 2026 RakshaNet Shield. Built under active peer networks. Secured for digital sovereign operations.</p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>AES-GCM Core Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-pink-400" />
                <span>Synchronized Nodes</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
