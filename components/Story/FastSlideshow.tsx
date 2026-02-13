'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FastSlideshowProps {
  photos: string[];
  onComplete: () => void;
  startTime: number; // When to start (1:53 = 113 seconds)
  currentTime: number;
}

export default function FastSlideshow({ photos, onComplete, startTime, currentTime }: FastSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(200); // Start very fast (200ms per photo)

  useEffect(() => {
    // Calculate timing based on song position
    const elapsed = currentTime - startTime;
    
    // 1:53 to 2:00 (7 seconds) - very fast slideshow
    if (elapsed >= 0 && elapsed < 7) {
      setSpeed(200); // 0.2 seconds per photo - very fast!
    }
    // 2:00 to 2:03 (3 seconds) - slow down gradually
    else if (elapsed >= 7 && elapsed < 10) {
      const progress = (elapsed - 7) / 3; // 0 to 1
      setSpeed(200 + (1300 * progress)); // 200ms to 1500ms
    }
    // After 2:03 - normal speed
    else if (elapsed >= 10) {
      setSpeed(1500); // 1.5 seconds per photo - normal
    }
  }, [currentTime, startTime]);

  useEffect(() => {
    if (currentIndex >= photos.length) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, speed, photos.length, onComplete]);

  if (currentIndex >= photos.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-dark-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: speed / 1000 * 0.5 }}
          className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
        >
          <img
            src={photos[currentIndex]}
            alt={`Memory ${currentIndex + 1}`}
            className="h-full w-full object-cover"
            style={{
              filter: 'brightness(0.95) contrast(1.05)',
            }}
          />
          {/* Glow effect */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 100px rgba(183, 110, 121, 0.4)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex gap-1">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 w-8 rounded-full transition-all ${
                idx === currentIndex ? 'bg-rose-gold' : 'bg-cream/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
