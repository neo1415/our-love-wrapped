# Implementation Plan: Our Love Wrapped

## Overview

This implementation plan breaks down the Our Love Wrapped feature into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout to catch errors early. The plan prioritizes core functionality first, then adds polish and error handling.

## Tasks

- [x] 1. Project setup and configuration foundation
  - Initialize Next.js 14 project with TypeScript and App Router
  - Configure Tailwind CSS and install dependencies (Framer Motion, Howler.js, Zustand, fast-check)
  - Set up directory structure (app/, components/, lib/, config/, public/)
  - Configure Next.js for static export in next.config.js
  - Set up Google Fonts (Cormorant Garamond, Playfair Display, Inter) in layout.tsx
  - _Requirements: 18.1, 18.2, 26.5, 26.6, 26.7_

- [x] 2. Content configuration system
  - [x] 2.1 Create TypeScript types for content configuration
    - Define ContentConfig, Section, Slide, AudioTrack, VideoConfig interfaces in types/content.d.ts
    - Add type definitions for names, dates, photos, audio, video, and text content
    - _Requirements: 29.1, 29.2, 29.4_
  
  - [x] 2.2 Create content.config.ts template with example data
    - Implement config file with all required fields and TypeScript types
    - Add inline comments explaining each configuration option
    - Include example data for all 8 sections with placeholder paths
    - _Requirements: 29.2, 29.3, 16.1, 19.1_
  
  - [x] 2.3 Implement content loader and validator
    - Create lib/content/contentLoader.ts to load and process configuration
    - Create lib/content/validator.ts for runtime validation
    - Process sections to calculate positions and audio track mappings
    - _Requirements: 29.5, 1.4_
  
  - [ ]*  2.4 Write property test for configuration round-trip
    - **Property 13: Configuration round-trip**
    - **Validates: Requirements 1.4, 7.5, 8.6, 9.6, 9.7, 11.3, 13.1, 14.1, 15.1, 16.1, 17.1, 19.1, 19.2**
  
  - [ ]* 2.5 Write property test for configuration validation
    - **Property 20: Configuration validation**
    - **Validates: Requirements 29.4, 29.5**

- [x] 3. State management foundation
  - [x] 3.1 Create Zustand store for story state
    - Implement lib/state/storyStore.ts with StoryState interface
    - Add state for navigation (currentSection, currentSlide, totalSlides)
    - Add state for playback (isPlaying, isPaused, isComplete)
    - Add state for audio (isMuted, currentTrack)
    - Add state for UI (showChapterMenu, showFullScreen)
    - Implement actions: nextSlide, previousSlide, goToSection, togglePlayPause, toggleMute, reset
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_
  
  - [ ]* 3.2 Write property test for state consistency
    - **Property 19: State consistency**
    - **Validates: Requirements 28.1, 28.2, 28.3, 28.4, 28.5**
  
  - [ ]* 3.3 Write unit tests for state transitions
    - Test nextSlide increments slide correctly
    - Test previousSlide decrements slide correctly
    - Test goToSection updates section and resets slide
    - Test togglePlayPause toggles isPlaying
    - Test toggleMute toggles isMuted
    - _Requirements: 28.6_

- [x] 4. Audio management system
  - [x] 4.1 Implement AudioManager class with Howler.js
    - Create lib/audio/AudioManager.ts wrapping Howler.js
    - Implement play, pause, resume, setMute methods
    - Implement getCurrentTime and onTimeUpdate for cue point detection
    - Add error handling for audio load failures
    - _Requirements: 5.1, 6.1, 6.2, 22.1, 22.4_
  
  - [x] 4.2 Implement crossfade functionality
    - Create lib/audio/crossfade.ts with crossfade logic
    - Implement 2-second crossfade with volume ramping
    - Add crossfade method to AudioManager
    - _Requirements: 5.3_
  
  - [ ]* 4.3 Write property test for audio continuity
    - **Property 3: Audio continuity during navigation**
    - **Validates: Requirements 2.5, 3.6, 5.2, 5.8**
  
  - [ ]* 4.4 Write property test for audio track crossfade
    - **Property 4: Audio track crossfade**
    - **Validates: Requirements 5.3**
  
  - [ ]* 4.5 Write property test for section-to-track mapping
    - **Property 5: Section-to-track mapping**
    - **Validates: Requirements 5.4, 5.5, 5.6, 5.7**
  
  - [ ]* 4.6 Write property test for mute state persistence
    - **Property 6: Mute state persistence**
    - **Validates: Requirements 6.3, 6.4, 6.5**
  
  - [ ]* 4.7 Write property test for mute/unmute round-trip
    - **Property 7: Mute/unmute round-trip**
    - **Validates: Requirements 6.2**
  
  - [ ]* 4.8 Write property test for audio load failure graceful degradation
    - **Property 16: Audio load failure graceful degradation**
    - **Validates: Requirements 22.1, 22.2, 22.3, 22.4, 22.5**

