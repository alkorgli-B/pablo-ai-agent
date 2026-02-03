import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check auth
    const secretParam = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (secretParam !== expectedSecret) {
      return NextResponse.json({ 
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Lazy load heavy modules
    const { default: twitterClient } = await import('@/lib/twitter');
    const { default: aiHelper } = await import('@/lib/ai');

    console.log('📝 Generating tweet...');
    
    const tweet = await aiHelper.generateOriginalTweet();
    const validation = await aiHelper.validateTweet(tweet);

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Tweet validation failed',
        issues: validation.issues
      }, { status: 400 });
    }

    console.log('📤 Posting to Twitter...');
    const posted = await twitterClient.postTweet(tweet);

    return NextResponse.json({
      success: true,
      tweetId: posted.id,
      tweet: tweet,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('❌ Post tweet error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
