'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import useStoryStore from '@/lib/state/storyStore';

export default function NavigationButtons() {
  const { nextSlide, previousSlide, isPaused, currentSection } = useStoryStore();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide buttons after first section on mobile
  useEffect(() => {
    if (isMobile && currentSection > 0) {
      setShowButtons(false);
    } else {
      // Always show on desktop
      setShowButtons(true);
    }
  }, [isMobile, currentSection]);

  // Handle screen tap (left/right half)
  const handleScreenTap = (e: React.MouseEvent) => {
    if (!isPaused) return;

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    if (clickX < screenWidth / 2) {
      // Left half - go back
      previousSlide();
    } else {
      // Right half - go forward
      nextSlide();
    }
  };

  // Handle swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - go back
          previousSlide();
        } else {
          // Swipe left - go forward
          nextSlide();
        }
      }

      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, previousSlide]);

  return (
    <>
      {/* Invisible tap zones for manual mode */}
      {isPaused && (
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handleScreenTap}
        />
      )}

      {/* Visible navigation buttons - hide after first section on mobile */}
      {showButtons && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-4">
          <motion.button
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              previousSlide();
            }}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/60 backdrop-blur-sm transition-opacity hover:bg-burgundy/80"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-cream"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </motion.button>

          <motion.button
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/60 backdrop-blur-sm transition-opacity hover:bg-burgundy/80"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-cream"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </motion.button>
        </div>
      )}
    </>
  );
}
