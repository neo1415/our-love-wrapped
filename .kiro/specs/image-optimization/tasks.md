# Implementation Tasks: Image Loading Performance Optimization

## Phase 1: Image Compression (Immediate Impact - Do This First!)

### Task 1.1: Install Image Compression Dependencies
- [ ] Install sharp package: `npm install sharp`
- [ ] Verify sharp installation works
- _Requirements: 2.1_

### Task 1.2: Create Image Compression Script
- [ ] Create `scripts/compress-images.js`
- [ ] Implement compression function with sharp
- [ ] Set quality to 80% for WebP
- [ ] Set max width to 1920px
- [ ] Add file size comparison logging
- [ ] Add progress indicators
- _Requirements: 2.1, 2.2, 2.3, 2.5_

### Task 1.3: Compress All Existing Images
- [ ] Run compression script on `public/photos/`
- [ ] Verify all images compressed successfully
- [ ] Check visual quality of compressed images
- [ ] Document file size savings
- [ ] Keep original files as backup (optional)
- _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

### Task 1.4: Update Image Paths to Use WebP
- [ ] Update `config/content.config.ts` to use .webp extensions
- [ ] Update background image path to .webp
- [ ] Test that all images load correctly
- [ ] Verify no broken images
- _Requirements: 9.1, 9.2_

## Phase 2: Aggressive Preloading (Quick Win)

### Task 2.1: Create Image Preload Manager
- [ ] Create `lib/images/ImagePreloadManager.ts`
- [ ] Implement preload queue with AbortController
- [ ] Implement priority-based preloading
- [ ] Add preload cancellation logic
- [ ] Add logging for debugging
- _Requirements: 1.1, 1.2, 1.3, 1.5, 10.1, 10.2, 10.3_

### Task 2.2: Integrate Preload Manager into StoryContainer
- [ ] Import ImagePreloadManager in StoryContainer
- [ ] Initialize preload manager
- [ ] Call preload on section/slide change
- [ ] Preload next 5 slides instead of 3
- [ ] Preload entire next section when near boundary
- _Requirements: 1.1, 1.2, 1.3, 4.2, 4.3, 4.4_

### Task 2.3: Implement Preload Cancellation
- [ ] Cancel preloads when navigating away
- [ ] Cancel preloads when jumping sections
- [ ] Use AbortController for cancellation
- [ ] Log cancelled preloads
- _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

### Task 2.4: Add Priority-Based Loading
- [ ] Load current slide with highest priority
- [ ] Load next 3 slides with high priority
- [ ] Load next section with medium priority
- [ ] Load distant slides with low priority
- _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

## Phase 3: Progressive Loading (Better UX)

### Task 3.1: Create Progressive Image Component
- [ ] Create `components/Images/ProgressiveImage.tsx`
- [ ] Implement blur placeholder support
- [ ] Add smooth transition when image loads
- [ ] Add loading state management
- [ ] Add error handling
- _Requirements: 3.1, 3.2, 3.3, 3.5_

### Task 3.2: Generate Blur Placeholders
- [ ] Create script to generate tiny placeholders
- [ ] Generate 10% size placeholders for all images
- [ ] Apply 20px blur to placeholders
- [ ] Save placeholders in separate folder
- _Requirements: 3.1, 3.3, 3.4_

### Task 3.3: Replace Image Tags with ProgressiveImage
- [ ] Update PhotoSlide to use ProgressiveImage
- [ ] Update PhotoCollage to use ProgressiveImage
- [ ] Update background image to use ProgressiveImage
- [ ] Test smooth transitions
- _Requirements: 3.1, 3.2, 3.5_

### Task 3.4: Add Loading State Indicators
- [ ] Create loading spinner component
- [ ] Create skeleton placeholder component
- [ ] Use burgundy color for indicators
- [ ] Fade out indicators when loaded
- _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

## Phase 4: Network Awareness (Adaptive)

### Task 4.1: Create Network Adapter
- [ ] Create `lib/images/NetworkAdapter.ts`
- [ ] Implement connection detection
- [ ] Implement preload distance calculation
- [ ] Implement quality selection
- [ ] Add connection change listeners
- _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

