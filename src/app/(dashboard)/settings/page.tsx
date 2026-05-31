'use client';

import { Settings as SettingsIcon, User, Bell, Shield, Eye, Moon, Globe, Key, Smartphone, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoScan, setAutoScan] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [puterUser, setPuterUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rakshanet_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.notifications ?? true);
        setEmailAlerts(parsed.emailAlerts ?? true);
        setDarkMode(parsed.darkMode ?? true);
        setAutoScan(parsed.autoScan ?? true);
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      import('@heyputer/puter.js').then((puterModule) => {
        const puter = puterModule.puter || puterModule.default || puterModule;
        try {
          if (puter?.auth?.isSignedIn()) {
            puter.auth.getUser().then((user: any) => {
              if (user) {
                setPuterUser({ username: user.username, email: user.email });
              }
            });
          }
        } catch (e) {
          console.warn('Puter auth check failed:', e);
        }
      }).catch(() => {
        // Puter.js not available — silent fallback
      });
    }
  }, []);

  const handlePuterSignIn = async () => {
    if (typeof window !== 'undefined') {
      const puterModule = await import('@heyputer/puter.js');
      const puter = puterModule.puter || puterModule.default || puterModule;
      try {
        await puter.auth.signIn();
        const user = (await puter.auth.getUser()) as any;
        if (user) {
          setPuterUser({ username: user.username, email: user.email });
        }
      } catch (err) {
        console.error("Sign in failed", err);
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem('rakshanet_settings', JSON.stringify({
      notifications, emailAlerts, darkMode, autoScan
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle} 
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        enabled ? 'bg-pink-500' : 'bg-white/5 border border-white/10'
      }`}
    >
      <div 
        className={`absolute top-0.5 w-4.5 h-4.5 rounded-full transition-transform duration-300 ${
          enabled ? 'translate-x-5.5 bg-black' : 'translate-x-0.5 bg-slate-500'
        }`} 
      />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">OPERATIONAL PARAMETERS</span>
        <h1 className="text-3xl font-black font-display text-white mt-1">
          System <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium font-sans">Manage your active security credentials, scanning vectors, and notification hooks.</p>
      </div>

      {/* Profile Card */}
      <GlassCard glowColor="cyan" interactive={false} className="p-6 bg-black/40 border-white/10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-pink-400" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Operator Profile</h3>
          </div>
          {!puterUser && (
            <button 
              onClick={handlePuterSignIn}
              className="px-3.5 py-1.5 rounded border border-pink-500/20 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-extrabold text-2xs uppercase tracking-widest transition-all"
            >
              Sign In with Puter ID
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl font-black text-black shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            {puterUser ? puterUser.username.substring(0, 2).toUpperCase() : 'RS'}
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-200">{puterUser ? puterUser.username : 'RakshaNet Admin Operator'}</h4>
            <p className="text-xs text-slate-500 font-mono">{puterUser ? puterUser.email : 'operator@rakshanet.shield'}</p>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-pink-500/25 bg-pink-500/10 text-pink-400">
              {puterUser ? 'VERIFIED OPERATOR' : 'Tactical Grade Level'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="cyber-form-group">
            <label>Display Name</label>
            <input 
              key={puterUser ? puterUser.username : 'operator'}
              defaultValue={puterUser ? puterUser.username : 'RakshaNet Operator'} 
              className="glass-input" 
            />
          </div>
          <div className="cyber-form-group">
            <label>Secure Email</label>
            <input 
              key={puterUser ? puterUser.email : 'email'}
              defaultValue={puterUser ? puterUser.email : 'operator@rakshanet.shield'} 
              className="glass-input" 
            />
          </div>
        </div>
      </GlassCard>

      {/* Notifications Card */}
      <GlassCard glowColor="purple" interactive={false} className="p-6 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Notification Channels</h3>
        </div>
        
        <div className="space-y-3.5">
          {[
            { label: 'Tactical Push Notifications', desc: 'Receive real-time dashboard notifications for verified scams', enabled: notifications, toggle: () => setNotifications(!notifications) },
            { label: 'Administrative Email Dossiers', desc: 'Periodic summaries of critical threat telemetry matches', enabled: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5">
              <div>
                <p className="text-xs font-bold text-slate-200">{item.label}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
              </div>
              <Toggle enabled={item.enabled} onToggle={item.toggle} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Preferences Card */}
      <GlassCard glowColor="none" interactive={false} className="p-6 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <Eye className="w-5 h-5 text-slate-400" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Guard Vector Preferences</h3>
        </div>
        
        <div className="space-y-3.5">
          {[
            { label: 'Secure Dark Theme (Recommended)', desc: 'High-contrast neon matrix visualization parameters', enabled: darkMode, toggle: () => setDarkMode(!darkMode), icon: Moon },
            { label: 'Autonomous Domain Scanning', desc: 'Trigger active DNS and SSL scanning rings during report intakes', enabled: autoScan, toggle: () => setAutoScan(!autoScan), icon: Shield },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <item.icon className="w-4.5 h-4.5 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                </div>
              </div>
              <Toggle enabled={item.enabled} onToggle={item.toggle} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Security Credentials */}
      <GlassCard glowColor="none" interactive={false} className="p-6 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <Key className="w-5 h-5 text-slate-400" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Terminal Credentials</h3>
        </div>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-200">Change Master Password</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Password was configured 30 days ago</p>
            </div>
            <Shield className="w-4 h-4 text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-200">Two-Factor Authentication Keys</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">CYBER-KEY SYNCED</p>
            </div>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </GlassCard>

      {/* Save Button */}
      <button 
        onClick={handleSave} 
        className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
          isSaved 
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
            : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.25)]'
        }`}
      >
        {isSaved ? (
          <>
            <Check className="w-4.5 h-4.5" /> settings saved successfully!
          </>
        ) : (
          'Commit Operator Changes'
        )}
      </button>

    </div>
  );
}
