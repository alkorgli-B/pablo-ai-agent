import { NextRequest, NextResponse } from 'next/server';
import { runAgentCycle } from '@/agent/runner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Check authorization from header OR query parameter
  const authHeader = request.headers.get('authorization');
  const secretParam = request.nextUrl.searchParams.get('secret');
  
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  const expectedSecret = process.env.CRON_SECRET;
  
  // Accept either header or query parameter
  if (authHeader !== expectedAuth && secretParam !== expectedSecret) {
    return NextResponse.json({ 
      error: 'Unauthorized',
      hint: 'Use either Authorization header or ?secret=your_secret query parameter'
    }, { status: 401 });
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
