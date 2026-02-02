import { TwitterApi } from 'twitter-api-v2';

// Initialize the client with OAuth 1.0a
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
});

export const twitterClient = {
  // Function to post a tweet
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

  // Function to get mentions (Fixed: Adding it back to avoid build failure)
  async getMentions(sinceId?: string) {
    try {
      console.log('🔍 Checking mentions...');
      const mentions = await client.v2.userMentions(process.env.TWITTER_USER_ID || '12345', {
        since_id: sinceId,
        "tweet.fields": ['author_id', 'text'],
      });
      return mentions.data.data || [];
    } catch (error: any) {
      console.error('❌ Twitter Mentions Error:', error.message);
      return [];
    }
  }
};

export default twitterClient;
