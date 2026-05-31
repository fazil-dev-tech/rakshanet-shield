import { NextRequest, NextResponse } from 'next/server';
import { aiOrchestrator } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, url, hasEvidence, evidenceType } = body;

    if (!text && !url) {
      return NextResponse.json(
        { error: 'Either text or url must be provided for analysis.' },
        { status: 400 }
      );
    }

    const analysis = await aiOrchestrator.analyzeScam({
      text: text || '',
      url,
      hasEvidence,
      evidenceType,
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('API /analyze error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
