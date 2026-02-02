import { NextRequest, NextResponse } from 'next/server';
import { runAgentCycle } from '@/agent/runner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
