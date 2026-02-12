// ============================================================
// Sand Serpent — Game Loop Hook (requestAnimationFrame)
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useGameLoop() {
  const rafRef = useRef<number>(0);
  const gameLoop = useGameStore(s => s.gameLoop);
  const screen = useGameStore(s => s.screen);
  const isPaused = useGameStore(s => s.isPaused);
  const alive = useGameStore(s => s.snake.alive);

  useEffect(() => {
    if (screen !== 'game' || isPaused || !alive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const loop = (timestamp: number) => {
      gameLoop(timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [screen, isPaused, alive, gameLoop]);
}