- [x] 5. Checkpoint - Core systems functional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Landing page components
  - [x] 6.1 Create LandingScreen component
    - Implement components/Landing/LandingScreen.tsx
    - Display names/initials from config
    - Display relationship date from config
    - Apply design system colors and fonts
    - _Requirements: 1.1, 1.2, 19.3, 19.4_
  
  - [x] 6.2 Create BeginButton component
    - Implement components/Landing/BeginButton.tsx with Framer Motion animation
    - Handle click to start audio and transition to story
    - Implement autoplay policy handling (start audio on user interaction)
    - _Requirements: 1.3, 1.5, 23.1, 23.2_
  
  - [x] 6.3 Create landing page route
    - Implement app/page.tsx with LandingScreen
    - Wire up BeginButton to start audio and navigate to story
    - Add Particles component for background effect
    - _Requirements: 1.5, 26.8_
  
  - [x] 6.4 Create Particles component
    - Implement components/Effects/ParticleSystem.tsx with 15-20 particles
    - Use burgundy and rose-gold colors at 20-40% opacity
    - Implement slow upward drift with horizontal wobble
    - _Requirements: 26.8_

- [x] 7. Story page foundation
  - [x] 7.1 Create StoryContainer component
    - Implement components/Story/StoryContainer.tsx as main orchestrator
    - Connect to storyStore for state management
    - Implement section and slide rendering logic
    - Handle auto-play and manual mode switching
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1_
  
  - [x] 7.2 Create TextSlide component
    - Implement components/Story/TextSlide.tsx with Framer Motion
    - Parse emphasis markers (*text*, **text**) and pet name markers ({{name}})
    - Implement line-by-line slide-up animation (800ms per line)
    - Apply design system fonts and colors
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 7.3 Create PhotoSlide component
    - Implement components/Story/PhotoSlide.tsx with Ken Burns effect
    - Implement fade-in + scale animation (1000ms)
    - Implement zoom from 100% to 108% over 8 seconds
    - Add burgundy glow border effect
    - _Requirements: 8.1, 8.2_
  
  - [x] 7.4 Create story page route
    - Implement app/story/page.tsx with StoryContainer
    - Add ProgressBar, PlayPauseButton, MuteButton components
    - Wire up navigation controls
    - _Requirements: 2.1, 2.2, 3.1_
  
  - [ ]* 7.5 Write property test for auto-play timing consistency
    - **Property 1: Auto-play timing consistency**
    - **Validates: Requirements 2.1, 2.2**
  
  - [ ]* 7.6 Write property test for manual navigation
    - **Property 2: Manual navigation advances correctly**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**
  
  - [ ]* 7.7 Write property test for text marker parsing
    - **Property 8: Text marker parsing**
    - **Validates: Requirements 7.2, 7.3**

