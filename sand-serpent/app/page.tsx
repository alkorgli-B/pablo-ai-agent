// ============================================================
// Sand Serpent — Main Page
// ============================================================

'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import SplashScreen from '@/components/screens/SplashScreen';
import MenuScreen from '@/components/screens/MenuScreen';
import SetupScreen from '@/components/screens/SetupScreen';
import GameScreen from '@/components/screens/GameScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';

export default function Home() {
  const screen = useGameStore(s => s.screen);
  const loadPersisted = useGameStore(s => s.loadPersisted);

  useEffect(() => {
    loadPersisted();
  }, [loadPersisted]);

  return (
    <main className="w-screen h-screen" style={{ background: '#06060e' }}>
      <AnimatePresence mode="wait">
        {screen === 'splash' && <SplashScreen key="splash" />}
        {screen === 'menu' && <MenuScreen key="menu" />}
        {screen === 'setup' && <SetupScreen key="setup" />}
        {screen === 'game' && <GameScreen key="game" />}
        {screen === 'gameover' && <GameOverScreen key="gameover" />}
      </AnimatePresence>
    </main>
  );
}
