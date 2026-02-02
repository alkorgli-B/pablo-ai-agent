import { NextRequest, NextResponse } from 'next/server';
import twitterClient from '@/lib/twitter';
import aiHelper from '@/lib/ai';

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
    console.log('📝 Posting scheduled tweet...');
    
    const tweet = await aiHelper.generateOriginalTweet();
    const validation = await aiHelper.validateTweet(tweet);

    if (!validation.isValid) {
      throw new Error('Invalid tweet: ' + validation.issues.join(', '));
    }

    const posted = await twitterClient.postTweet(tweet);

    return NextResponse.json({
      success: true,
      tweetId: posted.id,
      tweet: tweet,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Post tweet error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