- [x] 8. Navigation controls
  - [x] 8.1 Create PlayPauseButton component
    - Implement components/Controls/PlayPauseButton.tsx
    - Toggle between auto-play and manual mode
    - Display appropriate icon (play/pause)
    - _Requirements: 3.1, 2.3_
  
  - [x] 8.2 Create NavigationButtons component
    - Implement components/Controls/NavigationButtons.tsx
    - Add back and forward buttons for manual navigation
    - Handle tap on left/right half of screen
    - Implement swipe gesture detection
    - _Requirements: 3.2, 3.3, 3.4, 3.5_
  
  - [x] 8.3 Create MuteButton component
    - Implement components/Controls/MuteButton.tsx
    - Toggle mute state in audio manager
    - Display appropriate icon (muted/unmuted)
    - Persist mute state across sections
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 8.4 Create ProgressBar component
    - Implement components/Story/ProgressBar.tsx
    - Display progress through all slides
    - Show chapter markers at section boundaries
    - Handle tap to navigate to position
    - Handle long-press to show chapter menu
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_
  
  - [x] 8.5 Create ChapterMenu component
    - Implement components/Controls/ChapterMenu.tsx
    - Display chapter list with titles
    - Handle chapter selection
    - Trigger navigation to selected chapter
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 8.6 Write property test for chapter navigation
    - **Property 10: Chapter navigation correctness**
    - **Validates: Requirements 4.2, 4.3, 4.4**
  
  - [ ]* 8.7 Write property test for playback mode persistence
    - **Property 11: Playback mode persistence**
    - **Validates: Requirements 4.5**
  
  - [ ]* 8.8 Write property test for progress bar synchronization
    - **Property 17: Progress bar synchronization**
    - **Validates: Requirements 27.3, 4.4**
  
  - [ ]* 8.9 Write property test for progress bar navigation
    - **Property 18: Progress bar navigation**
    - **Validates: Requirements 27.4**

- [x] 9. Photo interactions
  - [x] 9.1 Create HeartAnimation component
    - Implement components/Effects/HeartAnimation.tsx
    - Display 5-8 floating hearts on double-tap
    - Use burgundy and rose-gold colors
    - Animate hearts floating upward and fading
    - _Requirements: 8.3_
  
  - [x] 9.2 Create FullScreenPhoto component
    - Implement components/Effects/FullScreenPhoto.tsx
    - Display photo in full-screen overlay
    - Support pinch-to-zoom gesture
    - Handle tap or swipe to close
    - _Requirements: 8.4, 8.5_
  
  - [x] 9.3 Integrate photo interactions into PhotoSlide
    - Add double-tap detection to PhotoSlide
    - Add long-press detection to PhotoSlide
    - Trigger HeartAnimation on double-tap
    - Trigger FullScreenPhoto on long-press
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [ ]* 9.4 Write property test for photo interaction state transitions
    - **Property 9: Photo interaction state transitions**
    - **Validates: Requirements 8.3, 8.4, 8.5**

- [x] 10. Checkpoint - Story experience functional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Video transition and playback
  - [x] 11.1 Create VideoTransition component
    - Implement components/Story/VideoTransition.tsx
    - Implement heartbeat pulse animation (1s)
    - Implement fade to black (500ms)
    - Implement fade in video (300ms)
    - Trigger on cue point detection
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 11.2 Create VideoPlayer component
    - Implement components/Video/VideoPlayer.tsx
    - Use HTML5 video element
    - Play video with audio track
    - Handle video completion
    - _Requirements: 9.5_
  
  - [x] 11.3 Integrate cue point detection
    - Add time update listener to AudioManager
    - Detect when JVKE track reaches cue point
    - Trigger video transition sequence
    - Switch to video audio track
    - _Requirements: 9.1, 15.1, 15.2, 15.3, 15.4_
  
  - [x] 11.4 Create DownloadButton component
    - Implement components/Video/DownloadButton.tsx
    - Trigger native browser download on tap
    - Display after video completion
    - Use meaningful filename from config
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 11.5 Write property test for video transition timing
    - **Property 12: Video transition timing**
    - **Validates: Requirements 9.1**

- [x] 12. Final screen and replay
  - [x] 12.1 Create FinalScreen component
    - Implement components/Story/FinalScreen.tsx
    - Display "I Love You" message from config
    - Display DownloadButton
    - Display replay button
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 12.2 Implement replay functionality
    - Add reset action to storyStore
    - Reset all state to initial conditions
    - Navigate back to landing screen
    - Reset audio to beginning of first track
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 12.3 Write property test for state reset completeness
    - **Property 14: State reset completeness**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

