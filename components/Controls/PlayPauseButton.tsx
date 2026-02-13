'use client';

import { motion } from 'framer-motion';
import useStoryStore from '@/lib/state/storyStore';

export default function PlayPauseButton() {
  const { isPlaying, togglePlayPause } = useStoryStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={togglePlayPause}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/80 backdrop-blur-sm transition-colors hover:bg-burgundy"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        // Pause icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-cream"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        // Play icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-cream"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </motion.button>
  );
}
