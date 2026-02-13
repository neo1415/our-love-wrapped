import useStoryStore from '@/lib/state/storyStore';

describe('Story Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useStoryStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useStoryStore.getState();
      
      expect(state.currentSection).toBe(0);
      expect(state.currentSlide).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.isComplete).toBe(false);
      expect(state.isMuted).toBe(false);
      expect(state.currentTrack).toBe(0);
      expect(state.showChapterMenu).toBe(false);
      expect(state.showFullScreen).toBe(false);
    });
  });

  describe('Navigation Actions', () => {
    it('should advance to next slide', () => {
      const { nextSlide } = useStoryStore.getState();
      
      nextSlide();
      
      const state = useStoryStore.getState();
      expect(state.currentSlide).toBe(1);
    });

    it('should go back to previous slide', () => {
      const store = useStoryStore.getState();
      
      // Move forward first
      store.nextSlide();
      store.nextSlide();
      
      // Then go back
      store.previousSlide();
      
      const state = useStoryStore.getState();
      expect(state.currentSlide).toBe(1);
    });

    it('should navigate to specific section', () => {
      const { goToSection } = useStoryStore.getState();
      
      goToSection(2);
      
      const state = useStoryStore.getState();
      expect(state.currentSection).toBe(2);
      expect(state.currentSlide).toBe(0);
    });

    it('should navigate to specific section and slide', () => {
      const { goToSection } = useStoryStore.getState();
      
      goToSection(1, 2);
      
      const state = useStoryStore.getState();
      expect(state.currentSection).toBe(1);
      expect(state.currentSlide).toBe(2);
    });
  });

  describe('Playback Actions', () => {
    it('should toggle play/pause', () => {
      const { togglePlayPause } = useStoryStore.getState();
      
      togglePlayPause();
      expect(useStoryStore.getState().isPlaying).toBe(true);
      
      togglePlayPause();
      expect(useStoryStore.getState().isPlaying).toBe(false);
    });

    it('should toggle mute', () => {
      const { toggleMute } = useStoryStore.getState();
      
      toggleMute();
      expect(useStoryStore.getState().isMuted).toBe(true);
      
      toggleMute();
      expect(useStoryStore.getState().isMuted).toBe(false);
    });

    it('should set muted state explicitly', () => {
      const { setMuted } = useStoryStore.getState();
      
      setMuted(true);
      expect(useStoryStore.getState().isMuted).toBe(true);
      
      setMuted(false);
      expect(useStoryStore.getState().isMuted).toBe(false);
    });
  });

  describe('UI Actions', () => {
    it('should toggle chapter menu', () => {
      const { setShowChapterMenu } = useStoryStore.getState();
      
      setShowChapterMenu(true);
      expect(useStoryStore.getState().showChapterMenu).toBe(true);
      
      setShowChapterMenu(false);
      expect(useStoryStore.getState().showChapterMenu).toBe(false);
    });

    it('should set full screen photo', () => {
      const { setFullScreenPhoto } = useStoryStore.getState();
      
      setFullScreenPhoto('/test.jpg');
      expect(useStoryStore.getState().showFullScreen).toBe(true);
      expect(useStoryStore.getState().fullScreenPhotoUrl).toBe('/test.jpg');
      
      setFullScreenPhoto(null);
      expect(useStoryStore.getState().showFullScreen).toBe(false);
      expect(useStoryStore.getState().fullScreenPhotoUrl).toBe('');
    });
  });

  describe('Reset Action', () => {
    it('should reset all state to initial conditions', () => {
      const store = useStoryStore.getState();
      
      // Change some state
      store.goToSection(3, 2);
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
  });
});
