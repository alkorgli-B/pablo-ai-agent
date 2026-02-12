// ============================================================
// Sand Serpent — Animated Button Component
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { playSfx } from '@/lib/audio';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: string;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  glow,
  className = '',
  disabled = false,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #f5b746, #d97706)',
      color: '#06060e',
      border: 'none',
      fontWeight: 700,
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#e8e0d4',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    ghost: {
      background: 'transparent',
      color: '#6b6b7b',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        if (disabled) return;
        try { playSfx('button_click'); } catch {}
        onClick?.();
      }}
      onHoverStart={() => {
        try { playSfx('button_hover'); } catch {}
      }}
      disabled={disabled}
      className={`font-display rounded-xl transition-all duration-200 ${sizeClasses[size]} ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        ...variantStyles[variant],
        boxShadow: glow ? `0 0 20px ${glow}44, 0 0 40px ${glow}22` : undefined,
      }}
    >
      {children}
    </motion.button>
  );
}
