import { NextRequest, NextResponse } from 'next/server';
import twitterClient from '@/lib/twitter';
import aiHelper from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. جلب السر من الرابط (URL)
  const { searchParams } = new URL(request.url);
  const urlSecret = searchParams.get('secret');
  
  // 2. جلب السر من الـ Header (للدعم التلقائي لاحقاً)
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // 3. التحقق: هل يطابق أحدهما القيمة 123456؟
  if (urlSecret !== process.env.CRON_SECRET && bearerToken !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📝 Generating and posting manual tweet...');
    
    // توليد التغريدة عبر الذكاء الاصطناعي
    const tweet = await aiHelper.generateOriginalTweet();
    const validation = await aiHelper.validateTweet(tweet);

    if (!validation.isValid) {
      throw new Error('Invalid tweet: ' + validation.issues.join(', '));
    }

    // النشر الفعلي على تويتر
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
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
