// RakshaNet Shield — Demo Data & Utilities
import { ScamType, SeverityLevel } from './ai-engine';

export interface ScamReport {
  id: string;
  title: string;
  description: string;
  scamType: ScamType;
  severity: SeverityLevel;
  riskScore: number;
  status: 'pending' | 'analyzing' | 'verified' | 'resolved' | 'false_positive';
  aiSummary: string;
  country: string;
  city: string;
  createdBy: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  evidenceCount: number;
  indicators: number;
}

export interface TimelineEvent {
  id: string;
  type: 'report_created' | 'ai_analysis' | 'evidence_added' | 'status_change' | 'community_vote' | 'agent_action';
  description: string;
  timestamp: string;
  agentName?: string;
  metadata?: Record<string, string>;
}

export interface ThreatIntel {
  id: string;
  domain: string;
  ip: string;
  reputation: number;
  threatType: string;
  lastSeen: string;
  reports: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentName?: string;
}

// Demo scam reports
export const DEMO_REPORTS: ScamReport[] = [
  {
    id: 'RPT-001',
    title: 'Fake SBI KYC Update SMS',
    description: 'Received SMS claiming SBI account will be blocked unless KYC is updated via a suspicious link. Link leads to a phishing page collecting banking credentials.',
    scamType: 'kyc_fraud',
    severity: 'critical',
    riskScore: 92,
    status: 'verified',
    aiSummary: 'AI identified this as a KYC fraud targeting SBI customers. The URL is a typosquatting domain designed to steal banking credentials.',
    country: 'India',
    city: 'Mumbai',
    createdBy: 'Anonymous User',
    createdAt: '2026-05-29T08:30:00Z',
    upvotes: 47,
    downvotes: 2,
    evidenceCount: 3,
    indicators: 5,
  },
  {
    id: 'RPT-002',
    title: 'Crypto Investment Scam on Telegram',
    description: 'Telegram group promising 300% returns on crypto investment within 24 hours. Asks users to deposit BTC to a specific wallet address.',
    scamType: 'crypto_scam',
    severity: 'high',
    riskScore: 85,
    status: 'verified',
    aiSummary: 'Classic cryptocurrency Ponzi scheme. The wallet address has been flagged in multiple fraud databases.',
    country: 'India',
    city: 'Delhi',
    createdBy: 'CyberWatch_Delhi',
    createdAt: '2026-05-29T07:15:00Z',
    upvotes: 32,
    downvotes: 1,
    evidenceCount: 5,
    indicators: 8,
  },
  {
    id: 'RPT-003',
    title: 'Fake Amazon Job Offer',
    description: 'WhatsApp message offering work-from-home job at Amazon with daily earnings of ₹5000. Requires ₹500 registration fee via UPI.',
    scamType: 'job_scam',
    severity: 'high',
    riskScore: 78,
    status: 'analyzing',
    aiSummary: 'Job scam using Amazon brand impersonation. Registration fee is a red flag — legitimate companies never charge for employment.',
    country: 'India',
    city: 'Bangalore',
    createdBy: 'TechGuard_BLR',
    createdAt: '2026-05-29T06:45:00Z',
    upvotes: 28,
    downvotes: 0,
    evidenceCount: 2,
    indicators: 4,
  },
  {
    id: 'RPT-004',
    title: 'QR Code Payment Scam at Market',
    description: 'Vendor at local market replaced legitimate payment QR codes with their own. Multiple victims reported unauthorized debits after scanning.',
    scamType: 'qr_scam',
    severity: 'medium',
    riskScore: 65,
    status: 'verified',
    aiSummary: 'Physical QR code tampering scam. Scammers overlay fake QR codes on legitimate merchant displays.',
    country: 'India',
    city: 'Jaipur',
    createdBy: 'SafePay_India',
    createdAt: '2026-05-28T18:20:00Z',
    upvotes: 56,
    downvotes: 3,
    evidenceCount: 7,
    indicators: 3,
  },
  {
    id: 'RPT-005',
    title: 'Phishing Email: Income Tax Refund',
    description: 'Email from "incometax-gov.in" (fake domain) claiming tax refund of ₹15,000. Asks for bank details and PAN number.',
    scamType: 'phishing',
    severity: 'critical',
    riskScore: 95,
    status: 'verified',
    aiSummary: 'Government impersonation phishing attack. Domain is a typosquatting of incometax.gov.in. Targets PAN and bank information.',
    country: 'India',
    city: 'Chennai',
    createdBy: 'GovWatch_TN',
    createdAt: '2026-05-28T14:10:00Z',
    upvotes: 89,
    downvotes: 1,
    evidenceCount: 4,
    indicators: 6,
  },
  {
    id: 'RPT-006',
    title: 'Romance Scam on Dating App',
    description: 'Person met on dating app claims to be US military stationed abroad. After weeks of chatting, asks for money to "come visit".',
    scamType: 'romance_scam',
    severity: 'medium',
    riskScore: 58,
    status: 'analyzing',
    aiSummary: 'Romance scam following classic pattern: emotional connection building followed by financial requests. Profile likely uses stolen photos.',
    country: 'India',
    city: 'Hyderabad',
    createdBy: 'HeartSafe_HYD',
    createdAt: '2026-05-28T10:00:00Z',
    upvotes: 15,
    downvotes: 2,
    evidenceCount: 1,
    indicators: 2,
  },
  {
    id: 'RPT-007',
    title: 'Malicious APK: "Free Recharge" App',
    description: 'APK circulating on WhatsApp claiming free mobile recharge. App requests SMS, contacts, and banking permissions.',
    scamType: 'apk_malware',
    severity: 'critical',
    riskScore: 98,
    status: 'verified',
    aiSummary: 'Trojan malware disguised as recharge app. Requests dangerous permissions to intercept OTPs and steal banking credentials.',
    country: 'India',
    city: 'Lucknow',
    createdBy: 'MalwareHunter',
    createdAt: '2026-05-27T22:30:00Z',
    upvotes: 124,
    downvotes: 0,
    evidenceCount: 6,
    indicators: 12,
  },
  {
    id: 'RPT-008',
    title: 'Lottery Win Notification via SMS',
    description: 'SMS claiming winner of ₹50 Lakh lottery from "Jio KBC Season 15". Asks to call a number and pay processing fee.',
    scamType: 'lottery_scam',
    severity: 'high',
    riskScore: 82,
    status: 'verified',
    aiSummary: 'Classic lottery scam impersonating KBC show. Processing fees are used to extract money from victims.',
    country: 'India',
    city: 'Patna',
    createdBy: 'AlertBihar',
    createdAt: '2026-05-27T16:45:00Z',
    upvotes: 67,
    downvotes: 1,
    evidenceCount: 2,
    indicators: 4,
  },
];

