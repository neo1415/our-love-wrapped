# Design Document: Our Love Wrapped

## Overview

Our Love Wrapped is a Next.js 14 application that delivers a cinematic, mobile-first love story experience. The architecture prioritizes continuous audio playback, smooth animations, user-controlled pacing, and a single-file configuration system for content customization.

The system is built around three core pillars:
1. **Audio-First Architecture**: Continuous music playback with crossfades, independent of navigation
2. **State-Driven UI**: Centralized state management coordinating playback, navigation, and animations
3. **Configuration-Driven Content**: All customizable content in a single TypeScript config file

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│                    (Static Export Mode)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Page Components                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │    Story     │  │    Video     │     │
│  │    Page      │  │    Page      │  │    Page      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Core Systems Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    State     │  │    Audio     │  │  Animation   │     │
│  │  Management  │  │   Manager    │  │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Content Configuration                       │
│                   (content.config.ts)                        │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14 with App Router, TypeScript, Static Export
- **Styling**: Tailwind CSS + CSS Modules for component-specific styles
- **Animation**: Framer Motion for declarative animations
- **Audio**: Howler.js for cross-browser audio management with crossfades
- **Video**: HTML5 video element with native controls
- **Fonts**: Google Fonts (Cormorant Garamond, Playfair Display, Inter)
- **Deployment**: Vercel with static export optimization

### Directory Structure

```
our-love-wrapped/
├── app/
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Landing page
│   ├── story/
│   │   └── page.tsx              # Main story experience
│   └── globals.css               # Global styles and Tailwind
├── components/
│   ├── Landing/
│   │   ├── LandingScreen.tsx     # Landing UI
│   │   └── BeginButton.tsx       # Begin CTA
│   ├── Story/
│   │   ├── StoryContainer.tsx    # Main story orchestrator
│   │   ├── TextSlide.tsx         # Animated text display
│   │   ├── PhotoSlide.tsx        # Photo with Ken Burns effect
│   │   ├── VideoTransition.tsx   # Heartbeat → video sequence
│   │   └── ProgressBar.tsx       # Progress with chapter markers
│   ├── Controls/
│   │   ├── PlayPauseButton.tsx   # Play/pause toggle
│   │   ├── MuteButton.tsx        # Audio mute toggle
│   │   ├── NavigationButtons.tsx # Back/forward controls
│   │   └── ChapterMenu.tsx       # Chapter selection overlay
│   ├── Effects/
│   │   ├── ParticleSystem.tsx    # Floating particles
│   │   ├── HeartAnimation.tsx    # Double-tap hearts
│   │   └── FullScreenPhoto.tsx   # Long-press full-screen
│   └── Video/
│       ├── VideoPlayer.tsx       # Video playback component
│       └── DownloadButton.tsx    # Video download control
├── lib/
│   ├── state/
│   │   ├── storyStore.ts         # Zustand store for story state
│   │   └── types.ts              # State type definitions
│   ├── audio/
│   │   ├── AudioManager.ts       # Howler.js wrapper
│   │   └── crossfade.ts          # Crossfade utilities
│   ├── content/
│   │   ├── contentLoader.ts      # Config file loader
│   │   └── validator.ts          # Config validation
│   └── utils/
│       ├── timing.ts             # Timing calculations
│       └── gestures.ts           # Touch gesture handlers
├── config/
│   └── content.config.ts         # All customizable content
├── public/
│   ├── photos/                   # Photo assets
│   ├── audio/                    # Audio tracks
│   └── video/                    # Video file
└── types/
    └── content.d.ts              # Content config types
```

## Components and Interfaces

### State Management

**StoryStore (Zustand)**

The central state store manages all application state using Zustand for simplicity and performance.

```typescript
interface StoryState {
  // Navigation state
  currentSection: number;        // 0-7 for sections, 8 for video
  currentSlide: number;          // Current slide within section
  totalSlides: number;           // Total slides in current section
  
  // Playback state
  isPlaying: boolean;            // Auto-play active
  isPaused: boolean;             // User paused
  isComplete: boolean;           // Story finished
  
  // Audio state
  isMuted: boolean;              // Audio muted
  currentTrack: number;          // Current audio track index (0-3)
  
  // UI state
  showChapterMenu: boolean;      // Chapter menu visible
  showFullScreen: boolean;       // Full-screen photo active
  fullScreenPhotoUrl: string;    // URL of full-screen photo
  
  // Actions
  nextSlide: () => void;
  previousSlide: () => void;
  goToSection: (section: number) => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  reset: () => void;
}
```

