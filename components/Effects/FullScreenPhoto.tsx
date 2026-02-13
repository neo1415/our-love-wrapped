'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import useStoryStore from '@/lib/state/storyStore';

export default function FullScreenPhoto() {
  const { showFullScreen, fullScreenPhotoUrl, setFullScreenPhoto } = useStoryStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; distance: number } | null>(null);

  const handleClose = () => {
    setFullScreenPhoto(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle pinch-to-zoom
  useEffect(() => {
    if (!showFullScreen) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        touchStartRef.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
          distance,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartRef.current) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const scaleChange = distance / touchStartRef.current.distance;
        setScale((prev) => Math.max(1, Math.min(3, prev * scaleChange)));
        touchStartRef.current.distance = distance;
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showFullScreen]);

  // Handle swipe to close
  const handleSwipe = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaY = Math.abs(touch.clientY - (touchStartRef.current?.y || touch.clientY));
    
    if (deltaY > 100) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {showFullScreen && fullScreenPhotoUrl && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
            onTouchEnd={handleSwipe}
          >
            <motion.img
              src={fullScreenPhotoUrl}
              alt="Full screen photo"
              className="max-h-full max-w-full object-contain"
              style={{
                scale,
                x: position.x,
                y: position.y,
              }}
              drag={scale > 1}
              dragConstraints={{
                left: -100,
                right: 100,
                top: -100,
                bottom: 100,
              }}
              onDragEnd={(_, info) => {
                setPosition({
                  x: position.x + info.offset.x,
                  y: position.y + info.offset.y,
                });
              }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/80 text-cream backdrop-blur-sm transition-colors hover:bg-burgundy"
              aria-label="Close full screen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            {/* Zoom indicator */}
            {scale > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-burgundy/80 px-4 py-2 font-ui text-sm text-cream backdrop-blur-sm">
                {Math.round(scale * 100)}%
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
