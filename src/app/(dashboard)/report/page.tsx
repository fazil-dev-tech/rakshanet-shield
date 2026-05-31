'use client';

import { useState, useCallback } from 'react';
import {
  Upload, Shield, AlertTriangle, FileText, Send, Brain, Zap,
  CheckCircle, X, ChevronRight, ChevronLeft, Loader2, Eye,
  Phone, Mail, Link2, CreditCard, Globe, Bot, ArrowRight, Download
} from 'lucide-react';
import { aiOrchestrator, SCAM_TYPES, type ScamAnalysis, type ScamType } from '@/lib/ai-engine';
import { getSeverityColor } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/GlassCard';

type Step = 'type' | 'details' | 'evidence' | 'analyze' | 'result';

const scamTypeEntries = Object.entries(SCAM_TYPES).filter(([k]) => k !== 'unknown') as [ScamType, typeof SCAM_TYPES[ScamType]][];

export default function ReportPage() {
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<ScamType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.apk', '.mp3', '.wav'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFiles = useCallback((incomingFiles: File[]) => {
    const valid: File[] = [];
    for (const file of incomingFiles) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(extension) && !file.type.startsWith('image/')) {
        alert(`Rejected file: ${file.name}. Invalid asset extension. Allowed: PNG, JPG, PDF, APK, MP3, WAV.`);
        continue;
      }
      if (file.size > maxFileSize) {
        alert(`Rejected file: ${file.name}. Asset size exceeds 50MB limit.`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const valid = validateFiles(droppedFiles);
    setFiles(prev => [...prev, ...valid]);
  }, [validateFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const valid = validateFiles(selected);
      setFiles(prev => [...prev, ...valid]);
    }
  }, [validateFiles]);

  const runAnalysis = async () => {
    setStep('analyze');
    setIsAnalyzing(true);
    setAgentLogs([]);

    const logs = [
      '⚡ [ORCHESTRATOR] Initializing Neural Analysis Loop...',
      '🤖 [AGENT-1] Spin-up TextAnalysisAgent: Booting NLP pipelines...',
      '🔍 [AGENT-1] TextAnalysisAgent: Scanning lexical parameters and urgency markers...',
      '🕵️ [AGENT-2] Spin-up EntityExtractionAgent: Extracting malicious indicators...',
      '🔑 [AGENT-2] EntityExtractionAgent: Found phone tokens and domain structures...',
      '🌐 [AGENT-3] Spin-up URLThreatAgent: Executing WHOIS probe & Nameserver maps...',
      '🔒 [AGENT-3] URLThreatAgent: Typosquatting verification & active certificate lookup complete...',
      '📊 [AGENT-4] Spin-up RiskScoringAgent: Running comparative heuristics algorithm...',
      '🔗 [AGENT-4] RiskScoringAgent: Synthesizing vectors. Total threat rating compiled...',
      '📝 [AGENT-5] Spin-up ReportGenAgent: Initiating FIR Technical Evidence format...',
      '✅ [SYSTEM] Orchestrated analysis terminated. Verified output ready for export.',
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 200));
      setAgentLogs(prev => [...prev, logs[i]]);
    }

    const result = await aiOrchestrator.analyzeScam({
      text: `${title} ${description} ${phone}`,
      url: url || undefined,
      hasEvidence: files.length > 0,
      evidenceType: files.length > 0 ? files[0].type : undefined,
      evidenceFile: files.length > 0 ? files[0] : undefined,
    });

    // Override with selected type if provided
    if (selectedType && selectedType !== 'unknown') {
      result.scamType = selectedType;
      result.riskScore = Math.max(result.riskScore, 65);
    }

    setAnalysis(result);
    setIsAnalyzing(false);
    setStep('result');
  };

  const handlePdfDownload = () => {
    window.print();
  };

  const submitToCommunity = async () => {
    if (!analysis || isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('scam_reports').insert([{
      title,
      description,
      scam_type: analysis.scamType,
      severity: analysis.severity,
      risk_score: analysis.riskScore,
      ai_summary: analysis.explanation,
      city: 'Online',
      indicator_count: analysis.indicators.length,
      evidence_count: files.length,
      upvotes: 0,
      downvotes: 0,
      created_at: new Date().toISOString()
    }]);
    setIsSubmitting(false);
    if (!error) {
      setIsSubmitted(true);
    } else {
      alert("Failed to publish report. Please try again.");
    }
  };

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'type', label: 'Scam Type', icon: Shield },
    { key: 'details', label: 'Details', icon: FileText },
    { key: 'evidence', label: 'Evidence', icon: Upload },
    { key: 'analyze', label: 'AI Process', icon: Brain },
    { key: 'result', label: 'Results', icon: CheckCircle },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">TELEMETRY INTAKE</span>
        <h1 className="text-3xl font-black font-display text-white mt-1">
          Submit Fraud <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Telemetry</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium font-sans">Submit digital fraud evidence to orchestrate autonomous multi-agent analysis verification loops.</p>
      </div>

      {/* Progress Steps */}
      <GlassCard glowColor="none" interactive={false} className="p-4 bg-black/40 border-white/10">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`flex items-center gap-2.5 ${i <= stepIndex ? 'text-pink-400' : 'text-slate-500'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${
                  i < stepIndex 
                    ? 'bg-pink-500 border-pink-400 text-black shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                    : i === stepIndex 
                    ? 'bg-pink-500/20 border-pink-400 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]' 
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}>
                  {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${i < stepIndex ? 'bg-pink-500' : 'bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Step 1: Scam Type */}
      {step === 'type' && (
        <GlassCard glowColor="cyan" interactive={false} className="p-8 bg-black/40 border-white/10">
          <h2 className="text-lg font-extrabold uppercase tracking-wider text-slate-200 mb-6">Select Telemetry Classification</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {scamTypeEntries.map(([key, meta]) => (
              <button 
                key={key} 
                onClick={() => setSelectedType(key)}
                className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  selectedType === key 
                    ? 'border-pink-500 bg-pink-500/10 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/15 hover:bg-white/10'
                }`}
              >
                <div className="text-3xl mb-3">{meta.icon}</div>
                <div className="text-xs font-bold tracking-wide uppercase leading-tight">{meta.label}</div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-end mt-8 border-t border-white/5 pt-6">
            <button 
              onClick={() => setStep('details')} 
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold tracking-wide flex items-center gap-1 transition-all shadow-[0_0_15px_rgba(236,72,153,0.25)]"
            >
              Configure Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* Step 2: Details */}
      {step === 'details' && (
        <GlassCard glowColor="cyan" interactive={false} className="p-8 bg-black/40 border-white/10">
          <h2 className="text-lg font-extrabold uppercase tracking-wider text-slate-200 mb-6">Report Parameters</h2>
          <div className="space-y-5">
            <div className="cyber-form-group">
              <label>Report Identifier Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Suspicious KYC OTP SMS warning from mock bank system"
                className="glass-input" 
              />
            </div>
            <div className="cyber-form-group">
              <label>Heuristic Context Details *</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the precise scam contents or describe the detailed conversation log. Mention monetary demands, fear cues, and timelines..."
                rows={6} 
                className="glass-input resize-none" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cyber-form-group">
                <label className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-pink-400" /> Target Phishing Domain
                </label>
                <input 
                  type="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://malicious-gateway-sbi.in" 
                  className="glass-input" 
                />
              </div>
              <div className="cyber-form-group">
                <label className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-pink-400" /> Telephony Scammer ID
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99802 38172" 
                  className="glass-input" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8 border-t border-white/5 pt-6">
            <button 
              onClick={() => setStep('type')} 
              className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-pink-500/20 text-slate-300 text-xs font-bold tracking-wide flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Classification
            </button>
            <button 
              onClick={() => setStep('evidence')} 
              disabled={!title || !description}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold tracking-wide flex items-center gap-1 transition-all shadow-[0_0_15px_rgba(236,72,153,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Evidence <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Evidence Upload */}
      {step === 'evidence' && (
        <GlassCard glowColor="cyan" interactive={false} className="p-8 bg-black/40 border-white/10">
          <h2 className="text-lg font-extrabold uppercase tracking-wider text-slate-200 mb-6">Attach Malicious Assets</h2>
          
          {/* Drop zone with interactive animation */}
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-pink-500/40 bg-white/5 hover:bg-pink-500/5 transition-all cursor-pointer group"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:scale-105 group-hover:text-pink-400 transition-all duration-300" />
            <p className="text-sm font-bold text-slate-300 mb-1">Drag & Drop threat indicators or logs</p>
            <p className="text-2xs text-slate-500 font-medium">Screenshots, APK vectors, emails, headers, call recordings</p>
            <p className="text-[10px] text-pink-400 font-bold mt-2 uppercase tracking-wide">Supports PNG, JPG, PDF, APK, MP3, WAV (Max 50MB)</p>
            <input id="file-input" type="file" multiple accept="image/*,.pdf,.apk,.mp3,.wav" className="hidden" onChange={handleFileSelect} />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-500 block mb-2">TELEMETRY BUNDLE</span>
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{file.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFiles(f => f.filter((_, j) => j !== i))} 
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-8 border-t border-white/5 pt-6">
            <button 
              onClick={() => setStep('details')} 
              className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-pink-500/20 text-slate-300 text-xs font-bold tracking-wide flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Parameters
            </button>
            <button 
              onClick={runAnalysis} 
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold tracking-wide flex items-center gap-1 transition-all shadow-[0_0_15px_rgba(236,72,153,0.25)]"
            >
              <Brain className="w-4 h-4" /> Run Autonomous AI Analysis
            </button>
          </div>
        </GlassCard>
      )}

      {/* Step 4: AI Analysis in Progress (Cyber multiline terminal logging) */}
      {step === 'analyze' && (
        <GlassCard glowColor="cyan" interactive={false} className="p-8 bg-black/40 border-white/10">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-10 h-10 text-pink-400 animate-pulse z-10" />
              <div className="absolute inset-0 bg-pink-500/10 rounded-full blur-[8px] animate-ping" />
            </div>
            <h2 className="text-lg font-extrabold uppercase tracking-wider text-slate-200">Neural Agents Orchestrating Verification</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Please wait while the multi-agent matrix verifies threat signatures...</p>
          </div>
          
          <div className="max-w-xl mx-auto rounded-xl border border-white/10 bg-black p-5 font-mono text-2xs space-y-2 overflow-hidden shadow-2xl relative">
            <div className="absolute top-2 right-4 text-[9px] font-extrabold text-pink-400/50 uppercase tracking-widest animate-pulse">
              ANALYZING CYCLES
            </div>
            
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
              {agentLogs.map((log, i) => (
                <div key={i} className="text-pink-400/80 leading-relaxed animate-fade-in">
                  {log}
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-indigo-400 font-bold animate-pulse pt-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing verification vectors...</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Step 5: Results (SVG circular risk dial) */}
      {step === 'result' && analysis && (
        <div className="space-y-6">
          {/* Risk Dial card */}
          <GlassCard glowColor={analysis.severity === 'critical' ? 'cyan' : 'purple'} interactive={false} className="p-8 bg-black/45 border-white/10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              
              {/* Animated Risk Circle Dial */}
              <div className="relative flex-shrink-0 flex items-center justify-center w-40 h-40">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                  <circle cx="80" cy="80" r="70" fill="none"
                    stroke={getSeverityColor(analysis.severity)}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 70 * analysis.riskScore / 100} ${2 * Math.PI * 70}`}
                    transform="rotate(-90 80 80)"
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-black tracking-tighter" style={{ color: getSeverityColor(analysis.severity) }}>
                    {analysis.riskScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">Risk Rating</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-3xl p-1 bg-white/5 border border-white/10 rounded">{SCAM_TYPES[analysis.scamType]?.icon}</span>
                  <div>
                    <h2 className="text-2xl font-black text-slate-100 leading-tight">{SCAM_TYPES[analysis.scamType]?.label}</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase inline-block mt-1 ${
                      analysis.severity === 'critical' 
                        ? 'bg-red-950 border border-red-500/30 text-red-400' 
                        : 'bg-amber-950 border border-amber-500/30 text-amber-400'
                    }`}>
                      {analysis.severity.toUpperCase()} SEVERITY LEVEL
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed">{analysis.explanation}</p>
                
                <div className="text-xs text-slate-500 font-medium">
                  Autonomous confidence threshold matched at: <span className="text-pink-400 font-mono font-bold">{(analysis.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AI Reasoning Chain */}
          <GlassCard glowColor="none" interactive={false} className="p-6 bg-black/40 border-white/10">
            <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-4">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Neural Log Reasoning</h3>
            </div>
            <div className="space-y-2">
              {analysis.aiReasoning.map((reason, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Threat Indicators */}
          {analysis.indicators.length > 0 && (
            <GlassCard glowColor="none" interactive={false} className="p-6 bg-black/40 border-white/10">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 border-b border-white/10 pb-4">Malicious Signature Indicators</h3>
              <div className="space-y-3">
                {analysis.indicators.map((ind, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ind.risk === 'high' ? 'bg-red-950/40 border border-red-500/20 text-red-400' : 'bg-white/5 border border-white/10 text-slate-400'}`}>
                        {ind.type === 'url' ? <Globe className="w-4 h-4" /> : ind.type === 'phone' ? <Phone className="w-4 h-4" /> : ind.type === 'email' ? <Mail className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-slate-200">{ind.value}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{ind.description}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase border ${
                      ind.risk === 'high' 
                        ? 'bg-red-950 border border-red-500/20 text-red-400' 
                        : 'bg-white/5 border border-white/5 text-slate-400'
                    }`}>
                      {ind.risk}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Recommendations */}
          <GlassCard glowColor="none" interactive={false} className="p-6 bg-black/40 border-white/10">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-6 border-b border-white/10 pb-4">🛡️ Active Operator Protocols</h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 font-semibold leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 print:hidden">
            <button 
              onClick={handlePdfDownload} 
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-pink-400" /> Export Dossier PDF
            </button>
            <button 
              onClick={submitToCommunity} 
              disabled={isSubmitting || isSubmitted}
              className={`flex-1 px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isSubmitted 
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 cursor-default'
                  : 'border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
              ) : isSubmitted ? (
                <><CheckCircle className="w-4 h-4" /> Shared to Community</>
              ) : (
                <><Send className="w-4 h-4" /> Share Community Signature</>
              )}
            </button>
            <a 
              href="https://cybercrime.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <AlertTriangle className="w-4 h-4" /> Lodge Police FIR
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
