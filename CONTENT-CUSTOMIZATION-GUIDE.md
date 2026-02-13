# Content Customization Guide

This guide explains how to customize the Our Love Wrapped experience with your own photos, audio, video, and story content.

## Quick Start

All content is configured in a single file: `config/content.config.ts`

The configuration is organized into five main sections:
1. Personalization (names, dates)
2. Audio tracks
3. Story sections (8 chapters)
4. Video
5. Final message

## File Structure

All media files should be placed in the `public/` directory:

```
public/
├── photos/          # Your photos
├── audio/           # Your audio tracks
└── video/           # Your video file
```

## Personalization

Update the names and relationship date:

```typescript
names: {
  his: 'John',        // Your name
  hers: 'Mary',       // Your partner's name
  initials: 'J & M',  // Optional initials for landing page
},
date: 'January 15, 2020',  // Your relationship start date
```

## Audio Configuration

### Audio Requirements

- Format: MP3 (recommended) or WAV
- File size: < 10MB per track (recommended)
- Quality: 128-192 kbps is sufficient for web playback
- Duration: 3-5 minutes per track (recommended)

### Configuring Audio Tracks

The experience uses 3 audio tracks that play continuously:

```typescript
audio: {
  tracks: [
    {
      name: 'Beautiful in White',           // Display name
      path: '/audio/beautiful-in-white.mp3', // Path in public/audio/
      sections: [0, 1, 2, 3],                // Sections using this track
    },
    {
      name: 'Beautiful Things',
      path: '/audio/beautiful-things.mp3',
      sections: [4, 5, 6],
    },
    {
      name: 'Her by JVKE',
      path: '/audio/her-jvke.mp3',
      sections: [7],
    },
  ],
},
```

### Audio Track Mapping

- Track 1: Plays during sections 0-3 (The Beginning → Our Adventures)
- Track 2: Plays during sections 4-6 (The Little Things → Growing Together)
- Track 3: Plays during section 7 (Forever) and triggers the video transition
- Video: Has its own audio track

The experience automatically crossfades between tracks (2-second fade).

## Story Sections

### Section Structure

Each section represents a chapter in your love story. You have 8 sections (0-7) to customize.

```typescript
{
  id: 0,                    // Section ID (0-7)
  title: 'The Beginning',   // Chapter title
  slides: [                 // Array of slides
    // ... slides go here
  ],
}
```

### Slide Types

#### Text Slides

Display animated text with optional formatting:

```typescript
{
  type: 'text',
  content: 'Your text here\nUse line breaks\nFor multiple lines',
  duration: 4000,  // 4 seconds (recommended)
}
```

Text formatting options:
- `*text*` - Italic emphasis (rose-gold color)
- `**text**` - Bold emphasis
- `{{name}}` - Pet name styling (rose-gold color)

Example:
```typescript
content: 'I fell for you\n*Slowly*, then all at once\n**Completely** and utterly\nMy {{love}}'
```

#### Photo Slides

Display photos with Ken Burns effect (slow zoom):

```typescript
{
  type: 'photo',
  content: '/photos/first-meeting.jpg',  // Path in public/photos/
  altText: 'Our first meeting',          // Accessibility description
  duration: 5000,                        // 5 seconds (recommended)
}
```

### Photo Requirements

- Format: JPG or PNG (WebP recommended for smaller file size)
- Dimensions: 1080x1920 (portrait) or 1920x1080 (landscape)
- File size: < 500KB per photo (recommended)
- Aspect ratio: 9:16 (portrait) works best for mobile
- Total photos: 8-15 photos recommended

### Photo Optimization

To optimize your photos:

1. Resize to 1080x1920 or smaller
2. Compress using tools like:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)
   - ImageOptim (Mac)
3. Convert to WebP format for best compression
4. Aim for < 500KB per photo

See `ASSET-OPTIMIZATION.md` for detailed optimization instructions.

### Recommended Slide Durations

- Text slides: 4000ms (4 seconds)
- Photo slides: 5000ms (5 seconds)
- Adjust based on content length and pacing

### Section Examples

#### Minimal Section (2 slides)
```typescript
{
  id: 0,
  title: 'The Beginning',
  slides: [
    {
      type: 'text',
      content: 'It all started\nOn a beautiful day',
      duration: 4000,
    },
    {
      type: 'photo',
      content: '/photos/first-meeting.jpg',
      altText: 'Our first meeting',
      duration: 5000,
    },
  ],
}
```

#### Rich Section (5 slides)
```typescript
{
  id: 3,
  title: 'Our Adventures',
  slides: [
    {
      type: 'text',
      content: 'We explored the world together',
      duration: 4000,
    },
    {
      type: 'photo',
      content: '/photos/adventure1.jpg',
      altText: 'Paris trip',
      duration: 5000,
    },
    {
      type: 'photo',
      content: '/photos/adventure2.jpg',
      altText: 'Beach vacation',
      duration: 5000,
    },
    {
      type: 'photo',
      content: '/photos/adventure3.jpg',
      altText: 'Mountain hiking',
      duration: 5000,
    },
    {
      type: 'text',
      content: 'Every moment with you\nIs an *adventure*',
      duration: 4000,
    },
  ],
}
```

