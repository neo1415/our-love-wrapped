'use client';

import { motion } from 'framer-motion';
import { loadContent } from '@/lib/content/contentLoader';
import DownloadButton from '@/components/Video/DownloadButton';

interface FinalScreenProps {
  onReplay: () => void;
}

export default function FinalScreen({ onReplay }: FinalScreenProps) {
  const content = loadContent();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-bg px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center"
      >
        {/* Final message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-12 font-title text-5xl font-bold text-cream md:text-7xl"
        >
          {content.config.finalMessage}
        </motion.h1>

        {/* Download button - COMMENTED OUT until video is ready */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <DownloadButton
            videoSrc={content.video.path}
            filename="our-love-story.mp4"
          />
        </motion.div> */}

        {/* Replay button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReplay}
          className="rounded-full bg-cream/20 px-8 py-3 font-ui text-lg text-cream transition-colors hover:bg-cream/30"
        >
          Replay Story
        </motion.button>
      </motion.div>

      {/* Decorative hearts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 1 }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          fill="#800020"
          className="h-64 w-64 opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
    </div>
  );
}
