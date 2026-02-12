// ============================================================
// Sand Serpent — Game HUD (Score, Combo, Power-ups)
// ============================================================

'use client';

import { useGameStore } from '@/stores/gameStore';
import { POWERUP_ICONS, POWERUP_COLORS, SNAKE_COLORS } from '@/lib/constants';
import { t } from '@/lib/translations';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameHUD() {
  const stats = useGameStore(s => s.stats);
  const combo = useGameStore(s => s.combo);
  const activePowerUps = useGameStore(s => s.activePowerUps);
  const playerName = useGameStore(s => s.playerName);
  const snakeColor = useGameStore(s => s.snakeColor);
  const wave = useGameStore(s => s.wave);
  const language = useGameStore(s => s.language);
  const isPaused = useGameStore(s => s.isPaused);
  const togglePause = useGameStore(s => s.togglePause);
  const colors = SNAKE_COLORS[snakeColor];

  const comboText = combo.count >= 20 ? t('combo.godlike', language) :
    combo.count >= 12 ? t('combo.unstoppable', language) :
    combo.count >= 8 ? t('combo.fire', language) : null;

  const comboColor = combo.count >= 20 ? '#fbbf24' :
    combo.count >= 12 ? 'rainbow' :
    combo.count >= 8 ? '#f97316' :
    combo.count >= 5 ? '#f97316' :
    combo.count >= 3 ? '#ef4444' : colors.primary;

  return (
    <div className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-lg"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
        {/* Player Name */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🐍</span>
          <span className="font-display text-sm" style={{ color: colors.primary }}>
            {playerName || 'Player'}
          </span>
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: '#6b6b7b' }}>
            {t('hud.score', language)}
          </div>
          <motion.div
            key={stats.score}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="font-display text-lg font-bold"
            style={{ color: combo.count >= 5 ? '#f97316' : '#e8e0d4' }}
          >
            {stats.score.toLocaleString()}
          </motion.div>
        </div>

        {/* Length */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: '#6b6b7b' }}>
            {t('hud.length', language)}
          </div>
          <div className="font-display text-lg" style={{ color: '#e8e0d4' }}>
            {stats.length}
          </div>
        </div>

        {/* Combo */}
        <div className="text-center min-w-[48px]">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: '#6b6b7b' }}>
            {t('hud.combo', language)}
          </div>
          <AnimatePresence mode="wait">
            {combo.count > 1 && (
              <motion.div
                key={combo.count}
                initial={{ scale: 1.5, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="font-display text-lg font-bold"
                style={{ color: comboColor === 'rainbow' ? '#e8e0d4' : comboColor }}
              >
                ×{combo.count}
                {combo.count >= 3 && <span className="ml-1 text-xs">🔥</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pause button */}
        <button
          onClick={togglePause}
          className="p-1.5 rounded-md transition-colors"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: '#6b6b7b',
          }}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      </div>

      {/* Active Power-ups */}
      <AnimatePresence>
        {activePowerUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2 justify-end mb-2"
          >
            {activePowerUps.map(pu => {
              const pct = (pu.remainingMs / pu.totalMs) * 100;
              const color = POWERUP_COLORS[pu.type];
              return (
                <div
                  key={pu.type}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-display"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}33`,
                  }}
                >
                  <span>{POWERUP_ICONS[pu.type]}</span>
                  <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: `${color}22` }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: color, width: `${pct}%` }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span style={{ color }}>{Math.ceil(pu.remainingMs / 1000)}s</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combo Text Flash */}
      <AnimatePresence>
        {comboText && (
          <motion.div
            key={comboText}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          >
            <div
              className="font-display text-3xl font-black tracking-widest"
              style={{
                color: comboColor === 'rainbow' ? '#fbbf24' : comboColor,
                textShadow: `0 0 20px ${comboColor === 'rainbow' ? '#fbbf24' : comboColor}`,
              }}
            >
              {comboText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-40 cursor-pointer"
            style={{ background: 'rgba(6, 6, 14, 0.8)' }}
            onClick={togglePause}
          >
            <div className="font-display text-4xl font-black tracking-widest" style={{ color: '#e8e0d4' }}>
              {t('hud.paused', language)}
            </div>
            <div className="mt-4 text-sm" style={{ color: '#6b6b7b' }}>
              {t('hud.resumeHint', language)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
