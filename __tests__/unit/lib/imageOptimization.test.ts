import { ImagePreloadManager } from '@/lib/images/ImagePreloadManager';
import { NetworkAdapter } from '@/lib/images/NetworkAdapter';
import { ImageCacheManager } from '@/lib/images/ImageCacheManager';
import { Section } from '@/types/content';

describe('Image Optimization', () => {
  describe('ImagePreloadManager', () => {
    let manager: ImagePreloadManager;

    beforeEach(() => {
      manager = new ImagePreloadManager();
    });

    afterEach(() => {
      manager.clear();
    });

    it('should initialize with empty state', () => {
      const stats = manager.getStats();
      expect(stats.loaded).toBe(0);
      expect(stats.loading).toBe(0);
      expect(stats.queued).toBe(0);
    });

    it('should preload images from current and next slides', () => {
      const mockSections: Section[] = [
        {
          id: 0,
          title: 'Test Section',
          slides: [
            {
              type: 'photo',
              content: '/test1.webp',
              altText: 'Test 1',
              duration: 5000,
            },
            {
              type: 'photo',
              content: '/test2.webp',
              altText: 'Test 2',
              duration: 5000,
            },
          ],
        },
      ];

      manager.preloadImages({
        currentSection: 0,
        currentSlide: 0,
        sections: mockSections,
        preloadDistance: 2,
      });

      // Should have queued images for preloading
      const stats = manager.getStats();
      expect(stats.queued + stats.loading).toBeGreaterThan(0);
    });

    it('should clear all state', () => {
      manager.clear();
      const stats = manager.getStats();
      expect(stats.loaded).toBe(0);
      expect(stats.loading).toBe(0);
      expect(stats.queued).toBe(0);
    });
  });

  describe('NetworkAdapter', () => {
    let adapter: NetworkAdapter;

    beforeEach(() => {
      adapter = new NetworkAdapter();
    });

    it('should return a preload distance', () => {
      const distance = adapter.getPreloadDistance();
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThanOrEqual(5);
    });

    it('should return an image quality setting', () => {
      const quality = adapter.getImageQuality();
      expect(['high', 'medium', 'low']).toContain(quality);
    });

    it('should determine if progressive loading should be used', () => {
      const shouldUse = adapter.shouldUseProgressiveLoading();
      expect(typeof shouldUse).toBe('boolean');
    });

    it('should detect connection speed', () => {
      const isSlow = adapter.isSlowConnection();
      const isFast = adapter.isFastConnection();
      expect(typeof isSlow).toBe('boolean');
      expect(typeof isFast).toBe('boolean');
    });
  });

  describe('ImageCacheManager', () => {
    let cache: ImageCacheManager;

    beforeEach(() => {
      cache = new ImageCacheManager(10); // Small cache for testing
    });

    afterEach(() => {
      cache.clear();
    });

    it('should initialize with empty cache', () => {
      const stats = cache.getStats();
      expect(stats.size).toBe(0);
    });

    it('should check if image is in cache', () => {
      expect(cache.has('/test.webp')).toBe(false);
    });

    it('should clear cache', () => {
      cache.clear();
      const stats = cache.getStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', () => {
      const stats = cache.getStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('utilization');
    });
  });

  describe('Integration', () => {
    it('should work together for optimal image loading', () => {
      const preloadManager = new ImagePreloadManager();
      const networkAdapter = new NetworkAdapter();
      const cacheManager = new ImageCacheManager();

      // Get network-aware preload distance
      const distance = networkAdapter.getPreloadDistance();
      expect(distance).toBeGreaterThan(0);

      // Check cache stats
      const stats = cacheManager.getStats();
      expect(stats.size).toBe(0);

      // Clean up
      preloadManager.clear();
      cacheManager.clear();
    });
  });
});
