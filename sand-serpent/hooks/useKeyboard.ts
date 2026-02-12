// ============================================================
// Sand Serpent — Keyboard Input Hook
// ============================================================

'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { Direction } from '@/lib/types';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

export function useKeyboard() {
  const changeDirection = useGameStore(s => s.changeDirection);
  const togglePause = useGameStore(s => s.togglePause);
  const screen = useGameStore(s => s.screen);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'game') return;

      const dir = KEY_MAP[e.key];
      if (dir) {
        e.preventDefault();
        changeDirection(dir);
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [changeDirection, togglePause, screen]);
}
