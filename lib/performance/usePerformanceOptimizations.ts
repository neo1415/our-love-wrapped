import { useEffect } from 'react';
import { optimizeTouchEvents, optimizeScroll } from './optimizations';

/**
 * Hook to apply performance optimizations
 */
export function usePerformanceOptimizations() {
  useEffect(() => {
    // Optimize touch events
    optimizeTouchEvents();

    // Optimize scroll
    const cleanupScroll = optimizeScroll();

    // Enable hardware acceleration for body
    if (typeof document !== 'undefined') {
      document.body.style.transform = 'translateZ(0)';
      document.body.style.backfaceVisibility = 'hidden';
      document.body.style.perspective = '1000px';
    }

    // Cleanup
    return () => {
      if (cleanupScroll) {
        cleanupScroll();
      }
      if (typeof document !== 'undefined') {
        document.body.style.transform = '';
        document.body.style.backfaceVisibility = '';
        document.body.style.perspective = '';
      }
    };
  }, []);
}
