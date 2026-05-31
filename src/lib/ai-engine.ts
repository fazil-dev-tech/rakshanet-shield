// RakshaNet Shield — AI Scam Classification Engine
// Agentic AI Multi-Agent System for Fraud Intelligence
// Helper to lazily load Puter on the client side only to prevent SSR ReferenceErrors during Next.js compile steps
async function getPuterInstance() {
  if (typeof window === 'undefined') return null;
  try {
    // @ts-ignore - Puter.js might not have TS declarations available
    const puterModule = await import('@heyputer/puter.js');
    return puterModule.puter || puterModule.default || puterModule;
  } catch (e) {
    console.error("Failed to load Puter.js dynamically", e);
    return null;
  }
}

export type ScamType = 
  | 'phishing' | 'investment_fraud' | 'job_scam' | 'romance_scam'
  | 'qr_scam' | 'apk_malware' | 'banking_fraud' | 'kyc_fraud'
  | 'lottery_scam' | 'crypto_scam' | 'unknown';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ScamAnalysis {
  scamType: ScamType;
  severity: SeverityLevel;
  riskScore: number;
  confidence: number;
  explanation: string;
  indicators: ThreatIndicator[];
  recommendations: string[];
  aiReasoning: string[];
  extractedEntities: ExtractedEntities;
  relatedPatterns: string[];
  rawText?: string;
}

export interface ThreatIndicator {
  type: 'url' | 'phone' | 'email' | 'upi' | 'wallet' | 'ip' | 'domain' | 'keyword';
  value: string;
  risk: 'high' | 'medium' | 'low';
  description: string;
}

export interface ExtractedEntities {
  urls: string[];
  phones: string[];
  emails: string[];
  upiIds: string[];
  cryptoWallets: string[];
  bankAccounts: string[];
  amounts: string[];
  dates: string[];
}

// ==========================================
// AGENTIC AI — MULTI-AGENT SYSTEM
// ==========================================

interface AgentTask {
  id: string;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: unknown;
  output: unknown;
  startTime: number;
  endTime?: number;
}

interface AgentResult {
  agentName: string;
  result: unknown;
  confidence: number;
  processingTime: number;
}

// Agent 1: Text Analysis Agent
class TextAnalysisAgent {
  name = 'TextAnalysisAgent';
  
  private urgencyKeywords = [
    'urgent', 'immediately', 'right now', 'act fast', 'limited time',
    'expires today', 'last chance', 'hurry', 'don\'t miss', 'only today',
    'final warning', 'account suspended', 'verify immediately', 'click now',
  ];
  
  private threatKeywords = [
    'suspended', 'blocked', 'unauthorized', 'hacked', 'compromised',
    'legal action', 'arrest', 'police', 'court', 'warrant',
    'fine', 'penalty', 'seized', 'frozen', 'deactivated',
  ];
  
  private paymentPressure = [
    'send money', 'transfer', 'payment', 'pay now', 'upi',
    'bank account', 'gift card', 'bitcoin', 'crypto', 'wire transfer',
    'western union', 'money order', 'prepaid card', 'google pay', 'phonepe',
    'paytm', 'razorpay', 'cash deposit',
  ];
  