- [x] 13. Error handling and resilience
  - [x] 13.1 Implement photo load failure handling
    - Create BurgundyPlaceholder component
    - Add onError handler to PhotoSlide
    - Display placeholder on photo load failure
    - Log error to console
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_
  
  - [x] 13.2 Implement audio load failure handling
    - Add error handling to AudioManager
    - Continue experience silently on audio failure
    - Maintain timing with setTimeout fallbacks
    - Log error to console
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  
  - [x] 13.3 Implement browser autoplay policy handling
    - Detect autoplay policy blocks in AudioManager
    - Start audio on first user interaction (Begin button)
    - Synchronize audio with current section
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_
  
  - [x] 13.4 Implement video load failure handling
    - Add onError handler to VideoPlayer
    - Display error message with retry and skip buttons
    - Log error to console
    - _Requirements: 9.5_
  
  - [x] 13.5 Implement configuration validation
    - Create validator.ts with Zod schema
    - Validate configuration on load
    - Show error overlay for invalid config
    - _Requirements: 29.4, 29.5_
  
  - [ ]* 13.6 Write property test for photo load failure graceful degradation
    - **Property 15: Photo load failure graceful degradation**
    - **Validates: Requirements 21.1, 21.2, 21.3, 21.5**

- [x] 14. Accessibility features
  - [x] 14.1 Add keyboard navigation support
    - Implement spacebar for play/pause toggle
    - Implement arrow keys for slide navigation
    - Add keyboard event listeners to StoryContainer
    - _Requirements: 30.1, 30.2_
  
  - [x] 14.2 Add ARIA labels and alt text
    - Add alt text to all photos from config
    - Add ARIA labels to all interactive controls
    - Add ARIA live regions for slide changes
    - _Requirements: 30.3, 30.4_
  
  - [x] 14.3 Implement focus management
    - Ensure focus moves to appropriate elements on navigation
    - Add visible focus indicators
    - Prevent focus loss during transitions
    - _Requirements: 30.5_
  
  - [ ]* 14.4 Write property test for accessibility attributes presence
    - **Property 21: Accessibility attributes presence**
    - **Validates: Requirements 30.3, 30.4**
  
  - [ ]* 14.5 Write property test for focus management
    - **Property 22: Focus management during navigation**
    - **Validates: Requirements 30.5**

- [x] 15. Orientation and mobile optimizations
  - [x] 15.1 Create OrientationPrompt component
    - Implement components/Effects/OrientationPrompt.tsx
    - Detect landscape orientation
    - Display rotation prompt overlay
    - Hide prompt when rotated to portrait
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_
  
  - [x] 15.2 Implement mobile-first responsive design
    - Use dvh (dynamic viewport height) for mobile browsers
    - Respect iOS safe areas with env(safe-area-inset-*)
    - Optimize touch targets (minimum 44x44px)
    - Test on iOS Safari 16+ and Chrome Android 110+
    - _Requirements: 25.3, 25.4_
  
  - [x] 15.3 Optimize performance for mobile
    - Implement lazy loading for images
    - Preload critical assets (audio, first section photos)
    - Use Next.js Image component with WebP format
    - Optimize animations for mobile CPUs
    - _Requirements: 25.1, 25.2, 25.5, 25.6, 18.3, 18.4, 18.5_

- [x] 16. Design system implementation
  - [x] 16.1 Create CSS variables and global styles
    - Define color palette in globals.css
    - Define typography scale
    - Define animation keyframes
    - Set up Tailwind CSS configuration
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6, 26.7, 26.9_
  
  - [x] 16.2 Implement section crossfade transitions
    - Add crossfade animation between sections
    - Use 1200ms duration with ease-in-out easing
    - Maintain audio continuity during crossfade
    - _Requirements: 26.9_

- [x] 17. Integration testing
  - [x] 17.1 Write integration test for complete story flow
    - Test landing → story → video → final screen flow
    - Verify audio plays continuously throughout
    - Verify state updates correctly at each step
    - _Requirements: All_
  
  - [x] 17.2 Write integration test for navigation scenarios
    - Test manual navigation through all sections
    - Test chapter jumping
    - Test auto-play mode
    - Verify audio synchronization
    - _Requirements: 2.1-2.5, 3.1-3.6, 4.1-4.5_
  
  - [x] 17.3 Write integration test for error scenarios
    - Test photo load failures
    - Test audio load failures
    - Test video load failures
    - Verify graceful degradation
    - _Requirements: 21.1-21.5, 22.1-22.5_

