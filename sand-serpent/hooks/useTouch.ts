// ============================================================
// Sand Serpent — Touch/Swipe Input Hook
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { Direction } from '@/lib/types';

const SWIPE_THRESHOLD = 30;

export function useTouch() {
  const changeDirection = useGameStore(s => s.changeDirection);
  const screen = useGameStore(s => s.screen);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (screen !== 'game') return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!startRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startRef.current.x;
      const dy = touch.clientY - startRef.current.y;

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

      let dir: Direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        dir = dy > 0 ? 'DOWN' : 'UP';
      }
      changeDirection(dir);
      startRef.current = null;

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [changeDirection, screen]);
}
