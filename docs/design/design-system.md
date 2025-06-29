# Design System

## Overview

The Eco-Explorer design system is built around the concept of nature, conservation, and education. It uses a dark theme with emerald accents to create a professional, modern look that appeals to investors while maintaining the educational and environmental focus.

## Color Palette

### Primary Colors
```css
--primary-emerald: #34d399;      /* Main brand color */
--primary-emerald-dark: #059669; /* Hover states, emphasis */
--primary-emerald-light: #6ee7b7; /* Accents, highlights */
```

### Neutral Colors
```css
--gray-900: #111827; /* Background */
--gray-800: #1f2937; /* Cards, sections */
--gray-700: #374151; /* Form inputs */
--gray-600: #4b5563; /* Borders */
--gray-500: #6b7280; /* Secondary text */
--gray-400: #9ca3af; /* Placeholder text */
--gray-300: #d1d5db; /* Primary text */
--gray-200: #e5e7eb; /* Light accents */
--gray-100: #f3f4f6; /* Very light accents */
--white: #ffffff;    /* Pure white */
```

### Usage Guidelines
- **Background**: Use `--gray-900` for main background
- **Cards/Sections**: Use `--gray-800` for elevated elements
- **Text**: Use `--white` for primary text, `--gray-300` for secondary
- **Accents**: Use emerald colors sparingly for CTAs and highlights

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Font Weights
- **400**: Regular text
- **500**: Medium emphasis
- **700**: Bold headings
- **800**: Extra bold hero text
- **900**: Ultra bold accents

### Type Scale
```css
/* Mobile First */
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.75rem (28px)
h4: 1.5rem (24px)
h5: 1.25rem (20px)
h6: 1rem (16px)

/* Tablet (768px+) */
h1: 3rem (48px)
h2: 2.5rem (40px)
h3: 2rem (32px)
h4: 1.75rem (28px)
h5: 1.5rem (24px)
h6: 1.25rem (20px)

/* Desktop (1024px+) */
h1: 3.5rem (56px)
h2: 3rem (48px)
h3: 2.25rem (36px)
h4: 2rem (32px)
h5: 1.75rem (28px)
h6: 1.5rem (24px)
```

## Spacing System

### Base Unit: 4px (0.25rem)
```css
/* Spacing Scale */
0: 0px
1: 4px (0.25rem)
2: 8px (0.5rem)
3: 12px (0.75rem)
4: 16px (1rem)
5: 20px (1.25rem)
6: 24px (1.5rem)
8: 32px (2rem)
10: 40px (2.5rem)
12: 48px (3rem)
16: 64px (4rem)
20: 80px (5rem)
24: 96px (6rem)
32: 128px (8rem)
```

### Usage Guidelines
- **Padding**: Use 4, 6, 8, 12, 16, 20, 24 for component padding
- **Margins**: Use 4, 6, 8, 12, 16, 20, 24 for spacing between elements
- **Gaps**: Use 4, 6, 8, 12, 16 for grid and flex gaps

## Component Library

### Buttons
```css
.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-emerald);
  color: var(--white);
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary-emerald);
  color: var(--primary-emerald);
}
```

### Cards
```css
.card {
  background: var(--gray-800);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
}
```

### Forms
```css
.form-input {
  background: var(--gray-700);
  border: 1px solid var(--gray-600);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--white);
}

.form-input:focus {
  border-color: var(--primary-emerald);
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
}
```

## Layout System

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

### Grid System
- **1 Column**: Mobile (default)
- **2 Columns**: Tablet (768px+)
- **3 Columns**: Desktop (1024px+)

### Section Spacing
```css
.section {
  padding: 5rem 0; /* Mobile */
}

@media (min-width: 768px) {
  .section {
    padding: 7rem 0; /* Desktop */
  }
}
```

## Icons and Imagery

### Icon Style
- **Line Icons**: 2px stroke width
- **Size Scale**: 16px, 24px, 32px, 48px
- **Color**: Inherit text color or use emerald for accents

### Image Guidelines
- **Hero Images**: High contrast, nature-focused
- **Section Images**: Relevant to content, professional quality
- **Format**: WebP with JPEG fallback
- **Optimization**: Compressed for web

## Animations and Transitions

### Duration Scale
```css
--transition-fast: 0.15s
--transition-normal: 0.3s
--transition-slow: 0.5s
```

### Easing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
```

### Common Animations
```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
}
```

## Accessibility

### Color Contrast
- **Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear focus states

### Focus States
```css
*:focus {
  outline: 2px solid var(--primary-emerald);
  outline-offset: 2px;
}
```

### Screen Reader Support
- Semantic HTML structure
- ARIA labels where needed
- Proper heading hierarchy
- Alt text for images

## Responsive Design

### Breakpoints
```css
/* Mobile First */
/* Small: 640px+ */
/* Medium: 768px+ */
/* Large: 1024px+ */
/* XL: 1280px+ */
/* 2XL: 1536px+ */
```

### Mobile Considerations
- Touch-friendly button sizes (44px minimum)
- Adequate spacing for touch targets
- Simplified navigation
- Optimized images for mobile

## Brand Guidelines

### Logo Usage
- Minimum size: 32px height
- Clear space: 1x logo height
- Dark background only
- Maintain aspect ratio

### Voice and Tone
- **Professional**: Credible and trustworthy
- **Educational**: Informative and engaging
- **Environmental**: Nature-focused and conservation-minded
- **Innovative**: Forward-thinking and technologically advanced

### Content Guidelines
- Use active voice
- Keep sentences concise
- Focus on benefits and impact
- Include specific data and examples
- Maintain consistent terminology

## Implementation Notes

### CSS Custom Properties
Use CSS custom properties for consistent theming and easy maintenance.

### Utility Classes
Follow Tailwind CSS patterns for utility classes while maintaining custom design system.

### Component Isolation
Each component should be self-contained with its own styles and behavior.

### Performance
- Minimize CSS bundle size
- Use efficient selectors
- Optimize animations for performance
- Consider critical CSS inlining 