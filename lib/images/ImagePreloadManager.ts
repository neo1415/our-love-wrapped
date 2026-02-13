import { Section, Slide } from '@/types/content';

interface PreloadConfig {
  currentSection: number;
  currentSlide: number;
  sections: Section[];
  preloadDistance?: number;
}

interface ImageWithPriority {
  src: string;
  priority: number;
}

/**
 * Manages aggressive image preloading with priority-based loading
 * and cancellation of stale preloads
 */
export class ImagePreloadManager {
  private preloadQueue: Map<string, AbortController>;
  private loadedImages: Set<string>;
  private loadingImages: Set<string>;

  constructor() {
    this.preloadQueue = new Map();
    this.loadedImages = new Set();
    this.loadingImages = new Set();
  }

  /**
   * Preload images based on current position
   */
  preloadImages(config: PreloadConfig): void {
    const preloadDistance = config.preloadDistance || 5;
    
    // Calculate which images should be preloaded
    const imagesToPreload = this.calculatePreloadList(config, preloadDistance);
    
    // Cancel preloads that are no longer needed
    this.cancelStalePreloads(imagesToPreload);
    
    // Start new preloads with priority
    imagesToPreload.forEach((img) => {
      this.preloadImage(img.src, img.priority);
    });
  }

  /**
   * Calculate which images should be preloaded with their priorities
   */
  private calculatePreloadList(
    config: PreloadConfig,
    preloadDistance: number
  ): ImageWithPriority[] {
    const images: ImageWithPriority[] = [];
    let priority = 0;

    const { currentSection, currentSlide, sections } = config;
    const section = sections[currentSection];

    if (!section) return images;

    // Priority 0: Current slide images
    const currentImages = this.getSlideImages(section.slides[currentSlide]);
    currentImages.forEach(src => {
      images.push({ src, priority: priority++ });
    });

    // Priority 1-N: Next slides in current section
    for (let i = 1; i <= preloadDistance; i++) {
      const nextSlideIndex = currentSlide + i;
      if (nextSlideIndex < section.slides.length) {
        const nextImages = this.getSlideImages(section.slides[nextSlideIndex]);
        nextImages.forEach(src => {
          if (!images.find(img => img.src === src)) {
            images.push({ src, priority: priority++ });
          }
        });
      }
    }

    // Priority N+1: Next section if near end of current section
    const slidesRemaining = section.slides.length - currentSlide;
    if (slidesRemaining <= 3 && currentSection < sections.length - 1) {
      const nextSection = sections[currentSection + 1];
      if (nextSection) {
        // Preload first 3 slides of next section
        for (let i = 0; i < Math.min(3, nextSection.slides.length); i++) {
          const nextSectionImages = this.getSlideImages(nextSection.slides[i]);
          nextSectionImages.forEach(src => {
            if (!images.find(img => img.src === src)) {
              images.push({ src, priority: priority++ });
            }
          });
        }
      }
    }

    return images;
  }

  /**
   * Extract image URLs from a slide
   */
  private getSlideImages(slide: Slide | undefined): string[] {
    if (!slide) return [];

    const images: string[] = [];

    if (slide.type === 'photo' && slide.content) {
      images.push(slide.content);
    } else if (slide.type === 'collage' && slide.photos) {
      slide.photos.forEach(photo => {
        if (photo.src) {
          images.push(photo.src);
        }
      });
    } else if (slide.type === 'text' && slide.backgroundPhoto) {
      images.push(slide.backgroundPhoto);
    }

    return images;
  }

  /**
   * Preload a single image with priority
   */
  private preloadImage(src: string, priority: number): void {
    // Skip if already loaded or currently loading
    if (this.loadedImages.has(src) || this.loadingImages.has(src)) {
      return;
    }

    // Skip if already in queue
    if (this.preloadQueue.has(src)) {
      return;
    }

    console.log(`⬇️ [Priority ${priority}] Preloading: ${src}`);

    const controller = new AbortController();
    this.preloadQueue.set(src, controller);
    this.loadingImages.add(src);

    const img = new Image();
    
    img.onload = () => {
      this.loadedImages.add(src);
      this.loadingImages.delete(src);
      this.preloadQueue.delete(src);
      console.log(`✅ Preloaded: ${src}`);
    };

    img.onerror = () => {
      this.loadingImages.delete(src);
      this.preloadQueue.delete(src);
      console.error(`❌ Preload failed: ${src}`);
    };

    // Start loading
    img.src = src;
  }

  /**
   * Cancel preloads that are no longer needed
   */
  private cancelStalePreloads(currentImages: ImageWithPriority[]): void {
    const currentSrcs = new Set(currentImages.map(img => img.src));

    this.preloadQueue.forEach((controller, src) => {
      if (!currentSrcs.has(src)) {
        controller.abort();
        this.preloadQueue.delete(src);
        this.loadingImages.delete(src);
        console.log(`🚫 Cancelled preload: ${src}`);
      }
    });
  }

  /**
   * Check if an image is already loaded
   */
  isLoaded(src: string): boolean {
    return this.loadedImages.has(src);
  }

  /**
   * Clear all caches and queues
   */
  clear(): void {
    // Cancel all pending preloads
    this.preloadQueue.forEach(controller => controller.abort());
    
    this.preloadQueue.clear();
    this.loadedImages.clear();
    this.loadingImages.clear();
    
    console.log('🗑️ Image preload manager cleared');
  }

  /**
   * Get statistics about preloading
   */
  getStats() {
    return {
      loaded: this.loadedImages.size,
      loading: this.loadingImages.size,
      queued: this.preloadQueue.size,
    };
  }
}

// Singleton instance
let preloadManagerInstance: ImagePreloadManager | null = null;

export function getPreloadManager(): ImagePreloadManager {
  if (!preloadManagerInstance) {
    preloadManagerInstance = new ImagePreloadManager();
  }
  return preloadManagerInstance;
}
