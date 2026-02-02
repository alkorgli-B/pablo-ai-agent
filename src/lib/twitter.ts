import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
});

export const twitterClient = {
  // 1. Get Me (Required for runner.ts:140)
  async getMe() {
    try {
      const { data: me } = await client.v2.me();
      return me;
    } catch (error: any) {
      console.error('❌ Twitter getMe Error:', error.message);
      return null;
    }
  },

  // 2. Post a new tweet
  async postTweet(text: string) {
    try {
      console.log('🚀 Attempting to post tweet...');
      const { data: createdTweet } = await client.v2.tweet(text);
      console.log('✅ Tweet posted successfully:', createdTweet.id);
      return createdTweet;
    } catch (error: any) {
      console.error('❌ Twitter Post Error Detail:', {
        code: error.code,
        data: error.data,
        message: error.message
      });
      throw error;
    }
  },

  // 3. Get mentions
  async getMentions(sinceId?: string) {
    try {
      const mentions = await client.v2.userMentions(process.env.TWITTER_USER_ID || '', {
        since_id: sinceId,
        "tweet.fields": ['author_id', 'text'],
      });
      return mentions.data.data || [];
    } catch (error: any) {
      console.error('❌ Twitter Mentions Error:', error.message);
      return [];
    }
  },

  // 4. Reply to a tweet
  async replyToTweet(tweetId: string, text: string) {
    try {
      const { data: reply } = await client.v2.reply(text, tweetId);
      return reply;
    } catch (error: any) {
      console.error('❌ Twitter Reply Error:', error.message);
      throw error;
    }
  },

  // 5. Like a tweet
  async likeTweet(tweetId: string) {
    try {
      await client.v2.like(process.env.TWITTER_USER_ID || '', tweetId);
    } catch (error: any) {
      console.error('❌ Twitter Like Error:', error.message);
    }
  }
};

export default twitterClient;
