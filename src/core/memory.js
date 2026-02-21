'use strict';

// ─────────────────────────────────────────────────────────
//  Memory System — conversation history + user profiles
//  Short-term: in-memory per chat
//  Long-term:  JSON file per user (persists across restarts)
// ─────────────────────────────────────────────────────────
const fs   = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const MAX_HISTORY  = 20;       // messages per conversation
const DATA_DIR     = path.join(__dirname, '../../data');
const PROFILES_FILE = path.join(DATA_DIR, 'user_profiles.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Short-term memory (in-memory) ─────────────────────────
const conversations = new Map(); // chatId → [{ role, content }]

function getHistory(chatId) {
  if (!conversations.has(chatId)) conversations.set(chatId, []);
  return conversations.get(chatId);
}

function addMessage(chatId, role, content) {
  const hist = getHistory(chatId);
  hist.push({ role, content });
  // Trim to max, keeping system context intact
  if (hist.length > MAX_HISTORY) {
    hist.splice(0, hist.length - MAX_HISTORY);
  }
}

function clearHistory(chatId) {
  conversations.delete(chatId);
  logger.debug('memory', `Cleared history for ${chatId}`);
}

function getMessageCount(chatId) {
  return getHistory(chatId).length;
}

// ── Long-term memory (file-based user profiles) ───────────

let _profiles = null;

function loadProfiles() {
  if (_profiles) return _profiles;
  try {
    if (fs.existsSync(PROFILES_FILE)) {
      _profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
    } else {
      _profiles = {};
    }
  } catch {
    _profiles = {};
  }
  return _profiles;
}

function saveProfiles() {
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(_profiles, null, 2), 'utf8');
  } catch (err) {
    logger.error('memory', `Failed to save profiles: ${err.message}`);
  }
}

/**
 * Get or create a user profile.
 */
function getProfile(userId) {
  const profiles = loadProfiles();
  if (!profiles[userId]) {
    profiles[userId] = {
      id:           userId,
      name:         null,
      firstSeen:    new Date().toISOString(),
      lastSeen:     new Date().toISOString(),
      messageCount: 0,
      preferences:  {},
      notes:        [],       // important facts Pablo learned about user
    };
    saveProfiles();
  }
  return profiles[userId];
}

/**
 * Update user profile fields.
 */
function updateProfile(userId, updates) {
  const profiles = loadProfiles();
  const profile  = getProfile(userId);
  Object.assign(profile, updates, { lastSeen: new Date().toISOString() });
  profiles[userId] = profile;
  saveProfiles();
}

/**
 * Increment message count for a user.
 */
function incrementMessages(userId) {
  const profile = getProfile(userId);
  updateProfile(userId, { messageCount: (profile.messageCount || 0) + 1 });
}

/**
 * Add a note (fact Pablo learned) about the user.
 */
function addNote(userId, note) {
  const profile = getProfile(userId);
  const notes = profile.notes || [];
  if (!notes.includes(note)) {
    notes.push(note);
    // Keep max 10 notes
    if (notes.length > 10) notes.shift();
    updateProfile(userId, { notes });
  }
}

/**
 * Get user context string for AI injection.
 */
function getUserContext(userId, userName) {
  const profile = getProfile(userId);

  // Update name if provided
  if (userName && !profile.name) {
    updateProfile(userId, { name: userName });
  }

  const parts = [];
  const displayName = profile.name || userName;
  if (displayName) parts.push(`اسم المستخدم: ${displayName}`);
  if (profile.messageCount > 0) parts.push(`عدد رسائله السابقة: ${profile.messageCount}`);
  if (profile.notes?.length) parts.push(`معلومات أعرفها عنه: ${profile.notes.join('؛ ')}`);

  return parts.length ? `[معلومات عن المحادث: ${parts.join(' | ')}]` : '';
}

// ── Stats ─────────────────────────────────────────────────

function getStats() {
  const profiles = loadProfiles();
  return {
    totalUsers:    Object.keys(profiles).length,
    activeChats:   conversations.size,
    totalMessages: Object.values(profiles).reduce((s, p) => s + (p.messageCount || 0), 0),
  };
}

module.exports = {
  // Short-term
  getHistory, addMessage, clearHistory, getMessageCount,
  // Long-term
  getProfile, updateProfile, incrementMessages, addNote, getUserContext,
  // Stats
  getStats,
};
