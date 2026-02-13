/**
 * State Management Types
 */

export interface StoryState {
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
  goToSection: (section: number, slide?: number) => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  setShowChapterMenu: (show: boolean) => void;
  setFullScreenPhoto: (url: string | null) => void;
  setCurrentTrack: (track: number) => void;
  reset: () => void;
}