  private scamPatterns: Record<ScamType, string[]> = {
    phishing: ['verify your account', 'confirm your identity', 'login credentials', 'update payment', 'click here to verify', 'your account has been', 'unusual activity', 'confirm your details'],
    investment_fraud: ['guaranteed returns', 'double your money', 'risk free', 'investment opportunity', 'high returns', 'passive income', 'earn from home', 'forex trading', 'binary options'],
    job_scam: ['work from home', 'easy money', 'no experience', 'hiring immediately', 'part time job', 'earn daily', 'data entry job', 'typing job', 'registration fee'],
    romance_scam: ['i love you', 'send me money', 'stuck abroad', 'need help urgently', 'military deployment', 'can\'t access my account', 'western union'],
    qr_scam: ['scan this qr', 'qr code', 'scan to pay', 'scan to receive', 'qr payment'],
    apk_malware: ['download this app', 'install apk', 'install this', 'sideload', 'unofficial app'],
    banking_fraud: ['otp', 'pin number', 'cvv', 'card number', 'banking details', 'account number', 'ifsc code', 'debit card', 'credit card'],
    kyc_fraud: ['kyc update', 'kyc verification', 'pan card', 'aadhaar', 'aadhar', 'link pan', 'update kyc', 'kyc expired'],
    lottery_scam: ['you have won', 'lottery winner', 'prize money', 'claim your prize', 'lucky winner', 'sweepstakes', 'congratulations you won'],
    crypto_scam: ['bitcoin', 'ethereum', 'crypto investment', 'mining pool', 'defi', 'nft', 'token sale', 'airdrop', 'pump and dump'],
    unknown: [],
  };
  
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async analyze(text: string): Promise<{ scamType: ScamType; confidence: number; urgencyScore: number; threatScore: number; pressureScore: number; detectedPatterns: string[] }> {
    const lower = text.toLowerCase();
    
    const urgencyScore = this.calculateKeywordScore(lower, this.urgencyKeywords);
    const threatScore = this.calculateKeywordScore(lower, this.threatKeywords);
    const pressureScore = this.calculateKeywordScore(lower, this.paymentPressure);
    
    let bestType: ScamType = 'unknown';
    let bestScore = 0;
    const detectedPatterns: string[] = [];
    
    for (const [type, patterns] of Object.entries(this.scamPatterns)) {
      let score = 0;
      for (const pattern of patterns) {
        // Strict word boundary matching prevents false positives (e.g. 'stupid' matching 'upi')
        const regex = new RegExp(`\\b${this.escapeRegExp(pattern)}\\b`, 'i');
        if (regex.test(lower)) {
          score += 1;
          detectedPatterns.push(pattern);
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestType = type as ScamType;
      }
    }
    
    let confidence = Math.min(0.95, (bestScore * 0.15) + (urgencyScore * 0.1) + (threatScore * 0.1) + (pressureScore * 0.1) + 0.3);
    
    // LLM Fallback: Semantic classification if standard keyword rules fail but urgency/threat is detected
    if (confidence < 0.6 && (urgencyScore > 0 || threatScore > 0 || pressureScore > 0) && text.length > 20) {
      try {
        const puterInstance = await getPuterInstance();
        if (puterInstance) {
          const response = await puterInstance.ai.chat(`Classify this text into one of these scam types: phishing, investment_fraud, job_scam, romance_scam, qr_scam, apk_malware, banking_fraud, kyc_fraud, lottery_scam, crypto_scam, unknown. Respond strictly with just the scam type word.\n\nText: "${text.substring(0, 500)}"`);
          let resText = typeof response === 'string' ? response : ((response as any)?.message?.content?.text || (response as any)?.message?.content || (response as any)?.text || String(response));
          resText = resText.toLowerCase().trim().replace(/[^a-z_]/g, '');
          
          if (Object.keys(this.scamPatterns).includes(resText) && resText !== 'unknown') {
             bestType = resText as ScamType;
             confidence = 0.75; // Boost confidence since LLM confirmed
             detectedPatterns.push('LLM_CLASSIFIED');
          }
        }
      } catch (err) {
        // Silent fallback
      }
    }
    
    return { scamType: bestType, confidence, urgencyScore, threatScore, pressureScore, detectedPatterns };
  }
  
  private calculateKeywordScore(text: string, keywords: string[]): number {
    let count = 0;
    for (const kw of keywords) {
      // Strict word boundary matching prevents partial word false positives
      const regex = new RegExp(`\\b${this.escapeRegExp(kw)}\\b`, 'i');
      if (regex.test(text)) count++;
    }
    return Math.min(1, count / 3);
  }
}

// Agent 2: Entity Extraction Agent
class EntityExtractionAgent {
  name = 'EntityExtractionAgent';
  
  extract(text: string): ExtractedEntities {
    return {
      urls: this.extractUrls(text),
      phones: this.extractPhones(text),
      emails: this.extractEmails(text),
      upiIds: this.extractUPI(text),
      cryptoWallets: this.extractCryptoWallets(text),
      bankAccounts: this.extractBankAccounts(text),
      amounts: this.extractAmounts(text),
      dates: this.extractDates(text),
    };
  }
  
  private extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
    return [...new Set(text.match(urlRegex) || [])];
  }
  
  private extractPhones(text: string): string[] {
    const phoneRegex = /(?:\+91[\s-]?)?(?:\d{10}|\d{5}[\s-]\d{5}|\d{4}[\s-]\d{3}[\s-]\d{3})/g;
    return [...new Set(text.match(phoneRegex) || [])];
  }
  
  private extractEmails(text: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return [...new Set(text.match(emailRegex) || [])];
  }
  
