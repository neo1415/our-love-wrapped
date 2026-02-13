# Requirements Document: Our Love Wrapped

## Introduction

Our Love Wrapped is a cinematic, mobile-first love story website that tells a relationship narrative through 8 chapters with continuous music, animated text, photo displays, and a climactic video moment. The experience is inspired by Spotify Wrapped but driven by emotion and personal storytelling. Users control the pacing while the creator customizes all content through a single configuration file.

## Glossary

- **System**: The Our Love Wrapped web application
- **Receiver**: The person experiencing the love story (the "her" in the relationship)
- **Creator**: The person building and customizing the experience (the "him" in the relationship)
- **Section**: One of 8 narrative chapters in the story
- **Chapter**: Synonym for Section
- **Progress_Bar**: Visual indicator showing current position and chapter markers
- **Ken_Burns_Effect**: Slow zoom animation on photos (100% to 108% over 8 seconds)
- **Cue_Point**: Specific timestamp in audio track that triggers video transition
- **Config_File**: Single TypeScript file (content.config.ts) containing all customizable content
- **Auto_Play_Mode**: Playback mode where sections advance automatically
- **Manual_Mode**: Playback mode where user controls all navigation
- **Crossfade**: Smooth audio transition between tracks over 2 seconds
- **Video_Transition**: Animated sequence from current section to video playback
- **Particle_System**: Floating visual elements (15-20 burgundy/rose-gold particles)

## Requirements

### Requirement 1: Landing Experience

**User Story:** As a Receiver, I want to see a beautiful landing screen with our names and relationship date, so that I feel the experience is personal and special before it begins.

#### Acceptance Criteria

1. WHEN the application loads, THE System SHALL display a landing screen with initials or full names
2. WHEN the landing screen is displayed, THE System SHALL show the relationship start date
3. WHEN the landing screen is displayed, THE System SHALL provide a "Begin" button to start the experience
4. THE System SHALL load all names and dates from the Config_File
5. WHEN the Begin button is tapped, THE System SHALL start audio playback and transition to the first section

### Requirement 2: Auto-Play Mode

**User Story:** As a Receiver, I want the story to advance automatically at a comfortable pace, so that I can experience it hands-free like watching a film.

#### Acceptance Criteria

1. WHEN Auto_Play_Mode is active, THE System SHALL advance text slides after 4 seconds
2. WHEN Auto_Play_Mode is active, THE System SHALL advance photo slides after 5 seconds
3. WHEN Auto_Play_Mode is active, THE System SHALL continue advancing until the Receiver pauses or the experience ends
4. WHEN a section completes in Auto_Play_Mode, THE System SHALL automatically transition to the next section
5. THE System SHALL maintain audio continuity during automatic section transitions

### Requirement 3: Manual Navigation Controls

**User Story:** As a Receiver, I want to control the pacing by pausing, advancing, or going back, so that I can savor moments or revisit parts of the story.

#### Acceptance Criteria

1. WHEN the Receiver taps a pause control, THE System SHALL pause Auto_Play_Mode and enter Manual_Mode
2. WHEN in Manual_Mode and the Receiver taps the screen, THE System SHALL advance to the next slide
3. WHEN in Manual_Mode and the Receiver taps a back button, THE System SHALL return to the previous slide
4. WHEN in Manual_Mode and the Receiver swipes left, THE System SHALL advance to the next slide
5. WHEN in Manual_Mode and the Receiver swipes right, THE System SHALL return to the previous slide
6. THE System SHALL maintain audio continuity during manual navigation

### Requirement 4: Chapter Navigation

**User Story:** As a Receiver, I want to jump directly to specific chapters, so that I can revisit my favorite moments without watching everything sequentially.

#### Acceptance Criteria

