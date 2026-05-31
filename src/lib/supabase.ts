// RakshaNet Shield — Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rstgmaihjuyeazeishum.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Type definitions for database tables
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          role: string;
          reputation_score: number;
          avatar_url: string | null;
          city: string | null;
          country: string;
          reports_submitted: number;
          scams_verified: number;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      scam_reports: {
        Row: {
          id: string;
          title: string;
          description: string;
          scam_type: string;
          severity: string;
          status: string;
          risk_score: number;
          ai_summary: string | null;
          country: string;
          city: string | null;
          url: string | null;
          phone: string | null;
          financial_loss: number | null;
          upvotes: number;
          downvotes: number;
          evidence_count: number;
          indicator_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scam_reports']['Row'], 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes'>;
      };
      evidence: {
        Row: {
          id: string;
          report_id: string;
          file_url: string;
          file_type: string;
          file_name: string | null;
          file_size: number | null;
          hash: string | null;
          ocr_text: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
      };
      indicators: {
        Row: {
          id: string;
          report_id: string;
          indicator_type: string;
          value: string;
          risk: string;
          confidence: number;
          description: string | null;
          source: string;
          created_at: string;
        };
      };
      ai_analysis: {
        Row: {
          id: string;
          report_id: string;
          model_name: string;
          classification: string;
          explanation: string | null;
          reasoning: unknown[];
          confidence: number;
          risk_factors: unknown[];
          recommendations: unknown[];
          processing_time_ms: number | null;
          created_at: string;
        };
      };
      threat_intelligence: {
        Row: {
          id: string;
          domain: string | null;
          ip: string | null;
          wallet: string | null;
          phone: string | null;
          email: string | null;
          reputation: number;
          threat_type: string | null;
          risk_level: string;
          total_reports: number;
          first_seen: string;
          last_seen: string;
          created_at: string;
        };
      };
    };
  };
}