  private extractUPI(text: string): string[] {
    const upiRegex = /[a-zA-Z0-9._%+-]+@(?:upi|paytm|ybl|okhdfcbank|oksbi|okicici|axl|ibl)/gi;
    return [...new Set(text.match(upiRegex) || [])];
  }
  
  private extractCryptoWallets(text: string): string[] {
    const btcRegex = /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g;
    const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g;
    return [...new Set([...(text.match(btcRegex) || []), ...(text.match(ethRegex) || [])])];
  }
  
  private extractBankAccounts(text: string): string[] {
    const accRegex = /\b\d{9,18}\b/g;
    const matches = text.match(accRegex) || [];
    return matches.filter(m => m.length >= 9 && m.length <= 18).slice(0, 5);
  }
  
  private extractAmounts(text: string): string[] {
    const amountRegex = /(?:₹|rs\.?|inr|usd|\$)\s*[\d,]+(?:\.\d{2})?/gi;
    return [...new Set(text.match(amountRegex) || [])];
  }
  
  private extractDates(text: string): string[] {
    const dateRegex = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g;
    return [...new Set(text.match(dateRegex) || [])];
  }
}

// Agent 3: URL Threat Analysis Agent
class URLThreatAgent {
  name = 'URLThreatAgent';
  
  private suspiciousTLDs = ['.xyz', '.top', '.club', '.work', '.click', '.buzz', '.icu', '.monster', '.tk', '.ml', '.ga', '.cf'];
  private trustedDomains = [
    'google.com', 'facebook.com', 'microsoft.com', 'apple.com', 'amazon.com', 
    'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'rbi.org.in', 'gov.in',
    'pnbindia.in', 'axisbank.com', 'kotak.com', 'uidai.gov.in', 'incometax.gov.in',
    'flipkart.com', 'myntra.com', 'amazon.in', 'paytm.com', 'phonepe.com'
  ];
  
  analyzeUrl(url: string): { riskScore: number; issues: string[]; isSuspicious: boolean } {
    const issues: string[] = [];
    let riskScore = 0;
    
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.toLowerCase();
      
      // Check suspicious TLD
      for (const tld of this.suspiciousTLDs) {
        if (domain.endsWith(tld)) {
          issues.push(`Suspicious TLD: ${tld}`);
          riskScore += 25;
          break;
        }
      }
      
      // Check for IP-based URL
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
        issues.push('URL uses raw IP address instead of domain');
        riskScore += 30;
      }
      
      // Check for excessive subdomains
      const parts = domain.split('.');
      if (parts.length > 4) {
        issues.push('Excessive subdomains detected');
        riskScore += 15;
      }
      
      // Check for typosquatting (Dynamic threshold to prevent short-domain false positives)
      for (const trusted of this.trustedDomains) {
        if (domain === trusted) continue;
        const dist = this.levenshtein(domain, trusted);
        const threshold = trusted.length <= 8 ? 1 : 2; // Strict threshold for short domains
        if (dist > 0 && dist <= threshold) {
          issues.push(`Possible typosquatting of ${trusted}`);
          riskScore += 35;
        }
      }
      
      // Check for HTTP (no SSL)
      if (parsed.protocol === 'http:') {
        issues.push('No SSL/HTTPS encryption');
        riskScore += 15;
      }
      
      // Check for suspicious paths
      if (parsed.pathname.includes('login') || parsed.pathname.includes('verify') || parsed.pathname.includes('secure') || parsed.pathname.includes('update')) {
        issues.push('Suspicious path keywords detected');
        riskScore += 10;
      }
      
      // Long URL
      if (url.length > 100) {
        issues.push('Unusually long URL');
        riskScore += 5;
      }
      
      // Special chars in domain
      if (domain.includes('-') && domain.split('-').length > 3) {
        issues.push('Multiple hyphens in domain');
        riskScore += 10;
      }
      
    } catch {
      issues.push('Invalid URL format');
      riskScore += 40;
    }
    
    return {
      riskScore: Math.min(100, riskScore),
      issues,
      isSuspicious: riskScore >= 30,
    };
  }
  
  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i-1] === a[j-1]
          ? matrix[i-1][j-1]
          : Math.min(matrix[i-1][j-1] + 1, matrix[i][j-1] + 1, matrix[i-1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  }
}

// Agent 4: Risk Scoring Agent
class RiskScoringAgent {
  name = 'RiskScoringAgent';
  