### Task 4.2: Integrate Network Adapter
- [ ] Import NetworkAdapter in StoryContainer
- [ ] Adjust preload distance based on connection
- [ ] Adjust image quality based on connection
- [ ] Log connection changes
- _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

### Task 4.3: Implement Adaptive Loading
- [ ] Load lower quality on slow connections
- [ ] Load full quality on fast connections
- [ ] Reduce preload distance on slow connections
- [ ] Increase preload distance on fast connections
- _Requirements: 8.1, 8.2, 8.4, 8.5_

## Phase 5: Caching (Performance)

### Task 5.1: Create Image Cache Manager
- [ ] Create `lib/images/ImageCacheManager.ts`
- [ ] Implement in-memory cache with Map
- [ ] Implement LRU eviction policy
- [ ] Set max cache size to 100 images
- [ ] Add cache hit/miss logging
- _Requirements: 6.1, 6.2_

### Task 5.2: Integrate Cache Manager
- [ ] Import ImageCacheManager in StoryContainer
- [ ] Use cache for all image loads
- [ ] Return cached images instantly
- [ ] Add images to cache after loading
- _Requirements: 6.1, 6.2, 6.5_

### Task 5.3: Implement Cache Persistence
- [ ] Use sessionStorage for cache persistence
- [ ] Restore cache on page reload
- [ ] Clear cache on app reset
- _Requirements: 6.5_

### Task 5.4: Add Cache Headers
- [ ] Update vercel.json with cache headers
- [ ] Set 1 year cache for images
- [ ] Set immutable flag for images
- _Requirements: 6.3_

## Phase 6: Testing and Validation

### Task 6.1: Performance Testing
- [ ] Measure load times with Chrome DevTools
- [ ] Test on throttled 3G connection
- [ ] Test on fast 4G connection
- [ ] Measure LCP (should be < 2.5s)
- [ ] Measure TTI (should be < 3s)
- [ ] Document performance improvements

### Task 6.2: User Experience Testing
- [ ] Test rapid forward navigation
- [ ] Test rapid backward navigation
- [ ] Test section jumping
- [ ] Test on slow connection
- [ ] Test cache behavior
- [ ] Test preload cancellation

### Task 6.3: Browser Compatibility Testing
- [ ] Test WebP support on Chrome
- [ ] Test WebP support on Firefox
- [ ] Test WebP support on Safari
- [ ] Test JPEG fallback on older browsers
- [ ] Test on mobile browsers (iOS Safari, Chrome Android)

### Task 6.4: Visual Quality Testing
- [ ] Verify compressed images look good
- [ ] Verify blur placeholders look good
- [ ] Verify transitions are smooth
- [ ] Verify no visual glitches
- [ ] Test on various screen sizes

## Phase 7: Documentation and Deployment

### Task 7.1: Update Documentation
- [ ] Document compression script usage
- [ ] Document preload manager configuration
- [ ] Document network adapter settings
- [ ] Document cache manager behavior
- [ ] Add troubleshooting guide

### Task 7.2: Deploy and Monitor
- [ ] Deploy to Vercel
- [ ] Monitor load times in production
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Make adjustments as needed

## Success Criteria

The optimization is complete when:
- All images are compressed to WebP format
- File sizes reduced by 60-80%
- First slide visible in < 1 second
- Navigation feels instant (< 100ms delay)
- No blank screens during navigation
- Works well on slow 3G connections
- Cache provides instant navigation to previous slides
- All tests pass
- Performance metrics meet targets

## Quick Start (Minimum Viable Optimization)

If you want the fastest improvement with minimal work:

1. **Do Task 1.1-1.4 first** (Image Compression)
   - This alone will give you 60-80% file size reduction
   - Biggest impact for least effort
   
2. **Then do Task 2.1-2.2** (Aggressive Preloading)
   - This will make navigation feel instant
   - Quick to implement

3. **Everything else is optional** but recommended for best experience

