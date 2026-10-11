'use client';

import React, { useMemo } from 'react';

export default function StarBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${(i * 19) % 100}%`,
      left: `${(i * 37) % 100}%`,
      size: (i % 3) + 1,
      delay: `${(i % 5) * 0.7}s`,
      speedClass:
        i % 3 === 0
          ? 'animate-twinkle'
          : i % 3 === 1
          ? 'animate-twinkle-fast'
          : 'animate-twinkle-slow',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="cosmic-nebula" />
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white ${star.speedClass}`}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            boxShadow:
              star.size > 2
                ? '0 0 6px 1px rgba(94, 235, 255, 0.8)'
                : '0 0 3px rgba(248, 214, 109, 0.6)',
          }}
        />
      ))}
    </div>
  );
}
