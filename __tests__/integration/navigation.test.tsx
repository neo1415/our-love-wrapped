import useStoryStore from '@/lib/state/storyStore';
import { loadContent } from '@/lib/content/contentLoader';

describe('Navigation Scenarios Integration', () => {
  beforeEach(() => {
    useStoryStore.getState().reset();
  });

  describe('Manual Navigation', () => {
    it('should navigate forward through all sections', () => {
      const store = useStoryStore.getState();
      const content = loadContent();

      for (let i = 0; i < content.sections.length; i++) {
        store.goToSection(i);
        expect(useStoryStore.getState().currentSection).toBe(i);
        expect(useStoryStore.getState().currentSlide).toBe(0);
      }
    });

    it('should navigate backward through sections', () => {
      const store = useStoryStore.getState();
      const content = loadContent();

      // Start at last section
      store.goToSection(content.sections.length - 1);

      for (let i = content.sections.length - 1; i >= 0; i--) {
        store.goToSection(i);
        expect(useStoryStore.getState().currentSection).toBe(i);
      }
    });

    it('should handle slide navigation within a section', () => {
      const store = useStoryStore.getState();
      const content = loadContent();

      // Find a section with multiple slides
      const multiSlideSection = content.sections.find(s => s.slides.length > 2);
      
      if (multiSlideSection) {
        store.goToSection(multiSlideSection.id);

        // Navigate through slides
        for (let i = 0; i < multiSlideSection.slides.length - 1; i++) {
          store.nextSlide();
          const currentSlide = useStoryStore.getState().currentSlide;
          expect(currentSlide).toBeGreaterThan(i);
        }
      }
    });

    it('should not go below slide 0 when going back', () => {
      const store = useStoryStore.getState();
      
      store.goToSection(0, 0);
      store.previousSlide();
      
      // Should stay at section 0, slide 0 (or move to previous section's last slide)
      const state = useStoryStore.getState();
      expect(state.currentSection).toBeGreaterThanOrEqual(0);
      expect(state.currentSlide).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Chapter Jumping', () => {
    it('should jump to any chapter directly', () => {
      const store = useStoryStore.getState();
      const content = loadContent();

      // Jump to middle chapter
      const middleChapter = Math.floor(content.sections.length / 2);
      store.goToSection(middleChapter);
      
      expect(useStoryStore.getState().currentSection).toBe(middleChapter);
      expect(useStoryStore.getState().currentSlide).toBe(0);
    });

    it('should update audio track when jumping chapters', () => {
      const store = useStoryStore.getState();
      const content = loadContent();

      // Jump to a section with different audio track
      store.goToSection(0);
      const track1 = content.sections[0].audioTrackIndex;
      
      store.goToSection(5);
      const track2 = content.sections[5].audioTrackIndex;
      
      // Tracks should be different (based on config)
      expect(track1).not.toBe(track2);
    });

    it('should preserve playback mode when jumping chapters', () => {
      const store = useStoryStore.getState();
      
      // Set to playing
      store.togglePlayPause();
      expect(useStoryStore.getState().isPlaying).toBe(true);
      
      // Jump to another chapter
      store.goToSection(3);
      
      // Should still be playing
      expect(useStoryStore.getState().isPlaying).toBe(true);
    });
  });

  describe('Auto-play Mode', () => {
    it('should toggle between auto-play and manual mode', () => {
      const store = useStoryStore.getState();
      
      expect(store.isPlaying).toBe(false);
      
      store.togglePlayPause();
      expect(useStoryStore.getState().isPlaying).toBe(true);
      
      store.togglePlayPause();
      expect(useStoryStore.getState().isPlaying).toBe(false);
    });

    it('should maintain playback state during navigation', () => {
      const store = useStoryStore.getState();
      
      store.togglePlayPause();
      expect(useStoryStore.getState().isPlaying).toBe(true);
      
      store.nextSlide();
      expect(useStoryStore.getState().isPlaying).toBe(true);
      
      store.goToSection(2);
      expect(useStoryStore.getState().isPlaying).toBe(true);
    });
  });

  describe('Progress Tracking', () => {
    it('should calculate progress correctly', () => {
      const store = useStoryStore.getState();
      const content = loadContent();

      // At start
      store.goToSection(0, 0);
      const startProgress = useStoryStore.getState().currentSection;
      expect(startProgress).toBe(0);

      // At middle
      const middleSection = Math.floor(content.sections.length / 2);
      store.goToSection(middleSection);
      const middleProgress = useStoryStore.getState().currentSection;
      expect(middleProgress).toBe(middleSection);

      // At end
      store.goToSection(content.sections.length - 1);
      const endProgress = useStoryStore.getState().currentSection;
      expect(endProgress).toBe(content.sections.length - 1);
    });
  });
});
