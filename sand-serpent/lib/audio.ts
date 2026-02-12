// ============================================================
// Sand Serpent — Audio System (Web Audio API Synthesized)
// ============================================================

import type { SoundEffect } from './types';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicOscillators: OscillatorNode[] = [];
let musicPlaying = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(audioCtx.destination);

    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.8;
    sfxGain.connect(masterGain);

    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.3;
    musicGain.connect(masterGain);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSfxVolume(vol: number) {
  if (sfxGain) sfxGain.gain.value = vol;
}

export function setMusicVolume(vol: number) {
  if (musicGain) musicGain.gain.value = vol * 0.4;
}

function playNote(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3, detune = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(sfxGain!);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, volume = 0.2, filterFreq = 1000) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain!);

  source.start(ctx.currentTime);
}

export function playSfx(effect: SoundEffect) {
  try {
    switch (effect) {
      case 'eat_food':
        playNote(600, 0.1, 'sine', 0.25);
        playNote(800, 0.08, 'sine', 0.2);
        break;

      case 'eat_golden':
        playNote(523, 0.12, 'sine', 0.3);
        setTimeout(() => playNote(659, 0.12, 'sine', 0.3), 60);
        setTimeout(() => playNote(784, 0.2, 'sine', 0.35), 120);
        break;

      case 'eat_poison':
        playNote(200, 0.3, 'sawtooth', 0.2);
        playNote(100, 0.4, 'sawtooth', 0.15);
        break;

      case 'powerup_get':
        for (let i = 0; i < 4; i++) {
          setTimeout(() => playNote(400 + i * 150, 0.15, 'sine', 0.2), i * 50);
        }
        break;

      case 'powerup_end':
        for (let i = 0; i < 3; i++) {
          setTimeout(() => playNote(800 - i * 150, 0.15, 'sine', 0.15), i * 60);
        }
        break;

      case 'shield_break':
        playNoise(0.3, 0.3, 3000);
        playNote(300, 0.2, 'sawtooth', 0.2);
        playNote(150, 0.3, 'sawtooth', 0.15);
        break;

      case 'combo_x5':
        playNoise(0.05, 0.15, 5000);
        playNote(880, 0.1, 'square', 0.15);
        playNote(1100, 0.1, 'square', 0.15);
        break;

      case 'combo_break':
        playNote(400, 0.15, 'sine', 0.2);
        setTimeout(() => playNote(300, 0.15, 'sine', 0.18), 100);
        setTimeout(() => playNote(200, 0.3, 'sine', 0.15), 200);
        break;

      case 'wall_hit':
        playNoise(0.2, 0.3, 200);
        playNote(80, 0.3, 'sine', 0.3);
        break;

      case 'game_over':
        playNote(400, 0.3, 'sawtooth', 0.2);
        setTimeout(() => playNote(350, 0.3, 'sawtooth', 0.18), 200);
        setTimeout(() => playNote(300, 0.3, 'sawtooth', 0.16), 400);
        setTimeout(() => playNote(200, 0.6, 'sawtooth', 0.2), 600);
        break;

      case 'new_record':
        const notes = [523, 659, 784, 1047];
        notes.forEach((n, i) => {
          setTimeout(() => playNote(n, 0.2, 'sine', 0.25), i * 100);
        });
        setTimeout(() => {
          playNote(1047, 0.5, 'sine', 0.3);
          playNote(784, 0.5, 'sine', 0.2);
          playNote(523, 0.5, 'sine', 0.15);
        }, 500);
        break;

      case 'wave_start':
        playNoise(0.1, 0.25, 300);
        playNote(100, 0.4, 'sine', 0.3);
        setTimeout(() => playNote(200, 0.2, 'sine', 0.25), 100);
        break;

      case 'button_click':
        playNote(800, 0.05, 'sine', 0.15);
        break;

      case 'button_hover':
        playNote(600, 0.03, 'sine', 0.08);
        break;

      case 'snake_turn':
        playNoise(0.03, 0.05, 4000);
        break;

      case 'countdown':
        playNote(440, 0.1, 'sine', 0.2);
        break;
    }
  } catch {
    // Audio not available
  }
}

// ---- Procedural Music ----

export function startMusic(intensity: number = 0) {
  if (musicPlaying) stopMusic();

  try {
    const ctx = getCtx();
    musicPlaying = true;

    // Base pad
    const padNotes = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    padNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.04;

      // Slow LFO for movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2 + i * 0.1;
      lfoGain.gain.value = 0.01;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      osc.connect(gain);
      gain.connect(musicGain!);
      osc.start();

      musicOscillators.push(osc, lfo);
    });

    // Sub bass
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.value = 65.41; // C2
    subGain.gain.value = 0.05;
    subOsc.connect(subGain);
    subGain.connect(musicGain!);
    subOsc.start();
    musicOscillators.push(subOsc);

    // Higher intensity adds more elements
    if (intensity > 0.3) {
      const hiOsc = ctx.createOscillator();
      const hiGain = ctx.createGain();
      hiOsc.type = 'triangle';
      hiOsc.frequency.value = 523.25; // C5
      hiGain.gain.value = 0.015;

      const hiLfo = ctx.createOscillator();
      const hiLfoGain = ctx.createGain();
      hiLfo.frequency.value = 0.5;
      hiLfoGain.gain.value = 0.008;
      hiLfo.connect(hiLfoGain);
      hiLfoGain.connect(hiGain.gain);
      hiLfo.start();

      hiOsc.connect(hiGain);
      hiGain.connect(musicGain!);
      hiOsc.start();
      musicOscillators.push(hiOsc, hiLfo);
    }
  } catch {
    // Audio not available
  }
}

export function stopMusic() {
  musicPlaying = false;
  musicOscillators.forEach(osc => {
    try { osc.stop(); } catch {}
  });
  musicOscillators = [];
}

export function initAudio() {
  getCtx();
}
