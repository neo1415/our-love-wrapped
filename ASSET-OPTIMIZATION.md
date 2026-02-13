# Asset Optimization Guide

This guide explains how to optimize photos, audio, and video files for production deployment.

## Photo Optimization

### Requirements
- Format: WebP (preferred) or JPEG
- Max file size: 500KB per photo
- Recommended dimensions: 1920x1080 or smaller

### Tools
- **Online**: [Squoosh](https://squoosh.app/) - Free image compression
- **CLI**: `cwebp` (WebP converter)
- **Batch**: ImageMagick or Sharp

### Steps
1. Resize images to 1920x1080 or smaller
2. Convert to WebP format with 80-85% quality
3. Place optimized images in `public/photos/`

### Example (ImageMagick)
```bash
# Convert and resize
convert input.jpg -resize 1920x1080 -quality 85 output.webp

# Batch convert all JPGs
for file in *.jpg; do
  convert "$file" -resize 1920x1080 -quality 85 "${file%.jpg}.webp"
done
```

## Audio Optimization

### Requirements
- Format: MP3 or M4A
- Max file size: 10MB per track
- Bitrate: 128-192 kbps
- Sample rate: 44.1 kHz

### Tools
- **Online**: [Online Audio Converter](https://online-audio-converter.com/)
- **CLI**: FFmpeg

### Steps
1. Convert to MP3 with 128-192 kbps bitrate
2. Ensure file size is under 10MB
3. Place optimized audio in `public/audio/`

### Example (FFmpeg)
```bash
# Convert to MP3 with 128 kbps
ffmpeg -i input.m4a -b:a 128k -ar 44100 output.mp3

# Batch convert all audio files
for file in *.m4a; do
  ffmpeg -i "$file" -b:a 128k -ar 44100 "${file%.m4a}.mp3"
done
```

## Video Optimization

### Requirements
- Format: MP4 (H.264 codec)
- Max file size: 100MB
- Resolution: 720p (1280x720) or 1080p (1920x1080)
- Bitrate: 2-4 Mbps
- Frame rate: 30 fps

### Tools
- **Online**: [CloudConvert](https://cloudconvert.com/)
- **CLI**: FFmpeg
- **Desktop**: HandBrake (free, cross-platform)

### Steps
1. Convert to MP4 with H.264 codec
2. Resize to 720p or 1080p
3. Set bitrate to 2-4 Mbps
4. Ensure file size is under 100MB
5. Place optimized video in `public/video/`

### Example (FFmpeg)
```bash
# Convert to 720p MP4 with 2 Mbps bitrate
ffmpeg -i input.mov -vcodec h264 -acodec aac -vf scale=1280:720 -b:v 2M -b:a 128k output.mp4

# Convert to 1080p MP4 with 4 Mbps bitrate
ffmpeg -i input.mov -vcodec h264 -acodec aac -vf scale=1920:1080 -b:v 4M -b:a 192k output.mp4
```

### HandBrake Settings
1. Open HandBrake
2. Load your video file
3. Select "Fast 720p30" or "Fast 1080p30" preset
4. Adjust quality slider to achieve <100MB file size
5. Click "Start Encode"

## Verification

After optimization, verify:
- [ ] All photos are under 500KB
- [ ] All audio files are under 10MB
- [ ] Video file is under 100MB
- [ ] All files load correctly in the application
- [ ] Quality is acceptable on mobile devices

## Performance Testing

Run Lighthouse audit to verify:
- LCP (Largest Contentful Paint) < 2.5s
- Performance score ≥ 90
- Total page weight is reasonable

## Notes

- Always keep original files as backups
- Test optimized assets on real devices before deployment
- Balance file size with quality - too much compression degrades experience
- Consider using a CDN for faster asset delivery
