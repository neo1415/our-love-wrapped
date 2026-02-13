'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

interface HeartAnimationProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export default function HeartAnimation({ x, y, onComplete }: HeartAnimationProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Generate 5-8 hearts
    const count = Math.floor(Math.random() * 4) + 5;
    const colors = ['#800020', '#B76E79']; // burgundy and rose-gold
    
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: x + (Math.random() - 0.5) * 40, // Spread around tap point
      y: y + (Math.random() - 0.5) * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 20 + 20, // 20-40px
      delay: Math.random() * 0.2, // 0-200ms delay
    }));

    setHearts(newHearts);

    // Hide after animation completes
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [x, y, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-50">
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                x: heart.x,
                y: heart.y,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                y: heart.y - 150,
                opacity: 0,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: heart.delay,
                ease: 'easeOut',
              }}
              className="absolute"
              style={{
                width: heart.size,
                height: heart.size,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill={heart.color}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
