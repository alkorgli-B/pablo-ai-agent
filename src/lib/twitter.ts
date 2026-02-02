import { TwitterApi } from 'twitter-api-v2';

// Initialize the client with OAuth 1.0a (Required for posting)
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
});

export const twitterClient = {
  async postTweet(text: string) {
    try {
      console.log('🚀 Attempting to post tweet...');
      // Using v2 API for posting
      const { data: createdTweet } = await client.v2.tweet(text);
      console.log('✅ Tweet posted successfully:', createdTweet.id);
      return createdTweet;
    } catch (error: any) {
      // Detailed error logging for debugging 401s
      console.error('❌ Twitter Post Error Detail:', {
        code: error.code,
        data: error.data,
        message: error.message
      });
      throw error;
    }
  }
};

export default twitterClient;