// Demo threat intelligence
export const DEMO_THREATS: ThreatIntel[] = [
  { id: 'TH-001', domain: 'sbi-kyc-update.xyz', ip: '185.234.xx.xx', reputation: 5, threatType: 'Phishing', lastSeen: '2026-05-29', reports: 142 },
  { id: 'TH-002', domain: 'amazon-jobs-india.top', ip: '91.215.xx.xx', reputation: 8, threatType: 'Job Scam', lastSeen: '2026-05-29', reports: 87 },
  { id: 'TH-003', domain: 'crypto-invest-300x.club', ip: '45.89.xx.xx', reputation: 3, threatType: 'Crypto Scam', lastSeen: '2026-05-28', reports: 234 },
  { id: 'TH-004', domain: 'incometax-gov.in', ip: '103.45.xx.xx', reputation: 2, threatType: 'Government Impersonation', lastSeen: '2026-05-28', reports: 456 },
  { id: 'TH-005', domain: 'free-recharge-app.com', ip: '77.91.xx.xx', reputation: 1, threatType: 'Malware Distribution', lastSeen: '2026-05-27', reports: 321 },
];

// Demo timeline
export const DEMO_TIMELINE: TimelineEvent[] = [
  { id: 'TL-001', type: 'report_created', description: 'Scam report submitted by user', timestamp: '2026-05-29T08:30:00Z' },
  { id: 'TL-002', type: 'agent_action', description: 'TextAnalysisAgent: Classified as KYC Fraud (92% confidence)', timestamp: '2026-05-29T08:30:02Z', agentName: 'TextAnalysisAgent' },
  { id: 'TL-003', type: 'agent_action', description: 'EntityExtractionAgent: Found 2 URLs, 1 phone, 1 UPI ID', timestamp: '2026-05-29T08:30:03Z', agentName: 'EntityExtractionAgent' },
  { id: 'TL-004', type: 'agent_action', description: 'URLThreatAgent: Domain sbi-kyc-update.xyz rated HIGH RISK (score: 85)', timestamp: '2026-05-29T08:30:04Z', agentName: 'URLThreatAgent' },
  { id: 'TL-005', type: 'ai_analysis', description: 'RiskScoringAgent: Overall risk score 92/100 — CRITICAL', timestamp: '2026-05-29T08:30:05Z', agentName: 'RiskScoringAgent' },
  { id: 'TL-006', type: 'evidence_added', description: 'Screenshot evidence uploaded and verified', timestamp: '2026-05-29T08:31:00Z' },
  { id: 'TL-007', type: 'status_change', description: 'Report status changed to VERIFIED by community consensus', timestamp: '2026-05-29T09:15:00Z' },
  { id: 'TL-008', type: 'community_vote', description: '47 community members confirmed this scam', timestamp: '2026-05-29T10:00:00Z' },
];