  calculateRisk(params: {
    textAnalysis: Awaited<ReturnType<TextAnalysisAgent['analyze']>>;
    urlAnalysis?: ReturnType<URLThreatAgent['analyzeUrl']>;
    entityCount: number;
    hasEvidence: boolean;
  }): { score: number; severity: SeverityLevel; factors: string[] } {
    const factors: string[] = [];
    let score = 0;
    
    // Text analysis contribution (40%)
    const textScore = (params.textAnalysis.urgencyScore * 15) + 
                      (params.textAnalysis.threatScore * 15) + 
                      (params.textAnalysis.pressureScore * 10);
    score += textScore;
    if (params.textAnalysis.urgencyScore > 0.5) factors.push('High urgency language detected');
    if (params.textAnalysis.threatScore > 0.5) factors.push('Threatening language detected');
    if (params.textAnalysis.pressureScore > 0.5) factors.push('Payment pressure detected');
    
    // Scam type confidence (25%)
    score += params.textAnalysis.confidence * 25;
    if (params.textAnalysis.scamType !== 'unknown') factors.push(`Matches ${params.textAnalysis.scamType.replace('_', ' ')} pattern`);
    
    // URL analysis (20%)
    if (params.urlAnalysis) {
      score += params.urlAnalysis.riskScore * 0.2;
      if (params.urlAnalysis.isSuspicious) factors.push('Suspicious URL detected');
    }
    
    // Entity count (10%)
    score += Math.min(10, params.entityCount * 2);
    if (params.entityCount > 3) factors.push('Multiple suspicious entities found');
    
    // Evidence bonus (5%)
    if (params.hasEvidence) {
      score += 5;
      factors.push('Evidence provided');
    }
    
    score = Math.min(100, Math.round(score));
    
    let severity: SeverityLevel;
    if (score >= 80) severity = 'critical';
    else if (score >= 60) severity = 'high';
    else if (score >= 35) severity = 'medium';
    else severity = 'low';
    
    return { score, severity, factors };
  }
}

// Agent 5: Report Generation Agent
class ReportGenerationAgent {
  name = 'ReportGenerationAgent';
  
  private parsePuterResponse(res: any): string {
    if (!res) return '';
    if (typeof res === 'string') return res;
    if (res.message?.content) {
      if (typeof res.message.content === 'string') return res.message.content;
      if (res.message.content.text) return String(res.message.content.text);
    }
    if (res.text) return String(res.text);
    return String(res);
  }

  async generateExplanation(analysis: ScamAnalysis): Promise<string> {
    try {
      const puterInstance = await getPuterInstance();
      if (!puterInstance) throw new Error("Puter is not available");
      
      const sanitizedType = String(analysis.scamType).replace(/[^a-zA-Z0-9_ ]/g, '').slice(0, 50);
      const sanitizedScore = Number(analysis.riskScore) || 50;
      const rawContext = analysis.rawText ? `\n\nUser Input: "${analysis.rawText.slice(0, 1000)}"` : '';
      
      const response = await puterInstance.ai.chat(
        `You are a top-tier cybersecurity intelligence analyst at RakshaNet. 
        Analyze the following text provided by the user. 
        It has been tentatively classified by our heuristic engine as a '${sanitizedType}' with a risk score of ${sanitizedScore}/100.
        Explain to the user exactly why this specific text is dangerous, what the attackers are trying to achieve, and what psychological or technical tricks they are using. Be brief but highly specific. Answer directly in 2-3 sentences.${rawContext}`
      );
      return this.parsePuterResponse(response);
    } catch {
      return `This appears to be a ${analysis.scamType.replace('_', ' ')} attempt. Exercise extreme caution.`;
    }
  }
  
  async generateRecommendations(analysis: ScamAnalysis): Promise<string[]> {
    try {
      const puterInstance = await getPuterInstance();
      if (!puterInstance) throw new Error("Puter is not available");
      
      const sanitizedType = String(analysis.scamType).replace(/[^a-zA-Z0-9_ ]/g, '').slice(0, 50);
      const rawContext = analysis.rawText ? `\n\nUser Input: "${analysis.rawText.slice(0, 1000)}"` : '';
      
      const response = await puterInstance.ai.chat(
        `You are a cybersecurity expert advising a user on how to protect themselves.
        They received a message classified as '${sanitizedType}'.
        Provide exactly 3 highly actionable, specific recommendations they must follow right now based on their exact situation. 
        Return them as a numbered list.${rawContext}`
      );
      const text = this.parsePuterResponse(response);
      return text.split('\n').filter((r: string) => r.trim().length > 0).map((r: string) => r.replace(/^\d+[\.\)]\s*/, '').replace(/^- \s*/, '').trim()).slice(0, 3);
    } catch {
      return [
        'Do NOT click any links or download attachments from this source.',
        'Do NOT share any personal, financial, or authentication information.',
        'Verify the sender through official channels before responding.'
      ];
    }
  }
}