### Audio Manager

**AudioManager Class**

Wraps Howler.js to provide continuous playback with crossfades.

```typescript
class AudioManager {
  private tracks: Howl[];
  private currentTrack: number;
  private fadeOutDuration: number = 2000;
  private fadeInDuration: number = 2000;
  
  constructor(trackUrls: string[]);
  
  // Play track at index, crossfading if different from current
  play(trackIndex: number, startTime?: number): void;
  
  // Pause current track
  pause(): void;
  
  // Resume current track
  resume(): void;
  
  // Mute/unmute all tracks
  setMute(muted: boolean): void;
  
  // Get current playback time
  getCurrentTime(): number;
  
  // Set callback for time updates (for cue point detection)
  onTimeUpdate(callback: (time: number) => void): void;
  
  // Crossfade from current track to new track
  private crossfade(fromIndex: number, toIndex: number): void;
}
```

### Content Configuration

**content.config.ts Structure**

```typescript
interface ContentConfig {
  // Personalization
  names: {
    his: string;
    hers: string;
    initials?: string;
  };
  date: string;
  
  // Audio configuration
  audio: {
    tracks: AudioTrack[];
  };
  
  // Section configuration
  sections: Section[];
  
  // Video configuration
  video: {
    path: string;
    audioPath: string;
    cuePoint: number;  // Seconds into JVKE track
  };
  
  // Final screen
  finalMessage: string;
}

interface AudioTrack {
  name: string;
  path: string;
  sections: number[];  // Which sections use this track
}

interface Section {
  id: number;
  title: string;
  slides: Slide[];
}

interface Slide {
  type: 'text' | 'photo';
  content: string;      // Text content or photo path
  duration: number;     // Auto-play duration in ms
  altText?: string;     // For photos
}
```

### Component Interfaces

**TextSlide Component**

```typescript
interface TextSlideProps {
  lines: string[];           // Array of text lines
  onComplete: () => void;    // Callback when animation completes
  isPlaying: boolean;        // Whether to animate
}

// Renders text with line-by-line slide-up animation
// Supports emphasis markers: *text* for italic, **text** for bold
// Supports pet name markers: {{name}} for special styling
```

**PhotoSlide Component**

```typescript
interface PhotoSlideProps {
  src: string;               // Photo URL
  alt: string;               // Alt text
  onComplete: () => void;    // Callback when duration expires
  onDoubleTap: (x: number, y: number) => void;  // Heart animation
  onLongPress: () => void;   // Full-screen trigger
  isPlaying: boolean;        // Whether to auto-advance
}

// Renders photo with Ken Burns effect (zoom 100% → 108% over 8s)
// Handles double-tap for hearts, long-press for full-screen
```

**ProgressBar Component**

```typescript
interface ProgressBarProps {
  currentSection: number;
  currentSlide: number;
  totalSlides: number;
  chapters: Chapter[];
  onChapterSelect: (section: number) => void;
  onLongPress: () => void;
}

interface Chapter {
  section: number;
  title: string;
  position: number;  // 0-1 normalized position
}

// Displays progress bar with chapter markers
// Long-press shows chapter menu
// Tap to navigate to position
```

**VideoTransition Component**

```typescript
interface VideoTransitionProps {
  videoSrc: string;
  audioSrc: string;
  onComplete: () => void;
  trigger: boolean;  // When true, starts transition
}

// Sequence:
// 1. Heartbeat pulse animation (1s)
// 2. Fade to black (0.5s)
// 3. Fade in video (1s)
// 4. Play video with audio
```

## Data Models

### Story State Model

The story state is a finite state machine with the following states:

```
LANDING → PLAYING → PAUSED → PLAYING → ... → VIDEO → COMPLETE
   ↓                                              ↓
   └──────────────── RESET ←─────────────────────┘
```

