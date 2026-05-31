'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, AlertTriangle, Clock, ThumbsUp, ThumbsDown, Download, 
  Globe, Phone, Mail, Bot, Zap, ChevronRight, Eye, Users, FileText,
  CheckCircle, ArrowLeft, Activity, CreditCard
} from 'lucide-react';
import { DEMO_REPORTS, DEMO_TIMELINE, getSeverityColor, getSeverityBadgeClass, timeAgo } from '@/lib/data';
import { SCAM_TYPES, type ScamType } from '@/lib/ai-engine';
import GlassCard from '@/components/GlassCard';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function normalizeReportDetail(report: any) {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    scamType: report.scam_type || report.scamType || 'unknown',
    severity: report.severity || 'medium',
    riskScore: report.risk_score !== undefined ? report.risk_score : (report.riskScore !== undefined ? report.riskScore : 50),
    status: report.status || 'pending',
    aiSummary: report.ai_summary || report.aiSummary || report.description,
    city: report.city || 'Digital',
    country: report.country || 'India',
    createdAt: report.created_at || report.createdAt || new Date().toISOString(),
    upvotes: report.upvotes !== undefined ? report.upvotes : 0,
    downvotes: report.downvotes !== undefined ? report.downvotes : 0,
    evidenceCount: report.evidence_count !== undefined ? report.evidence_count : (report.evidenceCount !== undefined ? report.evidenceCount : 0),
    indicatorCount: report.indicator_count !== undefined ? report.indicator_count : (report.indicators !== undefined ? report.indicators : 0),
    createdBy: report.created_by || report.createdBy || 'Anonymous Operator'
  };
}