// Stats
export const PLATFORM_STATS = {
  totalScamsDetected: 15847,
  scamsToday: 127,
  usersProtected: 284650,
  moneyProtected: 47800000, // ₹4.78 Crore
  aiAccuracy: 97.8,
  communityMembers: 52340,
  reportsGenerated: 8923,
  activeThreatFeeds: 24,
};

// Scam trend data for charts
export const SCAM_TRENDS = [
  { month: 'Jan', phishing: 245, investment: 120, job: 180, banking: 150, kyc: 90, other: 200 },
  { month: 'Feb', phishing: 280, investment: 150, job: 160, banking: 170, kyc: 110, other: 185 },
  { month: 'Mar', phishing: 310, investment: 180, job: 200, banking: 160, kyc: 130, other: 220 },
  { month: 'Apr', phishing: 350, investment: 220, job: 190, banking: 200, kyc: 150, other: 240 },
  { month: 'May', phishing: 420, investment: 280, job: 230, banking: 250, kyc: 180, other: 290 },
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Phishing', value: 32, color: '#f43f5e' },
  { name: 'Investment Fraud', value: 18, color: '#ec4899' },
  { name: 'Job Scams', value: 15, color: '#f472b6' },
  { name: 'Banking Fraud', value: 14, color: '#f9a8d4' },
  { name: 'KYC Fraud', value: 10, color: '#fbcfe8' },
  { name: 'Crypto Scams', value: 6, color: '#ffffff' },
  { name: 'Others', value: 5, color: '#94a3b8' },
];

export const HOURLY_ACTIVITY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  reports: Math.floor(Math.random() * 30) + 5,
  blocked: Math.floor(Math.random() * 20) + 3,
}));

// Utility functions
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return '#EF4444';
    case 'high': return '#F59E0B';
    case 'medium': return '#ec4899';
    case 'low': return '#22C55E';
  }
}

export function getSeverityBadgeClass(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'badge-critical';
    case 'high': return 'badge-high';
    case 'medium': return 'badge-medium';
    case 'low': return 'badge-low';
    default: return 'badge-medium';
  }
}

export function getStatusColor(status: ScamReport['status']): string {
  switch (status) {
    case 'pending': return '#64748B';
    case 'analyzing': return '#ec4899';
    case 'verified': return '#EF4444';
    case 'resolved': return '#22C55E';
    case 'false_positive': return '#94A3B8';
    default: return '#64748B';
  }
}
