import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Test tweet
    const testTweet = "🤖 Pablo AI Agent - Test tweet at " + new Date().toLocaleString();
    
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    const rwClient = client.readWrite;
    
    // Try to post
    const result = await rwClient.v2.tweet(testTweet);
    
    return NextResponse.json({
      success: true,
      message: "Tweet posted successfully!",
      tweetId: result.data.id,
      text: testTweet,
      url: `https://twitter.com/pablo26agent/status/${result.data.id}`
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      data: error.data,
      fullError: JSON.stringify(error, null, 2)
    }, { status: 500 });
  }
}