**State Transitions:**
- `LANDING → PLAYING`: User taps Begin button
- `PLAYING → PAUSED`: User taps pause or manually navigates
- `PAUSED → PLAYING`: User taps play
- `PLAYING → VIDEO`: Cue point reached in JVKE track
- `VIDEO → COMPLETE`: Video finishes
- `COMPLETE → LANDING`: User taps replay

### Content Model

Content is loaded from `content.config.ts` and validated at build time using TypeScript types. The content loader provides:

```typescript
interface LoadedContent {
  config: ContentConfig;
  sections: ProcessedSection[];
  audioTracks: AudioTrack[];
  video: VideoConfig;
}

interface ProcessedSection {
  id: number;
  title: string;
  slides: ProcessedSlide[];
  audioTrackIndex: number;
  startPosition: number;  // Normalized 0-1 for progress bar
}

interface ProcessedSlide {
  type: 'text' | 'photo';
  content: string;
  duration: number;
  parsedLines?: string[];  // For text slides
  altText?: string;        // For photo slides
}
```

### Timing Model

The timing system calculates slide durations and section transitions:

```typescript
interface TimingConfig {
  textSlideDuration: number;      // 4000ms
  photoSlideDuration: number;     // 5000ms
  sectionTransitionDuration: number;  // 1200ms
  textAnimationDuration: number;  // 800ms per line
  photoFadeInDuration: number;    // 1000ms
  kenBurnsDuration: number;       // 8000ms
  crossfadeDuration: number;      // 2000ms
}

// Calculate total section duration
function calculateSectionDuration(section: Section): number;

// Calculate progress position for a given section/slide
function calculateProgress(section: number, slide: number): number;

// Determine which audio track should play for a section
function getAudioTrackForSection(section: number): number;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Core Properties

**Property 1: Auto-play timing consistency**

*For any* slide in auto-play mode, text slides should advance after 4000ms and photo slides should advance after 5000ms, with timing accuracy within 100ms.

**Validates: Requirements 2.1, 2.2**

**Property 2: Manual navigation advances correctly**

*For any* slide in manual mode (except the last slide), advancing should move to the next slide, and for any slide except the first, going back should move to the previous slide.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

**Property 3: Audio continuity during navigation**

*For any* navigation action (manual advance, manual back, swipe, section transition, chapter jump), audio playback time should continue increasing monotonically without restarting or stopping.

**Validates: Requirements 2.5, 3.6, 5.2, 5.8**

**Property 4: Audio track crossfade**

*For any* transition between sections with different audio tracks, a crossfade should occur over 2000ms ± 100ms with both tracks playing during the overlap.

**Validates: Requirements 5.3**

**Property 5: Section-to-track mapping**

*For any* section number, the system should play the correct audio track: sections 0-3 play "Beautiful in White", sections 4-6 play "Beautiful Things", section 7 plays "Her" by JVKE, and section 8 plays the video audio track.

**Validates: Requirements 5.4, 5.5, 5.6, 5.7**

**Property 6: Mute state persistence**

*For any* sequence of navigation actions (section changes, slide advances, chapter jumps, track transitions), if audio is muted at the start, it should remain muted throughout all actions until explicitly unmuted.

**Validates: Requirements 6.3, 6.4, 6.5**

**Property 7: Mute/unmute round-trip**

*For any* audio playback state, muting then immediately unmuting should restore audio playback without restarting the track or changing the playback position.

**Validates: Requirements 6.2**

**Property 8: Text marker parsing**

*For any* text content with emphasis markers (*text* or **text**) or pet name markers ({{name}}), the parsed output should contain the correct styled elements with the markers removed from the display text.

**Validates: Requirements 7.2, 7.3**

**Property 9: Photo interaction state transitions**

*For any* photo slide, double-tapping should display a heart animation at the tap coordinates, and long-pressing then tapping should transition to full-screen then back to normal view (round-trip property).

**Validates: Requirements 8.3, 8.4, 8.5**

**Property 10: Chapter navigation correctness**

*For any* chapter marker selection, the system should navigate to the first slide of that section, play the correct audio track for that section, and update the progress bar to reflect the new position.

**Validates: Requirements 4.2, 4.3, 4.4**

**Property 11: Playback mode persistence**

*For any* playback mode (auto-play or manual), chapter navigation should preserve the current mode without changing it.

**Validates: Requirements 4.5**

**Property 12: Video transition timing**

*For any* configured cue point timestamp in the JVKE track, when audio playback reaches that timestamp, the video transition should trigger within 100ms.

**Validates: Requirements 9.1**

**Property 13: Configuration round-trip**

*For any* valid configuration object containing names, dates, photos, audio paths, video path, cue point, and text content, loading the configuration should produce a system state where all configured values are accessible and match the original configuration.

**Validates: Requirements 1.4, 7.5, 8.6, 9.6, 9.7, 11.3, 13.1, 14.1, 15.1, 16.1, 17.1, 19.1, 19.2**

**Property 14: State reset completeness**

*For any* final state (after video completion), triggering replay should reset all state to initial conditions: return to landing screen, reset audio to track 0 at time 0, reset progress to 0%, and reset playback mode to auto-play.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

**Property 15: Photo load failure graceful degradation**

*For any* invalid or unreachable photo path, the system should display a burgundy placeholder without broken image icons, continue navigation normally, and log an error without displaying user-facing error messages.

**Validates: Requirements 21.1, 21.2, 21.3, 21.5**

**Property 16: Audio load failure graceful degradation**

*For any* invalid or unreachable audio path, the system should continue the experience silently, maintain all timing and navigation behaviors, log an error, and attempt to load audio for subsequent sections.

**Validates: Requirements 22.1, 22.2, 22.3, 22.4, 22.5**

**Property 17: Progress bar synchronization**

*For any* navigation action that changes the current section or slide, the progress bar should update to reflect the new position with the correct percentage and chapter marker highlighting.

**Validates: Requirements 27.3, 4.4**

**Property 18: Progress bar navigation**

*For any* tap position on the progress bar (normalized 0-1), the system should navigate to the section and slide corresponding to that position.

**Validates: Requirements 27.4**

**Property 19: State consistency**

*For any* state change (section change, slide change, mode change, mute change), all UI elements (progress bar, play/pause button, mute button, current slide display) should update to reflect the new state consistently.

**Validates: Requirements 28.1, 28.2, 28.3, 28.4, 28.5**

**Property 20: Configuration validation**

*For any* configuration object, if it has type errors or missing required fields, the system should reject it with clear error messages during development; if it's valid, the system should accept it.

**Validates: Requirements 29.4, 29.5**

**Property 21: Accessibility attributes presence**

*For any* photo element, alt text should be present; for any interactive control, ARIA labels should be present.

**Validates: Requirements 30.3, 30.4**

**Property 22: Focus management during navigation**

*For any* navigation action, keyboard focus should move to an appropriate interactive element and never be lost.

**Validates: Requirements 30.5**

## Error Handling

### Photo Load Failures

When a photo fails to load:
1. Display burgundy (#800020) placeholder with same dimensions as expected photo
2. Apply Ken Burns effect to placeholder (maintains visual consistency)
3. Log error to console: `Photo load failed: ${photoPath}`
4. Continue experience without interruption
5. Never show broken image icons or error messages to user

Implementation: Use `onError` handler on `<img>` elements to swap to placeholder component.

### Audio Load Failures

When an audio track fails to load:
1. Continue experience silently (no audio playback)
2. Maintain all timing behaviors (slides still advance on schedule)
3. Log error to console: `Audio load failed: ${audioPath}`
4. Attempt to load audio for next section (don't give up permanently)
5. Never show error messages to user

Implementation: Wrap Howler.js in try-catch, use `onloaderror` callbacks, maintain timing with `setTimeout` fallbacks.

### Browser Autoplay Policy Blocks

When browser blocks autoplay:
1. Wait for first user interaction (Begin button tap)
2. Start audio playback on that interaction
3. Synchronize audio with current section (may need to seek to correct position)
4. No error messages to user (this is expected browser behavior)

Implementation: Use Howler.js autoplay detection, defer audio start until user gesture, track elapsed time to synchronize.

### Video Load Failures

When video fails to load:
1. Display error message: "Video could not be loaded. Please check your connection."
2. Provide retry button
3. Provide skip button to go to final screen
4. Log error to console: `Video load failed: ${videoPath}`

Implementation: Use `onError` handler on `<video>` element, show error UI with retry/skip options.

### Configuration Errors

When configuration has errors:
1. During development: Show TypeScript type errors in IDE
2. At runtime: Validate configuration on load
3. If invalid: Show error overlay with specific validation errors
4. Prevent experience from starting with invalid config

Implementation: Use Zod or similar for runtime validation, TypeScript for compile-time validation.

### Network Failures

When network requests fail:
1. Retry failed requests up to 3 times with exponential backoff
2. After 3 failures, fall back to error handling strategies above
3. Show loading indicators during retries
4. Never leave user in indefinite loading state

Implementation: Wrap fetch calls in retry logic, use loading states in UI.

## Testing Strategy

### Dual Testing Approach

This project requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized testing

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library**: We'll use `fast-check` for TypeScript property-based testing.

**Configuration**: Each property test should run a minimum of 100 iterations to ensure comprehensive input coverage through randomization.

**Test Tagging**: Each property test must include a comment tag referencing its design document property:

```typescript
// Feature: our-love-wrapped, Property 3: Audio continuity during navigation
test('audio playback continues during navigation', () => {
  fc.assert(
    fc.property(
      fc.record({
        initialSection: fc.integer({ min: 0, max: 7 }),
        navigationActions: fc.array(fc.oneof(
          fc.constant('next'),
          fc.constant('prev'),
          fc.constant('chapter')
        ))
      }),
      ({ initialSection, navigationActions }) => {
        // Test implementation
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Library**: Jest with React Testing Library for component tests.

**Focus Areas**:
- Specific user interaction examples (Begin button tap, pause button tap)
- Edge cases (first slide back navigation, last slide forward navigation)
- Error conditions (photo load failure, audio load failure)
- Integration points (state store updates, audio manager calls)
- Accessibility (keyboard navigation, ARIA labels)

**Balance**: Avoid writing too many unit tests for scenarios covered by property tests. Focus unit tests on:
- Concrete examples that demonstrate correct behavior
- Edge cases that are hard to generate randomly
- Error handling paths
- Integration between components

### Test Organization

```
__tests__/
├── unit/
│   ├── components/
│   │   ├── Landing.test.tsx
│   │   ├── TextSlide.test.tsx
│   │   ├── PhotoSlide.test.tsx
│   │   ├── VideoTransition.test.tsx
│   │   └── ProgressBar.test.tsx
│   ├── lib/
│   │   ├── AudioManager.test.ts
│   │   ├── storyStore.test.ts
│   │   └── contentLoader.test.ts
│   └── integration/
│       ├── navigation.test.tsx
│       ├── audio-sync.test.tsx
│       └── state-management.test.tsx
└── properties/
    ├── timing.properties.test.ts
    ├── navigation.properties.test.ts
    ├── audio.properties.test.ts
    ├── state.properties.test.ts
    └── config.properties.test.ts
```

### Key Test Scenarios

**Property Tests** (100+ iterations each):
1. Auto-play timing consistency across all slide types
2. Manual navigation correctness for all valid transitions
3. Audio continuity through all navigation paths
4. Mute state persistence through all actions
5. Configuration round-trip for all valid configs
6. State reset completeness from any final state
7. Progress bar synchronization for all navigation
8. Text marker parsing for all marker combinations
9. Photo interaction state transitions for all gestures
10. Chapter navigation correctness for all chapters

**Unit Tests** (specific examples):
1. Begin button starts audio and transitions to first section
2. Pause button toggles between auto-play and manual mode
3. Double-tap on photo shows heart at correct coordinates
4. Long-press on photo enters full-screen mode
5. Video transition sequence (heartbeat → black → video)
6. Download button triggers video download
7. Replay button resets to landing screen
8. Keyboard spacebar toggles play/pause
9. Keyboard arrows navigate slides
10. Photo load failure shows burgundy placeholder
11. Audio load failure continues silently
12. Invalid config shows error overlay

### Performance Testing

While not part of automated tests, manual performance validation should verify:
- Largest Contentful Paint (LCP) < 2.5s on mobile networks
- Lighthouse mobile performance score ≥ 90
- Smooth 60fps animations on target devices (iOS Safari 16+, Chrome Android 110+)
- Memory usage remains stable during full experience playback

### Accessibility Testing

Manual testing with assistive technologies:
- Screen reader announces all content correctly
- Keyboard navigation works for all interactions
- Focus indicators are visible
- Color contrast meets WCAG AA standards
- Touch targets are at least 44x44px

## Implementation Notes

### Audio Crossfade Implementation

The crossfade between audio tracks is critical for the emotional flow. Implementation approach:

```typescript
async crossfade(fromTrackIndex: number, toTrackIndex: number): Promise<void> {
  const fromTrack = this.tracks[fromTrackIndex];
  const toTrack = this.tracks[toTrackIndex];
  
  // Start new track at volume 0
  toTrack.volume(0);
  toTrack.play();
  
  // Crossfade over 2 seconds
  const steps = 20; // 100ms per step
  const volumeStep = 1 / steps;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    fromTrack.volume(1 - progress);
    toTrack.volume(progress);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Stop old track
  fromTrack.stop();
}
```

### Ken Burns Effect Implementation

The Ken Burns effect creates cinematic photo displays:

```typescript
// CSS approach using Framer Motion
<motion.img
  src={photoSrc}
  initial={{ scale: 1, opacity: 0 }}
  animate={{ scale: 1.08, opacity: 1 }}
  transition={{
    scale: { duration: 8, ease: 'linear' },
    opacity: { duration: 1, ease: 'easeIn' }
  }}
/>
```

### Video Transition Sequence

The video transition is a carefully choreographed sequence:

```typescript
async function playVideoTransition() {
  // 1. Heartbeat pulse (1s)
  await animateHeartbeat();
  
  // 2. Fade to black (0.5s)
  await fadeToBlack();
  
  // 3. Fade in video (1s)
  await fadeInVideo();
  
  // 4. Play video with audio
  videoElement.play();
}
```

### State Machine Implementation

The story state follows a finite state machine pattern:

```typescript
type StoryPhase = 'LANDING' | 'PLAYING' | 'PAUSED' | 'VIDEO' | 'COMPLETE';

const transitions: Record<StoryPhase, Partial<Record<StoryPhase, boolean>>> = {
  LANDING: { PLAYING: true },
  PLAYING: { PAUSED: true, VIDEO: true },
  PAUSED: { PLAYING: true },
  VIDEO: { COMPLETE: true },
  COMPLETE: { LANDING: true }
};

function canTransition(from: StoryPhase, to: StoryPhase): boolean {
  return transitions[from]?.[to] ?? false;
}
```

### Performance Optimizations

1. **Image Optimization**: Use Next.js Image component with WebP format, responsive sizes
2. **Audio Preloading**: Preload all audio tracks on landing screen
3. **Code Splitting**: Lazy load video player component
4. **Static Export**: Pre-render all pages for instant loading
5. **Asset CDN**: Serve media from Vercel CDN for global performance

### Mobile-First Considerations

1. **Touch Gestures**: Use `react-use-gesture` for reliable swipe detection
2. **Viewport Units**: Use `dvh` (dynamic viewport height) for mobile browsers
3. **Safe Areas**: Respect iOS safe areas with `env(safe-area-inset-*)`
4. **Orientation Lock**: Encourage portrait with CSS and rotation prompt
5. **Performance**: Optimize for mobile CPUs (avoid heavy animations)

## Deployment Configuration

### Next.js Configuration

```typescript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
};
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Environment Variables

No environment variables needed - all configuration is in `content.config.ts`.

## Future Enhancements

Potential features for future iterations (not in current scope):

1. **Multiple Stories**: Support for multiple relationship stories
2. **Social Sharing**: Share individual moments or full experience
3. **Custom Themes**: Alternative color schemes and fonts
4. **Music Upload**: Allow custom music uploads instead of file paths
5. **Photo Filters**: Apply Instagram-style filters to photos
6. **Collaborative Editing**: Both partners can contribute content
7. **Anniversary Reminders**: Notification system for relationship milestones
8. **Export Options**: Export as PDF, slideshow, or social media formats
