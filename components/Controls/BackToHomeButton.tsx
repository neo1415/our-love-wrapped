'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function BackToHomeButton() {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push('/')}
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/80 backdrop-blur-sm shadow-lg transition-all hover:bg-burgundy"
      aria-label="Back to home"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 text-cream"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </motion.button>
  );
}
