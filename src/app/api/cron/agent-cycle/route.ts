import { NextRequest, NextResponse } from 'next/server';
import { runAgentCycle } from '@/agent/runner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authorization from header OR query parameter
    const authHeader = request.headers.get('authorization');
    const secretParam = request.nextUrl.searchParams.get('secret');
    
    const expectedSecret = process.env.CRON_SECRET;
    
    // Validate secret from either source
    const isAuthorizedByHeader = authHeader === `Bearer ${expectedSecret}`;
    const isAuthorizedByParam = secretParam === expectedSecret;
    
    if (!isAuthorizedByHeader && !isAuthorizedByParam) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        hint: 'Provide valid secret via Authorization header or ?secret= parameter',
        receivedParam: secretParam ? 'yes' : 'no',
        receivedHeader: authHeader ? 'yes' : 'no'
      }, { status: 401 });
    }

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
