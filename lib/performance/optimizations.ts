/**
 * Performance Optimizations
 * Additional optimizations for butter-smooth experience
 */

/**
 * Request idle callback with fallback
 */
export const requestIdleCallback = (callback: () => void) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1);
};

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallback = (id: number) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  return clearTimeout(id);
};

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Optimize image loading with intersection observer
 */
export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  });
};

/**
 * Prefetch resources
 */
export const prefetchResource = (url: string, type: 'image' | 'audio' | 'video' = 'image') => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = type;
  document.head.appendChild(link);
};

/**
 * Enable GPU acceleration for element
 */
export const enableGPUAcceleration = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
};

/**
 * Disable GPU acceleration for element
 */
export const disableGPUAcceleration = (element: HTMLElement) => {
  element.style.transform = '';
  element.style.willChange = 'auto';
};

/**
 * Optimize touch events for better performance
 */
export const optimizeTouchEvents = () => {
  if (typeof document === 'undefined') return;

  // Add passive event listeners for better scroll performance
  const passiveSupported = (() => {
    let passive = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get() {
          passive = true;
          return false;
        },
      });
      window.addEventListener('test' as any, null as any, options);
      window.removeEventListener('test' as any, null as any, options);
    } catch (err) {
      passive = false;
    }
    return passive;
  })();

  if (passiveSupported) {
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }
};

/**
 * Reduce motion for users who prefer it
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Get optimal animation duration based on user preferences
 */
export const getAnimationDuration = (defaultDuration: number): number => {
  return shouldReduceMotion() ? 0 : defaultDuration;
};

/**
 * Optimize rendering with RAF
 */
export const optimizeRender = (callback: () => void) => {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

/**
 * Batch DOM updates
 */
export const batchDOMUpdates = (updates: Array<() => void>) => {
  if (typeof window === 'undefined') {
    updates.forEach(update => update());
    return;
  }

  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

/**
 * Memory-efficient array chunking
 */
export function* chunkArray<T>(array: T[], size: number): Generator<T[]> {
  for (let i = 0; i < array.length; i += size) {
    yield array.slice(i, i + size);
  }
}

/**
 * Optimize scroll performance
 */
export const optimizeScroll = () => {
  if (typeof document === 'undefined') return;

  // Disable smooth scrolling during rapid scrolling
  let scrolling = false;
  let scrollTimeout: NodeJS.Timeout;

  const handleScroll = () => {
    if (!scrolling) {
      document.documentElement.style.scrollBehavior = 'auto';
      scrolling = true;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
      scrolling = false;
    }, 100);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
};
