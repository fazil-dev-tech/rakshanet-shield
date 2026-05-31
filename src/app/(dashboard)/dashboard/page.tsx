'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, ShieldAlert, TrendingUp, Users, AlertTriangle, Activity,
  ArrowUpRight, ArrowDownRight, Eye, Bot, Zap, ExternalLink, Clock,
  ThumbsUp, ChevronRight, BarChart3, ShieldCheck, Globe
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  PLATFORM_STATS, DEMO_REPORTS, SCAM_TRENDS, CATEGORY_DISTRIBUTION,
  HOURLY_ACTIVITY, formatNumber, formatCurrency, timeAgo, getSeverityColor
} from '@/lib/data';
import { SCAM_TYPES, type ScamType, type SeverityLevel } from '@/lib/ai-engine';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';

function StatCard({ title, value, change, changeType, icon: Icon, color, suffix = '', glow }: {
  title: string; value: number; change: string; changeType: 'up' | 'down'; icon: React.ComponentType<any>; color: 'cyan' | 'purple' | 'amber' | 'emerald'; suffix?: string; glow: string;
}) {
  return (
    <GlassCard glowColor={color} tiltIntensity={10} className="p-6 bg-black/40 border-white/10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-pink-500/30 transition-colors">
            <Icon className="w-6 h-6" style={{ color: glow }} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {change}
          </div>
        </div>
        <div className="text-3xl font-extrabold tracking-tight mb-1 font-mono">
          <AnimatedCounter end={value} suffix={suffix} />
        </div>
      </div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{title}</div>
    </GlassCard>
  );
}

function normalizeReport(report: any) {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    scam_type: report.scam_type || report.scamType || 'unknown',
    severity: report.severity || 'medium',
    risk_score: report.risk_score !== undefined ? report.risk_score : (report.riskScore !== undefined ? report.riskScore : 50),
    status: report.status || 'pending',
    ai_summary: report.ai_summary || report.aiSummary || report.description,
    city: report.city || 'Digital',
    country: report.country || 'India',
    created_at: report.created_at || report.createdAt || new Date().toISOString(),
    upvotes: report.upvotes !== undefined ? report.upvotes : 0,
    downvotes: report.downvotes !== undefined ? report.downvotes : 0,
    evidence_count: report.evidence_count !== undefined ? report.evidence_count : (report.evidenceCount !== undefined ? report.evidenceCount : 0),
    indicator_count: report.indicator_count !== undefined ? report.indicator_count : (report.indicators !== undefined ? report.indicators : 0),
  };
}

