# Design Document: Image Loading Performance Optimization

## Overview

This design implements a comprehensive image loading optimization strategy for "Our Love Wrapped". The current implementation has basic preloading but suffers from slow load times. This redesign introduces aggressive preloading, image compression, progressive loading with blur placeholders, priority-based loading, and network-aware optimizations.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Image Loading Manager                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Preload Coordinator                       │  │
│  │  - Calculates which images to preload                 │  │
│  │  - Manages preload priority queue                     │  │
│  │  - Cancels unnecessary preloads                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Image Cache Manager                       │  │
│  │  - Stores loaded images in memory                     │  │
│  │  - Provides instant access to cached images           │  │
│  │  - Manages cache eviction policy                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Progressive Image Component                    │  │
│  │  - Shows blur placeholder immediately                 │  │
│  │  - Loads full image in background                     │  │
│  │  - Smooth transition when loaded                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Network Adapter                                │  │
│  │  - Detects connection speed                           │  │
│  │  - Adjusts quality and preload distance               │  │
│  │  - Provides fallback strategies                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Image Preload Manager

```typescript
interface PreloadConfig {
  currentSection: number;
  currentSlide: number;
  sections: Section[];
  preloadDistance: number; // Number of slides ahead to preload
}

class ImagePreloadManager {
  private preloadQueue: Map<string, AbortController>;
  private loadedImages: Set<string>;
  private priorityQueue: PriorityQueue<string>;

  /**
   * Preload images based on current position
   */
  preloadImages(config: PreloadConfig): void {
    // 1. Get images to preload
    const imagesToPreload = this.calculatePreloadList(config);
    
    // 2. Cancel preloads no longer needed
    this.cancelStalePreloads(imagesToPreload);
    
    // 3. Start new preloads with priority
    imagesToPreload.forEach((img, priority) => {
      this.preloadImage(img, priority);
    });
  }

  /**
   * Calculate which images should be preloaded
   */
  private calculatePreloadList(config: PreloadConfig): Map<string, number> {
    const images = new Map<string, number>();
    let priority = 0;

    // Priority 0: Current slide
    const currentSlide = this.getSlideImages(
      config.sections[config.currentSection],
      config.currentSlide
    );
    currentSlide.forEach(img => images.set(img, priority++));

    // Priority 1-3: Next 3 slides
    for (let i = 1; i <= 3; i++) {
      const nextSlide = this.getNextSlideImages(config, i);
      nextSlide.forEach(img => images.set(img, priority++));
    }

    // Priority 4+: Next section
    if (this.isNearSectionEnd(config)) {
      const nextSection = this.getNextSectionImages(config);
      nextSection.forEach(img => images.set(img, priority++));
    }

    return images;
  }

  /**
   * Preload a single image with priority
   */
  private preloadImage(src: string, priority: number): void {
    if (this.loadedImages.has(src) || this.preloadQueue.has(src)) {
      return; // Already loaded or loading
    }

    const controller = new AbortController();
    this.preloadQueue.set(src, controller);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      this.loadedImages.add(src);
      this.preloadQueue.delete(src);
      console.log(`✅ Preloaded: ${src}`);
    };

    img.onerror = () => {
      this.preloadQueue.delete(src);
      console.error(`❌ Preload failed: ${src}`);
    };
  }

  /**
   * Cancel preloads that are no longer needed
   */
  private cancelStalePreloads(currentImages: Map<string, number>): void {
    this.preloadQueue.forEach((controller, src) => {
      if (!currentImages.has(src)) {
        controller.abort();
        this.preloadQueue.delete(src);
        console.log(`🚫 Cancelled preload: ${src}`);
      }
    });
  }
}
```

### 2. Progressive Image Component

```typescript
interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string; // Tiny blur placeholder
  className?: string;
  onLoad?: () => void;
  priority?: 'high' | 'normal' | 'low';
}

function ProgressiveImage({
  src,
  alt,
  placeholder,
  className,
  onLoad,
  priority = 'normal',
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);

  useEffect(() => {
    // Load full image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      console.error(`Failed to load: ${src}`);
    };
  }, [src]);

  return (
    <motion.img
      src={currentSrc}
      alt={alt}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
      }}
      transition={{ 
        opacity: { duration: 0.3 },
        filter: { duration: 0.3 },
      }}
      loading={priority === 'high' ? 'eager' : 'lazy'}
    />
  );
}
```

### 3. Image Compression Script

```javascript
// scripts/compress-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function compressImage(inputPath, outputPath) {
  const stats = await fs.stat(inputPath);
  const originalSize = stats.size;

  await sharp(inputPath)
    .resize(1920, null, { // Max width 1920px
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: 80 }) // 80% quality WebP
    .toFile(outputPath);

  const newStats = await fs.stat(outputPath);
  const newSize = newStats.size;
  const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

  console.log(`✅ ${path.basename(inputPath)}`);
  console.log(`   ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`);

  return { originalSize, newSize, savings };
}

async function compressAllImages(directory) {
  const files = await fs.readdir(directory, { recursive: true });
  const imageFiles = files.filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f) && !f.includes('.webp')
  );

  let totalOriginal = 0;
  let totalNew = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(directory, file);
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    const result = await compressImage(inputPath, outputPath);
    totalOriginal += result.originalSize;
    totalNew += result.newSize;
  }

  const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  console.log(`\n📊 Total: ${formatBytes(totalOriginal)} → ${formatBytes(totalNew)}`);
  console.log(`💾 Saved: ${formatBytes(totalOriginal - totalNew)} (${totalSavings}%)`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Run compression
compressAllImages('./public/photos')
  .then(() => console.log('\n✅ All images compressed!'))
  .catch(err => console.error('❌ Error:', err));
```

