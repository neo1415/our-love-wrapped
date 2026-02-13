/**
 * Content Configuration Types
 * These types define the structure of the content.config.ts file
 */

export interface ContentConfig {
  // Personalization
  names: {
    his: string;
    hers: string;
    initials?: string;
  };
  date: string;
  
  // Audio configuration
  audio: {
    tracks: AudioTrack[];
  };
  
  // Section configuration
  sections: Section[];
  
  // Video configuration
  video: VideoConfig;
  
  // Final screen
  finalMessage: string;
  
  // Ice cream delivery code
  iceCreamCode?: string;
}

export interface AudioTrack {
  name: string;
  path: string;
  sections: number[];  // Which sections use this track
}

export interface Section {
  id: number;
  title: string;
  slides: Slide[];
}

export interface Slide {
  type: 'text' | 'photo' | 'collage';
  content: string;      // Text content or photo path
  duration: number;     // Auto-play duration in ms
  altText?: string;     // For photos
  special?: 'overlay' | 'valentine';  // For special text overlay on background or valentine style
  backgroundPhoto?: string; // For text slides with photo background
  photos?: Array<{ 
    src: string; 
    alt: string;
    focalPoint?: 'top center' | 'center center' | 'top left' | 'top right';
    collageRole?: 'hero' | 'accent' | 'strip' | 'equal';
  }>; // For collages
  layout?: 'hero-feature' | 'polaroid-scatter' | 'intimate-duo' | 'masonry-burst' | 'cinematic-strip' | 'featured-strip'; // Collage layout
}

export interface VideoConfig {
  path: string;
  audioPath: string;
  cuePoint: number;  // Seconds into JVKE track
}

// Processed types (after loading and validation)

export interface ProcessedSection {
  id: number;
  title: string;
  slides: ProcessedSlide[];
  audioTrackIndex: number;
  startPosition: number;  // Normalized 0-1 for progress bar
}

export interface ProcessedSlide {
  type: 'text' | 'photo' | 'collage';
  content: string;
  duration: number;
  parsedLines?: string[];  // For text slides
  altText?: string;        // For photo slides
  special?: 'overlay' | 'valentine';     // For special text overlay on background or valentine style
  backgroundPhoto?: string; // For text slides with photo background
  photos?: Array<{ 
    src: string; 
    alt: string;
    focalPoint?: 'top center' | 'center center' | 'top left' | 'top right';
    collageRole?: 'hero' | 'accent' | 'strip' | 'equal';
  }>; // For collages
  layout?: 'hero-feature' | 'polaroid-scatter' | 'intimate-duo' | 'masonry-burst' | 'cinematic-strip' | 'featured-strip'; // Collage layout
}

export interface LoadedContent {
  config: ContentConfig;
  sections: ProcessedSection[];
  audioTracks: AudioTrack[];
  video: VideoConfig;
}
