# Hero Background Image Optimization Guide

## Current Implementation

The hero section now uses an optimized `<img>` tag with:
- ✅ Explicit `width="1920"` and `height="1080"` attributes
- ✅ `loading="eager"` for immediate load
- ✅ `fetchpriority="high"` for LCP optimization
- ✅ `<link rel="preload">` in HTML `<head>`
- ✅ Proper alt text for accessibility

## Required Image Specifications

### File: `hero-background.webp`
- **Location:** `/public/images/hero-background.webp`
- **Format:** WebP (optimal for web)
- **Dimensions:** 1920x1080px (16:9 aspect ratio)
- **Target file size:** 40-50 KB
- **Quality:** 75-85% (balance between quality and size)

## How to Optimize Your Image

### Option 1: Using Online Tools
1. Go to https://squoosh.app/
2. Upload your hero image
3. Select WebP format
4. Adjust quality to ~75-85%
5. Ensure file size is under 50 KB
6. Download and save as `hero-background.webp`

### Option 2: Using CLI (ImageMagick)
```bash
convert hero-original.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 80 hero-background.webp
```

### Option 3: Using CLI (cwebp)
```bash
cwebp -q 80 -resize 1920 1080 hero-original.jpg -o hero-background.webp
```

## LCP Performance Impact

**Before optimization:**
- Background image loaded via CSS `background-image`
- No preload hint
- No explicit dimensions
- Typical LCP: 2.5-3.5s

**After optimization:**
- Native `<img>` with preload
- Explicit dimensions prevent layout shift (CLS)
- `fetchpriority="high"` prioritizes download
- Expected LCP: 1.2-1.8s (60-70% improvement)

## Testing

1. Build the project: `npm run build`
2. Preview locally: `npm run preview`
3. Open Chrome DevTools
4. Go to Lighthouse tab
5. Run audit (Desktop + Mobile)
6. Check LCP metric (should be < 2.5s)

## Fallback

If the WebP image doesn't load, the background will show as black (via `bg-black` class), maintaining the dark theme aesthetic.

## Stock Photo Recommendations

If you need a stock photo for the hero:
- **Pexels:** https://www.pexels.com/search/dj%20performance/
- **Unsplash:** https://unsplash.com/s/photos/dj-event
- Search terms: "DJ performance", "music festival", "zouk dance", "nightclub DJ"
- Choose dark/moody images that match the brand aesthetic
