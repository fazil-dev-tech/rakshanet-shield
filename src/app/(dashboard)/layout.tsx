'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, LayoutDashboard, Upload, FileText, Users, Brain,
  BarChart3, Globe, Settings, Menu, X, Bell, Search, ChevronRight,
  Activity, ShieldAlert, MessageSquare, AlertTriangle, LogOut, ShieldCheck
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main Menu' },
  { href: '/report', label: 'Report Scam', icon: Upload, section: 'Main Menu' },
  { href: '/community', label: 'Community Feed', icon: Users, section: 'Main Menu' },
  { href: '/reports', label: 'Reports Center', icon: FileText, section: 'Main Menu' },
  { href: '/assistant', label: 'AI Assistant', icon: MessageSquare, section: 'AI & Analytics' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, section: 'AI & Analytics' },
  { href: '/threats', label: 'Threat Intel', icon: Globe, section: 'AI & Analytics' },
  { href: '/settings', label: 'Settings', icon: Settings, section: 'System' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-slate-100 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar (frosted glass, multi-layer blur sidebar) */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex-shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-black/40 backdrop-blur-2xl border-r border-white/10`}>
        <div className="h-full flex flex-col justify-between">
          
          <div className="flex flex-col">
            {/* Logo with active ring */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <Shield className="w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)] group-hover:scale-105 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent font-display">RakshaNet</span>
                  <span className="text-lg font-bold text-slate-200 font-display"> Shield</span>
                </div>
              </Link>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-280px)]">
              <div>
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-4 mb-3">COMMAND CONTROLS</div>
                <div className="space-y-1">
                  {navItems.filter(item => item.section === 'Main Menu').map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all ${
                          isActive 
                            ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-pink-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-pink-400 ml-auto shadow-[0_0_8px_rgba(236,72,153,0.8)]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-4 mb-3">NEURAL AI SCANNER</div>
                <div className="space-y-1">
                  {navItems.filter(item => item.section === 'AI & Analytics').map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all ${
                          isActive 
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-auto shadow-[0_0_8px_rgba(244,63,94,0.8)]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-4 mb-3">SYSTEM SETTINGS</div>
                <div className="space-y-1">
                  {navItems.filter(item => item.section === 'System').map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all ${
                          isActive 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>


        </div>
      </aside>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black/95">
        {/* Top Header Navigation */}
        <header className="flex-shrink-0 h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/45 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Glassmorphism search input */}
            <div className="hidden sm:flex cyber-search-container min-w-[320px]">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search reports, hashes, threat indicators..."
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Active telemetry status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>SECURE SCANNER STATUS</span>
            </div>

            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className={`relative p-2 rounded-lg border transition-colors ${showNotifications ? 'bg-white/10 border-pink-500/30 text-pink-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <Bell className="w-5 h-5" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl p-4 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">SECURE NOTIFICATIONS</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 font-extrabold uppercase">3 NEW</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 hover:bg-red-950/30 transition-colors cursor-pointer">
                      <div className="flex justify-between text-xs font-bold text-red-400">
                        <span>High-Risk Scam Target</span>
                        <span>Just Now</span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-1 leading-relaxed">Spike in SBI Yono phishing scams matching active signatures. Guard is warning users.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex justify-between text-xs font-bold text-slate-200">
                        <span>Scam Report Verified</span>
                        <span>2h ago</span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-1 leading-relaxed">Scam report #4928 domain reputation verified. Shared signature updated with community.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                  showProfileMenu 
                    ? 'border-pink-500/30 bg-pink-500/5' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center font-bold text-xs text-black shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                  RS
                </div>
                <span className="hidden md:inline text-xs font-bold text-slate-300 tracking-wide pr-1">RakshaNet Admin</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl p-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-white/5 text-left mb-1">
                    <p className="text-xs font-bold text-slate-200">System Operator</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: SEC-2026-X83</p>
                  </div>
                  <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-slate-500" />
                    Operator Settings
                  </Link>
                  <Link href="/reports" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 text-slate-500" />
                    My Submissions
                  </Link>
                  <div className="border-t border-white/5 my-1" />
                  <button onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/';
                  }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4 text-red-500" />
                    Exit Terminal
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content viewport */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* Subtle grid backing texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