// ==========================================
// AI ORCHESTRATOR — MASTER AGENT
// ==========================================

export class AIOrchestrator {
  private textAgent = new TextAnalysisAgent();
  private entityAgent = new EntityExtractionAgent();
  private urlAgent = new URLThreatAgent();
  private riskAgent = new RiskScoringAgent();
  private reportAgent = new ReportGenerationAgent();
  
  private taskLog: AgentTask[] = [];
  
  async analyzeScam(input: {
    text: string;
    url?: string;
    hasEvidence?: boolean;
    evidenceType?: string;
    evidenceFile?: File;
  }): Promise<ScamAnalysis> {
    const startTime = Date.now();
    const agentResults: AgentResult[] = [];
    
    let combinedText = input.text;

    // Step 0: Evidence processing via Puter's real AI capabilities (OCR & Speech-to-Text)
    if (input.evidenceFile) {
      const evidenceTask = this.createTask('EvidenceAnalysisAgent', input.evidenceFile.name);
      try {
        const puterInstance = await getPuterInstance();
        if (puterInstance) {
          if (input.evidenceFile.type.startsWith('image/')) {
            // Perform real image OCR using Puter
            // @ts-ignore
            const ocrText = await puterInstance.ai.img2txt(input.evidenceFile);
            if (ocrText) {
              combinedText += ` [EXTRACTED SCREENSHOT EVIDENCE OCR: ${ocrText}]`;
              this.completeTask(evidenceTask, { type: 'ocr', text: ocrText });
            } else {
              this.completeTask(evidenceTask, { type: 'ocr', status: 'empty' });
            }
          } else if (
            input.evidenceFile.type.startsWith('audio/') || 
            input.evidenceFile.name.endsWith('.mp3') || 
            input.evidenceFile.name.endsWith('.wav')
          ) {
            // Perform real speech-to-text transcription using Puter
            // @ts-ignore
            const audioTranscription = await puterInstance.ai.speech2txt(input.evidenceFile);
            if (audioTranscription) {
              combinedText += ` [EXTRACTED AUDIO TELEMETRY TRANSCRIPTION: ${audioTranscription}]`;
              this.completeTask(evidenceTask, { type: 'audio_transcription', text: audioTranscription });
            } else {
              this.completeTask(evidenceTask, { type: 'audio_transcription', status: 'empty' });
            }
          } else {
            this.completeTask(evidenceTask, { type: 'generic', status: 'skipped' });
          }
        } else {
          this.completeTask(evidenceTask, { type: 'generic', status: 'skipped_no_puter' });
        }
      } catch (err) {
        console.error("Evidence analysis failed: ", err);
        this.completeTask(evidenceTask, { error: String(err) });
      }
    }

    // Step 1: Text Analysis Agent
    const textTask = this.createTask('TextAnalysisAgent', combinedText);
    const textResult = await this.textAgent.analyze(combinedText);
    this.completeTask(textTask, textResult);
    agentResults.push({ agentName: 'TextAnalysisAgent', result: textResult, confidence: textResult.confidence, processingTime: Date.now() - startTime });
    
    // Step 2: Entity Extraction Agent (parallel)
    const entityTask = this.createTask('EntityExtractionAgent', combinedText);
    const entities = this.entityAgent.extract(combinedText);
    this.completeTask(entityTask, entities);
    
    // Step 3: URL Analysis Agent (if URL present)
    let urlResult: ReturnType<URLThreatAgent['analyzeUrl']> | undefined;
    if (input.url || entities.urls.length > 0) {
      const targetUrl = input.url || entities.urls[0];
      const urlTask = this.createTask('URLThreatAgent', targetUrl);
      urlResult = this.urlAgent.analyzeUrl(targetUrl);
      this.completeTask(urlTask, urlResult);
      agentResults.push({ agentName: 'URLThreatAgent', result: urlResult, confidence: urlResult.riskScore / 100, processingTime: Date.now() - startTime });
    }
    
    // Step 4: Risk Scoring Agent (aggregates all)
    const entityCount = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
    const riskTask = this.createTask('RiskScoringAgent', { textResult, urlResult, entityCount });
    const risk = this.riskAgent.calculateRisk({
      textAnalysis: textResult,
      urlAnalysis: urlResult,
      entityCount,
      hasEvidence: input.hasEvidence || false,
    });
    this.completeTask(riskTask, risk);
    
    // Step 5: Build indicators
    const indicators: ThreatIndicator[] = [];
    for (const url of entities.urls) {
      const analysis = this.urlAgent.analyzeUrl(url);
      indicators.push({ type: 'url', value: url, risk: analysis.riskScore >= 50 ? 'high' : analysis.riskScore >= 25 ? 'medium' : 'low', description: analysis.issues.join('; ') || 'URL detected' });
    }
    for (const phone of entities.phones) {
      indicators.push({ type: 'phone', value: phone, risk: 'medium', description: 'Phone number found in suspicious context' });
    }
    for (const email of entities.emails) {
      indicators.push({ type: 'email', value: email, risk: 'medium', description: 'Email address found in suspicious context' });
    }
    for (const upi of entities.upiIds) {
      indicators.push({ type: 'upi', value: upi, risk: 'high', description: 'UPI ID used for payment request' });
    }
    for (const wallet of entities.cryptoWallets) {
      indicators.push({ type: 'wallet', value: wallet, risk: 'high', description: 'Cryptocurrency wallet address detected' });
    }
    
    // Step 6: Report Generation Agent
    const analysis: ScamAnalysis = {
      scamType: textResult.scamType,
      severity: risk.severity,
      riskScore: risk.score,
      confidence: textResult.confidence,
      explanation: '',
      indicators,
      recommendations: [],
      aiReasoning: risk.factors,
      extractedEntities: entities,
      relatedPatterns: textResult.detectedPatterns,
      rawText: combinedText,
    };
    
    analysis.explanation = await this.reportAgent.generateExplanation(analysis);
    analysis.recommendations = await this.reportAgent.generateRecommendations(analysis);
    
    // Simulate AI processing delay for UX (if puter was too fast)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return analysis;
  }
  
