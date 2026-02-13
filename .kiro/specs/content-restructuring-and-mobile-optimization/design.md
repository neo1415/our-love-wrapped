# Design Document: Content Restructuring and Mobile Optimization

## Overview

This design restructures the "Our Love Wrapped" content system to follow proper storytelling principles. The current implementation incorrectly groups all photos into collages, disrupting narrative flow. This redesign pairs messages with individual photos, uses collages strategically, introduces a new text overlay slide type, and optimizes the entire experience for mobile-first interaction.

The core philosophy: **sentence → photo(s) → sentence → photo(s)**, not **all sentences → all photos crammed together**.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Story Container                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Content Configuration                     │  │
│  │  - Section definitions with messages & photo mappings │  │
│  │  - Collage strategy rules (6+ photos)                 │  │
│  │  - Dynamic timing configuration                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Content Processor                         │  │
│  │  - Breaks messages into sentences                     │  │
│  │  - Pairs sentences with photos                        │  │
│  │  - Determines collage vs individual display           │  │
│  │  - Calculates dynamic timing per slide                │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Slide Renderer                            │  │
│  │  - TextSlide (text only)                              │  │
│  │  - PhotoSlide (single photo)                          │  │
│  │  - CollageSlide (2-3 photos, strategic layouts)      │  │
│  │  - TextOverlaySlide (photo bg + text overlay)        │  │
│  │  - VideoSlide (video content)                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Mobile-First Responsive Layout                 │  │
│  │  - Adaptive padding/gaps/radius                       │  │
│  │  - Touch-friendly targets (44x44px min)               │  │
│  │  - Swipe gesture support                              │  │
│  │  - Progressive navigation disclosure                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Content Flow Architecture

The content system follows a pipeline architecture:

1. **Configuration Layer**: Defines section structure, messages, photo mappings
2. **Processing Layer**: Transforms configuration into slide sequences
3. **Rendering Layer**: Displays slides with appropriate layouts and timing
4. **Interaction Layer**: Handles navigation, gestures, and progressive disclosure

## Components and Interfaces

### 1. Content Configuration Schema

```typescript
interface SectionConfig {
  id: string;
  title: string;
  song: {
    id: string;
    startTime?: number;
  };
  content: ContentBlock[];
}

interface ContentBlock {
  type: 'text' | 'photo' | 'collage' | 'text-overlay' | 'video';
  text?: string;
  photos?: string[];
  video?: string;
  layout?: CollageLayout;
  duration?: number; // Optional override, otherwise calculated dynamically
}

type CollageLayout = 
  | 'hero-feature'      // One large + smaller images
  | 'polaroid-scatter'  // Rotated polaroid style
  | 'intimate-duo'      // Two images side by side
  | 'cinematic-strip';  // Horizontal strip layout

interface ContentConfig {
  sections: SectionConfig[];
  collageRules: {
    minPhotosForCollage: number; // 6
    maxPhotosPerCollage: number; // 3
  };
  timingRules: {
    textOnly: [number, number];      // [4, 5] seconds
    singlePhoto: [number, number];   // [5, 6] seconds
    collage: [number, number];       // [6, 8] seconds
    textOverlay: [number, number];   // [6, 7] seconds
  };
}
```

### 2. Content Processor

