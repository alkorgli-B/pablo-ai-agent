import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Twitter API...');
    
    // Simple test tweet
    const testMessage = `🤖 Test from Pablo - ${new Date().toLocaleTimeString()}`;
    
    // Initialize Twitter
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Try to tweet
    const result = await client.readWrite.v2.tweet(testMessage);
    
    return NextResponse.json({
      success: true,
      message: 'Twitter API works!',
      tweetId: result.data.id,
      text: testMessage,
    });
    
  } catch (error: any) {
    console.error('Twitter error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      code: error.code,
      details: JSON.stringify(error, null, 2)
    }, { status: 500 });
  }
}