  getTaskLog(): AgentTask[] {
    return this.taskLog;
  }
  
  private createTask(agentName: string, input: unknown): AgentTask {
    const task: AgentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      agentName,
      status: 'running',
      input,
      output: null,
      startTime: Date.now(),
    };
    this.taskLog.push(task);
    return task;
  }
  
  private completeTask(task: AgentTask, output: unknown): void {
    task.status = 'completed';
    task.output = output;
    task.endTime = Date.now();
  }
}

// Export singleton
export const aiOrchestrator = new AIOrchestrator();

// ==========================================
// SCAM TYPE METADATA
// ==========================================

export const SCAM_TYPES: Record<ScamType, { label: string; icon: string; color: string; description: string }> = {
  phishing: { label: 'Phishing', icon: '🎣', color: '#EF4444', description: 'Fake websites or messages to steal credentials' },
  investment_fraud: { label: 'Investment Fraud', icon: '📈', color: '#F59E0B', description: 'Fake investment schemes promising high returns' },
  job_scam: { label: 'Job Scam', icon: '💼', color: '#F97316', description: 'Fake job offers to collect fees or data' },
  romance_scam: { label: 'Romance Scam', icon: '💔', color: '#EC4899', description: 'Emotional manipulation for financial gain' },
  qr_scam: { label: 'QR Scam', icon: '📱', color: '#8B5CF6', description: 'Malicious QR codes for unauthorized transactions' },
  apk_malware: { label: 'APK Malware', icon: '🦠', color: '#DC2626', description: 'Malicious apps that compromise device security' },
  banking_fraud: { label: 'Banking Fraud', icon: '🏦', color: '#EF4444', description: 'Targeting banking credentials and accounts' },
  kyc_fraud: { label: 'KYC Fraud', icon: '🪪', color: '#F59E0B', description: 'Exploiting identity verification processes' },
  lottery_scam: { label: 'Lottery Scam', icon: '🎰', color: '#22C55E', description: 'Fake prize/lottery winnings requiring advance fees' },
  crypto_scam: { label: 'Crypto Scam', icon: '₿', color: '#F59E0B', description: 'Cryptocurrency investment fraud or wallet theft' },
  unknown: { label: 'Unknown', icon: '❓', color: '#64748B', description: 'Unclassified suspicious activity' },
};
