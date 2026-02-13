'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

export default function ParticleSystem() {
  // Generate 15-20 particles with random properties
  const particles = useMemo(() => {
    const count = Math.floor(Math.random() * 6) + 15; // 15-20 particles
    const colors = ['#800020', '#B76E79']; // burgundy and rose-gold
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random x position (0-100%)
      y: Math.random() * 100 + 20, // Start below viewport
      size: Math.random() * 8 + 4, // 4-12px
      duration: Math.random() * 10 + 15, // 15-25 seconds
      delay: Math.random() * 5, // 0-5 seconds delay
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.2 + 0.2, // 20-40% opacity
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
          }}
          initial={{ y: '100vh', x: 0 }}
          animate={{
            y: '-20vh',
            x: [0, 30, -30, 0], // Horizontal wobble
          }}
          transition={{
            y: {
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: particle.delay,
            },
            x: {
              duration: particle.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            },
          }}
        />
      ))}
    </div>
  );
}
