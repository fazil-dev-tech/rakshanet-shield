'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ThumbsUp, ThumbsDown, Eye, Clock, Search, Filter, TrendingUp, AlertTriangle, MessageSquare, Share2, ShieldCheck } from 'lucide-react';
import { DEMO_REPORTS, timeAgo, getSeverityColor, getSeverityBadgeClass } from '@/lib/data';
import { SCAM_TYPES, type ScamType, type SeverityLevel } from '@/lib/ai-engine';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/GlassCard';

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

export default function CommunityPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase.from('scam_reports').select('*').order('created_at', { ascending: false });
        if (isMounted) {
          if (data && data.length > 0) {
            setReports(data.map(normalizeReport));
          } else {
            setReports(DEMO_REPORTS.map(normalizeReport));
          }
        }
      } catch (e) {
        if (isMounted) setReports(DEMO_REPORTS.map(normalizeReport));
      }
      if (isMounted) setLoading(false);
    };
    fetchReports();
    return () => { isMounted = false; };
  }, []);

  const filteredReports = reports.filter(r => {
    if (filter !== 'all' && r.scam_type !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 rounded-full border-t-2 border-pink-400 border-r-2 border-transparent animate-spin" />
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">Syncing Intelligence Feed...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">PUBLIC DATA EXCHANGE</span>
          <h1 className="text-3xl font-black font-display text-white mt-1">
            Community <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Intelligence</span> Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Crowdsourced threat signatures, phishing hashes, and fraud telemetry</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute" />
          <span className="pl-1">{reports.length} Telemetry Points Active</span>
        </div>
      </div>

      {/* Filters Search panel */}
      <GlassCard glowColor="cyan" interactive={false} className="p-4 bg-black/40 border-white/10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 cyber-search-container">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified fraud indicators..." 
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setFilter('all')} 
            className={`text-2xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg border transition-all ${
              filter === 'all' 
                ? 'bg-pink-500 border-pink-400 text-black shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          
          {['phishing', 'banking_fraud', 'job_scam', 'crypto_scam', 'kyc_fraud'].map(type => (
            <button 
              key={type} 
              onClick={() => setFilter(type)}
              className={`text-2xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg border transition-all ${
                filter === type 
                  ? 'bg-pink-500 border-pink-400 text-black shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                  : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {SCAM_TYPES[type as ScamType]?.icon} {SCAM_TYPES[type as ScamType]?.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Trending Hashtags */}
      <GlassCard glowColor="none" interactive={false} className="p-4 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">Hot Telemetry Tags</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['#FakeSBI_KYC', '#CryptoScam', '#JobFraud', '#PhishingAlert', '#UPIScam'].map(tag => (
            <span 
              key={tag} 
              className="text-2xs font-bold px-3 py-1.5 rounded-lg bg-pink-950/20 text-pink-300 border border-pink-500/10 cursor-pointer hover:bg-pink-500/15 hover:border-pink-500/30 transition-all"
            >
              {tag}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`} className="block">
            <GlassCard 
              glowColor="cyan" 
              className="bg-black/35 border-white/10 hover:border-pink-500/30 hover:bg-black/55 transition-all p-6"
            >
              <div className="flex items-start gap-4">
                
                <div className="text-3xl p-2 bg-white/5 border border-white/10 rounded flex-shrink-0">
                  {SCAM_TYPES[report.scam_type as ScamType]?.icon || '❓'}
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-black text-slate-100 group-hover:text-pink-300 transition-colors leading-tight">{report.title}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                      report.severity === 'critical' 
                        ? 'bg-red-950 border border-red-500/30 text-red-400' 
                        : report.severity === 'high' 
                        ? 'bg-amber-950 border border-amber-500/30 text-amber-400' 
                        : 'bg-indigo-950 border border-indigo-500/30 text-indigo-400'
                    }`}>
                      {report.severity}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded font-extrabold uppercase bg-white/5 border border-white/10 text-slate-400">{report.status}</span>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{report.description}</p>
                  <p className="text-xs text-slate-500 italic mt-1 font-sans leading-relaxed">&quot;{report.ai_summary || 'Multi-agent analysis verified...'}&quot;</p>
                  
                  {/* Meta Indicators */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wide flex-wrap pt-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeAgo(report.created_at)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{report.city || 'Digital'}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{report.created_by || 'Citizen'}</span>
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{report.indicator_count || report.indicators || 0} Indicators</span>
                  </div>
                </div>
                
                {/* Right side dial */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0 pl-2">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-mono font-black border"
                    style={{ 
                      borderColor: `${getSeverityColor(report.severity as SeverityLevel)}35`,
                      background: `${getSeverityColor(report.severity as SeverityLevel)}15`, 
                      color: getSeverityColor(report.severity as SeverityLevel) 
                    }}>
                    {report.risk_score}
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors" onClick={(e) => e.preventDefault()}>
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">{report.upvotes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors" onClick={(e) => e.preventDefault()}>
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">{report.downvotes || 0}</span>
                    </button>
                  </div>
                </div>

              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
