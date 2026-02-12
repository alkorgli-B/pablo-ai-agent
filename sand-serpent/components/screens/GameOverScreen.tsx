// ============================================================
// Sand Serpent — Game Over Screen
// ============================================================

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { t } from '@/lib/translations';
import { SCORE_RATINGS } from '@/lib/constants';
import { useAudio } from '@/hooks/useAudio';
import Button from '@/components/ui/Button';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRatingForScore(score: number) {
  let result = SCORE_RATINGS[0];
  for (const r of SCORE_RATINGS) {
    if (score >= r.min) result = r;
  }
  return result;
}

export default function GameOverScreen() {
  const stats = useGameStore(s => s.stats);
  const playerName = useGameStore(s => s.playerName);
  const snakeColor = useGameStore(s => s.snakeColor);
  const language = useGameStore(s => s.language);
  const setScreen = useGameStore(s => s.setScreen);
  const startGame = useGameStore(s => s.startGame);
  const addHighScore = useGameStore(s => s.addHighScore);
  const isNewHighScore = useGameStore(s => s.isNewHighScore);
  const setLanguage = useGameStore(s => s.setLanguage);

  const { play } = useAudio();
  const [displayScore, setDisplayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const savedRef = useRef(false);

  const isHighScore = isNewHighScore(stats.score);
  const rating = getRatingForScore(stats.score);
  const isRtl = language === 'ar';

  // Save high score
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    if (isHighScore) {
      addHighScore({
        name: playerName || 'Player',
        score: stats.score,
        date: new Date().toISOString(),
        color: snakeColor,
        wave: stats.waveReached,
        length: stats.length,
      });
      play('new_record');
      setShowConfetti(true);
    }
  }, []);

  // Score counting animation
  useEffect(() => {
    if (stats.score === 0) return;
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplayScore(Math.floor(stats.score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [stats.score]);

  const handleShare = () => {
    const text = t('share.text', language, {
      score: stats.score,
      wave: stats.waveReached,
      combo: stats.maxCombo,
      rating: language === 'ar' ? rating.titleAr : rating.title,
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statItems = [
    { label: t('gameover.score', language), value: displayScore.toLocaleString(), highlight: true },
    { label: t('gameover.length', language), value: stats.length },
    { label: t('gameover.maxCombo', language), value: `×${stats.maxCombo}` },
    { label: t('gameover.timeSurvived', language), value: formatTime(stats.timeSurvived) },
    { label: t('gameover.foodEaten', language), value: stats.foodEaten },
    { label: t('gameover.powerups', language), value: stats.powerupsCollected },
    { label: t('gameover.waveReached', language), value: stats.waveReached },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto py-8"
      style={{ background: '#06060e' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
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

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 0.5],
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 2, delay: Math.random() * 0.5 }}
              className="absolute rounded-sm"
              style={{
                width: 8,
                height: 8,
                background: ['#f5b746', '#ef4444', '#34d399', '#60a5fa', '#a78bfa', '#fb7185'][i % 6],
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Title */}
        <motion.h1
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="font-display text-4xl font-black text-center mb-2"
          style={{ color: '#e8e0d4' }}
        >
          {t('gameover.title', language)}
        </motion.h1>

        {/* New High Score */}
        {isHighScore && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-center mb-4"
          >
            <span className="font-display text-xl font-bold" style={{
              color: '#f5b746',
              textShadow: '0 0 20px rgba(245, 183, 70, 0.5)',
            }}>
              🏆 {t('gameover.newHighScore', language)} 🏆
            </span>
          </motion.div>
        )}

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-6"
        >
          <span className="text-3xl">{rating.icon}</span>
          <div className="font-display text-lg mt-1" style={{ color: '#f5b746' }}>
            {language === 'ar' ? rating.titleAr : rating.title}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="space-y-2 mb-8">
          {statItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex justify-between items-center py-2 px-4 rounded-lg"
              style={{
                background: item.highlight ? 'rgba(245, 183, 70, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: item.highlight ? '1px solid rgba(245, 183, 70, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <span style={{ color: '#6b6b7b' }}>{item.label}</span>
              <span className="font-display font-bold" style={{ color: item.highlight ? '#f5b746' : '#e8e0d4' }}>
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="flex flex-col gap-3"
        >
          <Button onClick={startGame} variant="primary" size="lg" glow="#f5b746" className="w-full">
            {t('gameover.playAgain', language)}
          </Button>
          <div className="flex gap-3">
            <Button onClick={() => setScreen('menu')} className="flex-1">
              {t('gameover.menu', language)}
            </Button>
            <Button onClick={handleShare} className="flex-1">
              {copied ? t('gameover.copied', language) : t('gameover.shareScore', language)}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
