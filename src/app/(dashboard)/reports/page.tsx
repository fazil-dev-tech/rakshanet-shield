'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Eye, Clock, Download, Filter, Search, ShieldAlert } from 'lucide-react';
import { DEMO_REPORTS, timeAgo, getSeverityBadgeClass, getSeverityColor } from '@/lib/data';
import { SCAM_TYPES, type ScamType, type SeverityLevel } from '@/lib/ai-engine';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/GlassCard';

function normalizeReport(report: any) {
  return {
    id: String(report.id || ''),
    title: report.title || 'Untitled Report',
    description: report.description || '',
    scam_type: report.scam_type || report.scamType || 'unknown',
    severity: report.severity || 'medium',
    risk_score: report.risk_score !== undefined ? report.risk_score : (report.riskScore !== undefined ? report.riskScore : 50),
    status: report.status || 'pending',
    ai_summary: report.ai_summary || report.aiSummary || report.description || '',
    city: report.city || 'Digital',
    country: report.country || 'India',
    created_at: report.created_at || report.createdAt || new Date().toISOString(),
    upvotes: report.upvotes !== undefined ? report.upvotes : 0,
    downvotes: report.downvotes !== undefined ? report.downvotes : 0,
    evidence_count: report.evidence_count !== undefined ? report.evidence_count : (report.evidenceCount !== undefined ? report.evidenceCount : 0),
    indicator_count: report.indicator_count !== undefined ? report.indicator_count : (report.indicators !== undefined ? report.indicators : 0),
  };
}

function safeStatusColor(status: string): string {
  switch (status) {
    case 'pending': return '#64748B';
    case 'analyzing': return '#ec4899';
    case 'verified': return '#EF4444';
    case 'resolved': return '#22C55E';
    case 'false_positive': return '#94A3B8';
    default: return '#64748B';
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase.from('scam_reports').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setReports(data.map(normalizeReport));
        } else {
          setReports(DEMO_REPORTS.map(normalizeReport));
        }
      } catch (e) {
        setReports(DEMO_REPORTS.map(normalizeReport));
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 rounded-full border-t-2 border-pink-400 border-r-2 border-transparent animate-spin" />
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">Synchronizing Dossier Logs...</span>
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Scam Type', 'Severity', 'Risk Score', 'Status', 'City', 'Country', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...reports.map(r => 
        [
          r.id, 
          `"${r.title.replace(/"/g, '""')}"`, 
          r.scam_type, 
          r.severity, 
          r.risk_score, 
          r.status, 
          `"${r.city || ''}"`, 
          `"${r.country || ''}"`, 
          r.created_at
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rakshanet_telemetry_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">TELEMETRY DATABASE</span>
          <h1 className="text-3xl font-black font-display text-white mt-1">
            Reports <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium font-sans">{reports.length} scam indicators stored in the active system catalog.</p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-pink-500/20 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-pink-400" /> Export CSV Log
        </button>
      </div>

      {/* Reports Table Container */}
      <GlassCard glowColor="none" interactive={false} className="overflow-hidden p-0 bg-black/35 border-white/10 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-2xs font-extrabold uppercase tracking-widest text-slate-400">
                <th className="p-5">Report Identifier</th>
                <th className="p-5">Threat Category</th>
                <th className="p-5">Severity</th>
                <th className="p-5">Risk</th>
                <th className="p-5">Verification State</th>
                <th className="p-5">Origin City</th>
                <th className="p-5">Logged Time</th>
                <th className="p-5 text-right">Operational File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors font-medium">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-white/5 border border-white/10 rounded flex-shrink-0">
                          {SCAM_TYPES[report.scam_type as ScamType]?.icon || '❓'}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{report.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {String(report.id).substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-xs text-slate-400 font-semibold">{SCAM_TYPES[report.scam_type as ScamType]?.label || report.scam_type}</td>
                    <td className="p-5">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        report.severity === 'critical' 
                          ? 'bg-red-950 border border-red-500/20 text-red-400' 
                          : report.severity === 'high' 
                          ? 'bg-amber-950 border border-amber-500/20 text-amber-400' 
                          : 'bg-indigo-950 border border-indigo-500/20 text-indigo-400'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-black border"
                        style={{ 
                          borderColor: `${getSeverityColor(report.severity as SeverityLevel)}35`,
                          background: `${getSeverityColor(report.severity as SeverityLevel)}15`, 
                          color: getSeverityColor(report.severity as SeverityLevel) 
                        }}>
                        {report.risk_score}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border" 
                        style={{ 
                          borderColor: `${safeStatusColor(report.status)}30`,
                          background: `${safeStatusColor(report.status)}15`, 
                          color: safeStatusColor(report.status) 
                        }}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-5 text-xs text-slate-400">{report.city || 'Digital'}</td>
                    <td className="p-5 text-xs text-slate-500 font-semibold">{timeAgo(report.created_at)}</td>
                    <td className="p-5 text-right">
                      <Link 
                        href={`/reports/${report.id}`} 
                        className="text-pink-400 hover:text-pink-300 text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Dossier
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    No active scam reports stored in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