- [x] 18. Deployment preparation
  - [x] 18.1 Configure Next.js for static export
    - Set output: 'export' in next.config.js
    - Configure image optimization for static export
    - Add trailing slash configuration
    - _Requirements: 18.1, 18.2_
  
  - [x] 18.2 Create Vercel configuration
    - Create vercel.json with build settings
    - Configure cache headers for static assets
    - Set up custom domain (optional)
    - _Requirements: 18.2_
  
  - [x] 18.3 Optimize assets for production
    - Compress images to WebP format
    - Compress audio files (ensure < 10MB each)
    - Compress video file (ensure < 100MB, H.264, 720p)
    - _Requirements: 18.5, 25.5_
  
  - [x] 18.4 Test production build locally
    - Run npm run build
    - Test static export in out/ directory
    - Verify all assets load correctly
    - Test on real mobile devices
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

- [x] 19. Final testing and polish
  - [x] 19.1 Manual testing on iOS Safari
    - Test on iPhone (iOS 16+)
    - Verify audio playback
    - Verify animations run smoothly
    - Verify touch gestures work correctly
    - _Requirements: 25.3_
  
  - [x] 19.2 Manual testing on Chrome Android
    - Test on Android device (Chrome 110+)
    - Verify audio playback
    - Verify animations run smoothly
    - Verify touch gestures work correctly
    - _Requirements: 25.4_
  
  - [x] 19.3 Performance testing
    - Run Lighthouse on mobile
    - Verify LCP < 2.5s
    - Verify performance score ≥ 90
    - Test on 4G network simulation
    - _Requirements: 18.3, 18.4, 25.1, 25.2_
  
  - [x] 19.4 Accessibility testing
    - Test with screen reader (VoiceOver on iOS, TalkBack on Android)
    - Test keyboard navigation
    - Verify color contrast ratios
    - Verify touch target sizes
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5_
  
  - [x] 19.5 Cross-browser testing
    - Test on iOS Safari 16+
    - Test on Chrome Android 110+
    - Test on desktop Chrome, Firefox, Safari (secondary)
    - _Requirements: 25.3, 25.4_

- [x] 20. Documentation and handoff
  - [x] 20.1 Create content customization guide
    - Document how to update content.config.ts
    - Provide examples for each configuration option
    - Document photo, audio, and video requirements
    - _Requirements: 13.1, 14.1, 15.1, 16.1, 17.1, 19.1_
  
  - [x] 20.2 Create deployment guide
    - Document Vercel deployment steps
    - Document custom domain setup (optional)
    - Document asset optimization steps
    - _Requirements: 18.1, 18.2_
  
  - [x] 20.3 Create troubleshooting guide
    - Document common issues and solutions
    - Document browser compatibility notes
    - Document performance optimization tips
    - _Requirements: All_

## Task Execution Order

The tasks are designed to be executed in the order listed above. Key checkpoints:

1. **Checkpoint 1 (Task 5)**: Core systems (state, audio, config) are functional and tested
2. **Checkpoint 2 (Task 10)**: Story experience is functional with navigation and controls
3. **Final Testing (Tasks 19-20)**: Complete experience is polished and ready for deployment

## Testing Requirements

- All property tests must run with minimum 100 iterations
- All property tests must include comment tags referencing design document properties
- Unit tests should focus on specific examples and edge cases not covered by property tests
- Integration tests should verify complete user flows
- Manual testing on real devices is required before deployment

## Success Criteria

The implementation is complete when:
- All required tasks are completed
- All property tests pass with 100+ iterations
- All unit tests pass
- Manual testing on iOS Safari and Chrome Android is successful
- Lighthouse mobile performance score ≥ 90
- LCP < 2.5s on mobile networks
- The experience can be deployed to Vercel and accessed via a public URL