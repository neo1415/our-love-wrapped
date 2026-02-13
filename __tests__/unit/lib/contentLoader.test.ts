import { loadContent, calculateProgress, getSectionById } from '@/lib/content/contentLoader';

describe('Content Loader', () => {
  describe('loadContent', () => {
    it('should load content configuration successfully', () => {
      const content = loadContent();
      
      expect(content).toBeDefined();
      expect(content.config).toBeDefined();
      expect(content.sections).toBeDefined();
      expect(content.audioTracks).toBeDefined();
      expect(content.video).toBeDefined();
    });

    it('should have 8 sections', () => {
      const content = loadContent();
      expect(content.sections).toHaveLength(8);
    });

    it('should process sections with audio track indices', () => {
      const content = loadContent();
      
      content.sections.forEach((section) => {
        expect(section.audioTrackIndex).toBeGreaterThanOrEqual(0);
        expect(section.startPosition).toBeGreaterThanOrEqual(0);
        expect(section.startPosition).toBeLessThanOrEqual(1);
      });
    });

    it('should parse text slides into lines', () => {
      const content = loadContent();
      const textSlides = content.sections
        .flatMap(s => s.slides)
        .filter(slide => slide.type === 'text');
      
      textSlides.forEach((slide) => {
        expect(slide.parsedLines).toBeDefined();
        expect(Array.isArray(slide.parsedLines)).toBe(true);
        if (slide.parsedLines) {
          expect(slide.parsedLines.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('getSectionById', () => {
    it('should return section for valid ID', () => {
      const section = getSectionById(0);
      expect(section).toBeDefined();
      expect(section?.id).toBe(0);
    });

    it('should return undefined for invalid ID', () => {
      const section = getSectionById(999);
      expect(section).toBeUndefined();
    });
  });

  describe('calculateProgress', () => {
    it('should return 0 for first slide of first section', () => {
      const progress = calculateProgress(0, 0);
      expect(progress).toBe(0);
    });

    it('should return value between 0 and 1', () => {
      const progress = calculateProgress(2, 1);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    });
  });
});
