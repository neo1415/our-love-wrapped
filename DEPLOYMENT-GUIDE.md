# Deployment Guide

This guide explains how to deploy your Our Love Wrapped experience to Vercel and make it accessible via a public URL.

## Prerequisites

Before deploying, ensure you have:

1. Completed content customization (see `CONTENT-CUSTOMIZATION-GUIDE.md`)
2. Optimized all assets (see `ASSET-OPTIMIZATION.md`)
3. Tested locally with `npm run dev`
4. A Vercel account (free tier is sufficient)

## Deployment Options

You can deploy to Vercel in three ways:

1. **Vercel CLI** (recommended for first-time deployment)
2. **GitHub Integration** (recommended for ongoing updates)
3. **Vercel Dashboard** (manual upload)

## Option 1: Deploy with Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out/` directory.

### Step 4: Deploy

```bash
vercel --prod
```

The CLI will:
- Upload your project
- Configure build settings automatically
- Deploy to production
- Provide a public URL

Example output:
```
✅  Production: https://our-love-wrapped-abc123.vercel.app [copied to clipboard]
```

### Step 5: Test Your Deployment

Open the provided URL in your browser and test:
- Landing page loads correctly
- Audio plays on Begin button
- All photos load
- Navigation works
- Video plays at the right moment
- Final screen displays

## Option 2: Deploy with GitHub Integration

### Step 1: Create a GitHub Repository

1. Create a new repository on GitHub
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/our-love-wrapped.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: out
5. Click "Deploy"

### Step 3: Automatic Deployments

Once connected, Vercel will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Provide deployment status in GitHub

## Option 3: Deploy via Vercel Dashboard

### Step 1: Build Locally

```bash
npm run build
```

### Step 2: Upload to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select "Upload" tab
4. Drag and drop the `out/` folder
5. Click "Deploy"

Note: This method requires manual re-upload for updates.

## Custom Domain Setup (Optional)

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Enter your custom domain (e.g., `ourlovestory.com`)
4. Click "Add"

### Step 2: Configure DNS

Vercel will provide DNS records to add to your domain registrar:

**For apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify Domain

1. Add the DNS records at your domain registrar
2. Wait for DNS propagation (can take up to 48 hours)
3. Vercel will automatically verify and issue SSL certificate

## Environment Configuration

### Vercel Configuration File

The project includes `vercel.json` with optimized settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/(.*)\\.(jpg|jpeg|png|gif|webp|svg|ico)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)\\.(mp3|mp4|wav)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

This configuration:
- Sets security headers
- Enables long-term caching for static assets
- Optimizes performance

### Next.js Configuration

The project is configured for static export in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

This ensures the site works as a static export on Vercel.

## Performance Optimization

### Vercel Edge Network

Vercel automatically:
- Serves your site from a global CDN
- Compresses assets with Brotli/Gzip
- Provides automatic HTTPS
- Optimizes image delivery

### Monitoring Performance

1. Go to your project in Vercel Dashboard
2. Click "Analytics" to view:
   - Page load times
   - Core Web Vitals
   - Traffic patterns
   - Geographic distribution

### Performance Targets

Your deployment should achieve:
- Lighthouse Performance Score: ≥ 90
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