```typescript
class ContentProcessor {
  /**
   * Breaks a message into individual sentences
   */
  breakIntoSentences(message: string): string[] {
    // Split on sentence boundaries (., !, ?)
    // Handle edge cases like "..." and emoticons
    return sentences;
  }

  /**
   * Pairs sentences with photos based on section strategy
   */
  pairSentencesWithPhotos(
    sentences: string[],
    photos: string[],
    strategy: 'individual' | 'strategic-collage'
  ): ContentBlock[] {
    if (photos.length < 6) {
      // Use individual or duo layouts
      return this.createIndividualPairing(sentences, photos);
    } else {
      // Use strategic collages mixed with individual photos
      return this.createStrategicCollages(sentences, photos);
    }
  }

  /**
   * Creates individual photo pairings for sections with few photos
   */
  private createIndividualPairing(
    sentences: string[],
    photos: string[]
  ): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    // Distribute photos across sentences
    // Allow multiple sentences to share a photo if needed
    // Or multiple photos for one sentence if it makes sense
    
    return blocks;
  }

  /**
   * Creates strategic collages for sections with many photos
   */
  private createStrategicCollages(
    sentences: string[],
    photos: string[]
  ): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    // Group photos into collages of 2-3 images
    // Mix collages with individual photos
    // Pair with sentence fragments
    
    return blocks;
  }

  /**
   * Calculates dynamic timing for a content block
   */
  calculateTiming(block: ContentBlock, rules: TimingRules): number {
    switch (block.type) {
      case 'text':
        return this.randomInRange(rules.textOnly);
      case 'photo':
        return this.randomInRange(rules.singlePhoto);
      case 'collage':
        // Longer duration for more photos
        const photoCount = block.photos?.length || 2;
        const [min, max] = rules.collage;
        return min + (photoCount - 2) * 0.5; // Add 0.5s per extra photo
      case 'text-overlay':
        return this.randomInRange(rules.textOverlay);
      default:
        return 5;
    }
  }

  private randomInRange([min, max]: [number, number]): number {
    return min + Math.random() * (max - min);
  }
}
```

### 3. Slide Components

#### TextOverlaySlide Component (NEW)

```typescript
interface TextOverlaySlideProps {
  text: string;
  photoUrl: string;
  duration: number;
}

function TextOverlaySlide({ text, photoUrl, duration }: TextOverlaySlideProps) {
  return (
    <div className="relative w-full h-full">
      {/* Full-screen background photo */}
      <Image
        src={photoUrl}
        alt=""
        fill
        className="object-cover object-top"
        priority
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      {/* Centered text overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white text-center leading-tight">
          {text}
        </h2>
      </div>
    </div>
  );
}
```

#### Enhanced CollageSlide Component

```typescript
interface CollageSlideProps {
  photos: string[];
  layout: CollageLayout;
  duration: number;
}

function CollageSlide({ photos, layout, duration }: CollageSlideProps) {
  // Ensure max 3 photos
  const displayPhotos = photos.slice(0, 3);
  
  return (
    <div className={`w-full h-full p-4 md:p-6 ${getLayoutClasses(layout)}`}>
      {displayPhotos.map((photo, index) => (
        <div
          key={index}
          className={getPhotoClasses(layout, index)}
        >
          <Image
            src={photo}
            alt=""
            fill
            className="object-cover object-top rounded-2xl md:rounded-3xl"
          />
        </div>
      ))}
    </div>
  );
}

function getLayoutClasses(layout: CollageLayout): string {
  switch (layout) {
    case 'hero-feature':
      return 'grid grid-cols-2 grid-rows-2 gap-2 md:gap-4';
    case 'polaroid-scatter':
      return 'relative';
    case 'intimate-duo':
      return 'flex gap-2 md:gap-4';
    case 'cinematic-strip':
      return 'flex flex-col gap-2 md:gap-4';
  }
}
```

### 4. Mobile-First Responsive System

```typescript
// Tailwind utility classes for mobile-first design
const responsiveClasses = {
  padding: 'p-4 md:p-6 lg:p-8',
  gap: 'gap-2 md:gap-4 lg:gap-6',
  borderRadius: 'rounded-2xl md:rounded-3xl',
  touchTarget: 'min-w-[44px] min-h-[44px]',
  fontSize: {
    heading: 'text-3xl md:text-4xl lg:text-5xl',
    body: 'text-base md:text-lg',
  },
};

// Swipe gesture detection
function useSwipeGesture(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}
```

### 5. Progressive Navigation Disclosure

```typescript
interface NavigationState {
  showArrows: boolean;
  hasSwipedOnce: boolean;
}

function useProgressiveNavigation() {
  const [state, setState] = useState<NavigationState>({
    showArrows: true,
    hasSwipedOnce: false,
  });
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSwipe = () => {
    if (isMobile && !state.hasSwipedOnce) {
      setState({
        showArrows: false,
        hasSwipedOnce: true,
      });
    }
  };

  // Always show arrows on desktop
  const shouldShowArrows = !isMobile || state.showArrows;

  return { shouldShowArrows, handleSwipe };
}
```

