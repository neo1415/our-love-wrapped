'use client';

import { loadContent } from '@/lib/content/contentLoader';
import { motion } from 'framer-motion';

interface LandingScreenProps {
  onBegin: () => void;
}

export default function LandingScreen({ onBegin }: LandingScreenProps) {
  const content = loadContent();
  const { names, date } = content.config;

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 text-center"
      >
        {/* Names/Initials */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6 font-title text-6xl font-bold text-cream md:text-8xl"
        >
          {names.initials || `${names.his} & ${names.hers}`}
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12 font-body text-xl text-rose-gold md:text-2xl"
        >
          {date}
        </motion.p>

        {/* Begin Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBegin}
          className="rounded-full bg-burgundy px-12 py-4 font-ui text-lg font-semibold text-cream shadow-lg transition-all hover:bg-opacity-90 hover:shadow-xl"
        >
          Begin Our Story
        </motion.button>
      </motion.div>

      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-burgundy/10 via-transparent to-transparent" />
    </div>
  );
}