Test with [PageSpeed Insights](https://pagespeed.web.dev/).

## Updating Your Deployment

### With GitHub Integration

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
3. Vercel automatically deploys the update

### With Vercel CLI

1. Make changes locally
2. Build and deploy:
   ```bash
   npm run build
   vercel --prod
   ```

### With Manual Upload

1. Make changes locally
2. Build locally:
   ```bash
   npm run build
   ```
3. Upload new `out/` folder to Vercel Dashboard

## Rollback to Previous Version

If you need to rollback:

1. Go to your project in Vercel Dashboard
2. Click "Deployments"
3. Find the previous working deployment
4. Click "..." → "Promote to Production"

## Troubleshooting Deployment Issues

### Build Fails

**Error: "Command failed: npm run build"**

Solution:
1. Test build locally: `npm run build`
2. Check for TypeScript errors: `npm run type-check`
3. Ensure all dependencies are in `package.json`
4. Check Node.js version (requires 18.x or higher)

### Assets Not Loading

**Error: 404 on photos/audio/video**

Solution:
1. Verify files exist in `public/` directory
2. Check file paths in `content.config.ts` start with `/`
3. Ensure file names match exactly (case-sensitive)
4. Rebuild and redeploy

### Audio Not Playing on Mobile

**Issue: Audio doesn't start on mobile devices**

Solution:
1. This is expected due to autoplay policies
2. Audio starts when user taps "Begin" button
3. Test on actual mobile devices, not just desktop browsers
4. Ensure audio files are in MP3 format

### Video Not Playing

**Issue: Video doesn't play or shows error**

Solution:
1. Verify video is in MP4 format with H.264 codec
2. Check file size (< 100MB recommended)
3. Test video file locally in browser
4. Consider re-encoding with HandBrake or FFmpeg

### Slow Loading

**Issue: Site loads slowly**

Solution:
1. Optimize assets (see `ASSET-OPTIMIZATION.md`)
2. Compress images to WebP format
3. Reduce audio/video file sizes
4. Check Vercel Analytics for bottlenecks
5. Test on 4G network simulation

### Domain Not Working

**Issue: Custom domain shows error**

Solution:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check domain status in Vercel Dashboard
4. Ensure domain is not already in use

## Security Considerations

### HTTPS

Vercel automatically provides:
- Free SSL certificates
- Automatic HTTPS redirect
- Certificate renewal

### Content Security

The `vercel.json` configuration includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Private Deployment

To make your deployment private:

1. Go to project settings in Vercel Dashboard
2. Enable "Password Protection" under "Deployment Protection"
3. Set a password
4. Share the password with your intended recipient

Note: This requires a Vercel Pro plan.

## Cost Considerations

### Vercel Free Tier

The free tier includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Global CDN
- Analytics (basic)

This is sufficient for personal projects with moderate traffic.

### Bandwidth Usage

Estimate your bandwidth usage:
- Average page size: ~25 MB (with photos, audio, video)
- 100 GB = ~4,000 complete views per month
- If you exceed, consider Vercel Pro ($20/month)

### Reducing Bandwidth

To reduce bandwidth usage:
1. Optimize all assets (see `ASSET-OPTIMIZATION.md`)
2. Use WebP for images
3. Compress audio to 128 kbps
4. Compress video to 720p, 2 Mbps

## Sharing Your Deployment

Once deployed, share your experience:

1. Copy the deployment URL from Vercel
2. Share via:
   - Text message
   - Email
   - QR code (generate at [qr-code-generator.com](https://www.qr-code-generator.com/))
   - Social media (if desired)

### Creating a QR Code

1. Go to a QR code generator
2. Enter your Vercel URL
3. Download the QR code image
4. Print or share digitally

This allows easy access on mobile devices.

## Post-Deployment Checklist

After deploying, verify:

- [ ] Landing page displays correct names and date
- [ ] Begin button starts audio and navigates to story
- [ ] All photos load correctly
- [ ] Text formatting appears correctly
- [ ] Audio plays continuously
- [ ] Navigation controls work (play/pause, next/previous)
- [ ] Mute button works
- [ ] Progress bar shows correct position
- [ ] Chapter menu works
- [ ] Photo interactions work (double-tap hearts, long-press fullscreen)
- [ ] Video triggers at correct moment
- [ ] Video plays with audio
- [ ] Download button works
- [ ] Final message displays correctly
- [ ] Replay button works
- [ ] Test on iOS Safari
- [ ] Test on Chrome Android
- [ ] Test on desktop browsers
- [ ] Check Lighthouse performance score
- [ ] Verify HTTPS is working
- [ ] Test custom domain (if configured)

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Support](https://vercel.com/support)
- Project Issues: Check `TROUBLESHOOTING-GUIDE.md`

## Next Steps

1. Deploy your project using one of the methods above
2. Test thoroughly on mobile devices
3. Share with your loved one
4. Monitor analytics and performance
5. Update content as needed

For content updates, see `CONTENT-CUSTOMIZATION-GUIDE.md`.
For troubleshooting, see `TROUBLESHOOTING-GUIDE.md`.
