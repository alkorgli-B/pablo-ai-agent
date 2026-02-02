import { NextRequest, NextResponse } from 'next/server';
import { runAgentCycle } from '@/agent/runner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // جلب السر من الرابط (URL)
  const { searchParams } = new URL(request.url);
  const urlSecret = searchParams.get('secret');
  
  // جلب السر من الـ Header
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // التحقق من أن أحدهما يطابق CRON_SECRET الموجود في Netlify
  if (urlSecret !== process.env.CRON_SECRET && bearerToken !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Running agent cycle via cron...');
    await runAgentCycle();
    
    return NextResponse.json({
      success: true,
      message: 'Agent cycle completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
