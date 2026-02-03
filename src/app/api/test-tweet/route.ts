import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if environment variables exist
    const hasTwitterKeys = !!(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    );

    const hasAIKeys = !!(
      process.env.ANTHROPIC_API_KEY &&
      process.env.OPENAI_API_KEY
    );

    return NextResponse.json({
      success: true,
      message: 'Environment check complete',
      config: {
        twitterConfigured: hasTwitterKeys,
        aiConfigured: hasAIKeys,
        username: process.env.PABLO_USERNAME || 'Not set',
        cronSecret: process.env.CRON_SECRET ? 'Set' : 'Not set',
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
