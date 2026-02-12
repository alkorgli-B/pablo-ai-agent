// ============================================================
// Sand Serpent — Game Canvas (Premium Snake Rendering)
// ============================================================

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import {
  SNAKE_COLORS,
  POWERUP_COLORS,
  SNAKE_BODY_WAVE_AMPLITUDE,
  SNAKE_BODY_WAVE_FREQUENCY,
  SNAKE_TONGUE_INTERVAL,
  FOOD_BOB_SPEED,
  FOOD_BOB_AMPLITUDE,
} from '@/lib/constants';
import type { Direction, Food, Obstacle, Particle, Position, PowerUp, Snake, SnakeColor } from '@/lib/types';

interface GameCanvasProps {
  width: number;
  height: number;
}

export default function GameCanvas({ width, height }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const snake = useGameStore(s => s.snake);
  const foods = useGameStore(s => s.foods);
  const powerUps = useGameStore(s => s.powerUps);
  const activePowerUps = useGameStore(s => s.activePowerUps);
  const particles = useGameStore(s => s.particles);
  const obstacles = useGameStore(s => s.obstacles);
  const gridSize = useGameStore(s => s.gridSize);
  const snakeColor = useGameStore(s => s.snakeColor);
  const screenShake = useGameStore(s => s.screenShake);
  const wave = useGameStore(s => s.wave);
  const isPaused = useGameStore(s => s.isPaused);

  const cellSize = width / gridSize;

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    // Background
    ctx.fillStyle = '#06060e';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(width, pos);
      ctx.stroke();
    }

    // Vignette effect
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.3,
      width / 2, height / 2, width * 0.7
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Sand particles for sandstorm waves
    if (wave.sandParticles) {
      ctx.fillStyle = 'rgba(245, 183, 70, 0.05)';
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.001 + i * 1.7) * 0.5 + 0.5) * width;
        const y = (Math.cos(time * 0.0008 + i * 2.3) * 0.5 + 0.5) * height;
        ctx.beginPath();
        ctx.arc(x, y, 1 + Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [width, height, gridSize, cellSize, wave.sandParticles]);

  const drawBorder = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const colors = SNAKE_COLORS[snakeColor];
    const pulse = Math.sin(time * 0.003) * 0.3 + 0.7;

    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = pulse * 0.6;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Glow
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 10 * pulse;
    ctx.strokeRect(0, 0, width, height);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }, [snakeColor, width, height]);

  const drawObstacles = useCallback((ctx: CanvasRenderingContext2D, obstacles: Obstacle[], time: number) => {
    obstacles.forEach(obs => {
      const x = obs.pos.x * cellSize;
      const y = obs.pos.y * cellSize;
      const pulse = Math.sin(time * 0.004) * 0.1 + 0.9;

      ctx.fillStyle = `rgba(139, 92, 246, ${0.6 * pulse})`;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 6;

      const r = cellSize * 0.15;
      const s = cellSize * 0.9;
      const ox = x + cellSize * 0.05;
      const oy = y + cellSize * 0.05;
      ctx.beginPath();
      ctx.moveTo(ox + r, oy);
      ctx.lineTo(ox + s - r, oy);
      ctx.quadraticCurveTo(ox + s, oy, ox + s, oy + r);
      ctx.lineTo(ox + s, oy + s - r);
      ctx.quadraticCurveTo(ox + s, oy + s, ox + s - r, oy + s);
      ctx.lineTo(ox + r, oy + s);
      ctx.quadraticCurveTo(ox, oy + s, ox, oy + s - r);
      ctx.lineTo(ox, oy + r);
      ctx.quadraticCurveTo(ox, oy, ox + r, oy);
      ctx.fill();

      // Cross pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + cellSize * 0.3, y + cellSize * 0.3);
      ctx.lineTo(x + cellSize * 0.7, y + cellSize * 0.7);
      ctx.moveTo(x + cellSize * 0.7, y + cellSize * 0.3);
      ctx.lineTo(x + cellSize * 0.3, y + cellSize * 0.7);
      ctx.stroke();

      ctx.shadowBlur = 0;
    });
  }, [cellSize]);

  const drawFood = useCallback((ctx: CanvasRenderingContext2D, foods: Food[], time: number) => {
    foods.forEach(food => {
      const x = food.pos.x * cellSize + cellSize / 2;
      const bobY = Math.sin(time * FOOD_BOB_SPEED + food.bobOffset) * FOOD_BOB_AMPLITUDE;
      const y = food.pos.y * cellSize + cellSize / 2 + bobY;
      const r = cellSize * 0.35;

      if (food.type === 'regular') {
        // Red glow underneath
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (food.type === 'golden') {
        const spin = time * 0.005;
        const sparkle = Math.sin(spin * 3) * 0.3 + 0.7;

        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15 * sparkle;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        // Star shape
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI * 2 * i) / 10 + spin;
          const rad = i % 2 === 0 ? r * 1.2 : r * 0.6;
          const sx = x + Math.cos(angle) * rad;
          const sy = y + Math.sin(angle) * rad;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Sparkle trails
        for (let i = 0; i < 3; i++) {
          const sa = spin * 2 + i * 2.1;
          const sx = x + Math.cos(sa) * r * 1.5;
          const sy = y + Math.sin(sa) * r * 1.5;
          ctx.fillStyle = `rgba(251, 191, 36, ${0.5 * sparkle})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (food.type === 'poison') {
        // Smoke effect
        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        for (let i = 0; i < 3; i++) {
          const sa = time * 0.002 + i * 2;
          const sx = x + Math.cos(sa) * r * 0.5;
          const sy = y + Math.sin(sa) * r * 0.8 - r * 0.3;
          ctx.beginPath();
          ctx.arc(sx, sy, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowColor = '#7c3aed';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#6d28d9';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Skull
        ctx.fillStyle = '#ddd6fe';
        ctx.font = `${cellSize * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☠', x, y);
      }
    });
  }, [cellSize]);

  const drawPowerUps = useCallback((ctx: CanvasRenderingContext2D, powerUps: PowerUp[], time: number) => {
    powerUps.forEach(pu => {
      const x = pu.pos.x * cellSize + cellSize / 2;
      const bobY = Math.sin(time * 0.004 + pu.pos.x) * 3;
      const y = pu.pos.y * cellSize + cellSize / 2 + bobY;
      const r = cellSize * 0.4;
      const color = POWERUP_COLORS[pu.type];
      const rotation = time * 0.003;

      // Aura
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 + Math.sin(time * 0.005) * 4;
      ctx.fillStyle = color + '33';
      ctx.beginPath();
      ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Icon background
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Icon
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = '#fff';
      ctx.font = `${cellSize * 0.45}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icons: Record<string, string> = {
        speed: '⚡', shield: '🛡️', double: '💎',
        magnet: '🧲', fire: '🔥', freeze: '❄️',
      };
      ctx.fillText(icons[pu.type] || '?', 0, 0);
      ctx.restore();
    });
  }, [cellSize]);

  const drawSnake = useCallback((ctx: CanvasRenderingContext2D, snake: Snake, color: SnakeColor, time: number) => {
    const colors = SNAKE_COLORS[color];
    const segments = snake.segments;
    const len = segments.length;
    if (len === 0) return;

    const hasSpeedBoost = activePowerUps.some(p => p.type === 'speed');

    // Ghost trail for speed boost
    if (hasSpeedBoost && len > 2) {
      ctx.globalAlpha = 0.15;
      for (let t = 1; t <= 3; t++) {
        segments.forEach((seg, i) => {
          if (i === 0) return;
          const x = seg.pos.x * cellSize + cellSize / 2 - t * 2;
          const y = seg.pos.y * cellSize + cellSize / 2 - t * 1;
          const segSize = cellSize * 0.42 * (1 - i / len * 0.3);
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(x, y, segSize, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.globalAlpha = 1;
    }

    // Fire mode: translucent body
    if (snake.fireActive) {
      ctx.globalAlpha = 0.6;
    }

    // Body segments (back to front, skip head)
    for (let i = len - 1; i >= 1; i--) {
      const seg = segments[i];
      const progress = i / len;

      // Sinusoidal wave offset
      const waveOffset = Math.sin(time * SNAKE_BODY_WAVE_FREQUENCY * 0.01 + i * 0.5) * SNAKE_BODY_WAVE_AMPLITUDE * cellSize;

      const x = seg.pos.x * cellSize + cellSize / 2 + (snake.direction === 'UP' || snake.direction === 'DOWN' ? waveOffset : 0);
      const y = seg.pos.y * cellSize + cellSize / 2 + (snake.direction === 'LEFT' || snake.direction === 'RIGHT' ? waveOffset : 0);

      // Size tapers toward tail
      const sizeMultiplier = 1 - progress * 0.35;
      const segSize = cellSize * 0.43 * sizeMultiplier;

      // Color gradient from head to tail
      const r1 = parseInt(colors.primary.slice(1, 3), 16);
      const g1 = parseInt(colors.primary.slice(3, 5), 16);
      const b1 = parseInt(colors.primary.slice(5, 7), 16);
      const r2 = parseInt(colors.dark.slice(1, 3), 16);
      const g2 = parseInt(colors.dark.slice(3, 5), 16);
      const b2 = parseInt(colors.dark.slice(5, 7), 16);

      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);

      // Tail transparency
      const alpha = i >= len - 2 ? 0.7 : 1;
      ctx.globalAlpha = (snake.fireActive ? 0.6 : 1) * alpha;

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.arc(x, y, segSize, 0, Math.PI * 2);
      ctx.fill();

      // Scale pattern every 4th segment
      if (i % 4 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-segSize * 0.3, -segSize * 0.3, segSize * 0.6, segSize * 0.6);
        ctx.restore();
      }

      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;

    // Head
    const head = segments[0];
    const hx = head.pos.x * cellSize + cellSize / 2;
    const hy = head.pos.y * cellSize + cellSize / 2;
    const headSize = cellSize * 0.48;

    // Head glow
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 8;

    // Head shape (rounded rect)
    const headGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, headSize);
    headGrad.addColorStop(0, colors.light);
    headGrad.addColorStop(1, colors.primary);
    ctx.fillStyle = headGrad;

    const hw = headSize * 0.9;
    const hh = headSize * 0.9;
    const hr = headSize * 0.3;
    ctx.beginPath();
    ctx.moveTo(hx - hw + hr, hy - hh);
    ctx.lineTo(hx + hw - hr, hy - hh);
    ctx.quadraticCurveTo(hx + hw, hy - hh, hx + hw, hy - hh + hr);
    ctx.lineTo(hx + hw, hy + hh - hr);
    ctx.quadraticCurveTo(hx + hw, hy + hh, hx + hw - hr, hy + hh);
    ctx.lineTo(hx - hw + hr, hy + hh);
    ctx.quadraticCurveTo(hx - hw, hy + hh, hx - hw, hy + hh - hr);
    ctx.lineTo(hx - hw, hy - hh + hr);
    ctx.quadraticCurveTo(hx - hw, hy - hh, hx - hw + hr, hy - hh);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Shield aura
    if (snake.shieldActive) {
      ctx.strokeStyle = '#60a5fa88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 10;
      // Hexagonal aura
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 + time * 0.002;
        const px = hx + Math.cos(angle) * headSize * 1.4;
        const py = hy + Math.sin(angle) * headSize * 1.4;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Fire particles
    if (snake.fireActive) {
      for (let i = 0; i < 4; i++) {
        const fa = time * 0.01 + i * 1.5;
        const fx = hx + Math.cos(fa) * headSize * 0.8;
        const fy = hy + Math.sin(fa) * headSize * 0.8 - headSize * 0.3;
        const fAlpha = Math.sin(time * 0.008 + i) * 0.3 + 0.5;
        ctx.fillStyle = `rgba(239, 68, 68, ${fAlpha})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 2 + Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Eyes
    const eyeOffsetX = snake.direction === 'LEFT' ? -headSize * 0.25 : snake.direction === 'RIGHT' ? headSize * 0.25 : 0;
    const eyeOffsetY = snake.direction === 'UP' ? -headSize * 0.25 : snake.direction === 'DOWN' ? headSize * 0.25 : 0;

    const eyeSpacing = headSize * 0.35;
    let leftEyeX: number, leftEyeY: number, rightEyeX: number, rightEyeY: number;

    if (snake.direction === 'UP' || snake.direction === 'DOWN') {
      leftEyeX = hx - eyeSpacing;
      leftEyeY = hy + eyeOffsetY;
      rightEyeX = hx + eyeSpacing;
      rightEyeY = hy + eyeOffsetY;
    } else {
      leftEyeX = hx + eyeOffsetX;
      leftEyeY = hy - eyeSpacing;
      rightEyeX = hx + eyeOffsetX;
      rightEyeY = hy + eyeSpacing;
    }

    const eyeSize = headSize * 0.22;
    const pupilSize = eyeSize * 0.55;

    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (look in direction)
    const pupilOffX = eyeOffsetX * 0.5;
    const pupilOffY = eyeOffsetY * 0.5;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(leftEyeX + pupilOffX, leftEyeY + pupilOffY, pupilSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX + pupilOffX, rightEyeY + pupilOffY, pupilSize, 0, Math.PI * 2);
    ctx.fill();

    // Tongue
    const tonguePhase = snake.tongueTimer / SNAKE_TONGUE_INTERVAL;
    if (tonguePhase < 0.15) {
      const tongueLen = cellSize * 0.5 * (tonguePhase / 0.15);
      const dir = snake.direction;
      const tStartX = hx + (dir === 'RIGHT' ? headSize * 0.8 : dir === 'LEFT' ? -headSize * 0.8 : 0);
      const tStartY = hy + (dir === 'DOWN' ? headSize * 0.8 : dir === 'UP' ? -headSize * 0.8 : 0);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tStartX, tStartY);

      if (dir === 'RIGHT' || dir === 'LEFT') {
        const dx = dir === 'RIGHT' ? tongueLen : -tongueLen;
        ctx.lineTo(tStartX + dx, tStartY);
        ctx.lineTo(tStartX + dx * 1.2, tStartY - 3);
        ctx.moveTo(tStartX + dx, tStartY);
        ctx.lineTo(tStartX + dx * 1.2, tStartY + 3);
      } else {
        const dy = dir === 'DOWN' ? tongueLen : -tongueLen;
        ctx.lineTo(tStartX, tStartY + dy);
        ctx.lineTo(tStartX - 3, tStartY + dy * 1.2);
        ctx.moveTo(tStartX, tStartY + dy);
        ctx.lineTo(tStartX + 3, tStartY + dy * 1.2);
      }
      ctx.stroke();
    }
  }, [cellSize, activePowerUps]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha * p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const time = Date.now();
      timeRef.current = time;

      ctx.save();

      // Screen shake
      if (screenShake.intensity > 0 && screenShake.duration > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake.intensity;
        const shakeY = (Math.random() - 0.5) * screenShake.intensity;
        ctx.translate(shakeX, shakeY);
      }

      // Freeze tint
      const hasFreeze = activePowerUps.some(p => p.type === 'freeze');

      drawGrid(ctx, time);
      drawBorder(ctx, time);
      drawObstacles(ctx, obstacles, time);
      drawFood(ctx, foods, time);
      drawPowerUps(ctx, powerUps, time);
      drawSnake(ctx, snake, snakeColor, time);
      drawParticles(ctx, particles);

      // Freeze overlay
      if (hasFreeze) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.05)';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [
    snake, foods, powerUps, activePowerUps, particles, obstacles,
    gridSize, snakeColor, screenShake, wave, isPaused, width, height,
    drawGrid, drawBorder, drawObstacles, drawFood, drawPowerUps, drawSnake, drawParticles,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      style={{ imageRendering: 'auto' }}
    />
  );
}
