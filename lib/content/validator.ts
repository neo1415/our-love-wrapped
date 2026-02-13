import { ContentConfig } from '@/types/content';

/**
 * Content Validator
 * Validates the content configuration at runtime
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate names configuration
 */
function validateNames(names: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!names) {
    errors.push({ field: 'names', message: 'Names configuration is required' });
    return errors;
  }

  if (!names.his || typeof names.his !== 'string') {
    errors.push({ field: 'names.his', message: 'His name is required and must be a string' });
  }

  if (!names.hers || typeof names.hers !== 'string') {
    errors.push({ field: 'names.hers', message: 'Her name is required and must be a string' });
  }

  if (names.initials && typeof names.initials !== 'string') {
    errors.push({ field: 'names.initials', message: 'Initials must be a string' });
  }

  return errors;
}

/**
 * Validate audio configuration
 */
function validateAudio(audio: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!audio) {
    errors.push({ field: 'audio', message: 'Audio configuration is required' });
    return errors;
  }

  if (!Array.isArray(audio.tracks)) {
    errors.push({ field: 'audio.tracks', message: 'Audio tracks must be an array' });
    return errors;
  }

  if (audio.tracks.length === 0) {
    errors.push({ field: 'audio.tracks', message: 'At least one audio track is required' });
  }

  audio.tracks.forEach((track: any, index: number) => {
    if (!track.name || typeof track.name !== 'string') {
      errors.push({ 
        field: `audio.tracks[${index}].name`, 
        message: 'Track name is required and must be a string' 
      });
    }

    if (!track.path || typeof track.path !== 'string') {
      errors.push({ 
        field: `audio.tracks[${index}].path`, 
        message: 'Track path is required and must be a string' 
      });
    }

    if (!Array.isArray(track.sections)) {
      errors.push({ 
        field: `audio.tracks[${index}].sections`, 
        message: 'Track sections must be an array' 
      });
    }
  });

  return errors;
}

/**
 * Validate sections configuration
 */
function validateSections(sections: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Array.isArray(sections)) {
    errors.push({ field: 'sections', message: 'Sections must be an array' });
    return errors;
  }

  if (sections.length === 0) {
    errors.push({ field: 'sections', message: 'At least one section is required' });
  }

  sections.forEach((section: any, sectionIndex: number) => {
    if (typeof section.id !== 'number') {
      errors.push({ 
        field: `sections[${sectionIndex}].id`, 
        message: 'Section ID must be a number' 
      });
    }

    if (!section.title || typeof section.title !== 'string') {
      errors.push({ 
        field: `sections[${sectionIndex}].title`, 
        message: 'Section title is required and must be a string' 
      });
    }

    if (!Array.isArray(section.slides)) {
      errors.push({ 
        field: `sections[${sectionIndex}].slides`, 
        message: 'Section slides must be an array' 
      });
      return;
    }

    if (section.slides.length === 0) {
      errors.push({ 
        field: `sections[${sectionIndex}].slides`, 
        message: 'Section must have at least one slide' 
      });
    }

    section.slides.forEach((slide: any, slideIndex: number) => {
      if (slide.type !== 'text' && slide.type !== 'photo' && slide.type !== 'collage') {
        errors.push({ 
          field: `sections[${sectionIndex}].slides[${slideIndex}].type`, 
          message: 'Slide type must be "text", "photo", or "collage"' 
        });
      }

      // Content is required for text and photo slides, but optional for collage slides
      if (slide.type !== 'collage' && (!slide.content || typeof slide.content !== 'string')) {
        errors.push({ 
          field: `sections[${sectionIndex}].slides[${slideIndex}].content`, 
          message: 'Slide content is required and must be a string' 
        });
      }
      
      // For collage slides, validate photos array
      if (slide.type === 'collage') {
        if (!Array.isArray(slide.photos) || slide.photos.length === 0) {
          errors.push({ 
            field: `sections[${sectionIndex}].slides[${slideIndex}].photos`, 
            message: 'Collage slides must have a photos array with at least one photo' 
          });
        }
      }

      if (typeof slide.duration !== 'number' || slide.duration <= 0) {
        errors.push({ 
          field: `sections[${sectionIndex}].slides[${slideIndex}].duration`, 
          message: 'Slide duration must be a positive number' 
        });
      }

      if (slide.type === 'photo' && slide.altText && typeof slide.altText !== 'string') {
        errors.push({ 
          field: `sections[${sectionIndex}].slides[${slideIndex}].altText`, 
          message: 'Alt text must be a string' 
        });
      }
    });
  });

  return errors;
}

/**
 * Validate video configuration
 */
function validateVideo(video: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!video) {
    errors.push({ field: 'video', message: 'Video configuration is required' });
    return errors;
  }

  if (!video.path || typeof video.path !== 'string') {
    errors.push({ field: 'video.path', message: 'Video path is required and must be a string' });
  }

  if (!video.audioPath || typeof video.audioPath !== 'string') {
    errors.push({ field: 'video.audioPath', message: 'Video audio path is required and must be a string' });
  }

  if (typeof video.cuePoint !== 'number' || video.cuePoint < 0) {
    errors.push({ field: 'video.cuePoint', message: 'Video cue point must be a non-negative number' });
  }

  return errors;
}

/**
 * Validate the entire content configuration
 */
export function validateConfig(config: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!config) {
    return {
      isValid: false,
      errors: [{ field: 'config', message: 'Configuration is required' }],
    };
  }

  // Validate each section
  errors.push(...validateNames(config.names));
  
  if (!config.date || typeof config.date !== 'string') {
    errors.push({ field: 'date', message: 'Date is required and must be a string' });
  }

  errors.push(...validateAudio(config.audio));
  errors.push(...validateSections(config.sections));
  errors.push(...validateVideo(config.video));

  if (!config.finalMessage || typeof config.finalMessage !== 'string') {
    errors.push({ field: 'finalMessage', message: 'Final message is required and must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate and throw if invalid
 */
export function validateConfigOrThrow(config: ContentConfig): void {
  const result = validateConfig(config);
  
  if (!result.isValid) {
    const errorMessages = result.errors.map(e => `${e.field}: ${e.message}`).join('\n');
    throw new Error(`Content configuration validation failed:\n${errorMessages}`);
  }
}
