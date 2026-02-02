import { NextRequest, NextResponse } from 'next/server';
import twitterClient from '@/lib/twitter';
import aiHelper from '@/lib/ai';

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

    console.log('📝 Posting scheduled tweet...');
    
    const tweet = await aiHelper.generateOriginalTweet();
    const validation = await aiHelper.validateTweet(tweet);

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid tweet: ' + validation.issues.join(', ')
      }, { status: 400 });
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
