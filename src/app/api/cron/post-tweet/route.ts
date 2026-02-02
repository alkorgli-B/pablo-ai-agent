import { NextRequest, NextResponse } from 'next/server';
import twitterClient from '@/lib/twitter';
import aiHelper from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