1. WHEN the Receiver long-presses the Progress_Bar, THE System SHALL display chapter markers with labels
2. WHEN the Receiver taps a chapter marker, THE System SHALL navigate to the first slide of that chapter
3. WHEN navigating to a chapter, THE System SHALL play the correct audio track for that chapter
4. WHEN navigating to a chapter, THE System SHALL update the Progress_Bar to reflect the new position
5. THE System SHALL maintain the current playback mode (Auto_Play_Mode or Manual_Mode) after chapter navigation

### Requirement 5: Continuous Music Playback

**User Story:** As a Receiver, I want music to play continuously throughout the experience with smooth transitions, so that the emotional flow is never broken.

#### Acceptance Criteria

1. WHEN the experience begins, THE System SHALL start playing the first audio track
2. WHEN transitioning between sections within the same audio track, THE System SHALL continue playback without interruption
3. WHEN transitioning to a section with a different audio track, THE System SHALL crossfade between tracks over 2 seconds
4. THE System SHALL play "Beautiful in White" for sections 1-4
5. THE System SHALL play "Beautiful Things" for sections 5-7
6. THE System SHALL play "Her" by JVKE for section 8
7. THE System SHALL play a separate song during the video section
8. WHEN the Receiver navigates between sections, THE System SHALL maintain audio continuity without restarting tracks

### Requirement 6: Audio Mute Control

**User Story:** As a Receiver, I want to mute and unmute the audio, so that I can experience the story silently if needed without losing my place.

#### Acceptance Criteria

1. WHEN the Receiver taps a mute control, THE System SHALL mute all audio playback
2. WHEN the Receiver taps the mute control again, THE System SHALL unmute audio playback
3. WHEN audio is muted and the Receiver navigates between sections, THE System SHALL maintain the muted state
4. WHEN audio is muted and a new audio track should start, THE System SHALL keep it muted
5. THE System SHALL persist the mute state across all sections until the Receiver unmutes

### Requirement 7: Text Animation and Styling

**User Story:** As a Receiver, I want text to appear line-by-line with beautiful animations and emphasis, so that the story feels cinematic and emotionally impactful.

#### Acceptance Criteria

1. WHEN a text slide appears, THE System SHALL animate each line sliding up with 800ms duration
2. WHEN text contains emphasis markers, THE System SHALL render emphasized text with distinct styling
3. WHEN text contains pet name markers, THE System SHALL render pet names with special styling
4. THE System SHALL stagger line animations so each line appears sequentially
5. THE System SHALL load all text content from the Config_File

### Requirement 8: Photo Display and Interactions

**User Story:** As a Receiver, I want photos to display cinematically with subtle animations and interactive features, so that I can appreciate our memories beautifully.

#### Acceptance Criteria

1. WHEN a photo slide appears, THE System SHALL fade in the photo over 1000ms
2. WHEN a photo is displayed, THE System SHALL apply the Ken_Burns_Effect zooming from 100% to 108% over 8 seconds
3. WHEN the Receiver double-taps a photo, THE System SHALL display a heart animation at the tap location
4. WHEN the Receiver long-presses a photo, THE System SHALL display the photo in full-screen mode
5. WHEN in full-screen mode and the Receiver taps, THE System SHALL exit full-screen and return to the story
6. THE System SHALL load all photo paths from the Config_File

### Requirement 9: Video Transition

**User Story:** As a Receiver, I want the video to appear at the perfect moment in the music with a dramatic transition, so that the climax feels magical and surprising.

#### Acceptance Criteria

1. WHEN the JVKE track reaches the configured Cue_Point, THE System SHALL trigger the video transition
2. WHEN the video transition triggers, THE System SHALL display a heartbeat pulse animation
3. WHEN the heartbeat pulse completes, THE System SHALL fade to black
4. WHEN the black screen appears, THE System SHALL fade in the video
5. WHEN the video starts, THE System SHALL play the video's audio track
6. THE System SHALL load the Cue_Point timestamp from the Config_File
7. THE System SHALL load the video path from the Config_File

### Requirement 10: Video Download

**User Story:** As a Receiver, I want to download the video after watching it, so that I can keep it as a personal memento.

