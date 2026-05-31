'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Shield, Brain, Zap, ArrowRight, MessageSquare, ImagePlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiOrchestrator, SCAM_TYPES } from '@/lib/ai-engine';
import type { ChatMessage } from '@/lib/data';
import GlassCard from '@/components/GlassCard';

const QUICK_PROMPTS = [
  { text: 'Is this URL safe? https://sbi-kyc-update.xyz/verify', icon: '🔗' },
  { text: 'I received an SMS about my bank account being blocked. Is this a scam?', icon: '📱' },
  { text: 'Someone promised 300% returns on crypto Telegram. Should I trust them?', icon: '₿' },
  { text: 'I got a call from "income tax department" asking for my Aadhaar. Is it legit?', icon: '📞' },
  { text: 'A job offer on WhatsApp asks for ₹500 registration fee. Is it a scam?', icon: '💼' },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `🛡️ **Welcome to RakshaNet Shield AI Tactical Assistant**\n\nI am your primary cybersecurity AI companion. You can query me on:\n\n• **Phishing URL analysis** and SSL certificate parameters\n• **Suspicious SMS text validation** and linguistic indicators\n• **Financial scam classification** (UPI, investment, banking, KYC, romance)\n• **Advisory protocols** and protective recommendations\n\nPaste your suspicion below. My autonomous neural network will dissect the footprint in real-time.`,
      timestamp: new Date().toISOString(),
      agentName: 'System Director',
    },
  ]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string, file: File | null = null) => {
    if (!text.trim() && !file) return;
    
    let contentText = text;
    if (file) {
      contentText = `📎 **[Image Attached: ${file.name}]**\n` + text;
    }
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: contentText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setImageFile(null);
    setIsThinking(true);

    try {
      const analysis = await aiOrchestrator.analyzeScam({ 
        text, 
        url: text.match(/https?:\/\/[^\s]+/)?.[0],
        evidenceFile: file || undefined
      });
      
      const scamInfo = SCAM_TYPES[analysis.scamType];
      let response = `## ${scamInfo.icon} Signature Classification Complete\n\n`;
      response += `**Threat Category:** ${scamInfo.label}\n`;
      response += `**Risk Vector Score:** ${analysis.riskScore}/100 (${analysis.severity.toUpperCase()})\n`;
      response += `**Neural Confidence Threshold:** ${(analysis.confidence * 100).toFixed(1)}%\n\n`;
      response += `### 🔍 Core Intelligence Summary\n${analysis.explanation}\n\n`;
      
      if (analysis.aiReasoning.length > 0) {
        response += `### ⚡ Key Risk Vectors Identified\n`;
        analysis.aiReasoning.forEach(r => { response += `• ${r}\n`; });
        response += '\n';
      }
      
      if (analysis.indicators.length > 0) {
        response += `### 🎯 Technical Indicators Extracted\n`;
        analysis.indicators.forEach(ind => { response += `• **${ind.type.toUpperCase()}:** \`${ind.value}\` — ${ind.description}\n`; });
        response += '\n';
      }
      
      response += `### 🛡️ Mandatory Protective Protocols\n`;
      analysis.recommendations.forEach(rec => { response += `• ${rec}\n`; });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        agentName: 'AI Orchestrator',
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Tactical analysis node offline. Query processing error. Retrying...',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] w-full mx-auto">
      
      {/* Header */}
      <div className="flex-shrink-0 mb-4 border-b border-white/5 pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-pink-400">NEURAL TERMINAL</span>
        <h1 className="text-3xl font-black font-display text-white mt-1">
          Cyber Guard <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">AI Assistant</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Converse directly with the integrated Puter.js multi-agent cyber defense engine.</p>
      </div>

      {/* Chat Area Panel */}
      <GlassCard glowColor="cyan" interactive={false} className="flex-1 bg-black/40 border-white/10 overflow-hidden mb-4 p-6 rounded-2xl flex flex-col">
        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                  msg.role === 'user' 
                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.2)]' 
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                {/* Bubble content */}
                <div className={`p-5 rounded-2xl border text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-pink-950/15 border-pink-500/20 text-pink-100' 
                    : 'bg-white/5 border-white/5 text-slate-300'
                }`}>
                  {msg.agentName && (
                    <div className="flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2">
                      <Zap className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                      <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest">{msg.agentName}</span>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{ __html: (() => {
                      const escaped = msg.content
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                      return escaped
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>')
                        .replace(/`(.*?)`/g, '<code class="bg-black border border-white/10 px-1.5 py-0.5 rounded text-pink-400 text-xs font-mono">$1</code>')
                        .replace(/### (.*)/g, '<h4 class="text-slate-200 font-bold text-sm mt-4 mb-2 uppercase tracking-wide border-l-2 border-pink-500 pl-2">$1</h4>')
                        .replace(/## (.*)/g, '<h3 class="text-pink-400 font-black text-base mt-2 mb-3">$1</h3>')
                        .replace(/• (.*)/g, '<div class="flex gap-2 ml-2 mt-1.5"><span class="text-pink-500">•</span><span>$1</span></div>');
                    })() }} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
          
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.3 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-500/20 animate-ping opacity-20" />
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 relative overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-[scan_2s_ease-in-out_infinite] -translate-x-full" />
                <div className="flex items-center gap-3 relative z-10">
                  <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                  <span className="text-xs text-pink-400 font-bold uppercase tracking-widest typing-dots flex items-center">
                    Neural scan in progress<span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </GlassCard>

      {/* Quick Prompts scrolling */}
      <div className="flex-shrink-0 mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, i) => (
          <motion.button 
            key={i} 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMessage(prompt.text)}
            className="flex-shrink-0 text-2xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/10 hover:border-pink-500/40 hover:bg-pink-500/20 text-slate-200 hover:text-pink-300 transition-colors shadow-sm"
          >
            {prompt.icon} {prompt.text.slice(0, 32)}...
          </motion.button>
        ))}
      </div>

      {/* Input container */}
      <GlassCard 
        glowColor="none" 
        interactive={false} 
        className="flex-shrink-0 p-3 bg-black/60 border-white/20 flex flex-col gap-2 transition-all duration-300 focus-within:border-pink-500/60 focus-within:bg-pink-500/10 focus-within:shadow-[0_0_30px_rgba(236,72,153,0.15)] focus-within:scale-[1.008]"
      >
        {imageFile && (
          <div className="flex items-center gap-2 bg-pink-500/20 text-pink-300 px-3 py-1.5 rounded-lg w-fit text-xs font-medium border border-pink-500/30">
            <ImagePlus className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{imageFile.name}</span>
            <button onClick={() => setImageFile(null)} className="hover:text-white transition-colors ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
              e.target.value = '';
            }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-pink-400 transition-colors border border-transparent hover:border-pink-500/30"
            disabled={isThinking}
            title="Attach Screenshot Evidence"
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(input, imageFile); }}
            placeholder="Paste suspicious URL, scam text, describe the anomaly, or upload a screenshot..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400 font-bold px-2" 
            disabled={isThinking} 
          />
          <button 
            onClick={() => sendMessage(input, imageFile)} 
            disabled={isThinking || (!input.trim() && !imageFile)}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(236,72,153,0.25)] disabled:opacity-50"
          >
          <Send className="w-4 h-4" /> Analyze
        </button>
        </div>
      </GlassCard>

    </div>
  );
}
