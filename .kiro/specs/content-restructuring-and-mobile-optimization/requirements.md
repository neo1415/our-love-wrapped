# Requirements Document

## Introduction

This specification addresses the restructuring of the "Our Love Wrapped" content system to follow proper storytelling principles. The current implementation incorrectly crams all photos into collages, disrupting the narrative flow. This restructuring will pair messages with individual photos, use collages strategically only when necessary, and optimize the entire experience for mobile-first interaction.

## Glossary

- **Content_System**: The module responsible for managing story content, including text messages, photos, videos, and their presentation
- **Slide**: A single unit of content displayed to the user (can be text, photo, video, or combination)
- **Collage**: A slide containing multiple photos arranged in a creative layout
- **Section**: A thematic grouping of slides that tells part of the story
- **Text_Overlay_Slide**: A slide type where a photo serves as the background with text overlaid on top
- **Progressive_Disclosure**: A UX pattern where interface elements are revealed gradually as users learn the interaction
- **Mobile_First**: A design approach where layouts are optimized for mobile devices first, then enhanced for larger screens

## Requirements

### Requirement 1: Content Flow Architecture

**User Story:** As a viewer, I want the story to flow naturally with messages paired to photos, so that I can experience the narrative as intended without visual cramming.

#### Acceptance Criteria

1. WHEN displaying story content, THE Content_System SHALL break messages into individual sentences
2. WHEN a sentence is displayed, THE Content_System SHALL pair it with one or more related photos
3. WHEN multiple photos relate to the same sentence, THE Content_System SHALL allow photo sharing for that sentence
4. THE Content_System SHALL follow the pattern: sentence → photo(s) → sentence → photo(s) throughout the story
5. THE Content_System SHALL NOT display all sentences followed by all photos in a cramped arrangement

### Requirement 2: Strategic Collage Usage

**User Story:** As a viewer, I want collages used only when necessary, so that individual photos have space to breathe and the story doesn't feel overwhelming.

#### Acceptance Criteria

1. WHEN a section contains fewer than 6 photos, THE Content_System SHALL display photos individually or in pairs
2. WHEN a section contains 6 or more photos, THE Content_System SHALL use collages strategically mixed with individual photos
3. WHEN creating a collage, THE Content_System SHALL include a maximum of 2-3 images per collage
4. THE Content_System SHALL NOT create collages with more than 3 images
5. WHEN selecting collage layouts, THE Content_System SHALL match the layout style to the emotional tone of the section

### Requirement 3: Section Content Mapping

**User Story:** As a content manager, I want each section properly mapped with its messages and photos, so that the story structure is clear and maintainable.

#### Acceptance Criteria

1. WHEN loading Section 0 ("When I First Met You"), THE Content_System SHALL display the specified message broken into 2-3 parts paired with 2 photos from section-1 folder
2. WHEN loading Section 1 ("Our Reunion"), THE Content_System SHALL display the specified message with 10 photos from section-2 folder using strategic collages
3. WHEN loading Section 2 ("Our First Date"), THE Content_System SHALL display the specified message with 5 photos and 1 video from section-3 folder
4. WHEN loading Section 3 ("The First I Love You"), THE Content_System SHALL display the specified message with 1 photo from section-4 folder
5. WHEN loading Section 4 ("Her Brilliance"), THE Content_System SHALL display the specified message with 9 photos from section-5 folder using strategic collages
6. WHEN loading Section 5 ("Through The Fire"), THE Content_System SHALL display the specified message broken into parts with 1 photo from section-6 folder
7. WHEN loading Section 6 ("Our Together"), THE Content_System SHALL display the specified message with 8 photos from section-7 folder using strategic collages
8. WHEN loading Section 7 ("My Smile"), THE Content_System SHALL display the specified message with 11 photos from section-8 folder, ending with a text overlay slide for "You are mine"

### Requirement 4: Text Overlay on Photo Slide Type

**User Story:** As a viewer, I want to see the final "You are mine" message overlaid on a photo background, so that the emotional impact is maximized.

#### Acceptance Criteria

