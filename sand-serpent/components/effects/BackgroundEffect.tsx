// ============================================================
// Sand Serpent — Animated Background Effect
// ============================================================

'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.3,
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.3,
        hue: 35 + Math.random() * 15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aurora effect
      const time = Date.now() * 0.0005;
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height * 0.7);
        const hue = 35 + i * 10 + Math.sin(time + i) * 10;
        gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, ${0.02 + Math.sin(time + i * 2) * 0.01})`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const centerX = canvas.width * (0.3 + i * 0.2) + Math.sin(time * 0.7 + i) * 100;
        ctx.ellipse(centerX, canvas.height * 0.5, 300, 200, Math.sin(time + i) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
