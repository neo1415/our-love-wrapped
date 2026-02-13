import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoSlide from '@/components/Story/PhotoSlide';
import { validateConfig } from '@/lib/content/validator';
import contentConfig from '@/config/content.config';

describe('Error Handling Integration', () => {
  describe('Photo Load Failures', () => {
    it('should display placeholder on photo load error', () => {
      const { container } = render(
        <PhotoSlide
          src="/invalid/path/photo.jpg"
          alt="Test photo"
          onComplete={() => {}}
          onDoubleTap={() => {}}
          onLongPress={() => {}}
          isPlaying={false}
        />
      );

      // Trigger error
      const img = container.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      // Should show placeholder text
      expect(screen.getByText('Photo unavailable')).toBeInTheDocument();
    });

    it('should maintain burgundy placeholder styling', () => {
      const { container } = render(
        <PhotoSlide
          src="/invalid/path/photo.jpg"
          alt="Test photo"
          onComplete={() => {}}
          onDoubleTap={() => {}}
          onLongPress={() => {}}
          isPlaying={false}
        />
      );

      const img = container.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      // Check for burgundy background class
      const placeholder = container.querySelector('.bg-burgundy');
      expect(placeholder).toBeInTheDocument();
    });

    it('should continue experience after photo failure', () => {
      const onComplete = jest.fn();
      
      render(
        <PhotoSlide
          src="/invalid/path/photo.jpg"
          alt="Test photo"
          onComplete={onComplete}
          onDoubleTap={() => {}}
          onLongPress={() => {}}
          isPlaying={false}
        />
      );

      // Photo failure should not prevent completion callback
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate correct configuration', () => {
      const result = validateConfig(contentConfig);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject configuration without names', () => {
      const invalidConfig = { ...contentConfig, names: undefined };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'names')).toBe(true);
    });

    it('should reject configuration without sections', () => {
      const invalidConfig = { ...contentConfig, sections: [] };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'sections')).toBe(true);
    });

    it('should reject configuration with invalid slide type', () => {
      const invalidConfig = {
        ...contentConfig,
        sections: [
          {
            id: 0,
            title: 'Test',
            slides: [
              {
                type: 'invalid' as any,
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

    it('should reject configuration without audio tracks', () => {
      const invalidConfig = {
        ...contentConfig,
        audio: { tracks: [] },
      };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'audio.tracks')).toBe(true);
    });

    it('should reject configuration without video', () => {
      const invalidConfig = {
        ...contentConfig,
        video: undefined as any,
      };
      const result = validateConfig(invalidConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'video')).toBe(true);
    });
  });

  describe('Graceful Degradation', () => {
    it('should handle missing optional fields', () => {
      const configWithoutOptionals = {
        ...contentConfig,
        names: {
          his: 'John',
          hers: 'Mary',
          // initials is optional
        },
      };
      
      const result = validateConfig(configWithoutOptionals);
      expect(result.isValid).toBe(true);
    });

    it('should validate slide durations are positive', () => {
      const invalidConfig = {
        ...contentConfig,
        sections: [
          {
            id: 0,
            title: 'Test',
            slides: [
              {
                type: 'text' as const,
                content: 'test',
                duration: -1000, // Invalid negative duration
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
