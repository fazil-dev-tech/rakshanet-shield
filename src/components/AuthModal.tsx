'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Shield, KeyRound, Loader2, ArrowRight, CheckCircle2, User, UserPlus, LogIn, ChevronDown, X, AlertTriangle, Fingerprint, Lock, Zap } from 'lucide-react';
import clsx from 'clsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Citizen');
  const [otp, setOtp] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError('');
      setOtp('');
    }
  }, [isOpen]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (authMode === 'signup' && (!firstName || !lastName)) {
      setError('Please provide your full name for account creation.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        email,
        otp,
        ...(authMode === 'signup' && { profile: { firstName, lastName, role } })
      };

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Invalid verification code');
      
      onClose();
      // PRODUCTION READY FIX: Hard redirect guarantees Next.js middleware sees the newly minted cookie
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const switchMode = (mode: 'signin' | 'signup') => {
    if (loading) return;
    setAuthMode(mode);
    setStep('form');
    setError('');
    setOtp('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans selection:bg-pink-500/30">
          
          {/* Intense Blur Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-black/60 transition-all"
            onClick={onClose}
          />

          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-[900px] relative z-10 flex flex-col md:flex-row bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-3xl shadow-[0_30px_100px_-15px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden"
          >
            {/* Modal Close Button (Mobile Absolute, Desktop Relative to form) */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md border border-white/5 transition-all z-20 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT COLUMN: BRANDING & TRUST */}
            <div className="hidden md:flex flex-col justify-between w-5/12 bg-gradient-to-b from-white/[0.03] to-transparent border-r border-white/5 p-12 relative overflow-hidden">
              
              {/* Dynamic Glow Background inside left panel */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1, 
                  backgroundColor: authMode === 'signin' ? 'rgba(236,72,153,0.1)' : 'rgba(139,92,246,0.1)',
                }}
                transition={{ duration: 1 }}
                className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-[100px] pointer-events-none z-0" 
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-14 h-14 bg-gradient-to-tr from-pink-600 to-rose-400 rounded-2xl mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.3)] border border-pink-400/30"
                >
                  <Shield className="w-7 h-7 text-white" />
                </motion.div>
                <h1 className="text-3xl font-black text-white tracking-tight font-display mb-2 drop-shadow-lg">
                  RakshaNet
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Welcome to the world's most advanced autonomous scam intelligence grid.
                </p>
              </div>

              <div className="relative z-10 space-y-6 mt-12">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Fingerprint className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Biometric-Grade Security</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">No passwords required. We utilize hyper-secure OTP tunnels to verify your identity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Encrypted Sessions</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Your data is locked within an isolated memory sandbox, completely invisible to threat actors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Instant Onboarding</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Initialize your protective environment in under 15 seconds.</p>
                  </div>
                </div>
              </div>

              {/* Decorative subtle noise */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* RIGHT COLUMN: THE FORM */}
            <div className="w-full md:w-7/12 p-8 sm:p-10 md:p-14 relative flex flex-col justify-center min-h-[500px]">
              
              {/* Desktop Close Button */}
              <button 
                onClick={onClose}
                className="hidden md:flex absolute top-6 right-6 p-2.5 text-slate-500 hover:text-white bg-transparent hover:bg-white/5 rounded-full transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex p-1 bg-black/40 rounded-xl mb-10 relative border border-white/5 w-full max-w-[320px] mx-auto md:mx-0 shadow-inner"
                  >
                    <div 
                      className="absolute inset-y-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm transition-transform duration-300 ease-spring border border-white/5"
                      style={{ transform: authMode === 'signin' ? 'translateX(0)' : 'translateX(100%)' }}
                    />
                    <button
                      onClick={() => switchMode('signin')}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg relative z-10 transition-colors",
                        authMode === 'signin' ? "text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In
                    </button>
                    <button
                      onClick={() => switchMode('signup')}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg relative z-10 transition-colors",
                        authMode === 'signup' ? "text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Sign Up
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                {step === 'form' ? (
                  <motion.form 
                    key={`form-${authMode}`}
                    initial={{ opacity: 0, x: authMode === 'signin' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: authMode === 'signin' ? 20 : -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSendOtp}
                    className="space-y-6"
                  >
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {authMode === 'signin' ? 'Welcome back' : 'Create an account'}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {authMode === 'signin' ? 'Enter your secure email to receive your access token.' : 'Initialize your protective grid environment today.'}
                      </p>
                    </div>

                    {/* Create Account Fields */}
                    <AnimatePresence>
                      {authMode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-5 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                  type="text"
                                  required
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  placeholder="John"
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-sm shadow-inner"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  placeholder="Doe"
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-sm shadow-inner"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Account Role</label>
                            <div className="relative">
                              <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full appearance-none bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-sm cursor-pointer shadow-inner"
                              >
                                <option value="Citizen">Citizen (Personal Protection)</option>
                                <option value="Investigator">Law Enforcement / Investigator</option>
                                <option value="Corporate">Corporate Security</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email Field (Shared) */}
                    <motion.div layout>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Secure Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-pink-400 transition-colors" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all text-sm shadow-inner"
                        />
                      </div>
                    </motion.div>

                    {error && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs py-3 px-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.p>
                    )}

                    <motion.button
                      layout
                      type="submit"
                      disabled={loading || !email}
                      className="w-full mt-2 bg-white text-black hover:bg-slate-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          {authMode === 'signin' ? 'Continue with Email' : 'Initialize Account'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  /* OTP Verification Step */
                  <motion.form
                    key="otp-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleVerifyOtp}
                    className="space-y-8 flex flex-col justify-center h-full"
                  >
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                      <p className="text-sm text-slate-400">
                        We sent a secure 6-digit code to <br />
                        <span className="text-white font-semibold">{email}</span>
                      </p>
                    </div>
                    


                    <div>
                      <div className="relative">
                        <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="000000"
                          className="w-full bg-white/[0.03] border border-white/20 rounded-xl py-5 pl-14 pr-4 text-white tracking-[1em] font-mono text-2xl placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs py-3 px-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.p>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] border border-emerald-400/50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          authMode === 'signin' ? 'Verify & Access Terminal' : 'Verify & Setup Account'
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => { setStep('form'); setOtp(''); setError(''); }}
                        className="w-full text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors py-4 mt-2"
                      >
                        &larr; Use a different email
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
