/**
 * Manages in-memory image cache with LRU eviction policy
 */
export class ImageCacheManager {
  private cache: Map<string, HTMLImageElement>;
  private accessOrder: string[]; // For LRU tracking
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 100) {
    this.cache = new Map();
    this.accessOrder = [];
    this.maxCacheSize = maxCacheSize;
  }

  /**
   * Get image from cache or load it
   */
  async getImage(src: string): Promise<HTMLImageElement> {
    // Check cache first
    if (this.cache.has(src)) {
      console.log(`📦 Cache hit: ${src}`);
      this.updateAccessOrder(src);
      return this.cache.get(src)!;
    }

    // Load image
    console.log(`⬇️ Cache miss, loading: ${src}`);
    const img = await this.loadImage(src);
    
    // Add to cache
    this.addToCache(src, img);
    
    return img;
  }

  /**
   * Load image and return promise
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        console.log(`✅ Loaded: ${src}`);
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.error(`❌ Failed to load: ${src}`, error);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }

  /**
   * Add image to cache with LRU eviction
   */
  private addToCache(src: string, img: HTMLImageElement): void {
    // Evict oldest if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
        console.log(`🗑️ Evicted from cache (LRU): ${oldestKey}`);
      }
    }

    this.cache.set(src, img);
    this.accessOrder.push(src);
    console.log(`📦 Added to cache: ${src} (${this.cache.size}/${this.maxCacheSize})`);
  }

  /**
   * Update access order for LRU
   */
  private updateAccessOrder(src: string): void {
    const index = this.accessOrder.indexOf(src);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(src);
    }
  }

  /**
   * Preload multiple images
   */
  async preloadImages(srcs: string[]): Promise<void> {
    const promises = srcs.map(src => 
      this.getImage(src).catch(err => {
        console.error(`Failed to preload ${src}:`, err);
        return null;
      })
    );
    
    await Promise.all(promises);
  }

  /**
   * Check if image is in cache
   */
  has(src: string): boolean {
    return this.cache.has(src);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      utilization: ((this.cache.size / this.maxCacheSize) * 100).toFixed(1) + '%',
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    console.log('🗑️ Image cache cleared');
  }

  /**
   * Save cache to sessionStorage
   */
  saveToStorage(): void {
    try {
      const cacheData = Array.from(this.cache.keys());
      sessionStorage.setItem('imageCache', JSON.stringify(cacheData));
      console.log(`💾 Saved ${cacheData.length} images to sessionStorage`);
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  /**
   * Restore cache from sessionStorage
   */
  async restoreFromStorage(): Promise<void> {
    try {
      const cacheData = sessionStorage.getItem('imageCache');
      if (cacheData) {
        const srcs: string[] = JSON.parse(cacheData);
        console.log(`📂 Restoring ${srcs.length} images from sessionStorage`);
        await this.preloadImages(srcs);
      }
    } catch (error) {
      console.error('Failed to restore cache from storage:', error);
    }
  }
}

// Singleton instance
let cacheManagerInstance: ImageCacheManager | null = null;

export function getImageCacheManager(): ImageCacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new ImageCacheManager(100);
  }
  return cacheManagerInstance;
}
