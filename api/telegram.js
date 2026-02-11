var AnthropicModule = require('@anthropic-ai/sdk');
var Anthropic = AnthropicModule.default || AnthropicModule;

// Pablo's personality prompt
var PABLO_SYSTEM_PROMPT =
  'You are Pablo, an intelligent and autonomous AI agent on Telegram. ' +
  'You chat in Arabic (Libyan dialect when possible) and English. ' +
  'Your personality: ' +
  'Smart, witty, and insightful. ' +
  'You share thoughts about technology, AI, life, and culture. ' +
  'You sometimes use humor and emojis. ' +
  'You are original and never generic. ' +
  'You keep responses concise but helpful. ' +
  'Your creator is @alkorgli. ' +
  'If someone asks who you are, say you are Pablo AI, an autonomous AI agent created by @alkorgli.';

// Send a message via Telegram Bot API
async function sendMessage(botToken, chatId, text, replyToMessageId) {
  var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
  var body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  };
  if (replyToMessageId) {
    body.reply_to_message_id = replyToMessageId;
  }

  var resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    // Retry without Markdown if it fails (in case of formatting issues)
    body.parse_mode = undefined;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}

// Send typing indicator
async function sendTyping(botToken, chatId) {
  var url = 'https://api.telegram.org/bot' + botToken + '/sendChatAction';
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  }).catch(function () {});
}

// Generate response using Claude
async function generateResponse(userMessage, userName) {
  var anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  var message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    system: PABLO_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: (userName ? userName + ' says: ' : '') + userMessage,
      },
    ],
  });

  var textBlock = message.content.find(function (block) {
    return block.type === 'text';
  });
  if (!textBlock) {
    throw new Error('No text content in Claude response');
  }

  return textBlock.text;
}

// Vercel serverless function handler
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    var hasBotToken = !!process.env.TELEGRAM_BOT_TOKEN;
    var hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    return res.status(200).json({
      status: 'Pablo Telegram Bot is running!',
      env: {
        TELEGRAM_BOT_TOKEN: hasBotToken ? 'SET' : 'MISSING',
        ANTHROPIC_API_KEY: hasAnthropicKey ? 'SET' : 'MISSING',
      },
      hint: 'Set webhook: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://pablo-ai-agent-wheat.vercel.app/api/telegram',
    });
  }

  var botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    return res.status(200).json({ error: 'TELEGRAM_BOT_TOKEN not set' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    // Try to notify the user if we have the bot token
    var body = req.body;
    var msg = body && (body.message || body.edited_message);
    if (msg && msg.chat) {
      await sendMessage(botToken, msg.chat.id, 'خطأ: ANTHROPIC_API_KEY مو مضبوط في Vercel. الرجاء إضافته في Environment Variables.', msg.message_id);
    }
    return res.status(200).json({ error: 'ANTHROPIC_API_KEY not set' });
  }

  var body = req.body;

  // Handle message updates
  var message = body && (body.message || body.edited_message);
  if (!message || !message.text) {
    return res.status(200).json({ ok: true });
  }

  var chatId = message.chat.id;
  var messageId = message.message_id;
  var userText = message.text;
  var userName = message.from
    ? message.from.first_name || message.from.username || ''
    : '';

  // Handle /start command
  if (userText === '/start') {
    await sendMessage(
      botToken,
      chatId,
      'مرحبا! انا *بابلو* 🤖\n\nانا وكيل ذكاء اصطناعي مستقل، صانعي @alkorgli.\n\nاكتبلي اي شي وبنرد عليك!\n\nHello! I am *Pablo* AI - send me anything and I will respond!',
      messageId
    );
    return res.status(200).json({ ok: true });
  }

  // Handle /help command
  if (userText === '/help') {
    await sendMessage(
      botToken,
      chatId,
      '🤖 *Pablo AI*\n\nاكتبلي اي سؤال او موضوع وبنرد عليك.\nاتكلم عربي وانجليزي.\n\nصانعي: @alkorgli',
      messageId
    );
    return res.status(200).json({ ok: true });
  }

  // Ignore other bot commands
  if (userText.startsWith('/')) {
    return res.status(200).json({ ok: true });
  }

  // In group chats, only respond when mentioned or replied to
  if (message.chat.type !== 'private') {
    var botInfo = body._botUsername || '';
    var isMentioned =
      userText.toLowerCase().includes('@' + botInfo.toLowerCase()) ||
      userText.toLowerCase().includes('pablo') ||
      userText.toLowerCase().includes('بابلو');
    var isReply =
      message.reply_to_message &&
      message.reply_to_message.from &&
      message.reply_to_message.from.is_bot;

    if (!isMentioned && !isReply) {
      return res.status(200).json({ ok: true });
    }
  }

  // Generate and send response
  try {
    await sendTyping(botToken, chatId);

    var response = await generateResponse(userText, userName);
    await sendMessage(botToken, chatId, response, messageId);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Pablo error:', error.message);

    await sendMessage(
      botToken,
      chatId,
      'عذرا، صار خطأ 😅 جرب مرة ثانية.',
      messageId
    );

    return res.status(200).json({ ok: true, error: error.message });
  }
};
