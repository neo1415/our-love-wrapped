import { create } from 'zustand';
import { StoryState } from './types';
import { loadContent } from '@/lib/content/contentLoader';

/**
 * Story State Store
 * Central state management for the Our Love Wrapped experience
 */

const useStoryStore = create<StoryState>((set, get) => ({
  // Initial navigation state
  currentSection: 0,
  currentSlide: 0,
  totalSlides: 0,
  
  // Initial playback state
  isPlaying: false,
  isPaused: false,
  isComplete: false,
  
  // Initial audio state
  isMuted: false,
  currentTrack: 0,
  
  // Initial UI state
  showChapterMenu: false,
  showFullScreen: false,
  fullScreenPhotoUrl: '',
  
  // Actions
  
  /**
   * Advance to the next slide
   */
  nextSlide: () => {
    const state = get();
    const content = loadContent();
    const currentSectionData = content.sections[state.currentSection];
    
    if (!currentSectionData) return;
    
    // If we're at the last slide of the current section
    if (state.currentSlide >= currentSectionData.slides.length - 1) {
      // Move to next section if available
      if (state.currentSection < content.sections.length - 1) {
        const nextSection = state.currentSection + 1;
        const nextSectionData = content.sections[nextSection];
        
        set({
          currentSection: nextSection,
          currentSlide: 0,
          totalSlides: nextSectionData.slides.length,
          currentTrack: nextSectionData.audioTrackIndex,
        });
      } else {
        // We're at the end of all sections, move to video (section 8)
        set({
          currentSection: 8,
          currentSlide: 0,
          totalSlides: 1,
          isPlaying: false,
        });
      }
    } else {
      // Move to next slide in current section
      set({
        currentSlide: state.currentSlide + 1,
      });
    }
  },
  
  /**
   * Go back to the previous slide
   */
  previousSlide: () => {
    const state = get();
    const content = loadContent();
    
    // If we're at the first slide of the current section
    if (state.currentSlide === 0) {
      // Move to previous section if available
      if (state.currentSection > 0) {
        const prevSection = state.currentSection - 1;
        const prevSectionData = content.sections[prevSection];
        
        set({
          currentSection: prevSection,
          currentSlide: prevSectionData.slides.length - 1,
          totalSlides: prevSectionData.slides.length,
          currentTrack: prevSectionData.audioTrackIndex,
        });
      }
    } else {
      // Move to previous slide in current section
      set({
        currentSlide: state.currentSlide - 1,
      });
    }
  },
  
  /**
   * Navigate to a specific section and optionally a specific slide
   */
  goToSection: (section: number, slide: number = 0) => {
    const content = loadContent();
    
    // Handle video section (8)
    if (section === 8) {
      set({
        currentSection: 8,
        currentSlide: 0,
        totalSlides: 1,
        isPlaying: false,
      });
      return;
    }
    
    const sectionData = content.sections[section];
    
    if (!sectionData) {
      console.error(`Section ${section} not found`);
      return;
    }
    
    // Ensure slide index is valid
    const validSlide = Math.max(0, Math.min(slide, sectionData.slides.length - 1));
    
    set({
      currentSection: section,
      currentSlide: validSlide,
      totalSlides: sectionData.slides.length,
      currentTrack: sectionData.audioTrackIndex,
    });
  },
  
  /**
   * Toggle between auto-play and manual mode
   */
  togglePlayPause: () => {
    const state = get();
    set({
      isPlaying: !state.isPlaying,
      isPaused: state.isPlaying, // If we were playing, now we're paused
    });
  },
  
  /**
   * Toggle mute state
   */
  toggleMute: () => {
    const state = get();
    set({
      isMuted: !state.isMuted,
    });
  },
  
  /**
   * Set mute state explicitly
   */
  setMuted: (muted: boolean) => {
    set({ isMuted: muted });
  },
  
  /**
   * Set chapter menu visibility
   */
  setShowChapterMenu: (show: boolean) => {
    set({ showChapterMenu: show });
  },
  
  /**
   * Set full-screen photo
   */
  setFullScreenPhoto: (url: string | null) => {
    set({
      showFullScreen: url !== null,
      fullScreenPhotoUrl: url || '',
    });
  },
  
  /**
   * Set current audio track
   */
  setCurrentTrack: (track: number) => {
    set({ currentTrack: track });
  },
  
  /**
   * Reset all state to initial conditions
   */
  reset: () => {
    const content = loadContent();
    const firstSection = content.sections[0];
    
    set({
      currentSection: 0,
      currentSlide: 0,
      totalSlides: firstSection?.slides.length || 0,
      isPlaying: false,
      isPaused: false,
      isComplete: false,
      isMuted: false,
      currentTrack: 0,
      showChapterMenu: false,
      showFullScreen: false,
      fullScreenPhotoUrl: '',
    });
  },
}));

export default useStoryStore;
