# Testing Guide

This guide provides instructions for manual testing on various devices and browsers.

## 19.1 Manual Testing on iOS Safari

### Requirements
- iPhone with iOS 16 or later
- Safari browser

### Test Checklist

#### Audio Playback
- [ ] Audio starts when Begin button is tapped
- [ ] Audio continues playing during navigation
- [ ] Audio crossfades smoothly between tracks
- [ ] Mute button works correctly
- [ ] Audio persists when switching between sections

#### Animations
- [ ] Landing page particles animate smoothly
- [ ] Text slides animate line-by-line
- [ ] Photos zoom smoothly (Ken Burns effect)
- [ ] Section transitions crossfade smoothly
- [ ] Heart animations appear on double-tap
- [ ] No jank or stuttering during animations

#### Touch Gestures
- [ ] Tap Begin button to start
- [ ] Swipe left/right to navigate slides
- [ ] Tap left/right half of screen for navigation
- [ ] Double-tap photos for heart animation
- [ ] Long-press photos for full-screen view
- [ ] Pinch-to-zoom works in full-screen
- [ ] Tap progress bar to navigate
- [ ] Long-press progress bar for chapter menu

#### Layout
- [ ] Portrait orientation displays correctly
- [ ] Landscape shows rotation prompt
- [ ] Safe areas respected (notch, home indicator)
- [ ] No content cut off or overlapping
- [ ] Controls are easily tappable (44x44px minimum)

### Known iOS Issues
- Autoplay may be blocked - audio should start on Begin button tap
- Video may require user interaction to play
- Background audio may pause when switching apps

## 19.2 Manual Testing on Chrome Android

### Requirements
- Android device with Chrome 110 or later

### Test Checklist

#### Audio Playback
- [ ] Audio starts when Begin button is tapped
- [ ] Audio continues during navigation
- [ ] Crossfades work smoothly
- [ ] Mute button functions correctly
- [ ] No audio glitches or stuttering

#### Animations
- [ ] All animations run at 60fps
- [ ] No dropped frames during transitions
- [ ] Particle system performs well
- [ ] Ken Burns effect is smooth
- [ ] Heart animations don't cause lag

#### Touch Gestures
- [ ] All touch interactions work
- [ ] Swipe gestures are responsive
- [ ] Double-tap detection works
- [ ] Long-press triggers correctly
- [ ] Multi-touch (pinch-to-zoom) works

#### Layout
- [ ] Responsive design adapts correctly
- [ ] No layout shifts during loading
- [ ] Controls are accessible
- [ ] Text is readable
- [ ] Images display correctly

### Known Android Issues
- Some devices may have slower animations
- Video playback may vary by device
- Battery saver mode may affect performance

## 19.3 Performance Testing

### Tools
- Chrome DevTools Lighthouse
- WebPageTest
- Chrome DevTools Performance tab

### Lighthouse Audit

#### Steps
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Mobile" device
4. Select "Performance" category
5. Click "Analyze page load"

#### Target Metrics
- [ ] Performance Score: ≥ 90
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] Total Blocking Time: < 300ms

### Network Throttling

#### Test on 4G Network
1. Open Chrome DevTools
2. Go to Network tab
3. Select "Fast 4G" throttling
4. Reload page and test experience

#### Checklist
- [ ] Page loads within 5 seconds
- [ ] Images load progressively
- [ ] Audio starts without long delay
- [ ] No timeout errors
- [ ] Experience remains usable

### Performance Optimization Tips
- Compress images to WebP
- Reduce audio file sizes
- Optimize video bitrate
- Enable caching headers
- Use CDN for assets

## 19.4 Accessibility Testing

### Screen Reader Testing

#### iOS VoiceOver
1. Settings → Accessibility → VoiceOver → On
2. Triple-click home button to toggle

#### Android TalkBack
1. Settings → Accessibility → TalkBack → On
2. Volume keys to toggle

#### Checklist
- [ ] All interactive elements are announced
- [ ] ARIA labels are present and descriptive
- [ ] Navigation order is logical
- [ ] Slide changes are announced
- [ ] Images have alt text
- [ ] Buttons have clear labels

### Keyboard Navigation

#### Checklist
- [ ] Spacebar toggles play/pause
- [ ] Arrow keys navigate slides
- [ ] Tab key moves between controls
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Focus indicators are visible

### Color Contrast

#### Tools
- Chrome DevTools Accessibility panel
- WebAIM Contrast Checker

#### Checklist
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Interactive elements are distinguishable
- [ ] Focus indicators are visible
- [ ] Color is not the only indicator

### Touch Target Sizes

#### Checklist
- [ ] All buttons are at least 44x44px
- [ ] Adequate spacing between targets
- [ ] Easy to tap on mobile devices
- [ ] No accidental taps

## 19.5 Cross-Browser Testing

### Desktop Browsers

#### Chrome (Latest)
- [ ] All features work
- [ ] Animations are smooth
- [ ] Audio plays correctly
- [ ] Video plays correctly

#### Firefox (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Layout is correct

#### Safari (Latest)
- [ ] All features work
- [ ] Audio/video work
- [ ] Animations are smooth
- [ ] No layout issues

### Mobile Browsers

#### iOS Safari 16+
- [ ] Primary target - all features must work
- [ ] Audio autoplay handled correctly
- [ ] Touch gestures work
- [ ] Performance is good

#### Chrome Android 110+
- [ ] Primary target - all features must work
- [ ] All interactions work
- [ ] Performance is acceptable
- [ ] No crashes or errors

### Known Browser Differences
- Safari may block autoplay more aggressively
- Firefox may have different audio behavior
- Chrome has best performance overall
- Mobile browsers have varying video support

## Testing Checklist Summary

### Critical (Must Pass)
- [ ] Audio plays on iOS Safari
- [ ] Audio plays on Chrome Android
- [ ] All navigation works on mobile
- [ ] Video plays and can be downloaded
- [ ] Replay functionality works
- [ ] No crashes or errors

### Important (Should Pass)
- [ ] Lighthouse score ≥ 90
- [ ] LCP < 2.5s
- [ ] All animations smooth
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

### Nice to Have
- [ ] Works on desktop browsers
- [ ] Reduced motion respected
- [ ] Offline functionality
- [ ] PWA installable

## Reporting Issues

When reporting issues, include:
1. Device model and OS version
2. Browser name and version
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots or video if possible
6. Console errors (if any)

## Sign-Off

Before deployment, ensure:
- [ ] All critical tests pass
- [ ] Performance targets met
- [ ] Accessibility requirements met
- [ ] No blocking bugs
- [ ] Tested on real devices
- [ ] Stakeholder approval received