## Video Configuration

### Video Requirements

- Format: MP4 (H.264 codec)
- Resolution: 720p (1280x720) recommended
- File size: < 100MB (recommended)
- Duration: 1-3 minutes (recommended)
- Frame rate: 30fps
- Audio: AAC codec, 128 kbps

### Configuring Video

```typescript
video: {
  path: '/video/our-video.mp4',      // Path in public/video/
  audioPath: '/video/our-video.mp4', // Can be same file or separate audio
  cuePoint: 120,                     // Seconds into track 3 when video starts
}
```

### Cue Point

The `cuePoint` determines when the video transition triggers during the third audio track (section 7).

- Set this to the emotional peak of your chosen song
- Measured in seconds from the start of track 3
- Example: `cuePoint: 120` means 2 minutes into the track
- The video transition includes:
  1. Heartbeat pulse animation (1 second)
  2. Fade to black (500ms)
  3. Video playback with its own audio

### Video Optimization

To optimize your video:

1. Use HandBrake or FFmpeg to compress:
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M -b:a 128k output.mp4
   ```
2. Target 720p resolution (1280x720)
3. Use 2-3 Mbps video bitrate
4. Use 128 kbps audio bitrate
5. Aim for < 100MB total file size

See `ASSET-OPTIMIZATION.md` for detailed optimization instructions.

## Final Message

Customize the message displayed after the video:

```typescript
finalMessage: 'I Love You, Forever and Always',
```

This appears on the final screen with the download button and replay option.

## Testing Your Configuration

After updating the configuration:

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Test the complete experience:
   - Landing page displays correct names and date
   - Audio plays continuously
   - All photos load correctly
   - Text formatting appears correctly
   - Video triggers at the right moment
   - Final message displays correctly

4. Check the browser console for any errors:
   - Missing files will show 404 errors
   - Invalid configuration will show validation errors

## Common Issues

### Photos Not Loading

- Verify file paths start with `/photos/`
- Check that files exist in `public/photos/`
- Ensure file names match exactly (case-sensitive)
- Check file extensions (.jpg, .png, .webp)

### Audio Not Playing

- Verify file paths start with `/audio/`
- Check that files exist in `public/audio/`
- Ensure files are in MP3 format
- Check file size (< 10MB recommended)
- Test on mobile devices (autoplay policies vary)

### Video Not Playing

- Verify file path starts with `/video/`
- Check that file exists in `public/video/`
- Ensure file is in MP4 format with H.264 codec
- Check file size (< 100MB recommended)
- Test on mobile devices (some formats not supported)

### Configuration Validation Errors

The experience validates your configuration on load. If you see an error overlay:

1. Check the browser console for specific error messages
2. Verify all required fields are present
3. Ensure section IDs are sequential (0-7)
4. Verify audio track sections reference valid section IDs
5. Check that all file paths are strings starting with `/`

## Example Configurations

### Minimal Configuration (Quick Start)

```typescript
const contentConfig: ContentConfig = {
  names: {
    his: 'Alex',
    hers: 'Sam',
    initials: 'A & S',
  },
  date: 'June 1, 2023',
  audio: {
    tracks: [
      {
        name: 'Our Song',
        path: '/audio/our-song.mp3',
        sections: [0, 1, 2, 3, 4, 5, 6, 7],
      },
    ],
  },
  sections: [
    {
      id: 0,
      title: 'Our Story',
      slides: [
        {
          type: 'text',
          content: 'This is our love story',
          duration: 4000,
        },
        {
          type: 'photo',
          content: '/photos/us.jpg',
          altText: 'Us together',
          duration: 5000,
        },
      ],
    },
    // ... 7 more sections
  ],
  video: {
    path: '/video/our-video.mp4',
    audioPath: '/video/our-video.mp4',
    cuePoint: 60,
  },
  finalMessage: 'I Love You',
};
```

### Full Configuration (Rich Experience)

See the default `config/content.config.ts` for a complete example with:
- 8 sections with varied content
- 3 audio tracks with crossfades
- Multiple photos per section
- Rich text formatting
- Video integration

## Next Steps

1. Gather your photos, audio, and video files
2. Optimize assets using the Asset Optimization Guide
3. Update `config/content.config.ts` with your content
4. Test locally with `npm run dev`
5. Deploy using the Deployment Guide

For deployment instructions, see `DEPLOYMENT-GUIDE.md`.
For asset optimization, see `ASSET-OPTIMIZATION.md`.
For troubleshooting, see `TROUBLESHOOTING-GUIDE.md`.
