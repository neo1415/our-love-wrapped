'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoHideControlsProps {
  children: ReactNode;
  hideDelay?: number; // milliseconds
  className?: string;
}

/**
 * Auto-hide controls wrapper (like YouTube)
 * Hides controls after inactivity, shows on user interaction
 */
export default function AutoHideControls({ 
  children, 
  hideDelay = 3000,
  className = ''
}: AutoHideControlsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset hide timer
  const resetHideTimer = () => {
    // Clear existing timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    // Show controls
    setIsVisible(true);

    // Set new timer to hide
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  // Handle user activity
  useEffect(() => {
    const handleActivity = () => {
      resetHideTimer();
    };

    // Listen for various user interactions
    const events = [
      'mousemove',
      'mousedown',
      'touchstart',
      'touchmove',
      'keydown',
      'scroll',
    ];

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetHideTimer();

    // Cleanup
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [hideDelay]);

  return (
    <div ref={containerRef} className={className}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
