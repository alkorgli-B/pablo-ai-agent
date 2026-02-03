import { NextRequest, NextResponse } from 'next/server';
import twitterClient from '@/lib/twitter';
import aiHelper from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check auth
    const secretParam = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || secretParam !== expectedSecret) {
      return NextResponse.json({ 
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('📝 Generating tweet...');
    
    const tweet = await aiHelper.generateOriginalTweet();
    
    // Check validation if method exists
    if (typeof aiHelper.validateTweet === 'function') {
      const validation = await aiHelper.validateTweet(tweet);
      if (!validation.isValid) {
        return NextResponse.json({
          success: false,
          error: 'Tweet validation failed',
          issues: validation.issues
        }, { status: 400 });
      }
    }

    console.log('📤 Posting to Twitter...');
    const posted = await twitterClient.postTweet(tweet);

    return NextResponse.json({
      success: true,
      tweetId: posted?.id || 'unknown',
      tweet: tweet,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('❌ Post tweet error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
