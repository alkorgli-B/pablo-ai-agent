import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Environment variables safety check
    const configStatus = {
      twitter: {
        apiKey: !!process.env.TWITTER_API_KEY,
        apiSecret: !!process.env.TWITTER_API_SECRET,
        accessToken: !!process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: !!process.env.TWITTER_ACCESS_SECRET,
      },
      ai: {
        anthropic: !!process.env.ANTHROPIC_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
      },
      general: {
        username: process.env.PABLO_USERNAME || 'Not configured',
        cronSecret: !!process.env.CRON_SECRET,
      }
    };

    const isFullyConfigured = 
      Object.values(configStatus.twitter).every(Boolean) && 
      (configStatus.ai.anthropic || configStatus.ai.openai);

    return NextResponse.json({
      success: true,
      status: isFullyConfigured ? 'Ready' : 'Incomplete Configuration',
      details: configStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Diagnostic failed'
    }, { status: 500 });
  }
}
