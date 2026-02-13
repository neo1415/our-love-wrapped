import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useStoryStore from '@/lib/state/storyStore';
import { loadContent } from '@/lib/content/contentLoader';

describe('Complete Story Flow Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useStoryStore.getState().reset();
  });

  it('should have correct initial state', () => {
    const state = useStoryStore.getState();
    
    expect(state.currentSection).toBe(0);
    expect(state.currentSlide).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.isMuted).toBe(false);
  });

  it('should load content configuration successfully', () => {
    const content = loadContent();
    
    expect(content).toBeDefined();
    expect(content.sections).toHaveLength(8);
    expect(content.audioTracks.length).toBeGreaterThan(0);
    expect(content.video).toBeDefined();
  });

  it('should navigate through sections correctly', () => {
    const store = useStoryStore.getState();
    const content = loadContent();
    
    // Start at section 0
    expect(store.currentSection).toBe(0);
    
    // Navigate to section 1
    store.goToSection(1);
    expect(useStoryStore.getState().currentSection).toBe(1);
    expect(useStoryStore.getState().currentSlide).toBe(0);
    
    // Navigate to section 7 (last story section)
    store.goToSection(7);
    expect(useStoryStore.getState().currentSection).toBe(7);
    
    // Navigate to section 8 (final screen)
    store.goToSection(8);
    expect(useStoryStore.getState().currentSection).toBe(8);
  });

  it('should maintain state consistency during navigation', () => {
    const store = useStoryStore.getState();
    
    // Set some state
    store.goToSection(3, 2);
    store.togglePlayPause();
    store.toggleMute();
    
    const state = useStoryStore.getState();
    expect(state.currentSection).toBe(3);
    expect(state.currentSlide).toBe(2);
    expect(state.isPlaying).toBe(true);
    expect(state.isMuted).toBe(true);
  });

  it('should reset state correctly for replay', () => {
    const store = useStoryStore.getState();
    
    // Change state
    store.goToSection(5, 3);
    store.togglePlayPause();
    store.toggleMute();
    store.setShowChapterMenu(true);
    
    // Reset
    store.reset();
    
    const state = useStoryStore.getState();
    expect(state.currentSection).toBe(0);
    expect(state.currentSlide).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.showChapterMenu).toBe(false);
  });

  it('should handle slide navigation within sections', () => {
    const store = useStoryStore.getState();
    const content = loadContent();
    
    // Go to a section with multiple slides
    const sectionWithSlides = content.sections.find(s => s.slides.length > 1);
    if (sectionWithSlides) {
      store.goToSection(sectionWithSlides.id);
      
      // Advance slide
      store.nextSlide();
      expect(useStoryStore.getState().currentSlide).toBe(1);
      
      // Go back
      store.previousSlide();
      expect(useStoryStore.getState().currentSlide).toBe(0);
    }
  });

  it('should track audio state correctly', () => {
    const store = useStoryStore.getState();
    
    // Initial state
    expect(store.isMuted).toBe(false);
    expect(store.currentTrack).toBe(0);
    
    // Toggle mute
    store.toggleMute();
    expect(useStoryStore.getState().isMuted).toBe(true);
    
    // Change track
    store.setCurrentTrack(1);
    expect(useStoryStore.getState().currentTrack).toBe(1);
    
    // Mute should persist
    expect(useStoryStore.getState().isMuted).toBe(true);
  });
});