1. THE Content_System SHALL support a text overlay slide type where a photo serves as the full-screen background
2. WHEN displaying a text overlay slide, THE Content_System SHALL center the text and make it large and clearly visible
3. WHEN the photo background has low contrast with text, THE Content_System SHALL apply a dark overlay to ensure text readability
4. WHEN displaying Section 7's final slide, THE Content_System SHALL use the text overlay slide type with "You are mine" text

### Requirement 5: Mobile-First Responsive Design

**User Story:** As a mobile user, I want the interface optimized for my device first, so that I have the best possible experience on smaller screens.

#### Acceptance Criteria

1. WHEN rendering layouts, THE Content_System SHALL use smaller padding on mobile (p-4) and larger padding on desktop (md:p-6)
2. WHEN rendering layouts, THE Content_System SHALL use smaller gaps on mobile (gap-2) and larger gaps on desktop (md:gap-4)
3. WHEN rendering layouts, THE Content_System SHALL use smaller border radius on mobile (rounded-2xl) and larger radius on desktop (md:rounded-3xl)
4. WHEN rendering layouts, THE Content_System SHALL use reduced heights on mobile for better viewport usage
5. WHEN rendering interactive elements, THE Content_System SHALL ensure touch targets are minimum 44x44 pixels
6. WHEN on mobile devices, THE Content_System SHALL support smooth swipe gestures for navigation

### Requirement 6: Progressive Navigation Disclosure

**User Story:** As a first-time viewer on mobile, I want to see navigation arrows initially to learn the interaction, then have them disappear after I understand, so that the interface stays clean.

#### Acceptance Criteria

1. WHEN the story starts on mobile, THE Content_System SHALL display navigation arrow buttons on the first section
2. WHEN the user swipes for the first time on mobile, THE Content_System SHALL hide the navigation arrows
3. WHEN on desktop, THE Content_System SHALL keep navigation arrows visible at all times
4. THE Content_System SHALL use this progressive disclosure pattern to teach swipe interaction

### Requirement 7: Background Overlay Balance

**User Story:** As a viewer, I want the background image to provide ambiance without competing with content, so that buttons and text are clearly visible.

#### Acceptance Criteria

1. WHEN displaying the background image, THE Content_System SHALL apply brightness(0.3) filter
2. WHEN displaying the background image, THE Content_System SHALL apply a gradient overlay from-dark-bg/70 via-dark-bg/60 to-dark-bg/70
3. WHEN displaying UI elements over the background, THE Content_System SHALL ensure buttons and text are clearly visible and readable
4. THE Content_System SHALL treat the background as subtle ambiance, not primary visual content

### Requirement 8: Dynamic Content Timing

**User Story:** As a viewer, I want each slide to display for an appropriate duration based on its content, so that I have enough time to read and appreciate without feeling rushed or bored.

#### Acceptance Criteria

1. WHEN displaying a text-only slide, THE Content_System SHALL show it for 4-5 seconds
2. WHEN displaying a single photo slide, THE Content_System SHALL show it for 5-6 seconds
3. WHEN displaying a collage slide, THE Content_System SHALL show it for 6-8 seconds based on the number of photos
4. WHEN displaying a text overlay on photo slide, THE Content_System SHALL show it for 6-7 seconds
5. THE Content_System SHALL calculate timing dynamically to feel natural throughout the experience

### Requirement 9: Collage Design Principles

**User Story:** As a viewer, I want collages to be visually appealing and properly display faces, so that the photos enhance rather than detract from the story.

#### Acceptance Criteria

1. WHEN creating collages, THE Content_System SHALL use creative layouts including hero-feature, polaroid-scatter, intimate-duo, and cinematic-strip
2. WHEN positioning images in collages, THE Content_System SHALL use object-position top center by default to prevent face cutting
3. WHEN rendering collages on mobile, THE Content_System SHALL scale layouts responsively
4. WHEN selecting a collage layout, THE Content_System SHALL match the style to the emotional tone of the section
5. THE Content_System SHALL ensure all collage images have proper aspect ratios and spacing