### 4. Network-Aware Loading

```typescript
interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number; // Mbps
  rtt: number; // Round-trip time in ms
}

class NetworkAdapter {
  private connection: NetworkInfo | null = null;

  constructor() {
    this.detectConnection();
  }

  private detectConnection(): void {
    // @ts-ignore - Network Information API
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (conn) {
      this.connection = {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
      };

      // Listen for changes
      conn.addEventListener('change', () => {
        this.detectConnection();
      });
    }
  }

  /**
   * Get optimal preload distance based on connection
   */
  getPreloadDistance(): number {
    if (!this.connection) return 3; // Default

    switch (this.connection.effectiveType) {
      case '4g':
        return 5; // Aggressive preloading
      case '3g':
        return 3; // Moderate preloading
      case '2g':
      case 'slow-2g':
        return 1; // Minimal preloading
      default:
        return 3;
    }
  }

  /**
   * Get optimal image quality based on connection
   */
  getImageQuality(): 'high' | 'medium' | 'low' {
    if (!this.connection) return 'high';

    if (this.connection.downlink > 5) return 'high';
    if (this.connection.downlink > 1.5) return 'medium';
    return 'low';
  }

  /**
   * Should we use progressive loading?
   */
  shouldUseProgressiveLoading(): boolean {
    if (!this.connection) return true;
    return this.connection.effectiveType !== '4g';
  }
}
```

### 5. Image Cache Manager

```typescript
class ImageCacheManager {
  private cache: Map<string, HTMLImageElement>;
  private maxCacheSize: number = 100; // Max images in cache

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get image from cache or load it
   */
  async getImage(src: string): Promise<HTMLImageElement> {
    // Check cache first
    if (this.cache.has(src)) {
      console.log(`📦 Cache hit: ${src}`);
      return this.cache.get(src)!;
    }

    // Load image
    console.log(`⬇️ Loading: ${src}`);
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
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Add image to cache with LRU eviction
   */
  private addToCache(src: string, img: HTMLImageElement): void {
    // Evict oldest if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      console.log(`🗑️ Evicted from cache: ${firstKey}`);
    }

    this.cache.set(src, img);
  }

  /**
   * Preload multiple images
   */
  async preloadImages(srcs: string[]): Promise<void> {
    const promises = srcs.map(src => this.getImage(src));
    await Promise.all(promises);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }
}
```

## Implementation Strategy

### Phase 1: Image Compression (Immediate Impact)

1. Install sharp: `npm install sharp`
2. Create compression script
3. Compress all existing images
4. Update image paths to use .webp
5. Measure file size reduction

**Expected Impact**: 60-80% file size reduction

### Phase 2: Aggressive Preloading (Quick Win)

1. Implement ImagePreloadManager
2. Preload next 5 slides instead of 3
3. Preload entire next section when near boundary
4. Add preload cancellation

**Expected Impact**: Near-instant slide transitions

### Phase 3: Progressive Loading (Better UX)

1. Generate tiny blur placeholders
2. Implement ProgressiveImage component
3. Replace all img tags with ProgressiveImage
4. Add smooth transitions

**Expected Impact**: No more blank screens

### Phase 4: Network Awareness (Adaptive)

1. Implement NetworkAdapter
2. Adjust preload distance based on connection
3. Adjust image quality based on connection
4. Add connection change listeners

**Expected Impact**: Better experience on slow connections

### Phase 5: Caching (Performance)

1. Implement ImageCacheManager
2. Cache all loaded images
3. Use cached images for instant display
4. Add cache eviction policy

**Expected Impact**: Instant navigation to previous slides

## Performance Metrics

### Before Optimization
- Average image load time: 2-3 seconds
- First slide visible: 3-4 seconds
- Navigation delay: 1-2 seconds
- Total page weight: ~50MB

### After Optimization (Expected)
- Average image load time: 200-500ms
- First slide visible: 500ms-1s
- Navigation delay: 0ms (instant)
- Total page weight: ~15MB (70% reduction)

## Testing Strategy

### Performance Testing
1. Measure load times with Chrome DevTools
2. Test on throttled 3G connection
3. Test on fast 4G connection
4. Measure Largest Contentful Paint (LCP)
5. Measure Time to Interactive (TTI)

### User Experience Testing
1. Test rapid navigation (forward/backward)
2. Test section jumping
3. Test on slow connection
4. Test cache behavior
5. Test preload cancellation

### Browser Compatibility
1. Test WebP support detection
2. Test JPEG fallback
3. Test on Safari (no WebP support in older versions)
4. Test on Chrome, Firefox, Edge
5. Test on mobile browsers

