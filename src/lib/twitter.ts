import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

const rwClient = client.readWrite;

export async function postTweet(text: string) {
  try {
    const tweet = await rwClient.v2.tweet(text);
    console.log('✅ Tweet posted:', tweet.data.id);
    return tweet.data;
  } catch (error) {
    console.error('❌ Error posting tweet:', error);
    throw error;
  }
}

export async function replyToTweet(tweetId: string, text: string) {
  try {
    const reply = await rwClient.v2.reply(text, tweetId);
    console.log('✅ Reply posted:', reply.data.id);
    return reply.data;
  } catch (error) {
    console.error('❌ Error replying:', error);
    throw error;
  }
}

export async function likeTweet(tweetId: string) {
  try {
    const me = await rwClient.v2.me();
    await rwClient.v2.like(me.data.id, tweetId);
    console.log('✅ Liked tweet:', tweetId);
    return true;
  } catch (error) {
    console.error('❌ Error liking:', error);
    return false;
  }
}

export async function getMentions(sinceId?: string) {
  try {
    const me = await rwClient.v2.me();
    const mentions = await rwClient.v2.userMentionTimeline(me.data.id, {
      max_results: 50,
      ...(sinceId && { since_id: sinceId }),
      expansions: ['author_id'],
      'tweet.fields': ['created_at', 'public_metrics'],
    });

    return mentions.data.data || [];
  } catch (error) {
    console.error('❌ Error getting mentions:', error);
    return [];
  }
}

export async function getMe() {
  try {
    const me = await rwClient.v2.me({
      'user.fields': ['description', 'public_metrics'],
    });
    return me.data;
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return null;
  }
}

export default {
  postTweet,
  replyToTweet,
  likeTweet,
  getMentions,
  getMe,
};
