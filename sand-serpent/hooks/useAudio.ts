// ============================================================
// Sand Serpent — Audio Hook
// ============================================================

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { playSfx, startMusic, stopMusic, setSfxVolume, setMusicVolume, initAudio } from '@/lib/audio';
import { useGameStore } from '@/stores/gameStore';
import type { SoundEffect } from '@/lib/types';

export function useAudio() {
  const musicVolume = useGameStore(s => s.musicVolume);
  const sfxVolume = useGameStore(s => s.sfxVolume);
  const screen = useGameStore(s => s.screen);
  const wave = useGameStore(s => s.wave);
  const initRef = useRef(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const init = () => {
      if (!initRef.current) {
        initAudio();
        initRef.current = true;
      }
    };
    window.addEventListener('click', init, { once: true });
    window.addEventListener('keydown', init, { once: true });
    window.addEventListener('touchstart', init, { once: true });
    return () => {
      window.removeEventListener('click', init);
      window.removeEventListener('keydown', init);
      window.removeEventListener('touchstart', init);
    };
  }, []);

  // Update volumes
  useEffect(() => {
    setSfxVolume(sfxVolume);
  }, [sfxVolume]);

  useEffect(() => {
    setMusicVolume(musicVolume);
  }, [musicVolume]);

  // Music management
  useEffect(() => {
    if (screen === 'menu' || screen === 'setup') {
      startMusic(0);
    } else if (screen === 'game') {
      const intensity = Math.min(1, (wave.number - 1) / 15);
      startMusic(intensity);
    } else {
      stopMusic();
    }
    return () => {
      stopMusic();
    };
  }, [screen, wave.number]);

  const play = useCallback((effect: SoundEffect) => {
    if (sfxVolume > 0) playSfx(effect);
  }, [sfxVolume]);

  return { play };
}
