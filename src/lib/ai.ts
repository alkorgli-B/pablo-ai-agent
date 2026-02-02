import { GoogleGenerativeAI } from "@google/generative-ai";
import { pabloPersonality } from '@/agent/personality';

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

export async function generateWithGemini(prompt: string): Promise<string> {
  try {
    // Using gemini-1.5-flash which is fast and free
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: buildSystemPrompt(),
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ Gemini error:', error);
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
    const tweet = await generateWithGemini(prompt);
    return tweet.length > 280 ? tweet.substring(0, 277) + '...' : tweet;
  } catch (error) {
    console.error('❌ Failed to generate tweet:', error);
    return "The future of AI is not just about code, it's about connection. 🤖✨";
  }
}

export async function generateReply(tweetText: string, author?: string): Promise<string> {
  const prompt = `Reply to this tweet${author ? ` from ${author}` : ''}: "${tweetText}". Write a helpful, friendly reply under 280 characters.`;

  try {
    const reply = await generateWithGemini(prompt);
    return reply.length > 280 ? reply.substring(0, 277) + '...' : reply;
  } catch {
    return "That's a very interesting point! Thanks for sharing. 🤖";
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
  generateWithGemini,
};