#### Acceptance Criteria

1. WHEN the video completes playback, THE System SHALL display a download button
2. WHEN the Receiver taps the download button, THE System SHALL initiate a download of the video file
3. THE System SHALL provide the video with a meaningful filename
4. WHEN the download starts, THE System SHALL provide visual feedback that the download is in progress

### Requirement 11: Final Screen

**User Story:** As a Receiver, I want to see a final "I Love You" message after the video, so that the experience ends with a heartfelt conclusion.

#### Acceptance Criteria

1. WHEN the video completes, THE System SHALL display a final screen with an "I Love You" message
2. WHEN the final screen is displayed, THE System SHALL provide a replay option
3. THE System SHALL load the final message text from the Config_File
4. WHEN the final screen is displayed, THE System SHALL stop all audio playback

### Requirement 12: Replay Functionality

**User Story:** As a Receiver, I want to replay the entire experience from the beginning, so that I can relive the story multiple times.

#### Acceptance Criteria

1. WHEN the Receiver taps the replay option, THE System SHALL reset all state to initial conditions
2. WHEN replaying, THE System SHALL return to the landing screen
3. WHEN replaying, THE System SHALL reset audio to the beginning of the first track
4. WHEN replaying, THE System SHALL reset the Progress_Bar to the start
5. WHEN replaying, THE System SHALL reset playback mode to Auto_Play_Mode

### Requirement 13: Photo Customization

**User Story:** As a Creator, I want to swap photos by only editing the config file, so that I can personalize the experience without touching code.

#### Acceptance Criteria

1. THE System SHALL load all photo paths from the Config_File
2. WHEN the Creator updates a photo path in the Config_File, THE System SHALL display the new photo without code changes
3. THE System SHALL support standard image formats (JPEG, PNG, WebP)
4. WHEN a photo path is updated, THE System SHALL maintain all animations and interactions for that photo

### Requirement 14: Song Customization

**User Story:** As a Creator, I want to swap songs by only editing the config file, so that I can choose music that's meaningful to our relationship.

#### Acceptance Criteria

1. THE System SHALL load all audio track paths from the Config_File
2. WHEN the Creator updates an audio path in the Config_File, THE System SHALL play the new audio without code changes
3. THE System SHALL support standard audio formats (MP3, M4A, OGG)
4. WHEN an audio path is updated, THE System SHALL maintain all crossfade and continuity behaviors

### Requirement 15: Cue Point Configuration

**User Story:** As a Creator, I want to configure the exact moment when the video transition happens, so that it aligns perfectly with the emotional peak of the song.

#### Acceptance Criteria

1. THE System SHALL load the video Cue_Point timestamp from the Config_File
2. WHEN the Creator updates the Cue_Point in the Config_File, THE System SHALL trigger the video transition at the new timestamp
3. THE System SHALL accept Cue_Point values in seconds as a number
4. WHEN the audio reaches the Cue_Point timestamp, THE System SHALL trigger the video transition within 100ms

### Requirement 16: Message Customization

**User Story:** As a Creator, I want to edit all text messages in the config file, so that I can tell our unique story in my own words.

#### Acceptance Criteria

1. THE System SHALL load all text content from the Config_File
2. WHEN the Creator updates text in the Config_File, THE System SHALL display the new text without code changes
3. THE System SHALL support emphasis markers in text for styling
4. THE System SHALL support pet name markers in text for special styling
5. WHEN text is updated, THE System SHALL maintain all animation behaviors

### Requirement 17: Video Integration

**User Story:** As a Creator, I want to add my video by dropping the file and updating the config, so that I can include our personal video without complex setup.

#### Acceptance Criteria

1. THE System SHALL load the video path from the Config_File
2. WHEN the Creator updates the video path in the Config_File, THE System SHALL play the new video without code changes
3. THE System SHALL support standard video formats (MP4, WebM)
4. WHEN a video path is updated, THE System SHALL maintain all transition and download behaviors