function RealtimeFeed() {
  const [reports, setReports] = useState<any[]>([]);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        const result = await Promise.resolve(
          supabase
            .from('scam_reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)
        ).catch(() => ({ data: null, error: new Error('Network error') }));
          
        const data = result?.data;
        
        if (isMounted) {
          if (data && data.length > 0) {
            setReports(data.map(normalizeReport));
          } else {
            setReports(DEMO_REPORTS.slice(0, 5).map(normalizeReport));
          }
        }
      } catch (e) {
        if (isMounted) {
          setReports(DEMO_REPORTS.slice(0, 5).map(normalizeReport));
        }
      }
    };
    fetchReports();
    
    // Auto-refresh every 30 seconds
    const refreshTimer = setInterval(fetchReports, 30000);
    const pulseTimer = setInterval(() => {
      if (isMounted) setPulse(p => !p);
    }, 2000);
    
    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
      clearInterval(pulseTimer);
    };
  }, []);

  return (
    <GlassCard glowColor="cyan" interactive={false} className="bg-black/35 border-white/10 h-full p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Activity className={`w-5 h-5 text-red-500 ${pulse ? 'animate-pulse' : ''}`} />
            <div className="absolute -inset-0.5 bg-red-500/20 rounded-full blur-[4px] animate-ping" />
          </div>
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Live Telemetry Feed</h3>
        </div>
        <Link href="/community" className="text-xs text-pink-400 hover:text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1">
          Explore All <ChevronRight className="w-4.5 h-4.5" />
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col justify-between space-y-2">
        {reports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`} className="block">
            <div className="flex items-start gap-4 p-3 rounded-xl border border-white/5 hover:border-pink-500/20 bg-white/5 hover:bg-pink-500/5 transition-all h-full">
              <div className="text-2xl flex-shrink-0 mt-0.5 p-1 rounded bg-white/5 border border-white/10">
                {SCAM_TYPES[report.scam_type as ScamType]?.icon || '❓'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-200 truncate">{report.title}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                    report.severity === 'critical' 
                      ? 'bg-red-950 border border-red-500/30 text-red-400' 
                      : report.severity === 'high' 
                      ? 'bg-amber-950 border border-amber-500/30 text-amber-400' 
                      : 'bg-indigo-950 border border-indigo-500/30 text-indigo-400'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate leading-relaxed">{report.ai_summary || report.description}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeAgo(report.created_at)}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{report.upvotes || 0}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{report.city || 'Digital'}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-black border"
                  style={{ 
                    borderColor: `${getSeverityColor(report.severity as SeverityLevel)}40`,
                    background: `${getSeverityColor(report.severity as SeverityLevel)}15`, 
                    color: getSeverityColor(report.severity as SeverityLevel) 
                  }}>
                  {report.risk_score}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

function AgentActivity() {
  const agents = [
    { name: 'TextAnalysisAgent', status: 'active', tasks: 47, accuracy: '96.8%', color: '#ec4899' },
    { name: 'EntityExtractionAgent', status: 'active', tasks: 42, accuracy: '98.2%', color: '#818cf8' },
    { name: 'URLThreatAgent', status: 'active', tasks: 38, accuracy: '97.1%', color: '#f87171' },
    { name: 'RiskScoringAgent', status: 'active', tasks: 47, accuracy: '95.4%', color: '#fbbf24' },
  ];

  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING NEURAL CORE...",
    "ORCHESTRATOR ONLINE."
  ]);

  useEffect(() => {
    const messages = [
      "Analyzing TLS certificate sequence...",
      "Intercepted anomalous payload from proxy.",
      "Extracting linguistic intent vector.",
      "Querying CyberBriefing threat DB...",
      "Threat signature matched (Severity: HIGH).",
      "Updating global decentralized blocklist.",
      "Tracing crypto wallet node graph...",
      "Entity Extraction NLP running...",
      "Isolating sandbox environment...",
      "Blocking IP range 185.220.x.x..."
    ];
    const interval = setInterval(() => {
      setLogs(prev => {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        const newLogs = [...prev, `[${timestamp}] ${messages[Math.floor(Math.random() * messages.length)]}`];
        if (newLogs.length > 5) newLogs.shift();
        return newLogs;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard glowColor="purple" interactive={false} className="bg-black/35 border-white/10 h-full p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Neural Agent Matrix</h3>
        </div>
        <div className="flex gap-1 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-between space-y-2">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 hover:border-indigo-500/30 transition-all h-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
            </span>
            
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{agent.name}</div>
            </div>
            
            <span className="text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border" 
              style={{ borderColor: `${agent.color}30`, background: `${agent.color}15`, color: agent.color }}>
              {agent.status}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 shrink-0 rounded-xl bg-black/60 border border-white/10 font-mono text-[9px] p-3 overflow-hidden h-[90px] flex flex-col justify-end relative shadow-inner">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
        {logs.map((log, i) => (
          <div key={i} className={`text-emerald-400 whitespace-nowrap overflow-hidden text-ellipsis ${i === logs.length - 1 ? 'opacity-100 font-bold' : 'opacity-50'}`}>
            <span className="text-pink-500 mr-2">&gt;</span>{log}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-panel p-3 border border-white/10 bg-black/90 rounded-xl text-xs space-y-1 shadow-2xl">
      <p className="font-bold text-slate-200 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [liveStats, setLiveStats] = useState({
    scams: PLATFORM_STATS.scamsToday,
    users: PLATFORM_STATS.usersProtected,
    capital: PLATFORM_STATS.moneyProtected,
    matrix: PLATFORM_STATS.aiAccuracy,
  });

  const [liveTrends, setLiveTrends] = useState(SCAM_TRENDS.map(t => ({...t})));
  const [liveCategories, setLiveCategories] = useState(CATEGORY_DISTRIBUTION.map(c => ({...c})));

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        scams: prev.scams + Math.floor(Math.random() * 3),
        users: prev.users + Math.floor(Math.random() * 7),
        capital: prev.capital + Math.floor(Math.random() * 50000),
        matrix: Number(Math.min(99.9, prev.matrix + (Math.random() * 0.2 - 0.1)).toFixed(1)),
      }));
    }, 4000);

    const trendsInterval = setInterval(() => {
      setLiveTrends(prev => {
        const newData = [...prev];
        newData.shift(); // remove first
        const last = newData[newData.length - 1];
        
        // Random massive spike occasionally for realism
        const hasSpike = Math.random() > 0.8;
        const spikeAmount = hasSpike ? Math.floor(Math.random() * 200 + 100) : 0;
        
        // Let them fluctuate much more wildly
        const phishingDelta = Math.floor(Math.random() * 100 - 50) + (Math.random() > 0.9 ? spikeAmount : 0);
        const investDelta = Math.floor(Math.random() * 80 - 40) + (Math.random() > 0.9 ? spikeAmount : 0);
        const jobDelta = Math.floor(Math.random() * 60 - 30) + (Math.random() > 0.9 ? spikeAmount : 0);
        const bankingDelta = Math.floor(Math.random() * 70 - 35) + (Math.random() > 0.9 ? spikeAmount : 0);
        const kycDelta = Math.floor(Math.random() * 50 - 25) + (Math.random() > 0.9 ? spikeAmount : 0);
        const otherDelta = Math.floor(Math.random() * 40 - 20) + (Math.random() > 0.9 ? spikeAmount : 0);
        
        newData.push({
          month: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          phishing: Math.max(20, Math.min(800, last.phishing + phishingDelta)),
          investment: Math.max(20, Math.min(800, last.investment + investDelta)),
          job: Math.max(20, Math.min(800, last.job + jobDelta)),
          banking: Math.max(20, Math.min(800, (last.banking || 0) + bankingDelta)),
          kyc: Math.max(20, Math.min(800, (last.kyc || 0) + kycDelta)),
          other: Math.max(20, Math.min(800, (last.other || 0) + otherDelta)),
        });
        return newData;
      });
    }, 1800); // Faster updates for real-time feel

    const categoriesInterval = setInterval(() => {
      setLiveCategories(prev => {
        let newCats = prev.map(c => ({
          ...c,
          value: Math.max(5, c.value + Math.floor(Math.random() * 10 - 5))
        }));
        const total = newCats.reduce((acc, curr) => acc + curr.value, 0);
        return newCats.map(c => ({
          ...c,
          value: Number(((c.value / total) * 100).toFixed(1))
        }));
      });
    }, 2500);

    return () => {
      clearInterval(statsInterval);
      clearInterval(trendsInterval);
      clearInterval(categoriesInterval);
    };
  }, []);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      
      {/* Page Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span> DECISION ROOM
          </span>
          <h1 className="text-3xl font-black font-display text-white mt-1">
            Threat <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Intelligence</span> Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Live streaming fraud intercept monitoring & neural network analysis</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/20 border border-red-500/30">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wide">3 Critical Vectors Alert</span>
          </div>
          <Link href="/report" className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all transform hover:-translate-y-0.5">
            <ShieldAlert className="w-4 h-4" /> Report Suspicious Activity
          </Link>
        </div>
      </motion.div>

      {/* Premium Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Live Intercepts" value={liveStats.scams} change="+12%" changeType="up" icon={ShieldAlert} color="cyan" glow="#ec4899" />
        <StatCard title="Users Protected" value={liveStats.users} change="+8.3%" changeType="up" icon={Users} color="emerald" glow="#f472b6" />
        <StatCard title="Capital Defended" value={liveStats.capital} suffix=" Cr" change="+15%" changeType="up" icon={TrendingUp} color="purple" glow="#f9a8d4" />
        <StatCard title="Veracity Matrix" value={liveStats.matrix} suffix="%" change="+0.3%" changeType="up" icon={Shield} color="amber" glow="#ffffff" />
      </motion.div>

      {/* Quick Actions Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/report" className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 hover:border-pink-500/40 hover:bg-pink-500/15 transition-all shadow-[0_0_15px_rgba(236,72,153,0.05)] hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]">
          <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Analyze Scam</span>
            <span className="text-[10px] text-slate-500 font-medium">Submit & Scan</span>
          </div>
        </Link>
        <Link href="/assistant" className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-indigo-500/5 border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/15 transition-all shadow-[0_0_15px_rgba(244,63,94,0.05)] hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">AI Agent Chat</span>
            <span className="text-[10px] text-slate-500 font-medium">Neural Terminal</span>
          </div>
        </Link>
        <Link href="/community" className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15 transition-all shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Community Feed</span>
            <span className="text-[10px] text-slate-500 font-medium">Crowd Intel</span>
          </div>
        </Link>
        <Link href="/threats" className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/15 transition-all shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Threat Intel</span>
            <span className="text-[10px] text-slate-500 font-medium">Global Sync</span>
          </div>
        </Link>
      </motion.div>

      {/* Analytics Chart Blocks */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scam Trends */}
        <div className="lg:col-span-2">
          <GlassCard glowColor="cyan" interactive={false} className="bg-black/35 border-white/10 p-6 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-r from-transparent to-black/80 z-10 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-20">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Live Global Trajectory</h3>
                <span className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-ping"></span> Live
                </span>
              </div>
              <div className="flex gap-1.5 bg-white/5 border border-white/10 rounded-lg p-0.5">
                {['1W', '1M', '3M', '1Y'].map((t) => (
                  <button key={t} className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${t === '3M' ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'text-slate-400 hover:text-slate-200'}`}>{t}</button>
                ))}
              </div>
            </div>
            
            <div className="w-full relative z-20">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={liveTrends} margin={{ right: 20 }}>
                  <defs>
                    <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbcfe8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#fbcfe8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" stroke="#555" fontSize={9} fontWeight={600} tickMargin={10} />
                  <YAxis stroke="#555" fontSize={10} fontWeight={600} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="phishing" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPhishing)" strokeWidth={2.5} name="Phishing Nodes" isAnimationActive={false} />
                  <Area type="monotone" dataKey="investment" stroke="#fbcfe8" fillOpacity={1} fill="url(#colorInvestment)" strokeWidth={2.5} name="Investment Fraud" isAnimationActive={false} />
                  <Area type="monotone" dataKey="job" stroke="#ec4899" fillOpacity={1} fill="url(#colorJob)" strokeWidth={2.5} name="Syndicate Activity" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Category Distribution */}
        <div>
          <GlassCard glowColor="purple" interactive={false} className="bg-black/35 border-white/10 p-6 h-full flex flex-col">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2 shrink-0">
               Threat Vectors <Globe className="w-4 h-4 text-pink-400 animate-[spin_10s_linear_infinite]" />
            </h3>
            
            <div className="flex justify-center relative flex-1 min-h-[200px]">
              <div className="absolute inset-0 rounded-full border border-pink-500/10 scale-[1.3] animate-ping opacity-20 pointer-events-none"></div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={liveCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {liveCategories.map((entry, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#ec4899' : (i % 3 === 0 ? '#f472b6' : '#ffffff')} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-6 shrink-0">
              {liveCategories.slice(0, 5).map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: i % 2 === 0 ? '#ec4899' : (i % 3 === 0 ? '#f472b6' : '#ffffff') }} />
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-200">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Live status feed structures - 2 Columns now! */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Live feed */}
        <RealtimeFeed />

        {/* Neural AI statuses */}
        <AgentActivity />
      </motion.div>

    </motion.div>
  );
}
