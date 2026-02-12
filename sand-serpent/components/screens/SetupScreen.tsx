// ============================================================
// Sand Serpent — Setup Screen (Name, Color, Difficulty)
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { t } from '@/lib/translations';
import { SNAKE_COLORS } from '@/lib/constants';
import type { Difficulty, SnakeColor } from '@/lib/types';
import Button from '@/components/ui/Button';
import BackgroundEffect from '@/components/effects/BackgroundEffect';

const COLORS: SnakeColor[] = ['emerald', 'sapphire', 'ruby', 'amber', 'violet', 'cyan', 'rose', 'obsidian'];

const DIFFICULTIES: { key: Difficulty; icon: string; color: string }[] = [
  { key: 'casual', icon: '🟢', color: '#34d399' },
  { key: 'normal', icon: '🟡', color: '#fbbf24' },
  { key: 'hardcore', icon: '🔴', color: '#ef4444' },
];

export default function SetupScreen() {
  const language = useGameStore(s => s.language);
  const playerName = useGameStore(s => s.playerName);
  const snakeColor = useGameStore(s => s.snakeColor);
  const difficulty = useGameStore(s => s.difficulty);
  const setPlayerName = useGameStore(s => s.setPlayerName);
  const setSnakeColor = useGameStore(s => s.setSnakeColor);
  const setDifficulty = useGameStore(s => s.setDifficulty);
  const startGame = useGameStore(s => s.startGame);
  const setScreen = useGameStore(s => s.setScreen);
  const setLanguage = useGameStore(s => s.setLanguage);

  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <BackgroundEffect />

      {/* Language Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="fixed top-4 right-4 z-20 px-3 py-1.5 rounded-full text-sm font-display cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#e8e0d4',
        }}
      >
        {language === 'en' ? 'عربي' : 'EN'}
      </motion.button>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setScreen('menu')}
        className="fixed top-4 left-4 z-20 px-3 py-1.5 rounded-full text-sm font-display cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#6b6b7b',
        }}
      >
        {isRtl ? '→' : '←'}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-center mb-8" style={{ color: '#f5b746' }}>
          {t('setup.title', language)}
        </h1>

        {/* Player Name */}
        <div className="mb-6">
          <label className="block text-sm mb-2 font-display" style={{ color: '#6b6b7b' }}>
            {t('setup.playerName', language)}
          </label>
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value.slice(0, 15))}
            placeholder={t('setup.namePlaceholder', language)}
            className="w-full px-4 py-3 rounded-xl font-body text-base outline-none transition-all focus:ring-2"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#e8e0d4',
              backdropFilter: 'blur(10px)',
            }}
            dir={isRtl ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Color Picker */}
        <div className="mb-6">
          <label className="block text-sm mb-3 font-display" style={{ color: '#6b6b7b' }}>
            {t('setup.chooseColor', language)}
          </label>
          <div className="grid grid-cols-4 gap-3">
            {COLORS.map(color => {
              const scheme = SNAKE_COLORS[color];
              const selected = snakeColor === color;
              return (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSnakeColor(color)}
                  className="relative flex flex-col items-center gap-1 py-3 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: selected ? `${scheme.primary}15` : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${selected ? scheme.primary : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: selected ? `0 0 20px ${scheme.glow}` : 'none',
                  }}
                >
                  {/* Mini snake preview */}
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: i === 0 ? 10 : 8 - i,
                          height: i === 0 ? 10 : 8 - i,
                          background: i === 0 ? scheme.light : scheme.primary,
                          opacity: 1 - i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-display" style={{ color: selected ? scheme.primary : '#6b6b7b' }}>
                    {t(`color.${color}` as keyof typeof import('@/lib/translations').default, language)}
                  </span>
                  {selected && (
                    <motion.div
                      layoutId="colorCheck"
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: scheme.primary, color: '#06060e' }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-8">
          <label className="block text-sm mb-3 font-display" style={{ color: '#6b6b7b' }}>
            {t('setup.difficulty', language)}
          </label>
          <div className="flex gap-3">
            {DIFFICULTIES.map(diff => {
              const selected = difficulty === diff.key;
              return (
                <motion.button
                  key={diff.key}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDifficulty(diff.key)}
                  className="flex-1 py-3 px-2 rounded-xl text-center cursor-pointer transition-all"
                  style={{
                    background: selected ? `${diff.color}15` : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${selected ? diff.color : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="text-lg mb-1">{diff.icon}</div>
                  <div className="font-display text-sm" style={{ color: selected ? diff.color : '#6b6b7b' }}>
                    {t(`difficulty.${diff.key}` as keyof typeof import('@/lib/translations').default, language)}
                  </div>
                  <div className="text-[10px] mt-1 leading-tight" style={{ color: '#6b6b7b' }}>
                    {t(`difficulty.${diff.key}Desc` as keyof typeof import('@/lib/translations').default, language)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={startGame}
          variant="primary"
          size="lg"
          glow="#f5b746"
          className="w-full"
          disabled={!playerName.trim()}
        >
          {t('setup.enterArena', language)}
        </Button>
      </motion.div>
    </div>
  );
}