export default function ReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      if (params?.id) {
        try {
          const { data, error } = await supabase.from('scam_reports').select('*').eq('id', params.id).single();
          if (isMounted) {
            if (data) {
              setReport(normalizeReportDetail(data));
            } else {
              const demo = DEMO_REPORTS.find(r => r.id === params.id);
              setReport(normalizeReportDetail(demo || DEMO_REPORTS[0]));
            }
          }
        } catch (e) {
          if (isMounted) {
            const demo = DEMO_REPORTS.find(r => r.id === params.id);
            setReport(normalizeReportDetail(demo || DEMO_REPORTS[0]));
          }
        }
      }
      if (isMounted) setLoading(false);
    };
    fetchReport();
    return () => { isMounted = false; };
  }, [params?.id]);

  if (loading || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 rounded-full border-t-2 border-pink-400 border-r-2 border-transparent animate-spin" />
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">Loading incident dossier files...</span>
      </div>
    );
  }

  const scamInfo = SCAM_TYPES[report.scamType as ScamType] || SCAM_TYPES.unknown;

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:space-y-8 print:p-8 print:bg-white print:text-black">
      
      {/* Print-Only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
        <h2 className="text-2xl font-black text-slate-900 uppercase font-display">RakshaNet Official Incident Dossier</h2>
        <p className="text-slate-600 font-bold text-sm mt-1">
          Dossier ID: {report.id} &nbsp;|&nbsp; Generated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Back button */}
      <Link 
        href="/reports" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-pink-400 transition-colors print:hidden"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Reports
      </Link>

      {/* Main Header Dossier Card */}
      <GlassCard glowColor="cyan" interactive={false} className="p-8 bg-black/45 border-white/10 relative overflow-hidden print:bg-white print:border-slate-300 print:shadow-none print:p-0 print:rounded-none">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          {/* Animated Risk Gauge */}
          <div className="relative flex-shrink-0 flex items-center justify-center w-36 h-36">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" className="print:stroke-slate-200" />
              <circle 
                cx="70" 
                cy="70" 
                r="60" 
                fill="none" 
                stroke={getSeverityColor(report.severity)} 
                strokeWidth="8"
                strokeLinecap="round" 
                strokeDasharray={`${2 * Math.PI * 60 * report.riskScore / 100} ${2 * Math.PI * 60}`}
                transform="rotate(-90 70 70)" 
                className="transition-all duration-1000 ease-out print:!stroke-current"
                style={{ color: getSeverityColor(report.severity) }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-mono font-black tracking-tighter" style={{ color: getSeverityColor(report.severity) }}>
                {report.riskScore}
              </span>
              <span className="text-[9px] text-slate-500 print:text-slate-600 font-extrabold uppercase tracking-widest mt-0.5">Risk Factor</span>
            </div>
          </div>
          
          {/* Main Info */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-3xl p-1 bg-white/5 border border-white/10 rounded print:bg-transparent print:border-none">{scamInfo.icon}</span>
              <h1 className="text-2xl font-black text-slate-100 print:text-slate-900 leading-tight">{report.title}</h1>
            </div>
            
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
              <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase print:border print:border-slate-300 print:text-black ${
                report.severity === 'critical' 
                  ? 'bg-red-950 border border-red-500/20 text-red-400' 
                  : report.severity === 'high' 
                  ? 'bg-amber-950 border border-amber-500/20 text-amber-400' 
                  : 'bg-indigo-950 border border-indigo-500/20 text-indigo-400'
              }`}>
                {report.severity.toUpperCase()} SEVERITY
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded font-extrabold uppercase bg-white/5 border border-white/10 text-slate-400 print:bg-slate-100 print:border-slate-300 print:text-slate-700">{scamInfo.label}</span>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase bg-pink-500/10 border border-pink-500/25 text-pink-400 print:bg-slate-100 print:border-slate-300 print:text-slate-700">{report.status}</span>
            </div>
            
            <p className="text-slate-300 print:text-slate-700 text-sm leading-relaxed">{report.description}</p>
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-[10px] text-slate-500 print:text-slate-600 font-bold uppercase tracking-wide flex-wrap justify-center md:justify-start pt-2">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{timeAgo(report.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{report.city}, {report.country}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{report.createdBy}</span>
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{report.evidenceCount} assets attached</span>
            </div>
          </div>
          
          {/* Dynamic Votes widget */}
          <div className="flex flex-row md:flex-col items-center gap-3 flex-shrink-0 bg-white/5 border border-white/5 p-3 rounded-2xl print:hidden">
            <button className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all group">
              <ThumbsUp className="w-4.5 h-4.5 text-emerald-400 group-hover:scale-105" />
            </button>
            <span className="text-xs font-mono font-black text-slate-200">{report.upvotes}</span>
            <button className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-500/10 transition-all group">
              <ThumbsDown className="w-4.5 h-4.5 text-red-400 group-hover:scale-105" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-500">{report.downvotes}</span>
          </div>
          
        </div>
      </GlassCard>

      {/* AI Analysis Summary */}
      <GlassCard glowColor="purple" interactive={false} className="p-6 bg-black/40 border-white/10 print:bg-slate-50 print:border-slate-200 print:shadow-none print:rounded-lg">
        <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 print:border-slate-200 pb-4">
          <Bot className="w-5 h-5 text-indigo-400 animate-pulse print:text-indigo-600 print:animate-none" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 print:text-slate-900">Neural Diagnostic Summary</h3>
        </div>
        <p className="text-slate-300 print:text-slate-700 text-sm leading-relaxed">{report.aiSummary}</p>
        
        <div className="mt-4 p-3 rounded-xl bg-pink-950/15 border border-pink-500/25 print:bg-slate-100 print:border-slate-300">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-400 animate-bounce print:text-pink-600 print:animate-none" />
            <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-300 print:text-pink-700">Scanned by Autonomous cyber agents loop</span>
          </div>
        </div>
      </GlassCard>

      {/* Incident Timeline */}
      <GlassCard glowColor="none" interactive={false} className="p-6 bg-black/40 border-white/10 print:bg-transparent print:border-none print:p-0 print:shadow-none">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 print:text-slate-900 mb-6 border-b border-white/10 print:border-slate-300 pb-4">📋 Operational Incident Timeline</h3>
        
        <div className="relative pl-8 space-y-6">
          {/* Vertical layout line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-pink-500/60 via-rose-500/40 to-transparent print:bg-slate-300" />

          {DEMO_TIMELINE.map((event) => (
            <div key={event.id} className="relative group">
              {/* Circle indicator node */}
              <div className={`absolute left-0 w-8 h-8 rounded-lg flex items-center justify-center -translate-x-8 ${
                event.type === 'agent_action' ? 'bg-pink-950/40 border border-pink-500/20 text-pink-400 print:bg-pink-50 print:border-pink-200 print:text-pink-600' :
                event.type === 'ai_analysis' ? 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 print:bg-indigo-50 print:border-indigo-200 print:text-indigo-600' :
                'bg-white/5 border border-white/10 text-slate-400 print:bg-slate-100 print:border-slate-200 print:text-slate-600'
              } z-10`}>
                {event.type === 'agent_action' ? <Bot className="w-4 h-4" /> :
                 event.type === 'ai_analysis' ? <Zap className="w-4 h-4" /> :
                 event.type === 'community_vote' ? <Users className="w-4 h-4" /> :
                 <Activity className="w-4 h-4" />}
              </div>
              
              <div className="ml-4 flex-1">
                <p className="text-xs font-bold text-slate-200 print:text-slate-800">{event.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 print:text-slate-600 font-semibold uppercase tracking-wider">
                  <span>{timeAgo(event.timestamp)}</span>
                  {event.agentName && (
                    <span className="px-2 py-0.5 rounded border border-pink-500/25 bg-pink-500/10 text-pink-400 font-extrabold print:bg-pink-50 print:border-pink-200 print:text-pink-600">{event.agentName}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-pink-400" /> Export Incident PDF
        </button>
        <button 
          onClick={() => alert('INTELLIGENCE SYNC INITIATED:\n\nTelemetry data successfully synchronized with global threat intelligence nodes and community blacklists.')}
          className="flex-1 px-6 py-3 rounded-xl border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <Globe className="w-4 h-4" /> Sync Threat Intelligence
        </button>
        <a 
          href="https://cybercrime.gov.in" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        >
          <AlertTriangle className="w-4 h-4" /> Escalate to Cybercrime
        </a>
      </div>
      
    </div>
  );
}
