'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface VideoTransitionProps {
  videoSrc: string;
  audioSrc: string;
  onComplete: () => void;
  trigger: boolean;
}

export default function VideoTransition({
  videoSrc,
  audioSrc,
  onComplete,
  trigger,
}: VideoTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'heartbeat' | 'fadeToBlack' | 'video'>('idle');

  useEffect(() => {
    if (!trigger || phase !== 'idle') return;

    // Start the transition sequence
    const runTransition = async () => {
      // Phase 1: Heartbeat pulse (1s)
      setPhase('heartbeat');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: Fade to black (500ms)
      setPhase('fadeToBlack');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 3: Show video
      setPhase('video');
    };

    runTransition();
  }, [trigger, phase]);

  if (phase === 'idle') {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Heartbeat pulse animation */}
      {phase === 'heartbeat' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 1.2, 1.5],
          }}
          transition={{
            duration: 1,
            times: [0, 0.3, 0.7, 1],
            ease: 'easeInOut',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg"
        >
          <svg
            viewBox="0 0 24 24"
            fill="#800020"
            className="h-32 w-32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      )}

      {/* Fade to black */}
      {phase === 'fadeToBlack' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black"
        />
      )}

      {/* Video phase */}
      {phase === 'video' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black"
        >
          <video
            src={videoSrc}
            autoPlay
            playsInline
            controls
            className="h-full w-full object-contain"
            onEnded={onComplete}
            onError={(e) => {
              console.error('Video playback error:', e);
              onComplete();
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
