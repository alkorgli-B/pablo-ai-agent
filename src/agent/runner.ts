import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import twitterClient from '@/lib/twitter';
import aiHelper from '@/lib/ai';
import { shouldReply, isGoodTimeToPost } from '@/agent/personality';

const CONFIG = {
  CHECK_INTERVAL: 60 * 1000,
  POST_INTERVAL: 3 * 60 * 60 * 1000,
  MAX_REPLIES_PER_CYCLE: 5,
};

let lastMentionId: string | undefined;
let lastPostTime: number = Date.now();
let isRunning = false;

async function processMentions() {
  console.log('📬 Checking mentions...');
  
  try {
    const mentions = await twitterClient.getMentions(lastMentionId);
    
    if (mentions.length === 0) {
      console.log('✅ No new mentions');
      return;
    }

    if (mentions.length > 0) {
      lastMentionId = mentions[0].id;
    }

    let repliesCount = 0;

    for (const mention of mentions.slice(0, CONFIG.MAX_REPLIES_PER_CYCLE)) {
      try {
        if (!shouldReply({ text: mention.text, mentions: true })) {
          continue;
        }

        console.log(`💬 Replying to mention...`);

        const reply = await aiHelper.generateReply(mention.text);
        const validation = await aiHelper.validateTweet(reply);

        if (!validation.isValid) {
          console.log('⚠️  Invalid reply');
          continue;
        }

        await twitterClient.replyToTweet(mention.id, reply);
        await twitterClient.likeTweet(mention.id);
        repliesCount++;

        await delay(10000);
      } catch (error) {
        console.error('❌ Error processing mention:', error);
      }
    }

    console.log(`✅ Replied to ${repliesCount} mentions`);
  } catch (error) {
    console.error('❌ Error in processMentions:', error);
  }
}

async function postOriginalTweet() {
  console.log('📝 Creating tweet...');

  try {
    if (!isGoodTimeToPost()) {
      console.log('⏰ Not the best time to post');
      return;
    }

    const tweet = await aiHelper.generateOriginalTweet();
    const validation = await aiHelper.validateTweet(tweet);

    if (!validation.isValid) {
      console.log('⚠️  Invalid tweet');
      return;
    }

    await twitterClient.postTweet(tweet);
    console.log(`✅ Tweet posted! Score: ${validation.score}/100`);
    
    lastPostTime = Date.now();
  } catch (error) {
    console.error('❌ Error posting tweet:', error);
  }
}

export async function runAgentCycle() {
  if (isRunning) {
    console.log('⏳ Cycle already running...');
    return;
  }

  isRunning = true;
  console.log('\n🤖 === Pablo Agent Cycle ===');
  console.log(`⏰ Time: ${new Date().toLocaleString()}`);

  try {
    await processMentions();
    await delay(5000);

    const timeSincePost = Date.now() - lastPostTime;
    if (timeSincePost >= CONFIG.POST_INTERVAL) {
      await postOriginalTweet();
    } else {
      const timeLeft = Math.round((CONFIG.POST_INTERVAL - timeSincePost) / 60000);
      console.log(`⏰ Next tweet in ${timeLeft} minutes`);
    }
  } catch (error) {
    console.error('❌ Cycle error:', error);
  } finally {
    isRunning = false;
    console.log('✅ === Cycle Complete ===\n');
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startPablo() {
  console.log(`
╔════════════════════════════════╗
║     🤖 PABLO AI AGENT 🤖       ║
║  Autonomous Twitter AI Agent   ║
╚════════════════════════════════╝
  `);

  console.log('🚀 Starting Pablo...\n');

  try {
    const me = await twitterClient.getMe();
    if (me) {
      console.log(`✅ Connected as: @${me.username}\n`);
    }
  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }

  await runAgentCycle();
  setInterval(runAgentCycle, CONFIG.CHECK_INTERVAL);

  console.log(`⏰ Running every ${CONFIG.CHECK_INTERVAL / 1000}s\n`);
}

if (require.main === module) {
  startPablo().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { startPablo };
