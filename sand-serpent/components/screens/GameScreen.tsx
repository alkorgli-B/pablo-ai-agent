// ============================================================
// Sand Serpent — Game Screen (Main Gameplay)
// ============================================================

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTouch } from '@/hooks/useTouch';
import { useAudio } from '@/hooks/useAudio';
import { t } from '@/lib/translations';
import { CANVAS_DESKTOP, CANVAS_MOBILE_PADDING, CANVAS_TABLET_PADDING } from '@/lib/constants';
import GameCanvas from '@/components/game/GameCanvas';
import GameHUD from '@/components/game/GameHUD';
import DPad from '@/components/game/DPad';

export default function GameScreen() {
  const language = useGameStore(s => s.language);
  const wave = useGameStore(s => s.wave);
  const isPaused = useGameStore(s => s.isPaused);
  const [canvasSize, setCanvasSize] = useState(CANVAS_DESKTOP);
  const [showWave, setShowWave] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastWaveRef = useRef(wave.number);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const { play } = useAudio();

  // Hooks
  useGameLoop();
  useKeyboard();
  useTouch();

  // Responsive canvas
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCanvasSize(w - CANVAS_MOBILE_PADDING * 2);
      } else if (w < 1024) {
        setCanvasSize(Math.min(w - CANVAS_TABLET_PADDING * 2, CANVAS_DESKTOP));
      } else {
        setCanvasSize(CANVAS_DESKTOP);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Update cellSize in store
  const gridSize = useGameStore(s => s.gridSize);
  useEffect(() => {
    useGameStore.setState({ cellSize: canvasSize / gridSize });
  }, [canvasSize, gridSize]);

  // Countdown
  useEffect(() => {
    if (gameStarted) return;
    if (countdown <= 0) {
      setGameStarted(true);
      return;
    }
    play('countdown');
    const timer = setTimeout(() => setCountdown(c => c - 1), 800);
    return () => clearTimeout(timer);
  }, [countdown, gameStarted, play]);

  // Wave transitions
  useEffect(() => {
    if (wave.number !== lastWaveRef.current && wave.number > 1) {
      lastWaveRef.current = wave.number;
      play('wave_start');
      setShowWave(true);
      useGameStore.setState({ isPaused: true, isTransitioning: true });
      const timer = setTimeout(() => {
        setShowWave(false);
        useGameStore.setState({ isPaused: false, isTransitioning: false });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [wave.number, play]);

  // Track combo for SFX
  const combo = useGameStore(s => s.combo);
  const prevComboRef = useRef(combo.count);
  useEffect(() => {
    if (combo.count >= 5 && prevComboRef.current < 5) {
      play('combo_x5');
    }
    if (combo.count === 0 && prevComboRef.current >= 3) {
      play('combo_break');
    }
    prevComboRef.current = combo.count;
  }, [combo.count, play]);

  // Track food eating for SFX
  const stats = useGameStore(s => s.stats);
  const prevFoodRef = useRef(stats.foodEaten);
  const prevGoldenRef = useRef(stats.goldenFoodEaten);
  const prevPoisonRef = useRef(stats.poisonFoodEaten);
  const prevPowerupRef = useRef(stats.powerupsCollected);
  useEffect(() => {
    if (stats.foodEaten > prevFoodRef.current) play('eat_food');
    prevFoodRef.current = stats.foodEaten;
  }, [stats.foodEaten, play]);
  useEffect(() => {
    if (stats.goldenFoodEaten > prevGoldenRef.current) play('eat_golden');
    prevGoldenRef.current = stats.goldenFoodEaten;
  }, [stats.goldenFoodEaten, play]);
  useEffect(() => {
    if (stats.poisonFoodEaten > prevPoisonRef.current) play('eat_poison');
    prevPoisonRef.current = stats.poisonFoodEaten;
  }, [stats.poisonFoodEaten, play]);
  useEffect(() => {
    if (stats.powerupsCollected > prevPowerupRef.current) play('powerup_get');
    prevPowerupRef.current = stats.powerupsCollected;
  }, [stats.powerupsCollected, play]);

  // Death SFX
  const alive = useGameStore(s => s.snake.alive);
  const prevAliveRef = useRef(alive);
  useEffect(() => {
    if (!alive && prevAliveRef.current) {
      play('wall_hit');
      setTimeout(() => play('game_over'), 500);
    }
    prevAliveRef.current = alive;
  }, [alive, play]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: '#06060e' }}
    >
      {/* Countdown */}
      <AnimatePresence>
        {!gameStarted && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(6, 6, 14, 0.9)' }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="font-display text-8xl font-black"
              style={{ color: countdown === 0 ? '#34d399' : '#f5b746' }}
            >
              {countdown === 0 ? t('misc.go', language) : countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave Transition */}
      <AnimatePresence>
        {showWave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: 'rgba(6, 6, 14, 0.85)' }}
          >
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="font-display text-5xl font-black"
              style={{ color: '#f5b746' }}
            >
              {t('hud.wave', language)} {wave.number}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-xl font-display"
              style={{ color: '#e8e0d4' }}
            >
              {language === 'ar' ? wave.nameAr : wave.name}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      <div className="relative flex flex-col items-center w-full max-w-[700px] px-2">
        <div style={{ width: canvasSize }}>
          <GameHUD />
        </div>
        <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
          <GameCanvas width={canvasSize} height={canvasSize} />
        </div>
        {isMobile && <DPad />}
      </div>
    </div>
  );
}