### 6. Background Overlay System

```typescript
function BackgroundOverlay() {
  return (
    <>
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ filter: 'brightness(0.3)' }}
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-dark-bg/70 via-dark-bg/60 to-dark-bg/70" />
    </>
  );
}
```

## Data Models

### Section Content Mapping

```typescript
const SECTION_CONTENT: SectionConfig[] = [
  {
    id: 'section-0',
    title: 'When I First Met You',
    song: { id: 'beautiful-in-white', startTime: 0 },
    content: [
      {
        type: 'text',
        text: 'It is truly baffling how a man can meet a miracle and in his humanity miss the gift that was right in front of him...',
      },
      {
        type: 'photo',
        photos: ['section-1/photo-1.jpg'],
      },
      {
        type: 'text',
        text: 'but you were so beautiful and so bright, it felt like trying to pluck the sun from the sky',
      },
      {
        type: 'photo',
        photos: ['section-1/photo-2.jpg'],
      },
    ],
  },
  {
    id: 'section-1',
    title: 'Our Reunion',
    song: { id: 'beautiful-in-white' },
    content: [
      {
        type: 'text',
        text: 'But when love is meant to be, Fate will find a way to bend the rules to make it work...',
      },
      {
        type: 'collage',
        photos: ['section-2/photo-1.jpg', 'section-2/photo-2.jpg', 'section-2/photo-3.jpg'],
        layout: 'hero-feature',
      },
      {
        type: 'text',
        text: 'with your goofy ass expressions and glass skin 😂',
      },
      {
        type: 'collage',
        photos: ['section-2/photo-4.jpg', 'section-2/photo-5.jpg'],
        layout: 'intimate-duo',
      },
      // ... more strategic collages and individual photos
    ],
  },
  // ... remaining sections following the same pattern
  {
    id: 'section-7',
    title: 'My Smile',
    song: { id: 'her-jvke' },
    content: [
      // ... earlier content blocks
      {
        type: 'text-overlay',
        text: 'You are mine',
        photos: ['section-8/final-photo.jpg'],
      },
    ],
  },
];
```

### Collage Strategy Rules

```typescript
const COLLAGE_STRATEGY = {
  // Only use collages when section has 6+ photos
  minPhotosForCollage: 6,
  
  // Maximum 2-3 images per collage
  maxPhotosPerCollage: 3,
  
  // Layout selection based on photo count and emotional tone
  layoutSelection: {
    2: ['intimate-duo', 'cinematic-strip'],
    3: ['hero-feature', 'polaroid-scatter'],
  },
  
  // Default image positioning to prevent face cutting
  imagePosition: 'object-top',
};
```

### Dynamic Timing Configuration

