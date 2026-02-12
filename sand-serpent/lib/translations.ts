// ============================================================
// Sand Serpent — Bilingual Translations (EN/AR)
// ============================================================

import type { Language } from './types';

const translations = {
  // Splash & Menu
  'game.title': { en: 'SAND SERPENT', ar: 'ثعبان الرمال' },
  'menu.play': { en: 'Play', ar: 'إلعب' },
  'menu.howToPlay': { en: 'How to Play', ar: 'كيف تلعب' },
  'menu.highScores': { en: 'High Scores', ar: 'أعلى النقاط' },
  'menu.settings': { en: 'Settings', ar: 'الإعدادات' },

  // Setup
  'setup.title': { en: 'Prepare for Battle', ar: 'استعد للمعركة' },
  'setup.playerName': { en: 'Player Name', ar: 'اسم اللاعب' },
  'setup.namePlaceholder': { en: 'Enter your name...', ar: 'أدخل اسمك...' },
  'setup.chooseColor': { en: 'Choose Your Serpent', ar: 'اختر ثعبانك' },
  'setup.difficulty': { en: 'Difficulty', ar: 'الصعوبة' },
  'setup.enterArena': { en: 'Enter the Arena', ar: 'ادخل الساحة' },

  // Difficulty
  'difficulty.casual': { en: 'Casual', ar: 'سهل' },
  'difficulty.normal': { en: 'Normal', ar: 'عادي' },
  'difficulty.hardcore': { en: 'Hardcore', ar: 'صعب' },
  'difficulty.casualDesc': { en: 'Slow pace, smaller grid, more power-ups', ar: 'سرعة بطيئة، شبكة صغيرة، قوى أكثر' },
  'difficulty.normalDesc': { en: 'Balanced gameplay', ar: 'لعب متوازن' },
  'difficulty.hardcoreDesc': { en: 'Fast, large grid, rare power-ups, no shield', ar: 'سريع، شبكة كبيرة، قوى نادرة، بدون درع' },

  // Colors
  'color.emerald': { en: 'Emerald', ar: 'زمرد' },
  'color.sapphire': { en: 'Sapphire', ar: 'ياقوت أزرق' },
  'color.ruby': { en: 'Ruby', ar: 'ياقوت أحمر' },
  'color.amber': { en: 'Amber', ar: 'عنبر' },
  'color.violet': { en: 'Violet', ar: 'بنفسجي' },
  'color.cyan': { en: 'Cyan', ar: 'سماوي' },
  'color.rose': { en: 'Rose', ar: 'وردي' },
  'color.obsidian': { en: 'Obsidian', ar: 'سبج' },

  // Game HUD
  'hud.score': { en: 'Score', ar: 'النقاط' },
  'hud.length': { en: 'Length', ar: 'الطول' },
  'hud.combo': { en: 'Combo', ar: 'كومبو' },
  'hud.wave': { en: 'Wave', ar: 'الموجة' },
  'hud.paused': { en: 'PAUSED', ar: 'إيقاف مؤقت' },
  'hud.resumeHint': { en: 'Press Space or tap to resume', ar: 'اضغط المسافة أو انقر للاستئناف' },

  // Power-ups
  'powerup.speed': { en: 'Speed Boost', ar: 'تعزيز السرعة' },
  'powerup.shield': { en: 'Shield', ar: 'درع' },
  'powerup.double': { en: 'Double Points', ar: 'نقاط مضاعفة' },
  'powerup.magnet': { en: 'Magnet', ar: 'مغناطيس' },
  'powerup.fire': { en: 'Fire Mode', ar: 'وضع النار' },
  'powerup.freeze': { en: 'Time Freeze', ar: 'تجميد الوقت' },

  // Combo messages
  'combo.fire': { en: 'FIRE COMBO', ar: 'كومبو ناري' },
  'combo.unstoppable': { en: 'UNSTOPPABLE', ar: 'لا يوقف' },
  'combo.godlike': { en: 'GODLIKE', ar: 'إلهي' },

  // Game Over
  'gameover.title': { en: 'GAME OVER', ar: 'انتهت اللعبة' },
  'gameover.newHighScore': { en: 'NEW HIGH SCORE!', ar: 'رقم قياسي جديد!' },
  'gameover.score': { en: 'Final Score', ar: 'النتيجة النهائية' },
  'gameover.length': { en: 'Snake Length', ar: 'طول الثعبان' },
  'gameover.maxCombo': { en: 'Max Combo', ar: 'أعلى كومبو' },
  'gameover.timeSurvived': { en: 'Time Survived', ar: 'وقت البقاء' },
  'gameover.foodEaten': { en: 'Food Eaten', ar: 'الطعام المأكول' },
  'gameover.powerups': { en: 'Power-ups', ar: 'القوى' },
  'gameover.waveReached': { en: 'Wave Reached', ar: 'الموجة' },
  'gameover.playAgain': { en: 'Play Again', ar: 'العب مرة أخرى' },
  'gameover.menu': { en: 'Menu', ar: 'القائمة' },
  'gameover.shareScore': { en: 'Share Score', ar: 'شارك النتيجة' },
  'gameover.copied': { en: 'Copied to clipboard!', ar: 'تم النسخ!' },

  // Tutorial
  'tutorial.title': { en: 'How to Play', ar: 'كيف تلعب' },
  'tutorial.move': { en: 'Use arrow keys or WASD to move', ar: 'استخدم الأسهم أو WASD للتحرك' },
  'tutorial.eat': { en: 'Eat food to grow and score points', ar: 'كل الطعام لتنمو وتحصل على نقاط' },
  'tutorial.avoid': { en: 'Avoid walls and your own tail', ar: 'تجنب الجدران وذيلك' },
  'tutorial.powerups': { en: 'Collect power-ups for special abilities', ar: 'اجمع القوى للحصول على قدرات خاصة' },
  'tutorial.combo': { en: 'Eat quickly to build combos for bonus points', ar: 'كل بسرعة لبناء كومبو ونقاط إضافية' },
  'tutorial.pause': { en: 'Press Space or Escape to pause', ar: 'اضغط المسافة أو Escape للإيقاف المؤقت' },
  'tutorial.close': { en: 'Got it!', ar: 'فهمت!' },

  // Settings
  'settings.title': { en: 'Settings', ar: 'الإعدادات' },
  'settings.music': { en: 'Music Volume', ar: 'صوت الموسيقى' },
  'settings.sfx': { en: 'Sound Effects', ar: 'المؤثرات الصوتية' },
  'settings.language': { en: 'Language', ar: 'اللغة' },
  'settings.close': { en: 'Close', ar: 'إغلاق' },

  // High Scores
  'highscores.title': { en: 'High Scores', ar: 'أعلى النقاط' },
  'highscores.empty': { en: 'No scores yet. Play to set records!', ar: 'لا توجد نقاط بعد. العب لتسجل أرقاماً!' },
  'highscores.close': { en: 'Close', ar: 'إغلاق' },

  // Share
  'share.text': {
    en: '🐍 Sand Serpent | Score: {score} | Wave: {wave} | Combo: ×{combo} | Rating: {rating} | Can you beat my score?',
    ar: '🐍 ثعبان الرمال | النقاط: {score} | الموجة: {wave} | كومبو: ×{combo} | التقييم: {rating} | هل تستطيع التغلب على نتيجتي؟',
  },

  // Misc
  'misc.ready': { en: 'READY', ar: 'استعد' },
  'misc.go': { en: 'GO!', ar: 'انطلق!' },
  'misc.close': { en: 'Close', ar: 'إغلاق' },
} as const;

type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language, params?: Record<string, string | number>): string {
  const entry = translations[key];
  if (!entry) return key;
  let text: string = entry[lang] || entry.en;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export default translations;
