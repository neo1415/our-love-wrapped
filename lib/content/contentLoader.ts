import contentConfig from '@/config/content.config';
import { ContentConfig, LoadedContent, ProcessedSection, ProcessedSlide } from '@/types/content';

/**
 * Content Loader
 * Loads and processes the content configuration
 */

/**
 * Parse text content into lines
 */
function parseTextLines(content: string): string[] {
  return content.split('\n').filter(line => line.trim().length > 0);
}

/**
 * Calculate the total number of slides across all sections
 */
function calculateTotalSlides(config: ContentConfig): number {
  return config.sections.reduce((total, section) => total + section.slides.length, 0);
}

/**
 * Calculate the start position (0-1) for each section based on slide count
 */
function calculateSectionPositions(config: ContentConfig): number[] {
  const totalSlides = calculateTotalSlides(config);
  const positions: number[] = [];
  let currentSlide = 0;

  config.sections.forEach((section) => {
    positions.push(currentSlide / totalSlides);
    currentSlide += section.slides.length;
  });

  return positions;
}

/**
 * Determine which audio track index should play for a given section
 */
function getAudioTrackIndexForSection(sectionId: number, config: ContentConfig): number {
  const trackIndex = config.audio.tracks.findIndex(track => 
    track.sections.includes(sectionId)
  );
  
  // Default to first track if not found
  return trackIndex >= 0 ? trackIndex : 0;
}

/**
 * Process a slide to add parsed content
 */
function processSlide(slide: any): ProcessedSlide {
  const processed: ProcessedSlide = {
    type: slide.type,
    content: slide.content,
    duration: slide.duration,
  };

  if (slide.type === 'text') {
    processed.parsedLines = parseTextLines(slide.content);
    if (slide.special) {
      processed.special = slide.special;
    }
    if (slide.backgroundPhoto) {
      processed.backgroundPhoto = slide.backgroundPhoto;
    }
  }

  if (slide.type === 'photo' && slide.altText) {
    processed.altText = slide.altText;
  }

  if (slide.type === 'collage') {
    processed.photos = slide.photos;
    processed.layout = slide.layout;
    console.log('Processing collage slide:', {
      photos: slide.photos,
      layout: slide.layout,
      photoCount: slide.photos?.length
    });
  }

  return processed;
}

/**
 * Process sections to add calculated data
 */
function processSections(config: ContentConfig): ProcessedSection[] {
  const positions = calculateSectionPositions(config);

  return config.sections.map((section, index) => ({
    id: section.id,
    title: section.title,
    slides: section.slides.map(processSlide),
    audioTrackIndex: getAudioTrackIndexForSection(section.id, config),
    startPosition: positions[index],
  }));
}

/**
 * Load and process the content configuration
 */
export function loadContent(): LoadedContent {
  const processedSections = processSections(contentConfig);

  return {
    config: contentConfig,
    sections: processedSections,
    audioTracks: contentConfig.audio.tracks,
    video: contentConfig.video,
  };
}

/**
 * Get a specific section by ID
 */
export function getSectionById(sectionId: number): ProcessedSection | undefined {
  const content = loadContent();
  return content.sections.find(section => section.id === sectionId);
}

/**
 * Get the audio track for a specific section
 */
export function getAudioTrackForSection(sectionId: number): string {
  const content = loadContent();
  const section = content.sections.find(s => s.id === sectionId);
  
  if (!section) {
    return content.audioTracks[0]?.path || '';
  }

  return content.audioTracks[section.audioTrackIndex]?.path || '';
}

/**
 * Calculate progress (0-1) for a given section and slide
 */
export function calculateProgress(sectionId: number, slideIndex: number): number {
  const content = loadContent();
  const totalSlides = content.sections.reduce((sum, s) => sum + s.slides.length, 0);
  
  let slidesBeforeSection = 0;
  for (const section of content.sections) {
    if (section.id === sectionId) {
      break;
    }
    slidesBeforeSection += section.slides.length;
  }

  const currentSlidePosition = slidesBeforeSection + slideIndex;
  return currentSlidePosition / totalSlides;
}