```typescript
const TIMING_CONFIG = {
  textOnly: [4, 5],        // 4-5 seconds
  singlePhoto: [5, 6],     // 5-6 seconds
  collage: [6, 8],         // 6-8 seconds (varies by photo count)
  textOverlay: [6, 7],     // 6-7 seconds
  video: [0, 0],           // Use video duration
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- **1.5 is redundant with 1.4**: Both test the alternating pattern of text and photos
- **2.4 is redundant with 2.3**: Both enforce the 3-image maximum for collages
- **9.4 is redundant with 2.5**: Both address emotional tone matching (not testable)

The following properties provide unique validation value:

### Property 1: Message Sentence Splitting

*For any* message string containing sentence-ending punctuation (., !, ?), breaking it into sentences should produce an array where each element is a complete sentence ending with punctuation.

**Validates: Requirements 1.1**

### Property 2: Sentence-Photo Pairing Completeness

*For any* set of sentences and photos processed by the pairing function, every sentence in the output content blocks should have at least one associated photo.

**Validates: Requirements 1.2**

### Property 3: Photo Sharing Support

*For any* content block with type 'photo' or 'collage', the photos array should support containing multiple photo paths.

**Validates: Requirements 1.3**

### Property 4: Alternating Content Flow

*For any* generated content sequence, text blocks and photo/collage blocks should alternate—no two consecutive text blocks should appear without a photo/collage block between them.

**Validates: Requirements 1.4**

### Property 5: Collage Threshold Enforcement

*For any* section with fewer than 6 photos, the generated content blocks should not contain collages with 3 photos (should use individual or duo layouts only).

**Validates: Requirements 2.1**

### Property 6: Strategic Collage Mixing

*For any* section with 6 or more photos, the generated content blocks should contain both collage-type blocks and individual photo-type blocks (not all collages).

**Validates: Requirements 2.2**

### Property 7: Collage Size Limit

*For any* content block with type 'collage', the photos array length should be greater than 0 and less than or equal to 3.

**Validates: Requirements 2.3**

### Property 8: Text Overlay Rendering

*For any* text overlay slide, the rendered output should contain both the background image element and the text overlay element with centering classes.

**Validates: Requirements 4.2**

### Property 9: Responsive Padding Classes

*For any* rendered layout component, the className string should contain both mobile padding classes (p-4) and desktop padding classes (md:p-6 or larger).

**Validates: Requirements 5.1**

### Property 10: Responsive Gap Classes

*For any* rendered layout component with multiple children, the className string should contain both mobile gap classes (gap-2) and desktop gap classes (md:gap-4 or larger).

**Validates: Requirements 5.2**

### Property 11: Responsive Border Radius Classes

*For any* rendered visual component, the className string should contain both mobile border radius classes (rounded-2xl) and desktop border radius classes (md:rounded-3xl).

**Validates: Requirements 5.3**

### Property 12: Touch Target Minimum Size

*For any* interactive element (button, link), the className string should contain minimum width and height classes ensuring at least 44x44 pixel touch targets (min-w-[44px] min-h-[44px] or equivalent).

**Validates: Requirements 5.5**

### Property 13: Swipe Gesture Response

*For any* swipe gesture with distance greater than the minimum threshold (50px), the appropriate navigation callback (onSwipeLeft or onSwipeRight) should be invoked.

**Validates: Requirements 5.6**

### Property 14: Navigation Arrow State Transition

*For any* mobile device, when a swipe event occurs for the first time, the navigation state should transition from showArrows: true to showArrows: false.

**Validates: Requirements 6.2**

### Property 15: Desktop Navigation Persistence

*For any* desktop device, the navigation arrows should remain visible (showArrows: true) regardless of swipe events.

**Validates: Requirements 6.3**

### Property 16: Background Brightness Filter

*For any* background image element, the style or className should include a brightness filter set to 0.3 or equivalent darkness.

**Validates: Requirements 7.1**

### Property 17: Background Gradient Overlay

*For any* background overlay element, the className should include gradient classes matching the pattern from-dark-bg/70 via-dark-bg/60 to-dark-bg/70.

**Validates: Requirements 7.2**

### Property 18: Text Slide Timing Range

*For any* content block with type 'text', the calculated duration should be greater than or equal to 4 seconds and less than or equal to 5 seconds.

**Validates: Requirements 8.1**

### Property 19: Photo Slide Timing Range

*For any* content block with type 'photo', the calculated duration should be greater than or equal to 5 seconds and less than or equal to 6 seconds.

**Validates: Requirements 8.2**

### Property 20: Collage Slide Timing Range

*For any* content block with type 'collage', the calculated duration should be greater than or equal to 6 seconds and less than or equal to 8 seconds, with longer durations for more photos.

**Validates: Requirements 8.3**

### Property 21: Text Overlay Timing Range

*For any* content block with type 'text-overlay', the calculated duration should be greater than or equal to 6 seconds and less than or equal to 7 seconds.

**Validates: Requirements 8.4**

### Property 22: Collage Image Positioning

*For any* image element within a collage, the className should include object-position classes that position the image at the top center (object-top or object-center).

**Validates: Requirements 9.2**

### Property 23: Collage Responsive Scaling

*For any* collage container element, the className should include responsive layout classes that adapt to mobile (flex, grid with mobile-first breakpoints).

**Validates: Requirements 9.3**

### Property 24: Collage Spacing Classes

*For any* collage container element, the className should include gap classes (gap-2, md:gap-4) to ensure proper spacing between images.

**Validates: Requirements 9.5**

## Error Handling

### Content Loading Errors

```typescript
class ContentLoadError extends Error {
  constructor(
    public sectionId: string,
    public reason: 'missing-photos' | 'invalid-config' | 'parse-error',
    message: string
  ) {
    super(message);
    this.name = 'ContentLoadError';
  }
}