### Requirement 18: Deployment

**User Story:** As a Creator, I want to deploy the site to Vercel with a static export, so that it loads fast and works reliably for the Receiver.

#### Acceptance Criteria

1. THE System SHALL support Next.js static export configuration
2. WHEN deployed to Vercel, THE System SHALL serve all assets statically
3. WHEN deployed, THE System SHALL achieve Largest Contentful Paint (LCP) under 2.5 seconds
4. WHEN deployed, THE System SHALL achieve a Lighthouse mobile performance score of 90 or higher
5. THE System SHALL optimize all images for web delivery

### Requirement 19: Name and Date Customization

**User Story:** As a Creator, I want to customize names, initials, and the relationship date in the config, so that the landing screen is personalized.

#### Acceptance Criteria

1. THE System SHALL load names or initials from the Config_File
2. THE System SHALL load the relationship date from the Config_File
3. WHEN the Creator updates names in the Config_File, THE System SHALL display the new names without code changes
4. WHEN the Creator updates the date in the Config_File, THE System SHALL display the new date without code changes
5. THE System SHALL support both full names and initials in the configuration

### Requirement 20: Mobile Preview

**User Story:** As a Creator, I want to preview the experience on mobile during development, so that I can ensure it looks perfect before sharing it.

#### Acceptance Criteria

1. THE System SHALL run in development mode with hot reloading
2. WHEN running in development mode, THE System SHALL be accessible from mobile devices on the local network
3. WHEN previewing on mobile, THE System SHALL display the same experience as production
4. THE System SHALL support responsive design testing tools during development

### Requirement 21: Photo Load Failure Handling

**User Story:** As a Receiver, I want the experience to continue gracefully if a photo fails to load, so that one missing image doesn't break the entire story.

#### Acceptance Criteria

1. WHEN a photo fails to load, THE System SHALL display a burgundy-colored placeholder
2. WHEN a photo fails to load, THE System SHALL NOT display broken image icons
3. WHEN a photo fails to load, THE System SHALL continue the experience without interruption
4. WHEN a photo fails to load, THE System SHALL maintain all navigation and animation behaviors
5. WHEN a photo fails to load, THE System SHALL log the error for the Creator to debug

### Requirement 22: Audio Load Failure Handling

**User Story:** As a Receiver, I want the experience to continue silently if audio fails to load, so that I can still see the story even with audio issues.

#### Acceptance Criteria

1. WHEN an audio track fails to load, THE System SHALL continue the experience without audio
2. WHEN an audio track fails to load, THE System SHALL NOT display error messages to the Receiver
3. WHEN an audio track fails to load, THE System SHALL maintain all navigation and timing behaviors
4. WHEN an audio track fails to load, THE System SHALL log the error for the Creator to debug
5. WHEN audio fails and the Receiver navigates, THE System SHALL attempt to load audio for new sections

### Requirement 23: Browser Autoplay Policy Handling

**User Story:** As a Receiver, I want audio to start reliably when I tap Begin, so that I don't experience silence due to browser restrictions.

#### Acceptance Criteria

1. WHEN the Receiver taps the Begin button, THE System SHALL start audio playback
2. WHEN browser autoplay policies block audio, THE System SHALL start audio on the first user interaction
3. WHEN audio is blocked by browser policy, THE System SHALL NOT display error messages
4. WHEN audio starts after user interaction, THE System SHALL synchronize with the current section
5. THE System SHALL handle autoplay policies for iOS Safari 16+ and Chrome Android 110+

### Requirement 24: Portrait Orientation Preference

**User Story:** As a Receiver, I want the experience optimized for portrait orientation with a prompt to rotate if needed, so that the cinematic framing is always correct.

#### Acceptance Criteria

