# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the Our Love Wrapped experience.

## Table of Contents

1. [Development Issues](#development-issues)
2. [Content Issues](#content-issues)
3. [Audio Issues](#audio-issues)
4. [Video Issues](#video-issues)
5. [Photo Issues](#photo-issues)
6. [Navigation Issues](#navigation-issues)
7. [Performance Issues](#performance-issues)
8. [Mobile Issues](#mobile-issues)
9. [Deployment Issues](#deployment-issues)
10. [Browser Compatibility](#browser-compatibility)

## Development Issues

### Cannot Start Development Server

**Error: "Command not found: npm"**

Solution:
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Verify installation: `node --version` (should be 18.x or higher)
3. Try again: `npm run dev`

**Error: "Cannot find module"**

Solution:
1. Install dependencies: `npm install`
2. Clear cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Error: "Port 3000 already in use"**

Solution:
1. Kill the process using port 3000:
   - Mac/Linux: `lsof -ti:3000 | xargs kill -9`
   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
2. Or use a different port: `npm run dev -- -p 3001`

### Build Fails

**Error: "Type error: ..."**

Solution:
1. Check TypeScript errors: `npm run type-check`
2. Fix type errors in the reported files
3. Ensure all imports are correct
4. Rebuild: `npm run build`

**Error: "Out of memory"**

Solution:
1. Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
2. Close other applications
3. Restart your computer

## Content Issues

### Configuration Validation Error

**Error: "Invalid configuration: ..."**

Solution:
1. Open browser console (F12) to see detailed error
2. Check `config/content.config.ts` for:
   - Missing required fields
   - Incorrect data types
   - Invalid section IDs (must be 0-7)
   - Invalid audio track section references
3. Compare with the example in `CONTENT-CUSTOMIZATION-GUIDE.md`

### Text Formatting Not Working

**Issue: Markers like `*text*` appear literally**

Solution:
1. Ensure markers are properly formatted:
   - `*text*` for italic (no spaces inside asterisks)
   - `**text**` for bold
   - `{{name}}` for pet names
2. Check for escaped characters in your text
3. Verify TextSlide component is rendering correctly

### Slides Not Appearing

**Issue: Some slides don't show up**

Solution:
1. Check slide duration is set (minimum 1000ms)
2. Verify slide type is either 'text' or 'photo'
3. For photo slides, ensure `content` and `altText` are provided
4. Check browser console for errors

### Section Titles Not Showing

**Issue: Chapter menu shows wrong titles**

Solution:
1. Verify each section has a `title` field
2. Check that section IDs are sequential (0-7)
3. Ensure no duplicate section IDs
4. Rebuild: `npm run build`

## Audio Issues

### Audio Not Playing

**Issue: No audio when clicking Begin button**

Solution:
1. Check browser console for audio load errors
2. Verify audio files exist in `public/audio/`
3. Ensure file paths in config start with `/audio/`
4. Check file format (MP3 recommended)
5. Test audio file directly in browser
6. Check file size (< 10MB recommended)

**Issue: Audio plays on desktop but not mobile**

Solution:
1. This is expected behavior due to autoplay policies
2. Audio should start when user taps "Begin" button
3. Ensure you're testing the Begin button, not just loading the page
4. Try different mobile browsers (Safari, Chrome)
5. Check that audio files are in MP3 format

### Audio Cuts Out or Stops

**Issue: Audio stops playing during experience**

Solution:
1. Check browser console for errors
2. Verify audio files are not corrupted
3. Test audio files in a media player
4. Check file size (< 10MB recommended)
5. Ensure stable internet connection
6. Try re-encoding audio files

### Audio Crossfade Not Working

**Issue: Abrupt transition between tracks**

Solution:
1. Verify multiple audio tracks are configured
2. Check that sections are mapped to different tracks
3. Ensure crossfade duration is set (default 2000ms)
4. Check browser console for errors
5. Test on different browsers

### Audio Out of Sync

**Issue: Audio doesn't match current section**

Solution:
1. Check audio track section mappings in config
2. Verify section IDs in audio tracks array
3. Ensure no duplicate section IDs
4. Test navigation between sections
5. Check browser console for timing errors

### Mute Button Not Working

**Issue: Mute button doesn't silence audio**

Solution:
1. Check browser console for errors
2. Verify AudioManager is initialized
3. Test on different browsers
4. Check that audio is actually playing first
5. Try refreshing the page

## Video Issues

### Video Not Playing

**Issue: Video doesn't start or shows error**

Solution:
1. Check browser console for video load errors
2. Verify video file exists in `public/video/`
3. Ensure file path in config starts with `/video/`
4. Check file format (MP4 with H.264 codec required)
5. Test video file directly in browser
6. Check file size (< 100MB recommended)

**Issue: Video plays on desktop but not mobile**

Solution:
1. Verify video codec is H.264 (not H.265/HEVC)
2. Check video resolution (720p recommended)
3. Ensure video is in MP4 container format
4. Re-encode video with compatible settings:
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec aac output.mp4
   ```

### Video Transition Not Triggering

**Issue: Video never appears**

Solution:
1. Check `cuePoint` value in config
2. Verify cuePoint is within the duration of track 3
3. Ensure track 3 is playing (check section 7)
4. Check browser console for cue point detection errors
5. Test by manually navigating to section 7

### Video Quality Poor

**Issue: Video looks pixelated or blurry**

Solution:
1. Check source video resolution
2. Re-encode at higher bitrate:
   ```bash
   ffmpeg -i input.mp4 -b:v 3M output.mp4
   ```
3. Use 720p or 1080p resolution
4. Ensure source video is high quality

### Video Download Not Working

**Issue: Download button doesn't work**

Solution:
1. Check browser console for errors
2. Verify video file path is correct
3. Test on different browsers
4. Check browser download settings
5. Ensure popup blocker isn't blocking download

## Photo Issues

### Photos Not Loading

**Issue: Photos show burgundy placeholder**

Solution:
1. Check browser console for 404 errors
2. Verify photo files exist in `public/photos/`
3. Ensure file paths in config start with `/photos/`
4. Check file names match exactly (case-sensitive)
5. Verify file extensions (.jpg, .png, .webp)

**Issue: Some photos load, others don't**

Solution:
1. Check file sizes (< 500KB recommended)
2. Verify file formats are supported (JPG, PNG, WebP)
3. Test problematic photos directly in browser
4. Re-save photos in a different format
5. Check for corrupted files

### Photos Load Slowly

**Issue: Long delay before photos appear**

Solution:
1. Optimize photo file sizes (see `ASSET-OPTIMIZATION.md`)
2. Compress photos to < 500KB each
3. Convert to WebP format
4. Reduce resolution to 1080x1920 or smaller
5. Check internet connection speed

### Ken Burns Effect Not Working

**Issue: Photos don't zoom**

Solution:
1. Check browser console for errors
2. Verify Framer Motion is installed: `npm list framer-motion`
3. Test on different browsers
4. Check that slide type is 'photo'
5. Ensure duration is set (5000ms recommended)

### Photo Interactions Not Working

**Issue: Double-tap or long-press doesn't work**

Solution:
1. Ensure you're on a photo slide (not text slide)
2. Test on touch device (not desktop with mouse)
3. Check browser console for errors
4. Verify gesture detection is enabled
5. Try different touch gestures

### Fullscreen Photo Not Closing

**Issue: Can't exit fullscreen photo view**

Solution:
1. Try swiping down
2. Try tapping outside the photo
3. Press Escape key (desktop)
4. Refresh the page
5. Check browser console for errors

## Navigation Issues

### Can't Navigate Between Slides

**Issue: Next/Previous buttons don't work**

Solution:
1. Check browser console for errors
2. Verify StoryContainer is rendering
3. Test keyboard navigation (arrow keys)
4. Check that slides exist in current section
5. Try refreshing the page

### Auto-Play Not Working

**Issue: Slides don't advance automatically**

Solution:
1. Check that auto-play is enabled (play button icon)
2. Verify slide durations are set in config
3. Check browser console for timing errors
4. Test manual navigation first
5. Try toggling play/pause button

### Progress Bar Not Updating

**Issue: Progress bar doesn't move**

Solution:
1. Check browser console for errors
2. Verify total slides calculation is correct
3. Test navigation to see if position updates
4. Check that StoryStore is connected
5. Try refreshing the page

### Chapter Menu Not Opening

**Issue: Long-press on progress bar doesn't work**

Solution:
1. Ensure you're long-pressing (hold for 500ms)
2. Test on touch device (not desktop with mouse)
3. Check browser console for errors
4. Try tapping the menu icon (if visible)
5. Verify ChapterMenu component is rendering

### Keyboard Navigation Not Working

**Issue: Arrow keys don't navigate**

Solution:
1. Ensure story page has focus (click on page)
2. Check browser console for errors
3. Verify keyboard event listeners are attached
4. Test on different browsers
5. Check for conflicting browser extensions

## Performance Issues

### Slow Loading

**Issue: Experience takes long to load**

Solution:
1. Optimize all assets (see `ASSET-OPTIMIZATION.md`)
2. Compress images to WebP format
3. Reduce audio file sizes (128 kbps)
4. Reduce video file size (720p, 2 Mbps)
5. Check internet connection speed
6. Test on different network conditions

### Laggy Animations

**Issue: Animations stutter or skip**

Solution:
1. Close other browser tabs and applications
2. Test on different device
3. Reduce animation complexity
4. Check CPU usage
5. Enable hardware acceleration in browser
6. Test on different browsers

### High Memory Usage

**Issue: Browser uses too much memory**

Solution:
1. Optimize photo file sizes
2. Reduce number of photos per section
3. Close other browser tabs
4. Restart browser
5. Test on different device

### Poor Lighthouse Score

**Issue: Performance score < 90**

Solution:
1. Optimize all assets (see `ASSET-OPTIMIZATION.md`)
2. Compress images to WebP
3. Reduce audio/video file sizes
4. Enable caching headers (already in vercel.json)
5. Test on mobile network simulation
6. Check for render-blocking resources

## Mobile Issues

### Layout Broken on Mobile

**Issue: Content doesn't fit screen**

Solution:
1. Test on actual mobile device (not just browser resize)
2. Check viewport meta tag in layout.tsx
3. Verify dvh units are used for height
4. Test in portrait orientation
5. Check for CSS overflow issues

### Touch Gestures Not Working

**Issue: Swipe or tap doesn't work**

Solution:
1. Ensure you're on a touch device
2. Check browser console for errors
3. Verify touch event listeners are attached
4. Test different gestures (tap, swipe, long-press)
5. Check for conflicting touch handlers

### Orientation Prompt Not Showing

**Issue: Landscape warning doesn't appear**

Solution:
1. Rotate device to landscape
2. Check browser console for errors
3. Verify OrientationPrompt component is rendering
4. Test on different mobile browsers
5. Check orientation detection logic

### Safe Area Issues on iOS

**Issue: Content hidden by notch or home indicator**

Solution:
1. Verify safe area insets are applied in globals.css
2. Check that `env(safe-area-inset-*)` is used
3. Test on actual iOS device (not simulator)
4. Update iOS to latest version
5. Check viewport-fit=cover in meta tag

### Audio Autoplay Blocked

**Issue: Audio doesn't start on mobile**

Solution:
1. This is expected behavior (autoplay policies)
2. Audio starts when user taps "Begin" button
3. Ensure Begin button triggers audio playback
4. Test on different mobile browsers
5. Check browser console for autoplay errors

## Deployment Issues

### Build Fails on Vercel

**Error: "Build failed"**

Solution:
1. Check build logs in Vercel Dashboard
2. Test build locally: `npm run build`
3. Verify all dependencies are in package.json
4. Check Node.js version (18.x required)
5. Ensure no TypeScript errors

### Assets Not Loading After Deploy

**Issue: 404 errors on photos/audio/video**

Solution:
1. Verify files are in `public/` directory
2. Check file paths start with `/` in config
3. Ensure files are committed to git
4. Check .gitignore doesn't exclude assets
5. Redeploy after adding files

### Custom Domain Not Working

**Issue: Domain shows error or doesn't load**

Solution:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check domain status in Vercel Dashboard
4. Ensure domain is not already in use
5. Try accessing via Vercel URL first

### Slow Performance After Deploy

**Issue: Site loads slowly on Vercel**

Solution:
1. Check Vercel Analytics for bottlenecks
2. Optimize assets (see `ASSET-OPTIMIZATION.md`)
3. Verify caching headers are applied
4. Test on different geographic locations
5. Check bandwidth usage in Vercel Dashboard

## Browser Compatibility

### Safari Issues

**Issue: Experience doesn't work in Safari**

Solution:
1. Update Safari to latest version
2. Check browser console for errors
3. Test on different Safari version
4. Verify video codec is H.264 (not H.265)
5. Check for Safari-specific CSS issues

### Chrome Issues

**Issue: Experience doesn't work in Chrome**

Solution:
1. Update Chrome to latest version
2. Check browser console for errors
3. Disable browser extensions
4. Clear cache and cookies
5. Test in incognito mode

### Firefox Issues

**Issue: Experience doesn't work in Firefox**

Solution:
1. Update Firefox to latest version
2. Check browser console for errors
3. Verify video codec compatibility
4. Test on different Firefox version
5. Check for Firefox-specific CSS issues

### Internet Explorer / Edge Legacy

**Issue: Experience doesn't work in old browsers**

Solution:
- This experience requires modern browsers
- Minimum versions:
  - iOS Safari 16+
  - Chrome Android 110+
  - Desktop Chrome 100+
  - Desktop Safari 15+
  - Desktop Firefox 100+
- Internet Explorer is not supported
- Recommend upgrading to modern browser

## Getting Help

If you're still experiencing issues:

1. Check browser console (F12) for error messages
2. Review relevant documentation:
   - `CONTENT-CUSTOMIZATION-GUIDE.md`
   - `DEPLOYMENT-GUIDE.md`
   - `ASSET-OPTIMIZATION.md`
   - `TESTING-GUIDE.md`
3. Test on different browsers and devices
4. Try the experience on the demo URL (if available)
5. Check Vercel status page for service issues

## Common Error Messages

### "Failed to load resource: net::ERR_FILE_NOT_FOUND"

**Cause:** File path is incorrect or file doesn't exist

**Solution:**
1. Check file exists in `public/` directory
2. Verify file path in config starts with `/`
3. Check file name matches exactly (case-sensitive)

### "Uncaught TypeError: Cannot read property '...' of undefined"

**Cause:** Missing data in configuration or state

**Solution:**
1. Check configuration is complete
2. Verify all required fields are present
3. Check browser console for specific property name
4. Review config structure in `CONTENT-CUSTOMIZATION-GUIDE.md`

### "DOMException: The play() request was interrupted"

**Cause:** Audio/video playback interrupted by browser

**Solution:**
1. This is normal behavior (autoplay policies)
2. Ensure playback starts on user interaction
3. Check that Begin button triggers playback
4. Test on different browsers

### "Error: Hydration failed"

**Cause:** Server-rendered HTML doesn't match client

**Solution:**
1. Check for dynamic content in components
2. Verify no browser-only APIs in initial render
3. Use `useEffect` for client-only code
4. Clear `.next` cache and rebuild

## Prevention Tips

To avoid common issues:

1. **Test locally before deploying**
   - Run `npm run dev` and test thoroughly
   - Test on actual mobile devices
   - Check browser console for errors

2. **Optimize assets before adding**
   - Compress images to < 500KB
   - Compress audio to < 10MB
   - Compress video to < 100MB
   - Use recommended formats (WebP, MP3, MP4)

3. **Validate configuration**
   - Use TypeScript for type checking
   - Test configuration changes immediately
   - Keep backups of working configurations

4. **Monitor performance**
   - Run Lighthouse tests regularly
   - Check Vercel Analytics
   - Test on slow network conditions

5. **Keep dependencies updated**
   - Run `npm update` periodically
   - Check for security vulnerabilities
   - Test after updates

## Debug Mode

To enable detailed logging:

1. Open browser console (F12)
2. Look for error messages and warnings
3. Check Network tab for failed requests
4. Check Console tab for JavaScript errors
5. Check Application tab for storage issues

## Still Need Help?

If you've tried everything and still have issues:

1. Document the exact steps to reproduce
2. Note your browser and device information
3. Capture screenshots or screen recordings
4. Check browser console for error messages
5. Review all documentation files again

The issue is likely related to:
- File paths or missing files (most common)
- Browser compatibility
- Asset optimization
- Configuration errors
- Network/deployment issues
