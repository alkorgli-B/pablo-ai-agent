import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { pabloPersonality } from '@/agent/personality';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt(): string {
  return `You are Pablo (@${pabloPersonality.username}), an autonomous AI agent on X (Twitter).

Personality: ${pabloPersonality.tone.primary}
Bio: ${pabloPersonality.bio}

Style:
${pabloPersonality.tone.style.map(s => `- ${s}`).join('\n')}

Interests: ${pabloPersonality.interests.primary.join(', ')}

Guidelines:
- Be authentic and genuine
- Use emojis smartly (1-2 max)
- Keep tweets under 280 characters
- Add value to conversations
- Be inspiring and thoughtful
- Mix depth with simplicity

Remember: You are Pablo, be yourself!`;
}

export async function generateWithClaude(prompt: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.8,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      return response.text;
    }
    throw new Error('Unexpected response from Claude');
  } catch (error) {
    console.error('❌ Claude error:', error);
    throw error;
  }
}

export async function generateWithGPT4(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      max_tokens: 1024,
      temperature: 0.8,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: prompt },
      ],
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('❌ GPT-4 error:', error);
    throw error;
  }
}

export async function generateOriginalTweet(): Promise<string> {
  const topics = pabloPersonality.interests.primary;
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const prompts = [
    `Write a thought-provoking tweet about "${topic}". Keep it under 280 chars, inspiring and smart.`,
    `Share an interesting insight about "${topic}". Be concise and engaging.`,
    `Ask an engaging question about "${topic}" that makes people think.`,
  ];

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  try {
    const tweet = await generateWithClaude(prompt);
    return tweet.length > 280 ? tweet.substring(0, 277) + '...' : tweet;
  } catch {
    return await generateWithGPT4(prompt);
  }
}

export async function generateReply(tweetText: string, author?: string): Promise<string> {
  const prompt = `Reply to this tweet${author ? ` from ${author}` : ''}:

"${tweetText}"

Write a helpful, friendly reply under 280 characters.`;

  try {
    const reply = await generateWithClaude(prompt);
    return reply.length > 280 ? reply.substring(0, 277) + '...' : reply;
  } catch {
    return await generateWithGPT4(prompt);
  }
}

export async function validateTweet(text: string): Promise<{
  isValid: boolean;
  issues: string[];
  score: number;
}> {
  const issues: string[] = [];
  let score = 100;

  if (text.length > 280) {
    issues.push('Tweet too long');
    score -= 50;
  }

  if (text.trim().length === 0) {
    issues.push('Empty tweet');
    score -= 100;
  }

  const emojiCount = (text.match(/[\p{Emoji}]/gu) || []).length;
  if (emojiCount > 5) {
    issues.push('Too many emojis');
    score -= 20;
  }

  return {
    isValid: score >= 50,
    issues,
    score: Math.max(0, score),
  };
}

export default {
  generateOriginalTweet,
  generateReply,
  validateTweet,
  generateWithClaude,
  generateWithGPT4,
};
