'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, AlertTriangle, Shield, ExternalLink, Eye, Clock } from 'lucide-react';
import { timeAgo } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/GlassCard';

import type { Database } from '@/lib/supabase';

type ThreatRow = Database['public']['Tables']['threat_intelligence']['Row'];

export default function ThreatsPage() {
  const [threats, setThreats] = useState<ThreatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchThreats = async () => {
      const { data } = await supabase.from('threat_intelligence').select('*').order('created_at', { ascending: false });
      if (isMounted && data) setThreats(data);
      if (isMounted) setLoading(false);
    };
    fetchThreats();
    return () => { isMounted = false; };
  }, []);

  const filteredThreats = threats.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.domain && t.domain.toLowerCase().includes(q)) ||
      (t.ip && t.ip.toLowerCase().includes(q)) ||
      (t.threat_type && t.threat_type.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 rounded-full border-t-2 border-pink-400 border-r-2 border-transparent animate-spin" />
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">Loading Reputation Indexes...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">REPUTATION GRID</span>
        <h1 className="text-3xl font-black font-display text-white mt-1">
          Threat <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Intelligence</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium font-sans">Aggregated malicious domains, typosquats, blacklisted IP ranges, and active scam wallets.</p>
      </div>

      {/* Search Bar */}
      <GlassCard glowColor="cyan" interactive={false} className="p-4 bg-black/40 border-white/10">
        <div className="cyber-search-container">
          <Search className="w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search domains, IP addresses, target indicators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Threat Table */}
      <GlassCard glowColor="none" interactive={false} className="overflow-hidden p-0 bg-black/35 border-white/10 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-2xs font-extrabold uppercase tracking-widest text-slate-400">
                <th className="p-5">Threat Target Domain</th>
                <th className="p-5">IP Address</th>
                <th className="p-5">Veracity Score</th>
                <th className="p-5">Threat Vector</th>
                <th className="p-5">Total Reports</th>
                <th className="p-5">Last Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredThreats.length > 0 ? (
                filteredThreats.map((threat) => {
                  const repColor = threat.reputation <= 3 ? '#f87171' : threat.reputation <= 6 ? '#fbbf24' : '#34d399';
                  return (
                    <tr key={threat.id} className="hover:bg-white/5 transition-colors font-medium">
                      <td className="p-5">
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-red-400" />
                          <span className="font-mono text-xs text-red-400 font-bold">{threat.domain || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-5 font-mono text-xs text-slate-400">{threat.ip || 'N/A'}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{
                              width: `${threat.reputation * 10}%`,
                              background: repColor
                            }} />
                          </div>
                          <span className="text-xs font-black font-mono" style={{ color: repColor }}>
                            {threat.reputation}/10
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded font-extrabold uppercase ${
                          threat.reputation <= 3 
                            ? 'bg-red-950 border border-red-500/20 text-red-400' 
                            : 'bg-amber-950 border border-amber-500/20 text-amber-400'
                        }`}>
                          {threat.threat_type || 'Malicious'}
                        </span>
                      </td>
                      <td className="p-5 text-xs font-extrabold text-slate-200 font-mono">{threat.total_reports || 0}</td>
                      <td className="p-5 text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(threat.last_seen || threat.created_at)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    No threat intelligence signatures match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
