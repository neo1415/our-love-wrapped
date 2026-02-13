'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import useStoryStore from '@/lib/state/storyStore';
import HeartAnimation from '@/components/Effects/HeartAnimation';

interface PhotoSlideProps {
  src: string;
  alt: string;
  onComplete: () => void;
  onDoubleTap: (x: number, y: number) => void;
  onLongPress: () => void;
  isPlaying: boolean;
}

export default function PhotoSlide({
  src,
  alt,
  onComplete,
  onDoubleTap,
  onLongPress,
  isPlaying,
}: PhotoSlideProps) {
  const [imageError, setImageError] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [heartPosition, setHeartPosition] = useState<{ x: number; y: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { setFullScreenPhoto } = useStoryStore();

  // VERBOSE LOGGING
  console.log('=== PHOTO SLIDE RENDER ===');
  console.log('Photo src:', src);
  console.log('Photo alt:', alt);
  console.log('Is Playing:', isPlaying);
  console.log('=========================');

  // Handle double-tap detection
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      
      setHeartPosition({ x, y });
      onDoubleTap(x, y);
    }

    setLastTap(now);
  };

  // Handle long press detection
  const handlePressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setFullScreenPhoto(src);
      onLongPress();
    }, 500); // 500ms for long press
  };

  const handlePressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Burgundy placeholder for failed images
  if (imageError) {
    return (
      <div className="flex h-screen items-center justify-center overflow-hidden px-6">
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.08 }}
          transition={{
            opacity: { duration: 1, ease: 'easeIn' },
            scale: { duration: 8, ease: 'linear' },
          }}
          className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-lg bg-burgundy shadow-2xl"
          style={{
            boxShadow: '0 0 40px rgba(128, 0, 32, 0.5)',
          }}
        >
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-xl text-cream opacity-50">
              Photo unavailable
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="flex h-screen items-center justify-center overflow-hidden px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1.08, rotateY: 0 }}
          transition={{
            opacity: { duration: 1, ease: 'easeOut' },
            scale: { duration: 8, ease: 'linear' },
            rotateY: { duration: 1, ease: 'easeOut' },
          }}
          className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl md:max-h-[75vh]"
          style={{
            boxShadow: '0 0 60px rgba(183, 110, 121, 0.4)',
          }}
          onClick={handleTap}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
        >
          <img
            src={src}
            alt={alt}
            onError={() => {
              console.error(`❌ PHOTO LOAD FAILED: ${src}`);
              setImageError(true);
            }}
            onLoad={() => {
              console.log(`✅ PHOTO LOADED SUCCESSFULLY: ${src}`);
            }}
            className="h-full w-full object-contain"
            style={{
              filter: 'brightness(0.95) contrast(1.05)',
              objectPosition: 'top center',
            }}
          />

          {/* Burgundy glow border effect */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: 'inset 0 0 80px rgba(128, 0, 32, 0.3)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Heart animation on double-tap */}
      {heartPosition && (
        <HeartAnimation
          x={heartPosition.x}
          y={heartPosition.y}
          onComplete={() => setHeartPosition(null)}
        />
      )}
    </>
  );
}
