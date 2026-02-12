// ============================================================
// Sand Serpent — Mobile D-Pad Controls
// ============================================================

'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { Direction } from '@/lib/types';

export default function DPad() {
  const changeDirection = useGameStore(s => s.changeDirection);
  const togglePause = useGameStore(s => s.togglePause);

  const handlePress = useCallback((dir: Direction) => {
    changeDirection(dir);
    if (navigator.vibrate) navigator.vibrate(10);
  }, [changeDirection]);

  const handlePause = useCallback(() => {
    togglePause();
    if (navigator.vibrate) navigator.vibrate(10);
  }, [togglePause]);

  const btnClass = "flex items-center justify-center select-none active:brightness-150 transition-all duration-75";
  const btnStyle = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '22px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation' as const,
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[180px] h-[180px] mx-auto mt-3"
      style={{ userSelect: 'none' }}
    >
      {/* Row 1 */}
      <div />
      <button
        className={`${btnClass} rounded-t-2xl`}
        style={btnStyle}
        onTouchStart={(e) => { e.preventDefault(); handlePress('UP'); }}
        onMouseDown={() => handlePress('UP')}
      >
        ▲
      </button>
      <div />

      {/* Row 2 */}
      <button
        className={`${btnClass} rounded-l-2xl`}
        style={btnStyle}
        onTouchStart={(e) => { e.preventDefault(); handlePress('LEFT'); }}
        onMouseDown={() => handlePress('LEFT')}
      >
        ◀
      </button>
      <button
        className={`${btnClass} rounded-md`}
        style={{ ...btnStyle, fontSize: '14px' }}
        onTouchStart={(e) => { e.preventDefault(); handlePause(); }}
        onMouseDown={handlePause}
      >
        ⏸
      </button>
      <button
        className={`${btnClass} rounded-r-2xl`}
        style={btnStyle}
        onTouchStart={(e) => { e.preventDefault(); handlePress('RIGHT'); }}
        onMouseDown={() => handlePress('RIGHT')}
      >
        ▶
      </button>

      {/* Row 3 */}
      <div />
      <button
        className={`${btnClass} rounded-b-2xl`}
        style={btnStyle}
        onTouchStart={(e) => { e.preventDefault(); handlePress('DOWN'); }}
        onMouseDown={() => handlePress('DOWN')}
      >
        ▼
      </button>
      <div />
    </div>
  );
}
