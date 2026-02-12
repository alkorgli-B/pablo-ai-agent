// ============================================================
// Sand Serpent — Splash Screen (Animated Logo Intro)
// ============================================================

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export default function SplashScreen() {
  const setScreen = useGameStore(s => s.setScreen);

  useEffect(() => {
    const timer = setTimeout(() => setScreen('menu'), 3500);
    return () => clearTimeout(timer);
  }, [setScreen]);

  const letters = 'SAND SERPENT'.split('');

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#06060e' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Snake emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
        className="text-7xl mb-8"
      >
        🐍
      </motion.div>

      {/* Title letters */}
      <div className="flex gap-1">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.06, duration: 0.4 }}
            className="font-display text-4xl md:text-5xl font-black tracking-wider"
            style={{
              color: letter === ' ' ? 'transparent' : '#f5b746',
              textShadow: letter === ' ' ? 'none' : '0 0 30px rgba(245, 183, 70, 0.5), 0 0 60px rgba(245, 183, 70, 0.2)',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5 }}
        className="mt-4 text-sm tracking-[0.3em] uppercase"
        style={{ color: '#6b6b7b' }}
      >
        A Desert Adventure
      </motion.div>

      {/* Particle burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(245, 183, 70, 0.3) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