1. WHEN the device is in landscape orientation, THE System SHALL display a rotation prompt
2. WHEN the device rotates to portrait orientation, THE System SHALL hide the rotation prompt and continue the experience
3. THE System SHALL optimize all layouts for portrait orientation
4. THE System SHALL maintain aspect ratios appropriate for mobile portrait viewing
5. WHEN the rotation prompt is displayed, THE System SHALL pause the experience until rotation occurs

## Additional System Requirements

### Requirement 25: Performance and Compatibility

**User Story:** As a Receiver, I want the experience to load quickly and work smoothly on my phone, so that I can enjoy it without technical frustrations.

#### Acceptance Criteria

1. THE System SHALL achieve Largest Contentful Paint (LCP) under 2.5 seconds on mobile networks
2. THE System SHALL achieve a Lighthouse mobile performance score of 90 or higher
3. THE System SHALL be compatible with iOS Safari 16 and higher
4. THE System SHALL be compatible with Chrome Android 110 and higher
5. THE System SHALL optimize images for mobile bandwidth
6. THE System SHALL preload critical assets for smooth playback

### Requirement 26: Visual Design System

**User Story:** As a Receiver, I want the visual design to feel romantic and cinematic, so that the aesthetic matches the emotional content.

#### Acceptance Criteria

1. THE System SHALL use burgundy (#800020) as the primary color
2. THE System SHALL use rose gold (#B76E79) as the secondary color
3. THE System SHALL use cream (#F5ECD7) for text and highlights
4. THE System SHALL use dark background (#0D0608) for the main canvas
5. THE System SHALL use Playfair Display font for titles
6. THE System SHALL use Cormorant Garamond font for body text
7. THE System SHALL use Inter font for UI elements
8. THE System SHALL display 15-20 floating particles in burgundy and rose-gold colors
9. WHEN sections transition, THE System SHALL crossfade over 1200ms

### Requirement 27: Progress Indication

**User Story:** As a Receiver, I want to see my progress through the story, so that I know how much remains and can navigate if desired.

#### Acceptance Criteria

1. THE System SHALL display a Progress_Bar showing current position
2. THE System SHALL display chapter markers on the Progress_Bar
3. WHEN the story advances, THE System SHALL update the Progress_Bar smoothly
4. WHEN the Receiver taps the Progress_Bar, THE System SHALL navigate to that position
5. THE System SHALL display the Progress_Bar in a non-intrusive location

### Requirement 28: State Management

**User Story:** As a system, I need to manage playback state consistently, so that all features work together without conflicts.

#### Acceptance Criteria

1. THE System SHALL maintain a single source of truth for current section
2. THE System SHALL maintain a single source of truth for current slide within section
3. THE System SHALL maintain a single source of truth for playback mode (Auto_Play_Mode or Manual_Mode)
4. THE System SHALL maintain a single source of truth for audio mute state
5. WHEN state changes occur, THE System SHALL update all UI elements consistently
6. WHEN navigation occurs, THE System SHALL validate state transitions to prevent invalid states

### Requirement 29: Content Configuration Structure

**User Story:** As a Creator, I want a clear and well-documented config file structure, so that I can customize content confidently without breaking anything.

#### Acceptance Criteria

1. THE System SHALL define the Config_File as a TypeScript file with type definitions
2. THE Config_File SHALL include sections for names, dates, photos, audio, video, text, and timing
3. THE Config_File SHALL include comments explaining each configuration option
4. THE Config_File SHALL use TypeScript types to prevent configuration errors
5. WHEN the Config_File has type errors, THE System SHALL display clear error messages during development

### Requirement 30: Accessibility Considerations

**User Story:** As a Receiver with accessibility needs, I want basic keyboard and screen reader support, so that I can experience the story with assistive technology.

#### Acceptance Criteria

1. WHEN using keyboard navigation, THE System SHALL support spacebar to pause/play
2. WHEN using keyboard navigation, THE System SHALL support arrow keys to navigate slides
3. THE System SHALL provide alt text for all photos loaded from the Config_File
4. THE System SHALL provide ARIA labels for all interactive controls
5. THE System SHALL maintain focus management during navigation
