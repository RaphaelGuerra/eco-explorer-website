# Image Inventory

## Current Images Used

### Hero Section
- **URL**: `https://images.unsplash.com/photo-1576016781848-64587034b17f?q=80&w=2070&auto=format&fit=crop`
- **Description**: View of Itatiaia National Park mountains
- **Usage**: Hero background image
- **Dimensions**: 2070px wide
- **Optimization**: Auto format, quality 80
- **Alternative**: Consider downloading and optimizing for better performance

### About Section
- **URL**: `https://images.unsplash.com/photo-1547471080-7cc2d5d88e93?q=80&w=1974&auto=format&fit=crop`
- **Description**: Black Capuchin monkey in a tree
- **Usage**: About section illustration
- **Dimensions**: 1974px wide
- **Optimization**: Auto format, quality 80
- **Alternative**: Consider downloading and optimizing for better performance

### World Section - Card 1
- **URL**: `https://images.unsplash.com/photo-1620067912543-74a951a3a416?q=80&w=1932&auto=format&fit=crop`
- **Description**: Legacy of Conservation (forest/nature scene)
- **Usage**: World section card background
- **Dimensions**: 1932px wide
- **Optimization**: Auto format, quality 80

### World Section - Card 2
- **URL**: `https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2175&auto=format&fit=crop`
- **Description**: Two Worlds in One (landscape scene)
- **Usage**: World section card background
- **Dimensions**: 2175px wide
- **Optimization**: Auto format, quality 80

### World Section - Card 3
- **URL**: `https://images.unsplash.com/photo-1608442220914-f513d8ac4448?q=80&w=1974&auto=format&fit=crop`
- **Description**: Haven for Wildlife (wildlife scene)
- **Usage**: World section card background
- **Dimensions**: 1974px wide
- **Optimization**: Auto format, quality 80

## Recommended Local Image Structure

```
assets/images/
├── hero/
│   ├── hero-bg.jpg
│   ├── hero-bg.webp
│   └── hero-bg-mobile.jpg
├── sections/
│   ├── about/
│   │   ├── capuchin-monkey.jpg
│   │   └── capuchin-monkey.webp
│   ├── world/
│   │   ├── conservation-legacy.jpg
│   │   ├── two-worlds.jpg
│   │   ├── wildlife-haven.jpg
│   │   └── webp-versions/
│   └── gameplay/
│       └── (future gameplay images)
├── icons/
│   ├── logo.svg
│   ├── tree-icon.svg
│   └── custom-icons/
└── backgrounds/
    ├── pattern.svg
    └── textures/
```

## Image Optimization Recommendations

### 1. Download and Optimize
- Download all Unsplash images
- Convert to WebP format with JPEG fallback
- Optimize for web delivery

### 2. Responsive Images
- Create multiple sizes for different screen sizes
- Use `srcset` and `sizes` attributes
- Implement lazy loading

### 3. Compression
- Use tools like ImageOptim, TinyPNG, or Squoosh
- Target file sizes:
  - Hero images: < 200KB
  - Section images: < 100KB
  - Card images: < 50KB

### 4. Format Strategy
- **WebP**: Primary format for modern browsers
- **JPEG**: Fallback for older browsers
- **SVG**: For icons and simple graphics

## Image Naming Convention

### Format: `{section}-{description}-{size}.{format}`

Examples:
- `hero-mountains-1920.webp`
- `about-capuchin-monkey-800.jpg`
- `world-conservation-legacy-400.webp`

### Size Suffixes
- `-thumb`: 150px wide (thumbnails)
- `-small`: 400px wide (mobile)
- `-medium`: 800px wide (tablet)
- `-large`: 1200px wide (desktop)
- `-xl`: 1920px wide (large screens)

## Performance Considerations

### 1. Loading Strategy
- Hero image: Preload critical image
- Section images: Lazy load with Intersection Observer
- Card images: Lazy load with loading="lazy"

### 2. Caching
- Set appropriate cache headers
- Use CDN for global delivery
- Implement cache busting for updates

### 3. Bandwidth
- Monitor image download sizes
- Implement progressive loading
- Consider adaptive quality based on connection

## Accessibility

### 1. Alt Text Guidelines
- Be descriptive and contextual
- Include relevant details for understanding
- Avoid redundant information

### 2. Examples
- Hero: "Panoramic view of Itatiaia National Park mountains at sunset"
- About: "Black Capuchin monkey sitting on a tree branch in natural habitat"
- World: "Lush Atlantic Forest canopy showing biodiversity and conservation"

## Future Image Needs

### 1. Gameplay Screenshots
- In-game interface mockups
- Character interactions
- Research progression visuals

### 2. Technical Diagrams
- System architecture
- Game mechanics flowcharts
- AI system illustrations

### 3. Team/Company Images
- Founder photos
- Team collaboration scenes
- Office/workspace images

## Image Sources

### Current Sources
- **Unsplash**: High-quality, free stock photos
- **Custom Icons**: SVG icons for UI elements

### Recommended Sources
- **Shutterstock**: Premium stock photos (paid)
- **Adobe Stock**: Professional imagery (paid)
- **Custom Photography**: Original content for unique needs

## Maintenance Schedule

### Monthly
- Check image loading performance
- Update alt text if needed
- Monitor file sizes

### Quarterly
- Review and optimize image quality
- Update outdated images
- Check for broken links

### Annually
- Complete image audit
- Update image strategy
- Plan new image needs 