// Graceful degradation
function loadSectionContent(sectionId: string): ContentBlock[] {
  try {
    const config = SECTION_CONTENT.find(s => s.id === sectionId);
    if (!config) {
      throw new ContentLoadError(sectionId, 'invalid-config', 'Section not found');
    }
    
    // Validate photo paths exist
    const allPhotos = config.content
      .flatMap(block => block.photos || []);
    
    const missingPhotos = allPhotos.filter(photo => !fileExists(photo));
    if (missingPhotos.length > 0) {
      console.warn(`Missing photos in ${sectionId}:`, missingPhotos);
      // Continue with available photos
    }
    
    return config.content;
  } catch (error) {
    console.error('Failed to load section content:', error);
    // Return fallback content
    return [{
      type: 'text',
      text: 'Content temporarily unavailable',
    }];
  }
}
```

### Timing Calculation Errors

```typescript
function safeCalculateTiming(block: ContentBlock, rules: TimingRules): number {
  try {
    const timing = calculateTiming(block, rules);
    
    // Validate timing is reasonable (1-15 seconds)
    if (timing < 1 || timing > 15) {
      console.warn(`Invalid timing ${timing}s for block type ${block.type}, using default`);
      return 5;
    }
    
    return timing;
  } catch (error) {
    console.error('Timing calculation failed:', error);
    return 5; // Safe default
  }
}
```

### Responsive Layout Errors

```typescript
function safeGetLayoutClasses(layout: CollageLayout): string {
  const layoutMap: Record<CollageLayout, string> = {
    'hero-feature': 'grid grid-cols-2 grid-rows-2 gap-2 md:gap-4',
    'polaroid-scatter': 'relative',
    'intimate-duo': 'flex gap-2 md:gap-4',
    'cinematic-strip': 'flex flex-col gap-2 md:gap-4',
  };
  
  const classes = layoutMap[layout];
  if (!classes) {
    console.warn(`Unknown layout ${layout}, using default`);
    return 'flex gap-2 md:gap-4'; // Safe default
  }
  
  return classes;
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific section configurations, edge cases (empty messages, missing photos), and integration between components
- **Property tests**: Verify universal properties across all content configurations, timing calculations, and responsive class generation

### Property-Based Testing Configuration

We will use **fast-check** (for TypeScript/JavaScript) as our property-based testing library.

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: content-restructuring-and-mobile-optimization, Property {number}: {property_text}**
- Each correctness property implemented as a SINGLE property-based test

**Example Property Test**:

```typescript
import fc from 'fast-check';

// Feature: content-restructuring-and-mobile-optimization, Property 7: Collage Size Limit
test('collage blocks should contain 1-3 photos', () => {
  fc.assert(
    fc.property(
      fc.array(fc.string(), { minLength: 1, maxLength: 3 }), // Generate 1-3 photo paths
      (photos) => {
        const block: ContentBlock = {
          type: 'collage',
          photos,
          layout: 'hero-feature',
        };
        
        // Property: collage photos array length should be 1-3
        expect(block.photos?.length).toBeGreaterThan(0);
        expect(block.photos?.length).toBeLessThanOrEqual(3);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Focus

Unit tests should cover:
- Specific section content configurations (Section 0-7)
- Edge cases: empty messages, single photo sections, maximum photo sections
- Error conditions: missing photos, invalid layouts, timing out of range
- Integration: content processor → slide renderer → responsive layout
- Progressive navigation state transitions
- Swipe gesture detection with various touch distances

### Test Coverage Goals

- **Content Processing**: 100% coverage of sentence splitting, photo pairing, collage strategy
- **Timing Calculation**: All content types, edge cases (0 photos, 10+ photos)
- **Responsive Classes**: All breakpoints, all component types
- **Navigation**: Mobile vs desktop behavior, state transitions
- **Error Handling**: All error paths, graceful degradation

### Testing Tools

- **Jest**: Unit test runner
- **React Testing Library**: Component testing
- **fast-check**: Property-based testing
- **@testing-library/user-event**: Gesture simulation
