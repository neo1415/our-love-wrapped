import { validateConfig } from '@/lib/content/validator';
import contentConfig from '@/config/content.config';

describe('Content Validator', () => {
  describe('validateConfig', () => {
    it('should validate the default config successfully', () => {
      const result = validateConfig(contentConfig);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject config without names', () => {
      const invalidConfig = { ...contentConfig, names: undefined };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject config without date', () => {
      const invalidConfig = { ...contentConfig, date: undefined };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'date')).toBe(true);
    });

    it('should reject config without audio tracks', () => {
      const invalidConfig = { ...contentConfig, audio: { tracks: [] } };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'audio.tracks')).toBe(true);
    });

    it('should reject config without sections', () => {
      const invalidConfig = { ...contentConfig, sections: [] };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'sections')).toBe(true);
    });

    it('should reject config with invalid slide type', () => {
      const invalidConfig = {
        ...contentConfig,
        sections: [
          {
            id: 0,
            title: 'Test',
            slides: [
              {
                type: 'invalid',
                content: 'test',
                duration: 4000,
              },
            ],
          },
        ],
      };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
    });
  });
});
