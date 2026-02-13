'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface BeginButtonProps {
  onClick: () => void;
}

export default function BeginButton({ onClick }: BeginButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    
    setIsClicked(true);
    
    // Handle autoplay policy by starting audio on user interaction
    onClick();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isClicked}
      className="group relative overflow-hidden rounded-full bg-burgundy px-12 py-4 font-ui text-lg font-semibold text-cream shadow-lg transition-all hover:bg-opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Begin the love story experience"
    >
      {/* Button text */}
      <span className="relative z-10">
        {isClicked ? 'Starting...' : 'Begin Our Story'}
      </span>

      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-rose-gold"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 blur-xl transition-opacity group-hover:opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(183, 110, 121, 0.8) 0%, transparent 70%)',
        }}
      />
    </motion.button>
  );
}
