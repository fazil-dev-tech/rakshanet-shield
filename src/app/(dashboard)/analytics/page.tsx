'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Globe, AlertTriangle, Activity, PieChart as PieIcon
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { SCAM_TRENDS, CATEGORY_DISTRIBUTION, HOURLY_ACTIVITY, PLATFORM_STATS, formatNumber } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';

const radarData = [
  { subject: 'Phishing', A: 92 },
  { subject: 'Banking', A: 78 },
  { subject: 'Investment', A: 85 },
  { subject: 'Job Scams', A: 71 },
  { subject: 'KYC Fraud', A: 88 },
  { subject: 'Crypto', A: 65 },
  { subject: 'Malware', A: 94 },
];

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  reports: Math.floor(Math.random() * 50) + 20,
  resolved: Math.floor(Math.random() * 30) + 10,
}));

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-panel p-3 border border-white/10 bg-black/90 rounded-xl text-xs space-y-1 shadow-2xl">
      <p className="font-bold text-slate-200 mb-1">{label}</p>
      {payload.map((e, i) => (
        <p key={i} className="font-semibold" style={{ color: e.color }}>
          {e.name}: {e.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [totalScams, setTotalScams] = useState(PLATFORM_STATS.totalScamsDetected);
  const [categoryData, setCategoryData] = useState<any[]>(CATEGORY_DISTRIBUTION);
  const [cityData, setCityData] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const { data } = await supabase.from('scam_reports').select('scam_type, city');
      if (data && isMounted) {
        setTotalScams(PLATFORM_STATS.totalScamsDetected + data.length);
        
        const catMap = data.reduce((acc, curr) => {
          const type = curr.scam_type;
          if (type) acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const colors: Record<string, string> = {
          phishing: '#f43f5e', investment_fraud: '#f9a8d4',
          job_scam: '#ec4899', kyc_fraud: '#fbcfe8',
          crypto_scam: '#f472b6', banking_fraud: '#ffffff',
        };
        
        const newCatData = Object.keys(catMap).map(k => ({
          name: k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          value: Math.max(1, Math.round((catMap[k] / data.length) * 100)),
          color: colors[k] || '#94a3b8'
        }));
        
        if (newCatData.length > 0) setCategoryData(newCatData);
        
        const cMap = data.reduce((acc, curr) => {
          if (curr.city) acc[curr.city] = (acc[curr.city] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setCityData(cMap);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const heatmapTiles = useMemo(() => {
    const tiles = Array.from({ length: 72 }, () => ({ intensity: 0, city: '' }));
    const cityEntries = Object.entries(cityData).sort((a,b) => b[1] - a[1]);
    
    cityEntries.forEach(([city, count], idx) => {
      if (idx < 72) {
        const randomIdx = Math.floor(Math.random() * 72);
        tiles[randomIdx] = { 
          intensity: Math.min(count / 10, 1), 
          city: `${city} (${count} reports)` 
        };
      }
    });

    return tiles.map(t => t.intensity === 0 ? { intensity: Math.random() * 0.3, city: 'Low Activity Zone' } : t);
  }, [cityData]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">TELEMETRY ANALYTICS</span>
        <h1 className="text-3xl font-black font-display text-white mt-1">
          Threat Vector <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium font-sans">Autonomous neural scoring summaries and active geographical hot-spots.</p>
      </div>

      {/* Top metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cumulative Telemetry', value: totalScams, icon: BarChart3, color: 'cyan' as const, glow: '#ec4899' },
          { label: 'Average Risk Rating', value: 72.4, icon: AlertTriangle, color: 'amber' as const, glow: '#f472b6' },
          { label: 'Model Accuracy', value: 97.8, icon: TrendingUp, color: 'emerald' as const, glow: '#f9a8d4', suffix: '%' },
          { label: 'Active Criticals', value: 127, icon: Activity, color: 'purple' as const, glow: '#ffffff' },
        ].map((s, i) => (
          <GlassCard key={i} glowColor={s.color} className="p-5 bg-black/40 border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
              <s.icon className="w-4 h-4" style={{ color: s.glow }} />
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="text-2xl font-black font-mono mt-2">
              <AnimatedCounter end={s.value} suffix={s.suffix} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scam Trend Area */}
        <GlassCard glowColor="cyan" interactive={false} className="bg-black/35 border-white/10 p-6">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-pink-400" /> Scam Vector Trajectory
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={SCAM_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" strokeOpacity={0.5} />
              <XAxis dataKey="month" stroke="#555" fontSize={11} fontWeight={600} />
              <YAxis stroke="#555" fontSize={11} fontWeight={600} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="phishing" stroke="#f43f5e" fill="transparent" strokeWidth={2} name="Phishing" />
              <Area type="monotone" dataKey="investment" stroke="#fbcfe8" fill="transparent" strokeWidth={2} name="Investment" />
              <Area type="monotone" dataKey="banking" stroke="#ec4899" fill="transparent" strokeWidth={2} name="Banking" />
              <Area type="monotone" dataKey="kyc" stroke="#f9a8d4" fill="transparent" strokeWidth={2} name="KYC" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* AI Detection Radar */}
        <GlassCard glowColor="purple" interactive={false} className="bg-black/35 border-white/10 p-6">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
            <Globe className="w-4.5 h-4.5 text-indigo-400 animate-pulse" /> Neural Classification Accuracy
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#222" />
              <PolarAngleAxis dataKey="subject" stroke="#555" fontSize={10} fontWeight={600} />
              <PolarRadiusAxis stroke="#222" fontSize={9} />
              <Radar name="Accuracy Score" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Weekly Activity */}
        <GlassCard glowColor="amber" interactive={false} className="bg-black/35 border-white/10 p-6">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-amber-400" /> Weekly Telemetry Cycles
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" strokeOpacity={0.5} />
              <XAxis dataKey="day" stroke="#555" fontSize={11} fontWeight={600} />
              <YAxis stroke="#555" fontSize={11} fontWeight={600} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="reports" fill="#ec4899" radius={[4, 4, 0, 0]} name="Verified Submissions" />
              <Bar dataKey="resolved" fill="#fbcfe8" radius={[4, 4, 0, 0]} name="Auto Mitigated" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Category distribution donut */}
        <GlassCard glowColor="purple" interactive={false} className="bg-black/35 border-white/10 p-6">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
            <PieIcon className="w-4.5 h-4.5 text-indigo-400" /> Signature Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

      </div>

      {/* Heatmap Grid */}
      <GlassCard glowColor="cyan" interactive={false} className="bg-black/35 border-white/10 p-6">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <Globe className="w-4.5 h-4.5 text-pink-400" /> Indian Geographic Vulnerability Grid
        </h3>
        
        <div className="relative grid grid-cols-6 md:grid-cols-12 gap-2 p-5 rounded-2xl bg-[#0a0508] border border-white/10 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent h-[150%] animate-scan pointer-events-none" />
          {heatmapTiles.map((tile, i) => {
            const intensity = tile.intensity;
            return (
              <div 
                key={i} 
                className="aspect-square rounded-[4px] transition-all duration-300 hover:scale-[1.15] cursor-pointer relative z-10"
                style={{
                  background: intensity > 0.7 
                    ? `rgba(239, 68, 68, ${intensity})` 
                    : intensity > 0.4 
                    ? `rgba(245, 158, 11, ${intensity})` 
                    : `rgba(236, 72, 153, ${intensity * 0.4 + 0.15})`,
                  boxShadow: intensity > 0.7 
                    ? '0 0 15px rgba(239, 68, 68, 0.4)' 
                    : intensity > 0.4 
                    ? '0 0 10px rgba(245, 158, 11, 0.2)' 
                    : 'inset 0 0 5px rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                title={tile.city} 
              />
            );
          })}
        </div>
        
        <div className="flex items-center gap-6 mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-pink-950/60 border border-pink-500/20" />Minimal Threat</div>
          <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-amber-500/50" />Warning Vectors</div>
          <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-red-600/80 animate-pulse" />Critical Lockout</div>
        </div>
      </GlassCard>

    </motion.div>
  );
}
