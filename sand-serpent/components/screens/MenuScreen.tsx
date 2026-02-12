// ============================================================
// Sand Serpent — Main Menu Screen
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { t } from '@/lib/translations';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import BackgroundEffect from '@/components/effects/BackgroundEffect';

export default function MenuScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);
  const highScores = useGameStore(s => s.highScores);
  const musicVolume = useGameStore(s => s.musicVolume);
  const sfxVolume = useGameStore(s => s.sfxVolume);
  const setMusicVolume = useGameStore(s => s.setMusicVolume);
  const setSfxVolume = useGameStore(s => s.setSfxVolume);

  const [showTutorial, setShowTutorial] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <BackgroundEffect />

      {/* Language Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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

      {/* Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative z-10 text-center mb-12"
      >
        <div className="text-5xl mb-4">🐍</div>
        <h1
          className="font-display text-5xl md:text-6xl font-black tracking-wider"
          style={{
            color: '#f5b746',
            textShadow: '0 0 30px rgba(245, 183, 70, 0.4), 0 0 60px rgba(245, 183, 70, 0.15)',
          }}
        >
          {t('game.title', language)}
        </h1>
        {/* Shimmer animation */}
        <motion.div
          animate={{ x: [-200, 400] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            width: 100,
          }}
        />
      </motion.div>

      {/* Menu Buttons */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 w-64"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
        }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="w-full"
        >
          <Button
            onClick={() => setScreen('setup')}
            variant="primary"
            size="lg"
            glow="#f5b746"
            className="w-full"
          >
            {t('menu.play', language)}
          </Button>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="w-full"
        >
          <Button onClick={() => setShowTutorial(true)} className="w-full">
            {t('menu.howToPlay', language)}
          </Button>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="w-full"
        >
          <Button onClick={() => setShowHighScores(true)} className="w-full">
            {t('menu.highScores', language)}
          </Button>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="w-full"
        >
          <Button onClick={() => setShowSettings(true)} className="w-full">
            {t('menu.settings', language)}
          </Button>
        </motion.div>
      </motion.div>

      {/* Tutorial Modal */}
      <Modal isOpen={showTutorial} onClose={() => setShowTutorial(false)} title={t('tutorial.title', language)}>
        <div className="space-y-4">
          {[
            { icon: '🕹️', text: t('tutorial.move', language) },
            { icon: '🍎', text: t('tutorial.eat', language) },
            { icon: '💀', text: t('tutorial.avoid', language) },
            { icon: '⚡', text: t('tutorial.powerups', language) },
            { icon: '🔥', text: t('tutorial.combo', language) },
            { icon: '⏸', text: t('tutorial.pause', language) },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl">{item.icon}</span>
              <span style={{ color: '#e8e0d4' }}>{item.text}</span>
            </motion.div>
          ))}
          <div className="pt-4">
            <Button onClick={() => setShowTutorial(false)} variant="primary" className="w-full">
              {t('tutorial.close', language)}
            </Button>
          </div>
        </div>
      </Modal>

      {/* High Scores Modal */}
      <Modal isOpen={showHighScores} onClose={() => setShowHighScores(false)} title={t('highscores.title', language)}>
        {highScores.length === 0 ? (
          <p style={{ color: '#6b6b7b' }}>{t('highscores.empty', language)}</p>
        ) : (
          <div className="space-y-2">
            {highScores.map((hs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg" style={{ color: i === 0 ? '#f5b746' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : '#6b6b7b' }}>
                    #{i + 1}
                  </span>
                  <span style={{ color: '#e8e0d4' }}>{hs.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display" style={{ color: '#f5b746' }}>
                    {hs.score.toLocaleString()}
                  </span>
                  <span className="text-xs" style={{ color: '#6b6b7b' }}>W{hs.wave}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="pt-4">
          <Button onClick={() => setShowHighScores(false)} variant="ghost" className="w-full">
            {t('highscores.close', language)}
          </Button>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title={t('settings.title', language)}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6b6b7b' }}>
              {t('settings.music', language)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={e => setMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6b6b7b' }}>
              {t('settings.sfx', language)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={e => setSfxVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#6b6b7b' }}>
              {t('settings.language', language)}
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setLanguage('en')}
                variant={language === 'en' ? 'primary' : 'ghost'}
                size="sm"
              >
                English
              </Button>
              <Button
                onClick={() => setLanguage('ar')}
                variant={language === 'ar' ? 'primary' : 'ghost'}
                size="sm"
              >
                العربية
              </Button>
            </div>
          </div>
          <Button onClick={() => setShowSettings(false)} variant="ghost" className="w-full">
            {t('settings.close', language)}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
